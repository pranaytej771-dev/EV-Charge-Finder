import StationCard from "./StationCard.jsx";

function StationList({
  stations,
  selectedStation,
  onSelectStation,
  onEditStation,
  onDeleteStation,
  canManageStations,
  loading
}) {
  if (loading) {
    return <section className="panel list-panel">Loading charging stations...</section>;
  }

  if (stations.length === 0) {
    return (
      <section className="panel list-panel">
        No nearby stations found.
      </section>
    );
  }

  return (
    <section className="panel list-panel">
      <div className="panel-heading">
        <h3>Charging Stations</h3>
        <span>{stations.length} result(s)</span>
      </div>

      <div className="station-list">
        {stations.map((station) => (
          <StationCard
            key={station._id}
            station={station}
            isSelected={selectedStation?._id === station._id}
            onSelect={() => onSelectStation(station)}
            onEdit={() => onEditStation(station)}
            onDelete={() => onDeleteStation(station)}
            canManageStations={canManageStations}
          />
        ))}
      </div>
    </section>
  );
}

export default StationList;
