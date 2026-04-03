import { useNavigate } from "react-router-dom";

type Album = {
  _id: string;
  name: string;
  photos: string[];
};

type Props = {
  album: Album;
  navigateTo?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function AlbumCard({ album, navigateTo, onEdit, onDelete }: Props) {
 const navigate = useNavigate();
  const handleCardClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  const cover = "https://picsum.photos/500/400?random=0";

  return (
    <div className="album-card">
      {/* Image */}
      <div className="album-image">
        <img src={cover} alt={album.name} />
      </div>

      {/* Info */}
      <div className="album-content" onClick={handleCardClick}>
        <h3>{album.name}</h3>
        <p>{album.photos.length} photos</p>
      </div>

      {/* Actions */}
      <div className="album-actions">
        <button className="edit-btn" onClick={() => onEdit(album._id)}>
          ✏️
        </button>
        <button className="delete-btn" onClick={() => onDelete(album._id)}>
          🗑️
        </button>
      </div>
    </div>
  );
}