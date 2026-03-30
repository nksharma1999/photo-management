import FaceEmbedding from "../model/FaceEmbedding";
import Person from "../model/Person";
import Photo from "../model/Photo";

function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0, normA = 0, normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

const THRESHOLD = 0.75;

export const clusterFaces = async () => {

  const embeddings = await FaceEmbedding.find({ processed: false });

  const persons = await Person.find();

  for (const embDoc of embeddings) {

    if (!embDoc.photoId) continue;

    let matchedPerson: any = null;
    let bestScore = 0;

    for (const person of persons) {

      if (!person.representative) continue;

      const sim = cosineSimilarity(
        embDoc.embedding,
        person.representative
      );

      if (sim > bestScore && sim > THRESHOLD) {
        bestScore = sim;
        matchedPerson = person;
      }
    }

    if (matchedPerson) {

      // ✅ prevent duplicate photos
      await Person.findByIdAndUpdate(
        matchedPerson._id,
        {
          $addToSet: { photos: embDoc.photoId }
        }
      );

      await Photo.findByIdAndUpdate(
        embDoc.photoId,
        {
          $addToSet: { people: matchedPerson._id }
        }
      );

    } else {

      const newPerson = await Person.create({
        name: "Unknown",
        representative: embDoc.embedding,
        photos: [embDoc.photoId]
      });

      persons.push(newPerson);

      await Photo.findByIdAndUpdate(
        embDoc.photoId,
        {
          $addToSet: { people: newPerson._id }
        }
      );
    }

    embDoc.processed = true;
    await embDoc.save();
  }

  return { message: "Clustering fixed" };
};

// export const clusterFaces = async () => {

//   const embeddings = await FaceEmbedding.find({ processed: false });
//   console.log(`Processing ${embeddings.length} face embeddings...`);
//   const persons = await Person.find();

//   for (const embDoc of embeddings) {

//     let matchedPerson: any = null;

//     for (const person of persons) {

//       if (!person.representative) continue;

//       const sim = cosineSimilarity(
//         embDoc.embedding,
//         person.representative
//       );

//       if (sim > THRESHOLD) {
//         matchedPerson = person;
//         break;
//       }
//     }

//     if (matchedPerson) {

//       // update person
//       matchedPerson.photos.push(embDoc.photoId);

//       // update representative (simple avg)
//       matchedPerson.representative = embDoc.embedding;

//       await matchedPerson.save();

//       await Photo.findByIdAndUpdate(
//         embDoc.photoId,
//         { $addToSet: { people: matchedPerson._id } }
//       );

//     } else {

//       const newPerson = await Person.create({
//         name: "Unknown",
//         representative: embDoc.embedding,
//         photos: [embDoc.photoId]
//       });

//       persons.push(newPerson);

//       await Photo.findByIdAndUpdate(
//         embDoc.photoId,
//         { $addToSet: { people: newPerson._id } }
//       );
//     }

//     embDoc.processed = true;
//     await embDoc.save();
//   }

//   return { message: "Clustering done" };
// };