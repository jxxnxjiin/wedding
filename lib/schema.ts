export type VendorCategory = "wedding_hall" | "studio" | "dress" | "makeup" | "snap";

export type VendorStatus = "active" | "draft" | "hidden";

export type VendorCategoryMeta = {
  id: VendorCategory;
  label: string;
  description: string;
  roadmapPhaseId: string;
  priority: number;
};

export type VendorProfile = {
  weddingHall?: {
    hallType: string;
    mealPrice: string;
    minGuests: string;
    interval: string;
    parking: string;
    confirmQuestions: string;
    estimatedTotalCost?: string;
    costVerification?: "official" | "user_quote" | "unknown";
    brideFitScore?: number;
    groomFitScore?: number;
    transportRating?: number;
    foodRating?: number;
    aiRecommendationTitle?: string;
    aiRecommendationBody?: string;
  };
  studio?: {
    shootingStyle: string[];
    includedCuts: string;
    retouchCount: string;
  };
  dress?: {
    dressTypes: string[];
    fittingFee: string;
    fittingCount: string;
  };
  makeup?: {
    artistLevel: string;
    earlyMorningFee: string;
    groomMakeupIncluded: boolean;
  };
  snap?: {
    coverageHours: string;
    photographerCount: string;
    editedCount: string;
    deliveryWeeks: string;
  };
};

export type Vendor = {
  id: string;
  category: VendorCategory;
  name: string;
  address: string;
  area: string;
  summary: string;
  tags: string[];
  priceRange?: string;
  photo?: string;
  matchReason?: string;
  questions?: string[];
  status: VendorStatus;
  profile: VendorProfile;
};

export type ChecklistSourceType = "roadmap" | "reservation" | "vendor" | "ai" | "service";

export type LinkedEntityType = "phase" | "task" | "vendor" | "reservation" | "service";

export type ChecklistCategory =
  | VendorCategory
  | "wedding_plan"
  | "budget"
  | "guest"
  | "ceremony"
  | "home_living";

export type ChecklistOwner = "couple" | "bride" | "groom";

export type ChecklistStatus = "todo" | "done" | "skipped";

export type ChecklistPriority = "low" | "medium" | "high";

export type ChecklistLinkedReservation = {
  reservationId: string;
  vendorId: string;
  vendorCategory: VendorCategory;
  scheduledAt?: string;
};

export type ChecklistAiRecommendation = {
  id: string;
  title: string;
  summary: string;
  reason?: string;
  sourceType?: LinkedEntityType;
  sourceId?: string;
  ctaLabel?: string;
};

export type ChecklistTaskSystemFields = {
  id: string;
  phaseId: string;
  category: ChecklistCategory;
  sourceType: ChecklistSourceType;
  sourceId?: string;
  linkedVendorCategory?: VendorCategory;
  linkedVendorId?: string;
  linkedReservation?: ChecklistLinkedReservation;
  dueDate?: string;
  scheduledAt?: string;
  priority: ChecklistPriority;
  thisWeek: boolean;
};

export type ChecklistTaskUserFields = {
  title: string;
  memo?: string;
  owner: ChecklistOwner;
};

export type ChecklistTask = ChecklistTaskSystemFields &
  ChecklistTaskUserFields & {
    status: ChecklistStatus;
    aiRecommendations?: ChecklistAiRecommendation[];
  };

export type ChecklistTaskEditableFields = Pick<ChecklistTask, "title" | "memo">;

export type ChecklistTaskUserUpdate = Partial<
  Pick<ChecklistTask, "title" | "memo" | "owner" | "status">
>;

export type ComparisonReportStatus = "draft" | "saved" | "archived";

export type ComparisonMetricKind = "cost" | "score" | "rating" | "text";

export type ComparisonVerification = "official" | "user_quote" | "unknown";

export type ComparisonQuestionCategory =
  | "cost"
  | "guest"
  | "schedule"
  | "parking"
  | "contract"
  | "option";

export type ComparisonReportCriterion = {
  id: string;
  label: string;
  description: string;
  weight?: number;
};

export type ComparisonReportMetric = {
  id: string;
  label: string;
  kind: ComparisonMetricKind;
  unit?: string;
  description?: string;
};

export type ComparisonReportVendorValue = {
  vendorId: string;
  value: string | number;
  score?: number;
  note?: string;
  verification?: ComparisonVerification;
};

export type ComparisonReportRow = {
  metricId: string;
  values: ComparisonReportVendorValue[];
};

export type ComparisonReportVendorSummary = {
  vendorId: string;
  title: string;
  body: string;
  risk?: string;
  recommendedFor?: "bride" | "groom" | "couple";
};

export type ComparisonReportQuestion = {
  id: string;
  text: string;
  category: ComparisonQuestionCategory;
  targetVendorIds?: string[];
};

export type ComparisonReport = {
  id: string;
  title: string;
  category: VendorCategory;
  vendorIds: string[];
  status: ComparisonReportStatus;
  createdAt: string;
  updatedAt?: string;
  criteria: ComparisonReportCriterion[];
  metrics: ComparisonReportMetric[];
  rows: ComparisonReportRow[];
  vendorSummaries: ComparisonReportVendorSummary[];
  suggestedQuestions: ComparisonReportQuestion[];
};

export type BudgetCurrency = "KRW";

export type BudgetCategory = {
  id: string;
  label: string;
  plannedAmount: number;
  spentAmount: number;
  note?: string;
  linkedVendorCategory?: VendorCategory;
};

export type BudgetPlan = {
  id: string;
  title: string;
  currency: BudgetCurrency;
  totalAmount: number;
  categories: BudgetCategory[];
};
