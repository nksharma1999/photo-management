import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./MapSection.css";

type Location = {
  name: string;
  lat: number;
  lng: number;
  photos: number;
};

const locations: Location[] = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777, photos: 230 },
  { name: "Goa", lat: 15.2993, lng: 74.124, photos: 80 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025, photos: 50 }
];

export default function MapSection() {
  return (
    <div className="map-section">
      <h3>Photo Locations</h3>

      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        scrollWheelZoom={false}
        className="map-container"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc, i) => (
          <Marker key={i} position={[loc.lat, loc.lng]}>
            <Popup>
              <strong>{loc.name}</strong>
              <br />
              {loc.photos} photos
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}