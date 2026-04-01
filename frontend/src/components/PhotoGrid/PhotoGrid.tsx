import Masonry from "react-masonry-css";
import "./PhotoGrid.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BaseIP, BaseIPForThumbnails } from "../../data/BaseIP";

export default function PhotoGrid() {
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await axios.get(`${BaseIP}/photos/recent`);
        setPhotos(res.data || []);
      } catch (err) {
        console.error("Failed to fetch photos", err);
      }
    };

    fetchPhotos();
  }, []);
  const breakpointColumns = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1,
  };

  return (
    <div className="photo-section">
      <h3>Recent Photos</h3>

      <Masonry
        breakpointCols={breakpointColumns}
        className="photo-masonry"
        columnClassName="photo-column"
      >
        {photos.map((p, i) => (
          <div className="photo-card" key={String(i)}>
            <img src={BaseIPForThumbnails + p} alt="photo" />
          </div>
        ))}
      </Masonry>
    </div>
  );
}
