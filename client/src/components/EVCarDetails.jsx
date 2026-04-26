function EVCarDetails({ car }) {
  if (!car) {
    return null;
  }

  return (
    <section className="panel car-panel">
      <div className="panel-heading">
        <h3>Selected EV Car</h3>
      </div>

      <div className="car-details-grid">
        <p>
          <strong>Name:</strong> {car.brand} {car.name}
        </p>
        <p>
          <strong>Battery:</strong> {car.batteryCapacity} kWh
        </p>
        <p>
          <strong>Range:</strong> {car.range} km
        </p>
        <p>
          <strong>Connector Types:</strong> {car.connectorTypes.join(", ")}
        </p>
      </div>
    </section>
  );
}

export default EVCarDetails;
