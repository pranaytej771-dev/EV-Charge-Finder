import { useState, useEffect } from "react";
import { MdMyLocation, MdCheckCircle } from "react-icons/md";
import { FaSpinner, FaSearch } from "react-icons/fa";

function SearchControls({
  cars,
  selectedCarId,
  latitude,
  longitude,
  isFetchingLocation,
  onCarChange,
  onLatitudeChange,
  onLongitudeChange,
  onUseMyLocation,
  onSearchClick
}) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let timeout;
    if (isFetchingLocation) {
      setShowSuccess(false);
    } else if (latitude !== "13.0827" && latitude !== "" && !isFetchingLocation) {
      setShowSuccess(true);
      timeout = setTimeout(() => setShowSuccess(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isFetchingLocation, latitude]);

  return (
    <section className="panel controls-panel">
      <div className="control-group">
        <label htmlFor="car-select">Select EV Car</label>
        <select
          id="car-select"
          value={selectedCarId}
          onChange={(event) => onCarChange(event.target.value)}
        >
          <option value="">Choose your EV car</option>
          {cars.map((car) => (
            <option key={car._id} value={car._id}>
              {car.brand} {car.name}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="search-latitude">Latitude</label>
        <input
          id="search-latitude"
          type="number"
          step="any"
          placeholder="13.0827"
          value={latitude}
          onChange={(event) => onLatitudeChange(event.target.value)}
        />
      </div>

      <div className="control-group">
        <label htmlFor="search-longitude">Longitude</label>
        <input
          id="search-longitude"
          type="number"
          step="any"
          placeholder="80.2707"
          value={longitude}
          onChange={(event) => onLongitudeChange(event.target.value)}
        />
      </div>

      <div className="control-group control-group-action location-btn-group">
        <button
          id="use-location-button"
          type="button"
          className={`location-button pill-button ${isFetchingLocation ? 'fetching' : ''} ${showSuccess ? 'success' : ''}`}
          onClick={() => {
            setShowSuccess(false);
            onUseMyLocation();
          }}
          disabled={isFetchingLocation}
          title="Detect my current location"
        >
          {isFetchingLocation ? (
            <><FaSpinner className="spin-icon" /> Fetching...</>
          ) : showSuccess ? (
            <><MdCheckCircle /> Location Found</>
          ) : (
            <><MdMyLocation /> Use My Location</>
          )}
        </button>
      </div>

      <div className="control-group control-group-action">
        <button type="button" className="submit-button pill-button search-button" onClick={onSearchClick}>
          <FaSearch /> Find Stations
        </button>
      </div>
    </section>
  );
}

export default SearchControls;
