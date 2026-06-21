import type { ReservationCard } from "../../lib/types";
import { getVendorCategoryLabel, getVendorPhoto } from "../../lib/vendor";
import { ClockIcon } from "../icons";

export function ReservationsScreen({
  reservations,
  onVisit
}: {
  reservations: ReservationCard[];
  onVisit: () => void;
}) {
  const confirmedReservations = reservations.filter((reservation) => reservation.kind === "confirmed");
  const waitingReservations = reservations.filter((reservation) => reservation.kind === "pending" || reservation.kind === "requested");
  const categoryLabels = Array.from(new Set(reservations.map((reservation) => getVendorCategoryLabel(reservation.vendor.category))));

  const renderReservationSection = (title: string, items: ReservationCard[], emptyText: string) => (
    <section className="reservation-group">
      <div className="section-title inline-title reservation-heading">
        <span className="serif">{title}</span>
        <small>{items.length}건</small>
      </div>
      {items.length > 0 ? (
        <div className="reservation-list">
          {items.map((reservation) => (
            <article key={reservation.id} className="reservation-card card">
              <div className="reservation-main">
                <div className="reservation-thumb" style={{ background: getVendorPhoto(reservation.vendor) }} />
                <div>
                  <header>
                    <b className="serif">{reservation.vendor.name}</b>
                    <span style={{ background: reservation.style.bg, color: reservation.style.color }}>{reservation.status}</span>
                  </header>
                  <small>{reservation.vendor.area} · {reservation.slot}</small>
                </div>
              </div>
              <div className="reservation-next" style={{ background: reservation.style.nextBg }}>
                <ClockIcon color={reservation.style.color} />
                <span>{reservation.next}</span>
              </div>
              <div className="reservation-actions">
                <button onClick={onVisit}>{reservation.primary}</button>
                <button>{reservation.secondary}</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="reservation-empty card">{emptyText}</div>
      )}
    </section>
  );

  return (
    <div className="reservations-screen">
      <div className="screen-pad">
        <h2 className="h2">내 예약</h2>
        <p className="caption">요청부터 방문 기록까지 한곳에서 관리해요</p>
      </div>
      <div className="reservation-category-row hide-scrollbar">
        <span className="filter-chip active">전체</span>
        {categoryLabels.map((label) => (
          <span key={label} className="filter-chip">{label}</span>
        ))}
      </div>
      {renderReservationSection("예약 확정 업체", confirmedReservations, "아직 확정된 방문 예약이 없어요.")}
      {renderReservationSection("대기중 업체", waitingReservations, "응답을 기다리는 업체가 없어요.")}
    </div>
  );
}
