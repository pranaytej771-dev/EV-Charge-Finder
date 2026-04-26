import { useEffect, useState } from "react";

const initialFormState = {
  stationName: "",
  address: "",
  city: "",
  state: "",
  latitude: "",
  longitude: "",
  pricing: "",
  operatingHours: "",
  availability: "Available",
  facilities: "",
  chargerTypes: []
};

const availableChargers = ["CCS", "Type 2", "CHAdeMO", "Fast DC"];

const mapStationToFormState = (station) => {
  if (!station) {
    return initialFormState;
  }

  return {
    stationName: station.stationName || "",
    address: station.address || "",
    city: station.city || "",
    state: station.state || "",
    latitude: station.coordinates?.lat?.toString() || "",
    longitude: station.coordinates?.lng?.toString() || "",
    pricing: station.pricing?.toString() || "",
    operatingHours: station.operatingHours || "",
    availability: station.availability || "Available",
    facilities: Array.isArray(station.facilities) ? station.facilities.join(", ") : "",
    chargerTypes: Array.isArray(station.chargerTypes) ? station.chargerTypes : []
  };
};

function AddStationForm({
  onAddStation,
  onUpdateStation,
  editingStation,
  onCancelEdit
}) {
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setFormData(mapStationToFormState(editingStation));
  }, [editingStation]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleChargerToggle = (chargerType) => {
    setFormData((current) => {
      const chargerTypes = current.chargerTypes.includes(chargerType)
        ? current.chargerTypes.filter((type) => type !== chargerType)
        : [...current.chargerTypes, chargerType];

      return {
        ...current,
        chargerTypes
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        stationName: formData.stationName.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        coordinates: {
          lat: Number(formData.latitude),
          lng: Number(formData.longitude)
        },
        chargerTypes: formData.chargerTypes,
        availability: formData.availability,
        pricing: Number(formData.pricing),
        operatingHours: formData.operatingHours.trim(),
        facilities: formData.facilities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      };

      if (payload.chargerTypes.length === 0) {
        throw new Error("Select at least one charger type.");
      }

      if (editingStation) {
        await onUpdateStation(editingStation._id, payload);
      } else {
        await onAddStation(payload);
        setFormData(initialFormState);
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <h3>{editingStation ? "Edit Station" : "Add New Station"}</h3>
      </div>

      <form className="station-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Station Name
            <input
              name="stationName"
              value={formData.stationName}
              onChange={handleChange}
              placeholder="GreenVolt Hub"
              required
            />
          </label>

          <label>
            Address
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="GST Road"
              required
            />
          </label>

          <label>
            City
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Chennai"
              required
            />
          </label>

          <label>
            State
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="Tamil Nadu"
              required
            />
          </label>

          <label>
            Latitude
            <input
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="13.0827"
              required
            />
          </label>

          <label>
            Longitude
            <input
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="80.2707"
              required
            />
          </label>

          <label>
            Pricing
            <input
              name="pricing"
              type="number"
              value={formData.pricing}
              onChange={handleChange}
              placeholder="25"
              required
            />
          </label>

          <label>
            Operating Hours
            <input
              name="operatingHours"
              value={formData.operatingHours}
              onChange={handleChange}
              placeholder="24/7"
              required
            />
          </label>
        </div>

        <div className="form-grid form-grid-compact">
          <label>
            Availability
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Offline">Offline</option>
            </select>
          </label>

          <label>
            Facilities
            <input
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              placeholder="Parking, Cafe, Restroom"
            />
          </label>
        </div>

        <div className="checkbox-block">
          <p>Charger Types</p>
          <div className="checkbox-row">
            {availableChargers.map((chargerType) => (
              <label key={chargerType} className="checkbox-pill">
                <input
                  type="checkbox"
                  checked={formData.chargerTypes.includes(chargerType)}
                  onChange={() => handleChargerToggle(chargerType)}
                />
                {chargerType}
              </label>
            ))}
          </div>
        </div>

        {error ? <p className="error-banner">{error}</p> : null}

        <div className="form-action-row">
          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting
              ? editingStation
                ? "Updating Station..."
                : "Adding Station..."
              : editingStation
                ? "Update Charging Station"
                : "Add Charging Station"}
          </button>

          {editingStation ? (
            <button
              type="button"
              className="secondary-button"
              onClick={onCancelEdit}
              disabled={submitting}
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default AddStationForm;
