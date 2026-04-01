import Photo from "../model/Photo";
import Person from "../model/Person";
import Album from "../model/Album";

export const getStats = async (req: any, res: any) => {
  try {
    const totalPhotos = await Photo.countDocuments();
    const peopleDetected = await Person.countDocuments();
    const locationsList = await Photo.distinct("location");
    const locations = locationsList.filter(Boolean).length;
    const albums = await Album.countDocuments();

    res.json({ totalPhotos, peopleDetected, locations, albums });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getTopPeople = async (req: any, res: any) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const peopleAgg: any = await Person.aggregate([
      { $project: { name: 1, croppedFaceUrl: 1, photos: { $size: { $ifNull: ["$photos", []] } } } },
      { $sort: { photos: -1 } },
      { $limit: limit }
    ]);
    
    res.json(peopleAgg);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getLocations = async (req: any, res: any) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const locs: any = await Photo.aggregate([
      { $match: { location: { $ne: null } } },
      { $group: { _id: "$location", photos: { $sum: 1 }, lat: { $avg: "$latitude" }, lng: { $avg: "$longitude" } } },
      { $sort: { photos: -1 } },
      { $limit: limit }
    ]);

    const mapped = locs.map((l: any) => ({ name: l._id, lat: l.lat || 0, lng: l.lng || 0, photos: l.photos }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getDataFor3DMap = async (req: any, res: any) => {
  try {
    // return list of photos with location and minimal metadata for 3D map
    const photos: any = await Photo.find({ location: { $ne: null } })
      .populate("people", "name")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const out = photos.map((p: any) => ({
      id: String(p._id),
      url: p.url,
      thumbnail: p.thumbnail || p.url,
      person: (p.people && p.people.length && p.people[0].name) ? p.people[0].name : "Unknown",
      location: p.location || "",
      date: p.dateTaken ? new Date(p.dateTaken).toISOString().slice(0,10) : new Date(p.createdAt).toISOString().slice(0,10)
    }));
    res.json(out);
  } catch (err) {
    res.status(500).json(err);
  }
};
