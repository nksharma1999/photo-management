import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { BaseIP } from "../../data/BaseIP";
import { RxDotsVertical } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { IoShareSocialOutline } from "react-icons/io5";
import { IoIosAdd, IoMdAlbums } from "react-icons/io";
type Album = {_id: string, name: string };
type Props = {
  _id: string;
  src: string;
  type: string;
  isFavorite?: boolean;
  albumList?: Album[];
};

export default function PhotoCard({ _id, src, type, isFavorite, albumList }: Props) {
  const [liked, setLiked] = useState(isFavorite);
  const [showOptions, setShowOptions] = useState(false);
  const [showAlbumOptions, setShowAlbumOptions] = useState(false);
  const toggleAlbumOptions = () => {
    setShowAlbumOptions((prev) => !prev);
  };
  const toggleOptions = () => {
    setShowOptions((prev) => !prev);
  };
  const toggleLike = async () => {
    await axios.patch(`${BaseIP}/photos/${_id}/favorite`, { favorite: !liked });
    setLiked(!liked);
  };

  const AddPhotoInAlbum = async (albumId:string) =>{
    try {
    const res = await axios.post(`${BaseIP}/albums/${albumId}/photos`, {
      photoId: _id, // send the unique photo id
    });
    alert(res.data.message);
    toggleAlbumOptions();
  } catch (err: any) {
    console.error("Error adding photo to album:", err.response?.data || err.message);
    throw err;
  }
  }
  return (
    <div className="gallery-photo-card">
      {showOptions && (
        <div
          className="options-menu"
          
        >
          <button className="option-item"><MdDelete /></button>
          <button className="option-item"><IoShareSocialOutline /></button>
          <button className="option-item" onClick={toggleAlbumOptions}><IoIosAdd /><IoMdAlbums /></button>
          {showAlbumOptions && (
            <div
              className="album-menu"
              style={{
                display:'flex',
                justifyContent:"space-between",
                flexWrap:'wrap',
                marginTop: "6px",
                background: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "6px",
              }}
            >
              {albumList?.map((album:Album)=>{
                return <button className="album-item" onClick={() => AddPhotoInAlbum(album._id)}>{album.name}</button>
              })}
            </div>
          )}
        </div>
      )}
      <img src={src} />

      {/* Heart button */}
      <button className="gallery-favorite-btn" onClick={toggleLike}>
        {liked ? <FaHeart size={18} color="#ff4d6d" /> : <FiHeart size={18} color="teal" />}
      </button>
      <button className="gallery-option-btn" onClick={toggleOptions}>
        <RxDotsVertical   size={18} color="teal"/>
      </button>
      

      {type === "video" && <div className="gallery-video-badge">0:45</div>}

      <div className="gallery-photo-overlay">RAW</div>
    </div>
  );
}
