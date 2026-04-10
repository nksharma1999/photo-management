import PhotoCard from "./PhotoCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { BaseIP, BaseIPForThumbnails } from "../../data/BaseIP";
import { useLocation, useNavigate } from "react-router-dom";
import { addBaseUrlForOriginalImg } from "../../utils/fixHeicUrl";

type Photo = { _id: string; url: string; thumbnail?: string; isFav?: boolean };
type Group = { date: string; photos: Photo[] };
type Album = { _id: string; name: string };

export default function GalleryPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const isFavorites = location.pathname.includes("favorites");
  const isAlbums = location.pathname.includes("albums");
  const [groups, setGroups] = useState<Group[]>([]);
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getAlbumList = async () => {
    const res = await axios.get(`${BaseIP}/albums/idname`);
    setAlbumList(res.data || []);
  };
  const fetchPhotos = async (pageNum: number) => {
    try {
      const res = await axios.get(
        `${BaseIP}/photos/by-date?page=${pageNum}&limit=5`,
      );
      const newData = res.data || [];
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setGroups((prev) => [...prev, ...newData]);
      }
    } catch (err) {
      console.error("Failed to load gallery groups", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if(page<=0){
        setPage(1);
        return;
      }
      await fetchPhotos(page);
    };
    fetchData();
  }, [page]);


  useEffect(() => {
    const fetch = async () => {
      try {
        getAlbumList();
        // const res = await axios.get(`${BaseIP}/photos/by-date`);
        // setGroups(res.data || []);
      } catch (err) {
        console.error("Failed to load gallery groups", err);
      }
    };

    fetch();
  }, []);

  const fmtDate = (d: string) => {
    try {
      const dt = new Date(d + "T00:00:00Z");
      return dt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="gallery-page">
      <div className="gallery-tabs">
        <button
          className={!isFavorites && !isAlbums ? "active" : ""}
          onClick={() => navigate("/gallery")}
        >
          All Photos
        </button>
        <button
          className={isFavorites ? "active" : ""}
          onClick={() => navigate("/gallery/favorites")}
        >
          Favorites
        </button>
        <button>Videos</button>

        <div className="gallery-actions">
          <button>Filters</button>
          <button>Sort</button>
        </div>
      </div>

      {groups.map((g) => {
        const filteredPhotos = isFavorites
          ? g.photos.filter((p) => p.isFav)
          : g.photos;

        if (filteredPhotos.length === 0) return null;

        return (
          <div className="gallery-section" key={g.date}>
            <div className="gallery-header">
              <h2>{fmtDate(g.date)}</h2>
              <span>{g.date}</span>
            </div>

            <div className="gallery-grid">
              {filteredPhotos.map((p) => {
                const src = p.thumbnail
                  ? p.thumbnail.startsWith("/")
                    ? `${BaseIPForThumbnails}${p.thumbnail}`
                    : p.thumbnail
                  : p.url + ".jpg" || "";

                return (
                  <PhotoCard
                    deletePermanently={true}
                    key={p._id}
                    src={src}
                    url={addBaseUrlForOriginalImg(p.url)}
                    isFavorite={p.isFav}
                    type="photo"
                    _id={p._id}
                    albumList={albumList}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      {hasMore && (
        <div className="loadImage" onClick={() => setPage((prev) => prev + 1)}>Load Image</div>
      )}
    </div>
  );
}
