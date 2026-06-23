import { HeaderBar } from "../common";

export function DressRecommendationScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="dress-recommendation-screen">
      <HeaderBar title="드레스 추천" onBack={onBack} />
    </div>
  );
}
