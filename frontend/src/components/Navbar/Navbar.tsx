import axios from "axios";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { IoCloudUploadOutline } from "react-icons/io5";
import { BaseIP } from "../../data/BaseIP";
type Props = {
  toggleSidebar: () => void;
};
export default function Navbar({ toggleSidebar }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [file, setFile] = useState<any | null>(null);
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("photo", file);

    await axios.post(`${BaseIP}/photos/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // console.log(res.data);
    alert("Photo uploaded successfully");
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return; // nothing selected
    }
    const file = files[0];
    setFile(file);
  }
  return (
    <div className="navbar">
      
      {/* <input
        className="search"
        placeholder="Search photos, people, locations..."
      /> */}

      <div className="nav-actions">
        <input type="file" onChange={handleFileChange} />
        <button className="upload" onClick={handleUpload}>
          {" "}
          <IoCloudUploadOutline /> Upload
        </button>
        {/* <img className="avatar" src="https://i.pravatar.cc/40" /> */}
      </div>
      <FiMenu className="menu-icon" onClick={toggleSidebar} size={35}/>
    </div>
  );
}
