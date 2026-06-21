const KOREAN_WEEKDAYS = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const SHORT_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function formatWeddingDate(value: string) {
  const date = parseDate(value);
  if (!date) return "예식 예정일을 선택해주세요";

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 · ${KOREAN_WEEKDAYS[date.getDay()]}`;
}

export function formatShortWeddingDate(value: string) {
  const date = parseDate(value);
  if (!date) return "날짜 미정";

  return `${date.getMonth() + 1}.${date.getDate()} ${SHORT_WEEKDAYS[date.getDay()]}`;
}

export function formatCompactWeddingDate(value: string) {
  const date = parseDate(value);
  if (!date) return "미정";

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${SHORT_WEEKDAYS[date.getDay()]}`;
}

export function getWeddingDday(value: string) {
  const date = parseDate(value);
  if (!date) return null;

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const weddingStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return Math.ceil((weddingStart - todayStart) / 86_400_000);
}

function parseDate(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}
