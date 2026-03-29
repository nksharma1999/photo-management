import axios from "axios";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
type Props = {
  toggleSidebar: () => void;
};
export default function Navbar({ toggleSidebar }: Props) {
  const [file, setFile] = useState(null);
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("photo", file);

    const res = await axios.post(
      "http://localhost:5001/api/photos/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    // console.log(res.data);
    alert("Photo uploaded successfully");
  };
  return (
    <div className="navbar">
      <FiMenu className="menu-icon" onClick={toggleSidebar} />
      <input
        className="search"
        placeholder="Search photos, people, locations..."
      />

      <div className="nav-actions">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="upload" onClick={handleUpload}>
          {" "}
          <IoCloudUploadOutline /> Upload
        </button>
        <img className="avatar" src="https://i.pravatar.cc/40" />
      </div>
    </div>
  );
}
