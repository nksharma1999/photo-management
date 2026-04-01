import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { BaseIP } from "../../data/BaseIP";
import axios from "axios";
import type { Person } from "../Dashboard";

type Props = {
  person: Person;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate: any;
  BaseIPForThumbnails: string;
  refreshPeople: () => void;
};

export default function PeopleCard({
  person,
  navigate,
  BaseIPForThumbnails,
  refreshPeople,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(person.name);

  const handleRename = async () => {
    if (!name.trim()) return;

    await axios.patch(`${BaseIP}/people/${person._id}`, {
      name,
    });

    setIsEditing(false);
    refreshPeople();
  };

  return (
    <div
      className="person-card"
      onClick={() => {
        if (!isEditing) navigate(`/people/${person._id}`);
      }}
    >
      <img
        src={`${BaseIPForThumbnails}${person.croppedFaceUrl}`}
        alt={person.name}
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
          <p>{person.name}</p>
        )}

        <span>{person.photos} photos</span>

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