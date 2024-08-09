import { useState, useRef } from 'react'
import './App.css'
import Globe from './Globe'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

function App() {
  const [count, setCount] = useState(0)
  

  // Texture maps from https://planetpixelemporium.com/earth8081.html
  return (

    <Canvas>

      <ambientLight intensity={0.5} />

      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Globe />
      <Stars />
    </Canvas>

  )
}

export default App
