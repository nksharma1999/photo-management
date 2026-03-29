import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { BaseIP } from "../../data/BaseIP";

type Props = {
  _id: string;
  src: string;
  type: string;
  isFavorite?: boolean;
};

export default function PhotoCard({ _id, src, type, isFavorite }: Props) {
  const [liked, setLiked] = useState(isFavorite);
  const toggleLike = async () => {
    await axios.patch(`${BaseIP}/photos/${_id}/favorite`, { favorite: !liked });
    setLiked(!liked);
  };
  return (
    <div className="gallery-photo-card">
      <img src={src} />

      {/* Heart button */}
      <button className="gallery-favorite-btn" onClick={toggleLike}>
        {liked ? <FaHeart size={18} color="#ff4d6d" /> : <FiHeart size={18} />}
      </button>

      {type === "video" && <div className="gallery-video-badge">0:45</div>}

      <div className="gallery-photo-overlay">RAW</div>
    </div>
  );
}
