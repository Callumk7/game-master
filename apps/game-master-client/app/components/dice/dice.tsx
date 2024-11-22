import { useState, useRef } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { Box, Text } from '@react-three/drei'

interface DiceProps {
  sides: number
  onRoll: (result: number) => void
}

function DiceModel({ sides }: { sides: number }) {
  const meshRef = useRef<ThreeElements['mesh']>(null!)
  const [rotation, setRotation] = useState([0, 0, 0])

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={meshRef} rotation={rotation}>
      <Box args={[1, 1, 1]}>
        <meshStandardMaterial color="white" />
      </Box>
      {[...Array(sides)].map((_, index) => (
        <Text
          key={index}
          position={[
            index % 2 === 0 ? 0.51 : index % 3 === 0 ? -0.51 : 0,
            index % 3 === 0 ? 0.51 : index % 5 === 0 ? -0.51 : 0,
            index % 5 === 0 ? 0.51 : index % 7 === 0 ? -0.51 : 0,
          ]}
          fontSize={0.5}
          color="black"
        >
          {index + 1}
        </Text>
      ))}
    </mesh>
  )
}

export function Dice({ sides, onRoll }: DiceProps) {
  const handleClick = () => {
    const result = Math.floor(Math.random() * sides) + 1
    onRoll(result)
  }

  return (
    <div className="w-full h-20 cursor-pointer" onClick={handleClick}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <DiceModel sides={sides} />
      </Canvas>
      <p className="text-center mt-1">d{sides}</p>
    </div>
  )
}

