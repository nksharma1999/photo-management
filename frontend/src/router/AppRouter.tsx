import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import GalleryPage from "../pages/Gallery/GalleryPage";
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
          {/* <Route path="/gallery" element={<Gallery />} />
          <Route path="/people" element={<People />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/timeline" element={<Timeline />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}