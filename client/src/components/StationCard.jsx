import { FaMapMarkerAlt, FaRoute, FaPlug, FaMoneyBillWave, FaClock, FaWifi } from "react-icons/fa";

function StationCard({
  station,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  canManageStations
}) {
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${station.coordinates.lat},${station.coordinates.lng}`;
  const stationStatus = station.status || station.availability || "Available";

  return (
    <article className={`station-card ${isSelected ? "selected" : ""}`}>
      <div className="station-card-top">
        <div>
          <h4>{station.stationName}</h4>
          <p>
            <FaMapMarkerAlt style={{ marginRight: '4px', opacity: 0.7 }} />
            {station.locationName || `${station.address}, ${station.city}, ${station.state}`}
          </p>
        </div>
        <span className={`status-pill status-${stationStatus.toLowerCase()}`}>
          {stationStatus}
        </span>
      </div>

      <div className="tag-row">
        {station.chargerTypes.map((type) => (
          <span key={type} className="tag">
            {type}
          </span>
        ))}
      </div>

      <div className="station-details" style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
        {typeof station.distanceKm === "number" ? (
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaRoute style={{ color: 'var(--color-primary)' }} />
            <strong>Distance:</strong> {station.distanceKm} km
          </p>
        ) : null}
        
        {station.compatibleConnectors?.length ? (
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
            <FaPlug style={{ color: 'var(--color-primary)' }} />
            <strong>Compatible:</strong>{" "}
            <span className="compatible-badge">
              {station.compatibleConnectors.join(", ")}
            </span>
          </p>
        ) : null}
        
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <FaMoneyBillWave style={{ color: 'var(--color-primary)' }} />
          <strong>Price:</strong> Rs. {station.pricing}/kWh
        </p>
        
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <FaClock style={{ color: 'var(--color-primary)' }} />
          <strong>Hours:</strong> {station.operatingHours}
        </p>
        
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <FaWifi style={{ color: 'var(--color-primary)' }} />
          <strong>Facilities:</strong>{" "}
          {station.facilities.length > 0 ? station.facilities.join(", ") : "Not listed"}
        </p>
      </div>

      <div className="station-actions">
        <button type="button" onClick={onSelect}>
          View on Map
        </button>
        {canManageStations ? (
          <button type="button" className="edit-button" onClick={onEdit}>
            Edit
          </button>
        ) : null}
        {canManageStations ? (
          <button type="button" className="delete-button" onClick={onDelete}>
            Delete
          </button>
        ) : null}
        <a href={googleMapsLink} target="_blank" rel="noreferrer">
          Directions
        </a>
      </div>
    </article>
  );
}

export default StationCard;
