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
  const [processing, setProcessing] = useState(false);
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

  const startFaceDetection = async () => {
    try {
      setProcessing(true);
      const res = await axios.post(`${BaseIP}/photos/process-all`);
      console.log(res.data);
      alert(`Started face detection for ${res.data.queued} photos`);
    } catch (err) {
      console.error(err);
      alert("Failed to start face detection");
    } finally {
      setProcessing(false);
    }
  };

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
        <button
          onClick={startFaceDetection}
          disabled={processing}
          className="upload"
        >
          {processing ? "Starting..." : "Run Face Detection"}
        </button>
        <button className="upload" onClick={clusterImage}>
          Cluster
        </button>
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
