import type { Photo } from "../data/photos"

export type ClusterMode = "person" | "location" | "timeline"

export type ClusteredPhoto = Photo & {
  position: [number, number, number]
}

function groupBy(key: keyof Photo, photos: Photo[]) {
  const map: Record<string, Photo[]> = {}

  photos.forEach(p => {
    const value = p[key] as string
    if (!map[value]) map[value] = []
    map[value].push(p)
  })

  return map
}

export function generateClusters(
  photos: Photo[],
  mode: ClusterMode
): ClusteredPhoto[] {

  let grouped: Record<string, Photo[]>

  if (mode === "person") grouped = groupBy("person", photos)
  else if (mode === "location") grouped = groupBy("location", photos)
  else grouped = groupBy("date", photos)

  const result: ClusteredPhoto[] = []

  const keys = Object.keys(grouped)

  keys.forEach((key, clusterIndex) => {

    const centerX = Math.cos(clusterIndex) * 8
    const centerZ = Math.sin(clusterIndex) * 8

    grouped[key].forEach(photo => {

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