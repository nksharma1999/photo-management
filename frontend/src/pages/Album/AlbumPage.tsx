import "./Album.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { BaseIP } from "../../data/BaseIP";
import AlbumCard from "./AlbumCard";

type Album = {
  _id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  photos: any[];
};

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchAlbums = async () => {
    try {
      const res = await axios.get(`${BaseIP}/albums`);
    //   console.log("Fetched albums", res.data);
      setAlbums(res.data || []);
    } catch (err) {
      console.error("Failed to fetch albums", err);
    }
  };

  useEffect(() => {
    const callmehtod = () =>{
      fetchAlbums();
    }
    callmehtod();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createAlbum = async (e?: any) => {
    if (e) e.preventDefault();
    if (!newName.trim()) return;

    try {
      await axios.post(`${BaseIP}/albums`, { name: newName.trim() });
      setNewName("");
      setShowCreate(false);
      fetchAlbums();
    } catch (err) {
      console.error("Failed to create album", err);
    }
  };

  return (
    <div className="albums-page">
      {/* HEADER */}
      <div className="albums-header">
        <h2>Albums</h2>

        <button className="create-btn" onClick={() => setShowCreate(true)}>
          + New Album
        </button>
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Album</h3>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter album name..."
              autoFocus
            />

            <div className="modal-actions">
              <button onClick={createAlbum}>Create</button>
              <button onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {albums.length === 0 && (
        <div className="empty-state">
          <p>No albums yet</p>
          <button onClick={() => setShowCreate(true)}>
            Create your first album
          </button>
        </div>
      )}

      {/* GRID */}
      <div className="albums-grid">
        {albums.map((album) => (
          <AlbumCard
            navigateTo={`/albums/${album._id}`}
            key={album._id}
            album={album}
            onEdit={(id) => console.log("Edit", id)}
            onDelete={(id) => console.log("Delete", id)}
          />
        ))}
        {/* {albums.map((a, index) => (
          <div
            key={a._id}
            className="album-card"
            onClick={() => navigate(`/albums/${a._id}`)}
          >
            <div className="album-image">
              <img
                src={
                  a.photos?.[0]?.thumbnail
                    ? `${BaseIPForThumbnails}${a.photos[0].thumbnail}`
                    : "https://picsum.photos/500/400?random=" + index
                }
              />

              <div className="album-overlay">
                <span>{a.photos.length} photos</span>
              </div>
            </div>

            <div className="album-info">
              <p>{a.name}</p>
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
}
