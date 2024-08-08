import { useState, useRef } from 'react'
import './App.css'
import Globe from './Globe'
import { Canvas } from '@react-three/fiber'

function App() {
  const [count, setCount] = useState(0)

  return (
 
<Canvas> 

<ambientLight intensity={0.5}/>
<directionalLight position={[5,5,5]} intensity={1} />
<Globe />
</Canvas>
  
  )
}

export default App
