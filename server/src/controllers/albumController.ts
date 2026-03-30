import Album from "../model/Album";
import Photo from "../model/Photo";

export const getAlbumIdAndName = async (req:any,res:any) =>{
  try{
    const albums = await Album.find({},"_id name");
    // console.log(albums);
    res.json(albums);
  } catch(err){
    res.status(500).json(err);
  }
}

export const getAlbums = async (req: any, res: any) => {
  try {
    const albums = await Album.find().populate({ path: "photos", select: "thumbnail url" }).lean();
    res.json(albums);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createAlbum = async (req: any, res: any) => {
  try {
    const { name } = req.body;
    const album = await Album.create({ name });
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getAlbumById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const album = await Album.findById(id).populate({ path: "photos", select: "_id url thumbnail isFav" }).lean();
    if (!album) return res.status(404).json({ message: "Album not found" });
    res.json(album);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateAlbum = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const album = await Album.findByIdAndUpdate(id, { name }, { new: true }).lean();
    res.json(album);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteAlbum = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    // remove album reference from photos
    await Photo.updateMany({ albums: id }, { $pull: { albums: id } });
    await Album.findByIdAndDelete(id);
    res.json({ message: "Album deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addPhotoToAlbum = async (req: any, res: any) => {
  try {
    const { id } = req.params; // album id
    const { photoId } = req.body;
    if (!photoId) {
      return res.status(400).json({ error: "photoId is required" });
    }
    await Album.findByIdAndUpdate(id, { $addToSet: { photos: photoId } });
    await Photo.findByIdAndUpdate(photoId, { $addToSet: { albums: id } });
    res.json({ message: "Photo added to album" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const removePhotoFromAlbum = async (req: any, res: any) => {
  try {
    const { id, photoId } = req.params;
    await Album.findByIdAndUpdate(id, { $pull: { photos: photoId } });
    await Photo.findByIdAndUpdate(photoId, { $pull: { albums: id } });
    res.json({ message: "Photo removed from album" });
  } catch (err) {
    res.status(500).json(err);
  }
};
