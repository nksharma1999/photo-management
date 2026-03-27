import { useEffect, useState } from "react";

type Person = {
  _id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  photos: any[];
};

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);

  const fetchPeople = async () => {
    const res = await fetch("http://localhost:5000/api/people");
    const data = await res.json();
    setPeople(data);
  };

  useEffect(() => {
    const fetchData = async () => {fetchPeople()};
    fetchData();
  }, []);

  return (
    <div className="people-page">
      <h2>People</h2>

      <div className="people-grid">
        {people.map((p) => (
          <div key={p._id} className="person-card">
            <img
              src={`http://localhost:5000${p.photos?.[0]?.thumbnail}`}
              alt=""
            />

            <h4>{p.name}</h4>
            <p>{p.photos.length} photos</p>
          </div>
        ))}
      </div>
    </div>
  );
}