import budgetData from "../../data/budget.json";
import type { BudgetPlan } from "../../lib/schema";
import { SparkIcon } from "../icons";

const budgetPlan = budgetData.plan as BudgetPlan;

export function BudgetScreen({ onOpenAi }: { onOpenAi: () => void }) {
  const spentAmount = budgetPlan.categories.reduce((total, category) => total + category.spentAmount, 0);
  const leftAmount = budgetPlan.totalAmount - spentAmount;
  const spentPercent = budgetPlan.totalAmount ? Math.round((spentAmount / budgetPlan.totalAmount) * 100) : 0;

  return (
    <div className="budget-screen">
      <div className="screen-pad">
        <h2 className="h2">예산 관리</h2>
        <p className="caption">항목별 배분과 지출을 한눈에 관리해요</p>
      </div>

      <section className="budget-summary-card">
        <span>전체 예산</span>
        <b className="serif">{formatAmount(budgetPlan.totalAmount)}만 원</b>
        <div className="budget-progress">
          <i style={{ width: `${Math.min(100, spentPercent)}%` }} />
        </div>
        <div className="budget-summary-row">
          <span>
            <small>사용</small>
            <strong>{formatAmount(spentAmount)}만</strong>
          </span>
          <span>
            <small>남은 예산</small>
            <strong>{formatAmount(leftAmount)}만</strong>
          </span>
        </div>
      </section>

      <div className="section-title inline-title budget-category-title">
        <span className="serif">항목별 배분</span>
        <small>사용 / 배정</small>
      </div>

      <section className="budget-category-list card">
        {budgetPlan.categories.map((category, index) => {
          const percent = category.plannedAmount ? Math.min(100, Math.round((category.spentAmount / category.plannedAmount) * 100)) : 0;
          const categoryLeft = category.plannedAmount - category.spentAmount;
          const share = budgetPlan.totalAmount ? Math.round((category.plannedAmount / budgetPlan.totalAmount) * 100) : 0;
          const overBudget = category.spentAmount > category.plannedAmount;

          return (
            <article key={category.id} className="budget-category-row" style={{ borderTopColor: index === 0 ? "transparent" : "var(--line)" }}>
              <header>
                <span>
                  <b>{category.label}</b>
                  {category.note && <small>{category.note}</small>}
                </span>
                <strong>
                  {formatAmount(category.spentAmount)}만 / {formatAmount(category.plannedAmount)}만
                </strong>
              </header>
              <div className="budget-category-progress">
                <i className={overBudget ? "over" : ""} style={{ width: `${percent}%` }} />
              </div>
              <footer>
                <span>전체의 {share}%</span>
                <span>{overBudget ? "초과" : "잔액"} {formatAmount(Math.abs(categoryLeft))}만</span>
              </footer>
            </article>
          );
        })}
      </section>

      <button className="budget-ai-card card" onClick={onOpenAi}>
        <span className="ai-icon">
          <SparkIcon />
        </span>
        <span>
          <b>AI 예산 코치에게 물어보기</b>
          <small>"이 견적에서 추가금 생길 항목은?"</small>
        </span>
        <em>›</em>
      </button>
    </div>
  );
}

function formatAmount(amount: number) {
  return amount.toLocaleString("ko-KR");
}
