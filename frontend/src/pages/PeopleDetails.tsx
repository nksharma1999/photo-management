import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PersonDetails() {
  const { id } = useParams();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/people/${id}/photos`)
      .then((res) => res.json())
      .then((data) => setPhotos(data.photos));
  }, [id]);

  return (
    <div>
      <h2>Person Photos</h2>

      <div className="gallery-grid">
        {photos.map((p) => (
          <img
            key={p._id}
            src={`http://localhost:5000${p.thumbnail}`}
          />
        ))}
      </div>
    </div>
  );
}