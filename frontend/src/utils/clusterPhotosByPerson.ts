import type { Photo } from "../data/photos"

export type ClusteredPhoto = Photo & {
  position: [number, number, number]
}

export const clusterPhotosByPerson = (photos: Photo[]): ClusteredPhoto[] => {

  const clusters: Record<string, Photo[]> = {}

  photos.forEach(photo => {
    if (!clusters[photo.person]) clusters[photo.person] = []
    clusters[photo.person].push(photo)
  })

  const result: ClusteredPhoto[] = []

  const clusterKeys = Object.keys(clusters)

  clusterKeys.forEach((person, clusterIndex) => {

    const centerX = Math.cos(clusterIndex) * 8
    const centerZ = Math.sin(clusterIndex) * 8

    clusters[person].forEach((photo) => {

      const x = centerX + (Math.random() - 0.5) * 2
      const y = (Math.random() - 0.5) * 2
      const z = centerZ + (Math.random() - 0.5) * 2

      result.push({
        ...photo,
        position: [x, y, z]
      })

    })
  })

  return result
}