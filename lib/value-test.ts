import valueTestData from "../data/value-test.json";
import type {
  CoupleRole,
  ValueAnswers,
  ValueResultTier,
  ValueTestQuestion
} from "./schema";

export const valueTestIntro = valueTestData.intro;
export const valueTestQuestions = valueTestData.questions as ValueTestQuestion[];
export const groomValueAnswers = valueTestData.groomAnswers as ValueAnswers;
export const brideValueAnswers = valueTestData.brideAnswers as ValueAnswers;
const resultTiers = valueTestData.resultTiers as ValueResultTier[];

export function getOptionLabel(questionKey: string, optionId?: string): string | null {
  if (!optionId) return null;
  const question = valueTestQuestions.find((item) => item.key === questionKey);
  return question?.options.find((option) => option.id === optionId)?.label ?? null;
}

export function isValueTestComplete(answers: ValueAnswers): boolean {
  return valueTestQuestions.every((question) => Boolean(answers[question.key]));
}

export function getAnsweredCount(answers: ValueAnswers): number {
  return valueTestQuestions.filter((question) => Boolean(answers[question.key])).length;
}

export function getMatchCount(bride: ValueAnswers, groom: ValueAnswers): number {
  return valueTestQuestions.filter((question) => {
    const brideAnswer = bride[question.key];
    const groomAnswer = groom[question.key];
    return Boolean(brideAnswer) && brideAnswer === groomAnswer;
  }).length;
}

export function getResultTier(matchCount: number): ValueResultTier {
  return resultTiers.find((tier) => matchCount >= tier.min) ?? resultTiers[resultTiers.length - 1];
}

export type ValueComparisonRow = {
  key: string;
  category: string;
  label: string;
  brideLabel: string | null;
  groomLabel: string | null;
  matched: boolean;
};

export function getComparisonRows(bride: ValueAnswers, groom: ValueAnswers): ValueComparisonRow[] {
  return valueTestQuestions.map((question) => {
    const brideAnswer = bride[question.key];
    const groomAnswer = groom[question.key];
    return {
      key: question.key,
      category: question.category,
      label: question.label,
      brideLabel: getOptionLabel(question.key, brideAnswer),
      groomLabel: getOptionLabel(question.key, groomAnswer),
      matched: Boolean(brideAnswer) && brideAnswer === groomAnswer
    };
  });
}

export function getCoupleRoleLabel(role: CoupleRole): string {
  return role === "bride" ? "신부" : "신랑";
}
