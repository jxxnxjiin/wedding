import type { Vendor, VendorCategory } from "./schema";

export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  wedding_hall: "웨딩홀",
  studio: "웨딩 스튜디오",
  dress: "드레스샵",
  makeup: "메이크업샵",
  snap: "본식 스냅"
};

export function getVendorCategoryLabel(category: VendorCategory) {
  return VENDOR_CATEGORY_LABELS[category];
}

export function getVendorPhoto(vendor: Vendor) {
  return vendor.photo ?? "linear-gradient(135deg,#E8DCD5,#B99A8F)";
}

export function getWeddingHallProfile(vendor: Vendor) {
  return vendor.profile.weddingHall;
}

export function isWeddingHallVendor(vendor: Vendor) {
  return vendor.category === "wedding_hall";
}

/** 카드 사진 위에 올리는 짧은 태그 (웨딩홀은 홀 종류, 그 외는 카테고리명) */
export function getVendorTagLabel(vendor: Vendor) {
  return vendor.profile.weddingHall?.hallType ?? getVendorCategoryLabel(vendor.category);
}

/** 카드 메타 줄에 노출할 칩 (카테고리별로 핵심 정보 3개) */
export function getVendorMetaItems(vendor: Vendor): string[] {
  const p = vendor.profile;
  if (p.weddingHall) {
    return [`식대 ${p.weddingHall.mealPrice}`, `보증 ${p.weddingHall.minGuests}`, p.weddingHall.parking];
  }
  if (p.studio) {
    return [vendor.priceRange ?? "-", p.studio.shootingStyle.join("·"), `보정 ${p.studio.retouchCount}`];
  }
  if (p.dress) {
    return [vendor.priceRange ?? "-", p.dress.dressTypes.join("·"), `피팅 ${p.dress.fittingCount}`];
  }
  if (p.makeup) {
    return [vendor.priceRange ?? "-", p.makeup.artistLevel, p.makeup.groomMakeupIncluded ? "신랑 포함" : "신랑 별도"];
  }
  if (p.snap) {
    return [vendor.priceRange ?? "-", p.snap.coverageHours, p.snap.photographerCount];
  }
  return [vendor.priceRange ?? vendor.address];
}

export type VendorHighlight = { label: string; value: string };

/** 상세 화면 상단 스탯 (카테고리별 핵심 지표 3개) */
export function getVendorHighlights(vendor: Vendor): VendorHighlight[] {
  const p = vendor.profile;
  if (p.weddingHall) {
    return [
      { label: "예상 식대", value: p.weddingHall.mealPrice },
      { label: "보증 인원", value: p.weddingHall.minGuests },
      { label: "예식 간격", value: p.weddingHall.interval }
    ];
  }
  if (p.studio) {
    return [
      { label: "패키지", value: vendor.priceRange ?? "-" },
      { label: "촬영 스타일", value: p.studio.shootingStyle.join("·") },
      { label: "보정 컷", value: p.studio.retouchCount }
    ];
  }
  if (p.dress) {
    return [
      { label: "가격대", value: vendor.priceRange ?? "-" },
      { label: "드레스 라인", value: p.dress.dressTypes.join("·") },
      { label: "피팅 횟수", value: p.dress.fittingCount }
    ];
  }
  if (p.makeup) {
    return [
      { label: "가격대", value: vendor.priceRange ?? "-" },
      { label: "아티스트", value: p.makeup.artistLevel },
      { label: "신랑 메이크업", value: p.makeup.groomMakeupIncluded ? "포함" : "별도" }
    ];
  }
  if (p.snap) {
    return [
      { label: "가격대", value: vendor.priceRange ?? "-" },
      { label: "촬영 시간", value: p.snap.coverageHours },
      { label: "납품", value: p.snap.deliveryWeeks }
    ];
  }
  return [{ label: "가격대", value: vendor.priceRange ?? "-" }];
}
