import "./PeopleSection.css";

type Person = {
  name: string;
  photos: number;
  avatar: string;
};

const people: Person[] = [
  {
    name: "Rahul",
    photos: 120,
    avatar: "https://i.pravatar.cc/100?img=1"
  },
  {
    name: "Mom",
    photos: 85,
    avatar: "https://i.pravatar.cc/100?img=5"
  },
  {
    name: "Amit",
    photos: 60,
    avatar: "https://i.pravatar.cc/100?img=8"
  },
  {
    name: "Sarah",
    photos: 40,
    avatar: "https://i.pravatar.cc/100?img=10"
  },
  {
    name: "John",
    photos: 30,
    avatar: "https://i.pravatar.cc/100?img=11"
  }
];

export default function PeopleSection() {
  return (
    <div className="people-section">
      <h3>People Detected</h3>

      <div className="people-grid">
        {people.map((p, i) => (
          <div key={i} className="person-card">
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