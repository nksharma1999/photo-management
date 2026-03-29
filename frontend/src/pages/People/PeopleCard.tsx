import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { BaseIP } from "../../data/BaseIP";
import axios from "axios";

type Props = {
  p: any;
  navigate: any;
  BaseIPForThumbnails: string;
  refreshPeople: () => void;
};

export default function PeopleCard({
  p,
  navigate,
  BaseIPForThumbnails,
  refreshPeople,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(p.name);

  const handleRename = async () => {
    if (!name.trim()) return;

    await axios.patch(`${BaseIP}/people/${p._id}`, {
      name,
    });

    setIsEditing(false);
    refreshPeople();
  };

  return (
    <div
      className="person-card"
      onClick={() => {
        if (!isEditing) navigate(`/people/${p._id}`);
      }}
    >
      <img
        src={`${BaseIPForThumbnails}${p.photos[0]?.thumbnail}`}
        alt={p.name}
      />

      <div className="person-info">

        {/* NAME / INPUT */}
        {isEditing ? (
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
            }}
            onBlur={() => setIsEditing(false)}
          />
        ) : (
          <p>{p.name}</p>
        )}

        <span>{p.photos.length} photos</span>

        {/* EDIT ICON */}
        {!isEditing && (
          <FaEdit
            className="edit-icon"
            onClick={(e) => {
              e.stopPropagation(); // 🔥 prevent navigation
              setIsEditing(true);
            }}
          />
        )}
      </div>
    </div>
  );
}