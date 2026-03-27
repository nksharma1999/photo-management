import Person from "../model/Person";
import Photo from "../model/Photo";

export const getPeople = async (req: any, res: any) => {

  const people = await Person.find().populate("photos");

  res.json(people);

};

export const renamePerson = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const person = await Person.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    res.json(person);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const mergePeople = async (req: any, res: any) => {
  try {
    const { sourceId, targetId } = req.body;

    const source = await Person.findById(sourceId);
    const target = await Person.findById(targetId);

    if (!source || !target) {
      return res.status(404).json({ message: "Person not found" });
    }

    // move photos
    target.photos.push(...source.photos);

    await target.save();

    // update photos collection
    await Photo.updateMany(
      { people: sourceId },
      {
        $pull: { people: sourceId },
        $addToSet: { people: targetId }
      }
    );

    // delete source
    await Person.findByIdAndDelete(sourceId);

    res.json({ message: "People merged" });

  } catch (err) {
    res.status(500).json(err);
  }
};
export const getPersonPhotos = async (req: any, res: any) => {
  const { id } = req.params;

  const person = await Person.findById(id).populate("photos");

  res.json(person);
};
export const deletePerson = async (req: any, res: any) => {

  const { id } = req.params;

  await Photo.updateMany(
    { people: id },
    { $pull: { people: id } }
  );

  await Person.findByIdAndDelete(id);

  res.json({ message: "Person deleted" });
};