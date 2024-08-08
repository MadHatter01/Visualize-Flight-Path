import { Canvas, useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'


const Globe = () => {
    const ref = useRef();

    useFrame(()=>{
        ref.current.rotation.y += 0.001;
    })

  return (
<mesh ref={ref} >
    <sphereGeometry args = {[1,32,32]} />
    <meshStandardMaterial color="blue" />
</mesh>
  )
}

export default Globe