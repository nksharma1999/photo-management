import { FiFolder, FiImage, FiMapPin, FiUsers } from "react-icons/fi";
import StatsCard from "../components/StatsCard/StatsCard";
import PhotoCloud from "../components/PhotoCloud/PhotoCloud";
import PeopleSection from "../components/PeopleSection/PeopleSection";
import MapSection from "../components/MapSection/MapSection";
import PhotoGrid from "../components/PhotoGrid/PhotoGrid";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="stats">
        <StatsCard title="Total Photos" value="42,891" icon={<FiImage />} />
        <StatsCard
          title="People Detected"
          value="184"
          icon={<FiUsers color="teal" />}
        />
        <StatsCard
          title="Locations"
          value="56"
          icon={<FiMapPin color="yellow" />}
        />
        <StatsCard title="Albums" value="312" icon={<FiFolder color="red" />} />
      </div>

      <PhotoCloud />

      <div className="bottom-section">
        <PeopleSection />
        <MapSection />
      </div>

      <PhotoGrid />
    </div>
  );
}
