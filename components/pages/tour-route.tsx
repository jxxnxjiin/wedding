import type { Vendor } from "../../lib/schema";
import { getVendorTagLabel, getWeddingHallProfile } from "../../lib/vendor";
import { HeaderBar } from "../common";
import { ClockIcon } from "../icons";

type RouteStop = {
  vendor: Vendor;
  time: string;
  kind: "tour" | "consult";
  status: "예약 확정" | "상담 대기";
  moveMinutes: number;
  distance: string;
};

export function TourRouteScreen({
  vendors,
  onBack,
  onOpenDetail
}: {
  vendors: Vendor[];
  onBack: () => void;
  onOpenDetail: (id: string) => void;
}) {
  const stops: RouteStop[] = vendors.slice(0, 3).map((vendor, index) => {
    const isConsult = index === 2;
    return {
      vendor,
      time: ["11:00", "13:30", "15:30"][index] ?? "16:00",
      kind: isConsult ? "consult" : "tour",
      status: isConsult ? "상담 대기" : "예약 확정",
      moveMinutes: [18, 12, 16][index] ?? 10,
      distance: ["7.4km", "4.1km", "5.8km"][index] ?? "3.2km"
    };
  });
  const totalMinutes = stops.reduce((sum, stop) => sum + 40 + stop.moveMinutes, 0) - (stops.at(-1)?.moveMinutes ?? 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const restMinutes = totalMinutes % 60;

  return (
    <div className="tour-route-screen">
      <HeaderBar title="투어 동선" onBack={onBack} />
      <div className="tour-route-body">
        <section className="tour-route-summary compact">
          <div className="route-pin-icon" aria-hidden="true">
            <span />
          </div>
          <div>
            <small>6/24 (수) · 투어 동선</small>
            <h2>{stops.length}곳 투어 · 예상 소요 {totalHours}시간 {restMinutes}분</h2>
          </div>
        </section>

        <section className="route-map" aria-label="웨딩홀 투어 지도">
          <div className="map-grid" />
          <div className="map-river" />
          <div className="map-park" />
          <svg className="route-line" viewBox="0 0 280 220" aria-hidden="true">
            <path d="M69 73 C112 89 136 108 173 120 C151 145 134 168 123 192" />
          </svg>
          {stops.map((stop, index) => (
            <button
              key={stop.vendor.id}
              className={`route-marker route-marker-${index + 1}`}
              onClick={() => onOpenDetail(stop.vendor.id)}
              aria-label={`${index + 1}번째 투어 ${stop.vendor.name} 상세 보기`}
            >
              {index + 1}
            </button>
          ))}
          <button className="route-locate-button" aria-label="현재 위치">
            <span />
          </button>
        </section>

        <div className="route-section-title">
          <h3 className="serif">추천 동선 순서</h3>
          <span>출발 11:00</span>
        </div>

        <div className="route-stop-list">
          {stops.map((stop, index) => {
            const profile = getWeddingHallProfile(stop.vendor);
            return (
              <div key={stop.vendor.id} className="route-stop-wrap">
                <button className="route-stop-card card" onClick={() => onOpenDetail(stop.vendor.id)}>
                  <span className="route-stop-number">{index + 1}</span>
                  <span className="route-stop-copy">
                    <b className="serif">{stop.vendor.name}</b>
                    <small>{stop.vendor.area} · {profile?.hallType ?? getVendorTagLabel(stop.vendor)}</small>
                    <em>
                      <ClockIcon color="#8A4B75" />
                      {stop.time} {stop.kind === "consult" ? "상담" : "투어"}
                    </em>
                  </span>
                  <span className={`route-confirm ${stop.status === "상담 대기" ? "pending" : ""}`}>{stop.status}</span>
                </button>
                {index < stops.length - 1 && (
                  <div className="route-transfer">
                    <span />
                    <p>이동 차량 {stop.moveMinutes}분 · {stop.distance}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button className="route-reorder-button" type="button">
          <span>↻</span>
          가장 빠른 동선으로 다시 정렬
        </button>
        <p className="route-helper">예약·상담 일정에 맞춰 이동 시간을 자동으로 계산해요.</p>
      </div>
    </div>
  );
}
