export const seedStations = [
  {
    stationName: "ChargePoint Central",
    locationName: "Anna Salai, Chennai",
    address: "Anna Salai",
    city: "Chennai",
    state: "Tamil Nadu",
    coordinates: { type: "Point", coordinates: [80.2707, 13.0827] },
    chargerTypes: ["CCS", "Type 2"],
    status: "Available",
    availability: "Available",
    pricing: 22,
    operatingHours: "24/7",
    facilities: ["Parking", "Restroom", "Cafe"]
  },
  {
    stationName: "VoltGo Express",
    locationName: "MG Road, Bengaluru",
    address: "MG Road",
    city: "Bengaluru",
    state: "Karnataka",
    coordinates: { type: "Point", coordinates: [77.5946, 12.9716] },
    chargerTypes: ["Fast DC", "CCS"],
    status: "Busy",
    availability: "Busy",
    pricing: 28,
    operatingHours: "6 AM - 11 PM",
    facilities: ["Wi-Fi", "Cafe"]
  },
  {
    stationName: "EcoPlug Stop",
    locationName: "Banjara Hills, Hyderabad",
    address: "Banjara Hills Road No. 12",
    city: "Hyderabad",
    state: "Telangana",
    coordinates: { type: "Point", coordinates: [78.4867, 17.385] },
    chargerTypes: ["Type 2", "CHAdeMO"],
    status: "Available",
    availability: "Available",
    pricing: 20,
    operatingHours: "8 AM - 10 PM",
    facilities: ["Parking", "Convenience Store"]
  },
  {
    stationName: "Highway Spark Hub",
    locationName: "Mumbai Pune Expressway Food Plaza",
    address: "Mumbai Pune Expressway Food Plaza",
    city: "Lonavala",
    state: "Maharashtra",
    coordinates: { type: "Point", coordinates: [73.407, 18.7546] },
    chargerTypes: ["Fast DC", "CCS", "CHAdeMO"],
    status: "Available",
    availability: "Available",
    pricing: 30,
    operatingHours: "24/7",
    facilities: ["Food Court", "Restroom", "Parking"]
  }
];
