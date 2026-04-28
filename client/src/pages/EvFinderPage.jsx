import React, { useState, useEffect } from "react";
import api from "../api/apiClient.js";
import AddStationForm from "../components/AddStationForm.jsx";
import EVCarDetails from "../components/EVCarDetails.jsx";
import MapView from "../components/MapView.jsx";
import SearchControls from "../components/SearchControls.jsx";
import StationList from "../components/StationList.jsx";
import { useNavigate } from "react-router-dom";
import { clearAuthSession } from "../utils/authStorage.js";

const defaultUserLocation = { lat: 13.0827, lng: 80.2707 };

const EvFinderPage = ({ currentUser, onSessionExpired }) => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [selectedCarId, setSelectedCarId] = useState("");
  const selectedCarDetails = cars.find((car) => car._id === selectedCarId) || null;

  const [latitude, setLatitude] = useState(defaultUserLocation.lat.toString());
  const [longitude, setLongitude] = useState(defaultUserLocation.lng.toString());
  const [userLocation, setUserLocation] = useState(defaultUserLocation);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loadingStations, setLoadingStations] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingStation, setEditingStation] = useState(null);
  const [showStationForm, setShowStationForm] = useState(false);

  const isAuthenticated = Boolean(currentUser);
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setCarsLoading(true);
      const { data } = await api.get("/cars");
      setCars(data.cars);
    } catch (_requestError) {
      setError("Unable to load EV cars right now.");
    } finally {
      setCarsLoading(false);
    }
  };

  const handleSessionExpired = () => {
    if (onSessionExpired) {
      onSessionExpired();
    } else {
      clearAuthSession();
      navigate("/login", { state: { message: "Session expired. Please login again." } });
    }
  };

  const executeStationSearch = async ({ latitudeValue, longitudeValue }) => {
    const latValue = Number(latitudeValue);
    const lngValue = Number(longitudeValue);

    if (
      Number.isNaN(latValue) ||
      Number.isNaN(lngValue) ||
      latValue < -90 ||
      latValue > 90 ||
      lngValue < -180 ||
      lngValue > 180
    ) {
      setError("Please enter valid latitude and longitude.");
      return;
    }

    try {
      setLoadingStations(true);
      setError("");
      setSuccessMessage("");

      const { data } = await api.get("/stations/search", {
        params: { lat: latValue, lng: lngValue }
      });

      setStations(data.stations);
      setSelectedStation(data.stations[0] || null);
      setSearchPerformed(true);
      setUserLocation({ lat: latValue, lng: lngValue });

      setSuccessMessage(
        data.total === 0
          ? "No nearby stations found."
          : `Found ${data.total} nearby station(s).`
      );
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        handleSessionExpired();
        return;
      }
      setError(
        requestError.response?.data?.message ||
          "Unable to find nearby charging stations."
      );
    } finally {
      setLoadingStations(false);
    }
  };

  const handleSearchClick = async () => {
    await executeStationSearch({
      latitudeValue: latitude,
      longitudeValue: longitude
    });
  };

  const handleUseMyLocation = () => {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "::1";

    if (!window.isSecureContext && !isLocalhost) {
      setError("Location works only on http://localhost or https://.");
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    setFetchingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setLatitude(currentCoords.lat.toFixed(6));
        setLongitude(currentCoords.lng.toFixed(6));
        setUserLocation(currentCoords);
        setSuccessMessage("Location fetched successfully.");
        setFetchingLocation(false);
      },
      (locationError) => {
        if (locationError.code === 1) {
          setError(
            "Please enable location from site settings (lock icon in address bar)."
          );
        } else {
          setError("Unable to fetch your location.");
        }
        setFetchingLocation(false);
      }
    );
  };

  const refreshSearchResults = async () => {
    if (!searchPerformed) {
      return;
    }
    await executeStationSearch({
      latitudeValue: latitude,
      longitudeValue: longitude
    });
  };

  const handleStationAdded = async (payload) => {
    if (!isAdmin) {
      throw new Error("Only admin users can add charging stations.");
    }
    try {
      const { data } = await api.post("/stations", payload);
      setSuccessMessage(data.message);
      setError("");
      setShowStationForm(false);
      await refreshSearchResults();
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        handleSessionExpired();
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(
        requestError.response?.data?.message ||
          "Could not add the charging station."
      );
    }
  };

  const handleStationUpdated = async (stationId, payload) => {
    if (!isAdmin) {
      throw new Error("Only admin users can update charging stations.");
    }
    try {
      const { data } = await api.put(`/stations/${stationId}`, payload);
      setSuccessMessage(data.message);
      setError("");
      setEditingStation(null);
      setShowStationForm(false);
      await refreshSearchResults();
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        handleSessionExpired();
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(
        requestError.response?.data?.message ||
          "Could not update the charging station."
      );
    }
  };

  const handleStationDelete = async (station) => {
    if (!isAdmin) {
      setError("Only admin users can delete charging stations.");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${station.stationName}" from ElectroMap?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      const { data } = await api.delete(`/stations/${station._id}`);
      setSuccessMessage(data.message);
      setError("");
      setEditingStation((current) =>
        current?._id === station._id ? null : current
      );
      await refreshSearchResults();
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        handleSessionExpired();
        return;
      }
      setError(
        requestError.response?.data?.message ||
          "Could not delete the charging station."
      );
    }
  };

  const handleEditStart = (station) => {
    if (!isAdmin) {
      setError("Only admin users can edit charging stations.");
      return;
    }
    setEditingStation(station);
    setShowStationForm(true);
    setSuccessMessage("");
    setError("");
  };

  const handleEditCancel = () => {
    setEditingStation(null);
    setShowStationForm(false);
  };

  const handleStationFormToggle = () => {
    setShowStationForm((current) => !current);
    setEditingStation(null);
  };

  return (
    <>
      <section className="hero-panel fade-in">
        <div>
          <h2>Find Charging Stations</h2>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <strong>{searchPerformed ? stations.length : "-"}</strong>
            <span>Matched Stations</span>
          </div>
          <div className="stat-card">
            <strong>{selectedCarDetails ? selectedCarDetails.name : "-"}</strong>
            <span>Selected EV Car</span>
          </div>
          <div className="stat-card">
            <strong>
              {Number(latitude).toFixed(2)}, {Number(longitude).toFixed(2)}
            </strong>
            <span>Search Coordinates</span>
          </div>
        </div>
      </section>

      {successMessage && <p className="success-banner slide-down">{successMessage}</p>}
      {error && <p className="error-banner slide-down">{error}</p>}

      {carsLoading ? (
        <section className="panel loading-panel fade-in">
          <div className="spinner"></div>
          <p>Loading EV cars...</p>
        </section>
      ) : (
        <div className="fade-in" style={{ animationDelay: '0.1s' }}>
          <SearchControls
            cars={cars}
            selectedCarId={selectedCarId}
            latitude={latitude}
            longitude={longitude}
            isFetchingLocation={fetchingLocation}
            onCarChange={setSelectedCarId}
            onLatitudeChange={setLatitude}
            onLongitudeChange={setLongitude}
            onUseMyLocation={handleUseMyLocation}
            onSearchClick={handleSearchClick}
          />
        </div>
      )}

      {isAuthenticated && searchPerformed ? (
        <div className="fade-in" style={{ animationDelay: '0.2s' }}>
          <EVCarDetails car={selectedCarDetails} />

          <section className="content-grid">
            <div className="map-column">
              <MapView
                stations={stations}
                selectedStation={selectedStation}
                onSelectStation={setSelectedStation}
                userLocation={userLocation}
                apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              />
            </div>

            <div className="list-column">
              {loadingStations ? (
                <div className="panel loading-panel">
                  <div className="spinner"></div>
                  <p>Finding nearest stations...</p>
                </div>
              ) : stations.length === 0 ? (
                <div className="panel empty-state">
                  <h3>No stations found</h3>
                  <p>We couldn't find any EV charging stations matching your criteria in this area.</p>
                </div>
              ) : (
                <StationList
                  stations={stations}
                  selectedStation={selectedStation}
                  onSelectStation={setSelectedStation}
                  onEditStation={handleEditStart}
                  onDeleteStation={handleStationDelete}
                  canManageStations={isAdmin}
                  loading={loadingStations}
                />
              )}
            </div>
          </section>

          {isAdmin ? (
            <section className="panel admin-panel fade-in">
              <div className="panel-heading">
                <h3>Admin Controls</h3>
                <span>Only admins can add or modify stations</span>
              </div>

              <button
                type="button"
                className="submit-button"
                onClick={handleStationFormToggle}
              >
                {showStationForm || editingStation
                  ? "Close Add Station Form"
                  : "Add Station"}
              </button>
            </section>
          ) : null}

          {isAdmin && (showStationForm || editingStation) ? (
            <div className="fade-in slide-down">
              <AddStationForm
                onAddStation={handleStationAdded}
                onUpdateStation={handleStationUpdated}
                editingStation={editingStation}
                onCancelEdit={handleEditCancel}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default EvFinderPage;
