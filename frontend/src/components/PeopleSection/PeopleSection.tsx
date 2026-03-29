import { useNavigate } from "react-router-dom";
import "./PeopleSection.css";
import { BaseIP, BaseIPForThumbnails } from "../../data/BaseIP";

type Person = {
  _id: string;
  name: string;
  photos: number;
  avatar: string;
};

const defaultPeople: Person[] = [
  {
    _id: "1",
    name: "Rahul",
    photos: 120,
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    _id: "2",
    name: "Mom",
    photos: 85,
    avatar: "https://i.pravatar.cc/100?img=5",
  },
  {
    _id: "3",
    name: "Amit",
    photos: 60,
    avatar: "https://i.pravatar.cc/100?img=8",
  },
];

type Props = {
  people?: Person[];
  loading?: boolean;
};

export default function PeopleSection({ people: peopleProp, loading }: Props) {
  const navigate = useNavigate();
  const people = peopleProp && peopleProp.length ? peopleProp : defaultPeople;

  return (
    <div className="people-section">
      <h3>People Detected</h3>

      <div className="people-grid">
        {people.map((p, i) => (
          <div
            key={p._id || i}
            className="person-card"
            onClick={() => navigate(`/people/${p._id}`)}
          >
            <img src={`${BaseIPForThumbnails}${p.avatar}`} alt={p.name} />
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