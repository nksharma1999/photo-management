import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./MapSection.css";
import type { Location } from "../../pages/Dashboard";


type props ={
  locations:Location[]
}

export default function MapSection({locations}:props) {
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