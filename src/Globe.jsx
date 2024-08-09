import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import React, { useRef } from 'react'
import { TextureLoader } from 'three';


const Globe = () => {
    const ref = useRef();
    const texture = useLoader(TextureLoader, '/earth_texture.jpg');
    const bump = useLoader(TextureLoader, 'earth_bump.jpg')

    useFrame(()=>{
        ref.current.rotation.y += 0.001;
    })

  return (
<mesh ref={ref} >
    <OrbitControls />
    <sphereGeometry args = {[2,32,32]} />
    <meshStandardMaterial map={texture} bumpMap={bump} bumpScale={0.5}/>
</mesh>
  )
}

export default Globe