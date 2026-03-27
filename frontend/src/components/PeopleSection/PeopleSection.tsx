import { useNavigate } from "react-router-dom";
import "./PeopleSection.css";

type Person = {
  _id:string;
  name: string;
  photos: number;
  avatar: string;
};

const people: Person[] = [
  {
    _id:"1",
    name: "Rahul",
    photos: 120,
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    _id:"2",
    name: "Mom",
    photos: 85,
    avatar: "https://i.pravatar.cc/100?img=5"
  },
  {
    _id:"3",
    name: "Amit",
    photos: 60,
    avatar: "https://i.pravatar.cc/100?img=8"
  },
];

export default function PeopleSection() {
  const navigate = useNavigate();
  return (
    <div className="people-section">
      <h3>People Detected</h3>

      <div className="people-grid">
        {people.map((p, i) => (
          <div key={i} className="person-card" onClick={() => navigate(`/people/${p._id}`)}>
            <img src={p.avatar} alt={p.name} />
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