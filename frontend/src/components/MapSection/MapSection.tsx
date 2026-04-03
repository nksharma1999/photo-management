import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngTuple } from 'leaflet'
import "leaflet/dist/leaflet.css";
import "./MapSection.css";
import type { Location } from "../../pages/Dashboard";


type props ={
  locations:Location[]
}

export default function MapSection({locations}:props) {
  const center:LatLngTuple  = [22.9734, 78.6569];
  return (
    <div className="map-section">
      <h3>Photo Locations</h3>

      <MapContainer
        center={center}
        zoom={3}
        scrollWheelZoom={false}
        className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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