import { FiFolder, FiImage, FiMapPin, FiUsers } from "react-icons/fi";
import StatsCard from "../components/StatsCard/StatsCard";
import PhotoCloud from "../components/PhotoCloud/PhotoCloud";
import PeopleSection from "../components/PeopleSection/PeopleSection";
import MapSection from "../components/MapSection/MapSection";
import PhotoGrid from "../components/PhotoGrid/PhotoGrid";
import axios from "axios";
import { useEffect, useState } from "react";
import { BaseIP } from "../data/BaseIP";

type StatShape = {
  totalPhotos: number;
  peopleDetected: number;
  locations: number;
  albums: number;
};

export type Person = { _id: string; name: string; photos: number; croppedFaceUrl: string };
export type Location = { name: string; lat: number; lng: number; photos: number };

export default function Dashboard() {
  const [stats, setStats] = useState<StatShape | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, p, l] = await Promise.all([
          axios.get(`${BaseIP}/dashboard/stats`),
          axios.get(`${BaseIP}/dashboard/people`),
          axios.get(`${BaseIP}/dashboard/locations`),
        ]);
        setStats(s.data);
        setPeople(p.data);
        setLocations(l.data);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="dashboard">
      <div className="stats">
        <StatsCard
          navigateTo="/gallery"
          title="Total Photos"
          value={stats ? stats.totalPhotos.toLocaleString() : "—"}
          icon={<FiImage />}
        />
        <StatsCard
          navigateTo="/people"
          title="People Detected"
          value={stats ? stats.peopleDetected.toLocaleString() : "—"}
          icon={<FiUsers color="teal" />}
        />
        <StatsCard
          title="Locations"
          value={stats ? stats.locations.toLocaleString() : "—"}
          icon={<FiMapPin color="yellow" />}
        />
        <StatsCard
          navigateTo="/albums"
          title="Albums"
          value={stats ? stats.albums.toLocaleString() : "—"}
          icon={<FiFolder color="red" />}
        />
      </div>

      <PhotoCloud />

      <div className="bottom-section">
        <PeopleSection people={people} loading={loading}/>
        <MapSection locations={locations}/>
      </div>

      <PhotoGrid />
    </div>
  );
}
