import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BaseIP, BaseIPForThumbnails } from "../../data/BaseIP";
import PhotoCard from "../Gallery/PhotoCard";
type PersonInfo = {
  _id: string;
  name: string;
  photos: {
    _id: string;
    thumbnail: string;
    url: string;
    isFav: boolean;
  }[];
};

export default function PersonDetails() {
  const { id } = useParams();
  const [info, setInfo] = useState<PersonInfo | null>(null);

  useEffect(() => {
    fetch(`${BaseIP}/people/${id}/photos`)
      .then((res) => res.json())
      .then((data) => setInfo(data));
  }, [id]);
  return (
    <div>
      <h2>Person Photos: {info?.name}</h2>

      <div className="gallery-grid">
        {info?.photos.map((p) => (
          <PhotoCard _id={p._id} isFavorite={p.isFav} key={p._id} src={BaseIPForThumbnails+p.thumbnail} type={""} />
        ))}
      </div>
    </div>
  );
}