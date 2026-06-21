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
