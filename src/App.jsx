import { useState, useRef } from 'react'
import './App.css'
import Globe from './Globe'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import DataLoader from './DataLoader'

function App() {
  const [count, setCount] = useState(0)
  

  // Texture maps from https://planetpixelemporium.com/earth8081.html
  return (

    <Canvas>

      <ambientLight intensity={0.5} />

      <directionalLight position={[5, 5, 5]} intensity={1} />
     
      <DataLoader>
        {({flightRoutes,airports})=>(
          <Globe flightRoutes={flightRoutes} airports={airports} />
        )}

      </DataLoader>
      <Stars />
    </Canvas>

  )
}

export default App
