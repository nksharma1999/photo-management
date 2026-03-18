import Masonry from "react-masonry-css";
import "./PhotoGrid.css";

const photos = [
  "https://picsum.photos/400/600",
  "https://picsum.photos/400/500",
  "https://picsum.photos/400/700",
  "https://picsum.photos/400/450",
  "https://picsum.photos/400/650",
  "https://picsum.photos/400/500",
  "https://picsum.photos/400/600",
  "https://picsum.photos/400/450"
];

export default function PhotoGrid() {
  const breakpointColumns = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1
  };

  return (
    <div className="photo-section">
      <h3>Recent Photos</h3>

      <Masonry
        breakpointCols={breakpointColumns}
        className="photo-masonry"
        columnClassName="photo-column"
      >
        {photos.map((src, i) => (
          <div className="photo-card" key={i}>
            <img src={src} alt="photo" />
          </div>
        ))}
      </Masonry>
    </div>
  );
}