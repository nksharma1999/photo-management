import "./GalleryPage.css";
import PhotoCard from "./PhotoCard";

const photos = [
  {
    id: 1,
    src: "https://picsum.photos/500/400?1",
    date: "Today",
    location: "Tokyo, Japan",
    type: "photo",
  },
  {
    id: 2,
    src: "https://picsum.photos/500/400?2",
    date: "Today",
    location: "Tokyo, Japan",
    type: "photo",
  },
  {
    id: 3,
    src: "https://picsum.photos/500/400?3",
    date: "Today",
    location: "Tokyo, Japan",
    type: "photo",
  },
  {
    id: 4,
    src: "https://picsum.photos/500/400?4",
    date: "Yesterday",
    location: "Kyoto, Japan",
    type: "video",
  },
];

export default function GalleryPage() {
  const todayPhotos = photos.filter((p) => p.date === "Today");
  const yesterdayPhotos = photos.filter((p) => p.date === "Yesterday");

  return (
    <div className="gallery-page">
      {/* Top Tabs */}
      <div className="gallery-tabs">
        <button className="active">All Photos</button>
        <button>Favorites</button>
        <button>Videos</button>
        <button>Albums</button>

        <div className="gallery-actions">
          <button>Filters</button>
          <button>Sort</button>
        </div>
      </div>

      {/* Today Section */}
      <div className="gallery-section">
        <div className="gallery-header">
          <h2>Today</h2>
          <span>Oct 24, 2023 • Tokyo, Japan</span>
        </div>

        <div className="gallery-grid">
          {todayPhotos.map((photo) => (
            <PhotoCard key={photo.id} src={photo.src} type={photo.type} />
          ))}
        </div>
      </div>

      {/* Yesterday Section */}

      <div className="gallery-section">
        <div className="gallery-header">
          <h2>Yesterday</h2>
          <span>Oct 23, 2023 • Kyoto, Japan</span>
        </div>

        <div className="gallery-grid">
          {yesterdayPhotos.map((photo) => (
            <PhotoCard key={photo.id} src={photo.src} type={photo.type} />
          ))}
        </div>
      </div>
    </div>
  );
}
