import AppRouter from "./router/AppRouter";
import "./styles/global.css"
import "./pages/Album/Album.css";
import "./pages/Album/AlbumCard.css";
import "./pages/Gallery/GalleryPage.css";
import "./components/PeopleSection/PeopleSection.css";
import "./components/PhotoCloud/PhotoCloud.css"
import "./components/PhotoCloud/PreviewModal.css"
import "./components/PhotoGrid/PhotoGrid.css"

function App() {
  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
