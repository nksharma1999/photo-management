import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

type Props = {
  src: string;
  type: string;
};

export default function PhotoCard({ src, type }: Props) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="gallery-photo-card">
      <img src={src} />

      {/* Heart button */}
      <button className="gallery-favorite-btn" onClick={() => setLiked(!liked)}>
        {liked ? <FaHeart size={18} color="#ff4d6d" /> : <FiHeart size={18} />}
      </button>

      {type === "video" && <div className="gallery-video-badge">0:45</div>}

      <div className="gallery-photo-overlay">RAW</div>
    </div>
  );
}
