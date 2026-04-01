import { useNavigate } from "react-router-dom";
import "./PeopleSection.css";
import {BaseIPForThumbnails } from "../../data/BaseIP";
import type { Person } from "../../pages/Dashboard";

type Props = {
  people?: Person[];
  loading?: boolean;
};

export default function PeopleSection({ people }: Props) {
  const navigate = useNavigate();

  return (
    <div className="people-section">
      <h3>People Detected</h3>

      <div className="people-grid">
        {people && people.map((p:Person, i) => (
          <div
            key={p._id || i}
            className="person-card"
            onClick={() => navigate(`/people/${p._id}`)}
          >
            <img src={`${BaseIPForThumbnails}${p.croppedFaceUrl}`} alt={p.name} />
            <div className="person-info">
              <p>{p.name}</p>
              <span>{p.photos} photos</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}