import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BaseIP, BaseIPForThumbnails } from "../../data/BaseIP";
import PeopleCard from "./PeopleCard";
import axios from "axios";

type Person = {
  _id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  photos: any[];
};

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const navigate = useNavigate();
  const fetchPeople = async () => {
    const res = await fetch(`${BaseIP}/people`);
    const data = await res.json();
    setPeople(data);
  };

  const clusterImage = async () => {
    try {
      await axios.get(`${BaseIP}/ai/cluster`);
      fetchPeople();
    } catch (err) {
      console.error("Failed to cluster people", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      fetchPeople();
    };
    fetchData();
  }, []);

  return (
    <div className="people-section">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
        <h3>Peoples</h3>
        <button className="upload" onClick={clusterImage}>Cluster</button>
      </div>
      <div className="people-grid">
        {people.map((p, i) => (
          <PeopleCard
            key={i}
            p={p}
            navigate={navigate}
            BaseIPForThumbnails={BaseIPForThumbnails}
            refreshPeople={fetchPeople}
          />
        ))}
      </div>
    </div>
  );
}
