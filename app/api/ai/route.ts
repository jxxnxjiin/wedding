import { NextResponse } from "next/server";
import type { AiMessage } from "../../../lib/types";

const GEMINI_MODEL = "gemini-3.1-flash-lite";
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const FALLBACK_ANSWER = "안녕하세요, 웨딩 플래너 AI입니다. 무엇을 도와드릴까요?";

type AiRequestBody = {
  question?: string;
  thread?: AiMessage[];
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
    "확실하지 않은 내용은 단정하지 말고 확인해야 할 항목으로 정리해주세요.",
    recentThread ? `최근 대화:\n${recentThread}` : "",
    `사용자 질문:\n${question}`
  ]
    .filter(Boolean)
    .join("\n\n");
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
