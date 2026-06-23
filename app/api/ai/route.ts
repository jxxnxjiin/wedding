import { NextResponse } from "next/server";
import appMetaData from "../../../data/app-meta.json";
import budgetData from "../../../data/budget.json";
import onboardingData from "../../../data/onboarding.json";
import reservationsData from "../../../data/reservations.json";
import valueTestData from "../../../data/value-test.json";
import type { AiMessage } from "../../../lib/types";

const GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const FALLBACK_ANSWER = "안녕하세요, 웨딩 플래너 AI입니다. 무엇을 도와드릴까요?";

type AiRequestBody = {
  question?: string;
  thread?: AiMessage[];
};

type ValueQuestion = {
  key: string;
  options: Array<{ id: string; label: string }>;
};

type GeminiResponse = {
  output_text?: string;
  steps?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

export async function POST(request: Request) {
  const body = (await request.json()) as AiRequestBody;
  const question = body.question?.trim();

  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ answer: FALLBACK_ANSWER, source: "fallback" });
  }

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        store: false,
        input: makePrompt(question, body.thread ?? []),
        generation_config: {
          thinking_level: "minimal"
        }
      })
    });

    if (!response.ok) {
      return NextResponse.json({ answer: FALLBACK_ANSWER, source: "fallback" });
    }

    const data = (await response.json()) as GeminiResponse;
    const answer = extractGeminiText(data);

    return NextResponse.json({ answer: answer || FALLBACK_ANSWER, source: answer ? "gemini" : "fallback" });
  } catch {
    return NextResponse.json({ answer: FALLBACK_ANSWER, source: "fallback" });
  }
}

function makePrompt(question: string, thread: AiMessage[]) {
  const recentThread = thread
    .filter((message) => !message.pending)
    .slice(-6)
    .map((message) => `사용자: ${message.question}\nAI: ${message.answer}`)
    .join("\n\n");

  return [
    "당신은 결혼 준비 앱 Easy Wedding의 웨딩 상담 AI입니다.",
    "예식장 투어, 예약 준비, 견적 비교, 체크리스트에 대해 한국어로 간결하고 실용적으로 답해주세요.",
    "답변은 마크다운 구조를 사용해 2~3개의 짧은 문단으로 작성하세요. 필요하면 불릿 목록은 최대 3개까지만 사용하세요.",
    "마지막 문장은 사용자가 추가 정보를 더 줄 수 있도록 부드러운 질문으로 마무리하세요.",
    "아래 사용자 컨텍스트는 데모 앱의 저장 데이터를 요약한 것입니다. 질문과 관련 있는 정보만 자연스럽게 반영하고, 없는 내용은 지어내지 마세요.",
    "확실하지 않은 내용은 단정하지 말고 확인해야 할 항목으로 정리해주세요.",
    makeUserPreferenceContext(),
    recentThread ? `최근 대화:\n${recentThread}` : "",
    `사용자 질문:\n${question}`
  ]
    .filter(Boolean)
    .join("\n\n");
}

function makeUserPreferenceContext() {
  const onboarding = onboardingData.defaultOnboarding;
  const couple = appMetaData.coupleProfiles.map((profile) => `${profile.role} ${profile.name}: ${profile.summary}`).join(" / ");
  const budget = budgetData.plan;
  const categories = budget.categories
    .map((category) => {
      const remain = category.plannedAmount - category.spentAmount;
      return `${category.label} ${category.spentAmount}/${category.plannedAmount}만 사용, 잔여 ${remain}만`;
    })
    .join(" / ");
  const bride = valueTestData.brideAnswers;
  const groom = valueTestData.groomAnswers;
  const reservations = reservationsData.seedReservations
    .map((reservation) => `${reservation.status}: ${reservation.slot}`)
    .join(" / ");

  return [
    "사용자 컨텍스트:",
    `- 커플: ${couple}`,
    `- 예식 조건: ${onboarding.stage}, ${onboarding.region}, 하객 ${onboarding.guests}, 전체 예산 ${onboarding.budget}, ${onboarding.time}, 예식일 ${onboarding.weddingDate}`,
    `- 예산 현황: 총 ${budget.totalAmount}만 원 계획. ${categories}`,
    `- 가치관 요약: 신부는 ${answerLabel("spending_priority", bride.spending_priority)}를 우선하고 ${answerLabel("tradition", bride.tradition)} 성향. 신랑은 ${answerLabel("spending_priority", groom.spending_priority)}를 우선하고 ${answerLabel("tradition", groom.tradition)} 성향.`,
    `- 의사결정 성향: 신부 ${answerLabel("decision_making", bride.decision_making)}, 신랑 ${answerLabel("decision_making", groom.decision_making)}`,
    `- 예약/상담: ${reservations}`
  ].join("\n");
}

function answerLabel(questionKey: string, optionId?: string) {
  const question = (valueTestData.questions as ValueQuestion[]).find((item) => item.key === questionKey);
  return question?.options.find((option) => option.id === optionId)?.label ?? "미응답";
}

function extractGeminiText(data: GeminiResponse) {
  if (typeof data.output_text === "string") return data.output_text.trim();

  const stepText = data.steps
    ?.filter((step) => step.type === "model_output")
    .flatMap((step) => step.content ?? [])
    .map((content) => content.text)
    .filter(Boolean)
    .join("\n")
    .trim();

  if (stepText) return stepText;

  const outputText = data.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .filter(Boolean)
    .join("\n")
    .trim();

  if (outputText) return outputText;

  return data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("\n")
    .trim();
}
