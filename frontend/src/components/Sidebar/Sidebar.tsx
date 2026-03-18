import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiImage,
  FiUsers,
  FiMapPin,
  FiClock,
  FiSearch,
} from "react-icons/fi";
type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};
export default function Sidebar({ open, setOpen }: Props) {
  return (
    <>
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>PhotoSphere</h2>
          {/* <FiX className="close-btn" onClick={() => setOpen(false)} /> */}
        </div>
        <nav>
          <NavLink to="/">
            <FiGrid /> Dashboard
          </NavLink>

          <NavLink to="/gallery">
            <FiImage /> Gallery
          </NavLink>

          <NavLink to="/people">
            <FiUsers /> People
          </NavLink>

          <NavLink to="/locations">
            <FiMapPin /> Locations
          </NavLink>

          <NavLink to="/timeline">
            <FiClock /> Timeline
          </NavLink>

          <NavLink to="/ai">
            <FiSearch /> AI Search
          </NavLink>
        </nav>
      </div>
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
}
