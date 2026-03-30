import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BaseIP, BaseIPForThumbnails } from "../../data/BaseIP";
import PhotoCard from "../Gallery/PhotoCard";
import axios from "axios";
type Album = { _id: string; name: string };
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
  const [albumList, setAlbumList] = useState<Album[]>([]);

  const getAlbumList = async () => {
    const res = await axios.get(`${BaseIP}/albums/idname`);
    setAlbumList(res.data || []);
  };
  useEffect(() => {
    fetch(`${BaseIP}/people/${id}/photos`)
      .then((res) => res.json())
      .then((data) => setInfo(data));
  }, [id]);
  useEffect(() => {
    const fetchData = async () => {
      getAlbumList();
    };
    fetchData();
  }, []);
  return (
    <div>
      <h2>Person Photos: {info?.name}</h2>

      <div className="gallery-grid">
        {info?.photos.map((p) => (
          <PhotoCard
            deletePermanently={true}
            _id={p._id}
            isFavorite={p.isFav}
            key={p._id}
            src={BaseIPForThumbnails + p.thumbnail}
            type={""}
            albumList={albumList}
          />
        ))}
      </div>
    </div>
  );
}
