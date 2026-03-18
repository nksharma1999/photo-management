import { Text } from "@react-three/drei"

type Props = {
  text:string
  position:[number,number,number]
}

export default function ClusterLabel({text,position}:Props){

  return(
    <Text
      position={[position[0],position[1]+2,position[2]]}
      fontSize={0.8}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  )
}