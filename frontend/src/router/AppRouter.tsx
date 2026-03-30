import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import GalleryPage from "../pages/Gallery/GalleryPage";
import PeoplePage from "../pages/People/PeoplePage";
import PeopleDetails from "../pages/People/PeopleDetails";
import AlbumDetails from "../pages/Album/AlbumDetails";
import AlbumsPage from "../pages/Album/AlbumPage";
// import People from "../pages/People";
// import Locations from "../pages/Locations";
// import Timeline from "../pages/Timeline";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gallery" element={<GalleryPage />}/>
          <Route path="/gallery/favorites" element={<GalleryPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route path="/people/:id" element={<PeopleDetails />} />
          <Route path="/albums" element={<AlbumsPage />} /> 
          <Route path="/albums/:id" element={<AlbumDetails />} />
          {/* <Route path="/gallery" element={<Gallery />} />
          <Route path="/people" element={<People />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/timeline" element={<Timeline />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}