import FaceEmbedding from "../model/FaceEmbedding";
import Person from "../model/Person";
import Photo from "../model/Photo";
import fetch from "node-fetch";

async function findBestMatch(
  queryDescriptor: any,
  knownFaces: any[],
  threshold = 0.6,
) {
  const faceApiUrl =
    process.env.FACEAPI_URL || "http://localhost:4001/match-faces";

  try {
    const res = await fetch(faceApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryDescriptor, knownFaces, threshold }),
    });

    if (res.ok) {
      const data: any = await res.json();
      // expected { name, personId, distance }
      if (data && data.name) return data;
    } else {
      console.warn("face-api server responded with", res.status);
    }
  } catch (err) {
    console.warn("face-api match-faces call failed:", err);
  }

  return null;
}

export const clusterFaces = async () => {
  const embeddings = await FaceEmbedding.find({ processed: false });
  const persons = await Person.find();

  // build knownFaces array for fast matching
  const knownFaces = [];

  persons.forEach((p) => {
    if (p.representative) {
      knownFaces.push({ id: String(p._id), name: p.name, descriptor:p.representative });
    }
  });

  for (const embDoc of embeddings) {
    if (!embDoc.photoId) continue;

    const match = await findBestMatch(embDoc.embedding, knownFaces, 0.5);
    console.log(match);
    if (match == null) {
      // no match found
      continue;
    }

    if (match.name !== "Not Found" && match.personId) {
      // matched existing person
      await Person.findByIdAndUpdate(match.personId, {
        $addToSet: { photos: embDoc.photoId },
      });
      await Photo.findByIdAndUpdate(embDoc.photoId, {
        $addToSet: { people: match.personId },
      });
    } else {
      // create new person
      const newPerson = await Person.create({
        name: "Unknown",
        representative: embDoc.embedding,
        photos: [embDoc.photoId],
      });
      const newDesc = Array.isArray(newPerson.representative)
        ? newPerson.representative
        : Object.values(newPerson.representative as any);
      knownFaces.push({
        id: String(newPerson._id),
        name: newPerson.name,
        descriptor: newDesc,
      });
      await Photo.findByIdAndUpdate(embDoc.photoId, {
        $addToSet: { people: newPerson._id },
      });
    }

    embDoc.processed = true;
    await embDoc.save();
  }

  return { message: "Clustering fixed" };
};
