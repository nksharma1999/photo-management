import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseIP, BaseIPForThumbnails } from "../../data/BaseIP";
import PeopleCard from "./PeopleCard";
import type { Person } from "../Dashboard";

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  
  const navigate = useNavigate();
  const fetchPeople = async () => {
    const res = await fetch(`${BaseIP}/people`);
    const data = await res.json();
    setPeople(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchPeople();
    };
    fetchData();
  }, []);


  return (
    <div className="people-section">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3>Peoples</h3>
      </div>
      <div className="people-grid">
        {people.map((p, i) => (
          <PeopleCard
            key={i}
            person={p}
            navigate={navigate}
            BaseIPForThumbnails={BaseIPForThumbnails}
            refreshPeople={fetchPeople}
            
          />
        ))}
      </div>
    </div>
  );
}
