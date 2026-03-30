import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BaseIP, BaseIPForThumbnails } from "../../data/BaseIP";
import PhotoCard from "../Gallery/PhotoCard";

export default function AlbumDetails() {
  const { id } = useParams();
  const [album, setAlbum] = useState<any>(null);

  useEffect(() => {
    axios.get(`${BaseIP}/albums/${id}`).then((res) => {
      setAlbum(res.data);
    });
  }, [id]);

  if (!album) return <p>Loading...</p>;

  return (
    <div>
      <h2>{album.name}</h2>

      <div className="gallery-grid">
        {album.photos.map((p: any) => (
          <PhotoCard
            deletePermanently={false}
            _id={p._id}
            isFavorite={p.isFav}
            key={p._id}
            src={BaseIPForThumbnails + p.thumbnail}
            type={""}
            disableAddToAlbum={true}
            albumIdToDelete={album._id}
          />
        ))}
      </div>
    </div>
  );
}
