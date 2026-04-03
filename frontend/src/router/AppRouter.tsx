import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { lazy, Suspense } from "react";


// Lazy imports
const Dashboard = lazy(() => import("../pages/Dashboard"));
const GalleryPage = lazy(() => import("../pages/Gallery/GalleryPage"));
const PeoplePage = lazy(() => import("../pages/People/PeoplePage"));
const PeopleDetails = lazy(() => import("../pages/People/PeopleDetails"));
const AlbumDetails = lazy(() => import("../pages/Album/AlbumDetails"));
const AlbumsPage = lazy(() => import("../pages/Album/AlbumPage"));
// const People = lazy(() => import("../pages/People"));
// const Locations = lazy(() => import("../pages/Locations"));
// const Timeline = lazy(() => import("../pages/Timeline"));

export default function AppRouter() {
  return (
    <BrowserRouter>
    <Suspense fallback={<div className="loader"></div>}>
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
      </Suspense>
    </BrowserRouter>
  );
}