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
      { $project: { name: 1, photosCount: { $size: { $ifNull: ["$photos", []] } } } },
      { $sort: { photosCount: -1 } },
      { $limit: limit }
    ]);

    // populate first photo thumbnail for avatar when available
    const results = await Promise.all(
      peopleAgg.map(async (p: any) => {
        const person = (await Person.findById(p._id).populate({ path: "photos", options: { limit: 1 }, select: "thumbnail" })) as any;
        const avatar = person?.photos?.length ? person.photos[0].thumbnail : `https://i.pravatar.cc/100?u=${p._id}`;
        return { _id: p._id, name: p.name, photos: p.photosCount, avatar };
      })
    );

    res.json(results);
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
