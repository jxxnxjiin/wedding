import guides from "../../data/guides.json";
import comparisonReportsData from "../../data/comparison-reports.json";
import vendorsData from "../../data/vendors.json";
import type { Vendor } from "../../lib/schema";
import type { VendorTab } from "../../lib/types";
import { getVendorCategoryLabel, getVendorPhoto, getWeddingHallProfile, isWeddingHallVendor } from "../../lib/vendor";
import { HeaderBar, Stat } from "../common";
import { HeartIcon, SparkIcon } from "../icons";

const weddingHallVendors = (vendorsData.vendors as Vendor[]).filter(isWeddingHallVendor);

export function VendorExploreScreen({
  vendorTab,
  savedIds,
  savedVendors,
  onToggleSave,
  onOpenDetail,
  onReserve,
  onSelectVendorTab,
  onCompare
}: {
  vendorTab: VendorTab;
  savedIds: string[];
  savedVendors: Vendor[];
  onToggleSave: (id: string) => void;
  onOpenDetail: (id: string) => void;
  onReserve: (id: string) => void;
  onSelectVendorTab: (tab: VendorTab) => void;
  onCompare: () => void;
}) {
  const savedReports = comparisonReportsData.reports.filter((report) => report.status === "saved");

  return (
    <div className="vendors-screen find-screen">
      <div className="screen-pad">
        <h2 className="h2">{vendorTab === "saved" ? "저장한 업체" : "업체 찾기"}</h2>
        <p className="caption">{vendorTab === "saved" ? "좋아요한 업체와 비교 리포트를 모아봐요" : "서울 동부권 · 하객 150명 · 토요일 저녁 기준 추천"}</p>
        <div className="vendor-segment">
          <button className={vendorTab === "recommendations" ? "active" : ""} onClick={() => onSelectVendorTab("recommendations")}>
            추천
          </button>
          <button className={vendorTab === "saved" ? "active" : ""} onClick={() => onSelectVendorTab("saved")}>
            저장 {savedIds.length}
          </button>
        </div>
      </div>

      {vendorTab === "recommendations" && (
        <>
          <div className="filter-row hide-scrollbar">
            {vendorsData.filters.map((filter) => (
              <span key={filter.label} className={filter.active ? "filter-chip active" : "filter-chip"}>
                {filter.label}
              </span>
            ))}
          </div>

          <VendorCardList vendors={weddingHallVendors} savedIds={savedIds} onToggleSave={onToggleSave} onOpenDetail={onOpenDetail} />
        </>
      )}

      {vendorTab === "saved" && (
        <div className="saved-vendor-tab">
          <section className="saved-vendor-group">
            <div className="section-title inline-title">
              <span className="serif">좋아요한 업체</span>
              <small>{savedVendors.length}곳</small>
            </div>
            {savedVendors.length > 0 ? (
              <div className="saved-venue-list">
                {savedVendors.map((vendor) => {
                  const profile = getWeddingHallProfile(vendor);
                  return (
                    <article key={vendor.id} className="saved-venue-row card">
                      <button className="saved-venue-row-main" onClick={() => onOpenDetail(vendor.id)}>
                        <div style={{ background: getVendorPhoto(vendor) }} />
                        <span>
                          <b className="serif">{vendor.name}</b>
                          <small>{vendor.area} · {profile?.hallType ?? getVendorCategoryLabel(vendor.category)}</small>
                          <p>{profile ? `식대 ${profile.mealPrice} · 보증 ${profile.minGuests}` : vendor.priceRange}</p>
                        </span>
                      </button>
                      <button className="saved-venue-heart" onClick={() => onToggleSave(vendor.id)} aria-label={`${vendor.name} 좋아요 해제`}>
                        <HeartIcon filled />
                      </button>
                      <button className="saved-venue-reserve" onClick={() => onReserve(vendor.id)}>
                        투어 희망 일정 보내기
                      </button>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="reservation-empty card">아직 저장한 업체가 없어요.</div>
            )}
          </section>

          <section className="saved-vendor-group">
            <div className="section-title inline-title">
              <span className="serif">저장된 비교 리포트</span>
              <small>{savedReports.length}개</small>
            </div>
            <div className="saved-report-list">
              {savedReports.map((report) => (
                <button key={report.id} className="saved-report-card card" onClick={onCompare}>
                  <span>
                    <b>{report.title}</b>
                    <small>{report.vendorIds.length}개 업체 · 물어볼 질문 {report.suggestedQuestions.length}개</small>
                  </span>
                  <em>보기</em>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function VendorCardList({
  vendors,
  savedIds,
  onToggleSave,
  onOpenDetail
}: {
  vendors: Vendor[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onOpenDetail: (id: string) => void;
}) {
  return (
    <div className="venue-list">
      {vendors.map((vendor) => {
        const saved = savedIds.includes(vendor.id);
        const profile = getWeddingHallProfile(vendor);
        return (
          <article key={vendor.id} className="venue-card card">
            <div
              className="venue-photo"
              style={{ background: getVendorPhoto(vendor) }}
              onClick={() => onOpenDetail(vendor.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onOpenDetail(vendor.id);
              }}
            >
              <span>{profile?.hallType ?? getVendorCategoryLabel(vendor.category)}</span>
              <button
                className="heart-button"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleSave(vendor.id);
                }}
                aria-label={`${vendor.name} 저장`}
              >
                <HeartIcon filled={saved} />
              </button>
            </div>
            <button className="venue-body" onClick={() => onOpenDetail(vendor.id)}>
              <div className="venue-title-row">
                <b className="serif">{vendor.name}</b>
                <span>{vendor.area}</span>
              </div>
              <div className="venue-meta">
                <span>식대 {profile?.mealPrice ?? vendor.priceRange}</span>
                <i />
                <span>보증 {profile?.minGuests ?? "-"}</span>
                <i />
                <span>{profile?.parking ?? vendor.address}</span>
              </div>
              <div className="match-box">
                <SparkIcon />
                <span>{vendor.matchReason}</span>
              </div>
            </button>
          </article>
        );
      })}
    </div>
  );
}

export function CompareScreen({
  vendors,
  onBack,
  onReserve
}: {
  vendors: Vendor[];
  onBack: () => void;
  onReserve: (id: string) => void;
}) {
  const compareRows = [
    {
      label: "총비용",
      value: (vendor: Vendor) => getWeddingHallProfile(vendor)?.estimatedTotalCost ?? vendor.priceRange ?? "-",
      subValue: (vendor: Vendor) => verificationLabel(getWeddingHallProfile(vendor)?.costVerification)
    },
    {
      label: "신부\n적합도",
      value: (vendor: Vendor) => scoreText(getWeddingHallProfile(vendor)?.brideFitScore),
      subValue: (vendor: Vendor) => scoreLabel(getWeddingHallProfile(vendor)?.brideFitScore)
    },
    {
      label: "신랑\n적합도",
      value: (vendor: Vendor) => scoreText(getWeddingHallProfile(vendor)?.groomFitScore),
      subValue: (vendor: Vendor) => scoreLabel(getWeddingHallProfile(vendor)?.groomFitScore)
    },
    {
      label: "주차",
      value: (vendor: Vendor) => ratingStars(getWeddingHallProfile(vendor)?.transportRating),
      subValue: () => ""
    },
    {
      label: "음식",
      value: (vendor: Vendor) => ratingStars(getWeddingHallProfile(vendor)?.foodRating),
      subValue: () => ""
    }
  ];
  const compareGridStyle = { gridTemplateColumns: `58px repeat(${vendors.length}, minmax(0, 1fr))` };

  return (
    <div className="compare-screen">
      <HeaderBar title="후보 비교" onBack={onBack} />
      <p className="compare-copy">공통 후보를 선택하고 투어 요청서를 보내세요.</p>
      <div className="compare-criteria">
        <b>적합도 기준</b>
        <span>분위기·단독홀, 총비용·주차, 교통·음식 기준으로 비교해요.</span>
      </div>
      <section className="compare-table card">
        <div className="compare-vendor-head" style={compareGridStyle}>
          <span />
          {vendors.map((vendor) => (
            <div key={vendor.id}>
              <b className="serif">{vendor.name}</b>
              <small>{vendor.area}</small>
            </div>
          ))}
        </div>
        {compareRows.map((row) => (
          <div key={row.label} className="compare-table-row" style={compareGridStyle}>
            <span>{row.label.split("\n").map((line) => <span key={line}>{line}</span>)}</span>
            {vendors.map((vendor) => (
              <b key={vendor.id}>
                {row.value(vendor)}
                {row.subValue(vendor) && <small>{row.subValue(vendor)}</small>}
              </b>
            ))}
          </div>
        ))}
        <div className="compare-table-actions" style={compareGridStyle}>
          <span />
          {vendors.map((vendor) => (
            <button key={vendor.id} onClick={() => onReserve(vendor.id)}>
              상세 보기
            </button>
          ))}
        </div>
      </section>
      <section className="compare-reasons card">
        <h3>AI 추천 이유</h3>
        {vendors.map((vendor) => {
          const profile = getWeddingHallProfile(vendor);
          return (
            <div key={vendor.id}>
              <b>{vendor.name} — {profile?.aiRecommendationTitle ?? "확인 필요"}</b>
              <p>{profile?.aiRecommendationBody ?? vendor.matchReason}</p>
            </div>
          );
        })}
      </section>
      <section className="tour-request-preview card">
        <h3>투어 요청서 내용 미리보기</h3>
        <dl>
          <div><dt>희망 방문 날짜</dt><dd>2026년 7월 첫째주 토/일</dd></div>
          <div><dt>예상 하객 수</dt><dd>180~220명</dd></div>
          <div><dt>웨딩홀 예산 상한</dt><dd>1,800만원</dd></div>
        </dl>
        <p>꽃장식 포함 총비용은 얼마인가요?</p>
        <p>보증 인원 180명 기준 최소 비용은?</p>
        <p>2026년 7월 토요일 오후 가능 날짜는?</p>
      </section>
      <button className="compare-bulk-request" onClick={() => window.alert("요청이 완료되었습니다.")}>
        저장한 후보 전체에 투어 요청서 보내기
      </button>
    </div>
  );
}

function scoreText(score?: number) {
  return typeof score === "number" ? `${score}점` : "-";
}

function scoreLabel(score?: number) {
  if (typeof score !== "number") return "";
  if (score >= 85) return "최고";
  if (score >= 75) return "보통";
  return "낮음";
}

function ratingStars(rating = 0) {
  return rating ? `${rating}/5` : "-";
}

function verificationLabel(value?: "official" | "user_quote" | "unknown") {
  if (value === "official") return "공식확인";
  if (value === "user_quote") return "사용자견적";
  return "확인필요";
}

export function DetailScreen({
  vendor,
  onBack
}: {
  vendor: Vendor;
  saved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onReserve: () => void;
}) {
  const profile = getWeddingHallProfile(vendor);

  return (
    <div className="detail-screen">
      <div className="detail-hero" style={{ background: getVendorPhoto(vendor) }}>
        <button className="circle-back" onClick={onBack} aria-label="뒤로가기">
          ‹
        </button>
        <span>{profile?.hallType ?? getVendorCategoryLabel(vendor.category)}</span>
      </div>
      <div className="detail-body">
        <h2 className="serif">{vendor.name}</h2>
        <p>{vendor.area} · {profile?.hallType ?? getVendorCategoryLabel(vendor.category)}</p>
        <div className="stat-row">
          <Stat label="예상 식대" value={profile?.mealPrice ?? vendor.priceRange ?? "-"} />
          <Stat label="보증 인원" value={profile?.minGuests ?? "-"} />
          <Stat label="예식 간격" value={profile?.interval ?? "-"} />
        </div>
        <div className="match-box detail-match">
          <SparkIcon />
          <span>{vendor.matchReason}</span>
        </div>
        <h3 className="serif">방문 전 확인하면 좋아요</h3>
        <p className="caption">AI가 이 홀에 맞춰 정리한 질문이에요. 요청 시 함께 전달돼요.</p>
        <div className="question-card card">
          {guides.detailQuestions.map((question, index) => (
            <div key={question} style={{ borderTopColor: index === 0 ? "transparent" : "var(--line)" }}>
              <span />
              <p>{question}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
