import type { Vendor } from "../../lib/schema";
import type { ReservationCard } from "../../lib/types";
import { getVendorCategoryLabel, getVendorPhoto, getWeddingHallProfile } from "../../lib/vendor";
import { HeaderBar } from "../common";
import { ClockIcon, HeartIcon } from "../icons";

export function ReservationsScreen({
  reservations,
  savedCount,
  onVisit,
  onSavedVenues
}: {
  reservations: ReservationCard[];
  savedCount: number;
  onVisit: () => void;
  onSavedVenues: () => void;
}) {
  const confirmedReservations = reservations.filter((reservation) => reservation.kind === "confirmed");
  const waitingReservations = reservations.filter((reservation) => reservation.kind === "pending" || reservation.kind === "requested");

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
      <div className="reservation-segment">
        <span>예약 내역</span>
        <button onClick={onSavedVenues}>좋아요 {savedCount}</button>
      </div>
      {/* <button className="saved-venue-entry card" onClick={onSavedVenues}>
        <span>
          <b className="serif">좋아요 누른 업체</b>
          <small>나중에 비교하거나 투어 요청할 후보를 모아봤어요</small>
        </span>
        <em>{savedCount}곳</em>
      </button> */}
      {renderReservationSection("예약 확정 업체", confirmedReservations, "아직 확정된 방문 예약이 없어요.")}
      {renderReservationSection("대기중 업체", waitingReservations, "응답을 기다리는 업체가 없어요.")}
    </div>
  );
}

export function SavedVenuesScreen({
  vendors,
  onBack,
  onOpenDetail,
  onToggleSave,
  onReserve
}: {
  vendors: Vendor[];
  onBack: () => void;
  onOpenDetail: (id: string) => void;
  onToggleSave: (id: string) => void;
  onReserve: (id: string) => void;
}) {
  return (
    <div className="saved-venues-screen">
      <HeaderBar title="좋아요 누른 업체" onBack={onBack} />
      <div className="screen-pad">
        <h2 className="h2">좋아요 누른 업체</h2>
        <p className="caption">저장한 업체에 투어 요청을 보낼 수 있어요.</p>
      </div>
      {vendors.length > 0 ? (
        <div className="saved-venue-list">
          {vendors.map((vendor) => {
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
        <div className="reservation-empty card">아직 좋아요 누른 업체가 없어요.</div>
      )}
    </div>
  );
}
