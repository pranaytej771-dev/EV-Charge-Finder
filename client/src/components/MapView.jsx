import { useEffect, useRef, useState } from "react";

function MapView({
  stations,
  selectedStation,
  onSelectStation,
  userLocation,
  apiKey
}) 
{
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapsReady, setMapsReady] = useState(Boolean(window.google?.maps));

  useEffect(() => {
    if (!apiKey) {
      return;
    }

    if (window.google?.maps) {
      setMapsReady(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[data-google-maps-script="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", handleScriptLoad);
      return () => existingScript.removeEventListener("load", handleScriptLoad);
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsScript = "true";
    script.addEventListener("load", handleScriptLoad);
    document.body.appendChild(script);

    return () => script.removeEventListener("load", handleScriptLoad);
  }, [apiKey]);

  useEffect(() => {
    if (!mapsReady || !mapContainerRef.current) {
      return;
    }

    const center = getMapCenter(selectedStation, userLocation, stations);

    if (!mapRef.current) {
      mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
        center,
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });
    } else {
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(selectedStation ? 11 : 6);
    }

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = stations.map((station) => {
      const marker = new window.google.maps.Marker({
        map: mapRef.current,
        position: station.coordinates,
        title: station.stationName
      });

      marker.addListener("click", () => onSelectStation(station));
      return marker;
    });
  }, [mapsReady, stations, selectedStation, onSelectStation, userLocation]);

  const fallbackStation = selectedStation || stations[0];
  const fallbackMapsLink = fallbackStation
    ? `https://www.google.com/maps/search/?api=1&query=${fallbackStation.coordinates.lat},${fallbackStation.coordinates.lng}`
    : "https://www.google.com/maps";

  return (
    <section className="panel map-panel">
      <div className="panel-heading">
        <h3>Google Maps View</h3>
        <span>{apiKey ? "Interactive map enabled" : "API key not added yet"}</span>
      </div>

      {mapsReady ? (
        <div ref={mapContainerRef} className="map-canvas" />
      ) : (
        <div className="map-fallback">
          <h4>Map preview is ready for Google Maps</h4>
          <p>
            Add `GOOGLE_MAPS_API_KEY` in the client `.env` file to display
          </p>
          <p>
            Until then, you can still open a station directly in Google Maps for
            navigation.
          </p>
          <a href={fallbackMapsLink} target="_blank" rel="noreferrer">
            Open selected station in Google Maps
          </a>
        </div>
      )}
    </section>
  );

  function handleScriptLoad() {
    setMapsReady(true);
  }
}

function getMapCenter(selectedStation, userLocation, stations) {
  if (selectedStation?.coordinates) {
    return selectedStation.coordinates;
  }

  if (userLocation?.lat && userLocation?.lng) {
    return userLocation;
  }

  if (stations[0]?.coordinates) {
    return stations[0].coordinates;
  }

  return { lat: 13.0827, lng: 80.2707 };
}

export default MapView;

