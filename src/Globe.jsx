import { OrbitControls, Text } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import React, { useRef } from 'react'
import { TextureLoader, Vector3 } from 'three';


const points = [
    {lat:39.78397490187944, lon:-120.30191565436742},
    {lat:37.78418122425514,lon: -78.95779763006966},
    {lat:32.75716166343337, lon:-117.11451349581553},
    {lat:17.371722992847285, lon:78.5419414236944}

];

const Globe = () => {
    const ref = useRef();
    const texture = useLoader(TextureLoader, '/earth_texture.jpg');
    const bump = useLoader(TextureLoader, 'earth_bump.jpg')

    // useFrame(() => {
    //     ref.current.rotation.y += 0.001;
    // })

    return (
        <mesh ref={ref} >
            <OrbitControls />
            <sphereGeometry args={[1.20, 32, 32]} />
            <meshStandardMaterial map={texture} bumpMap={bump} bumpScale={0.5} />
            {points.map((point, index) => {

                // Phi is lat and theta is for lon. Phi will be measured from top to down - so 0 degrees at north pole to 90 to equator and 180 at south pole
                // so equator which is a 0 lat and lon will be 90 degrees.

                // lon is how far east or west a point is from meridian. 
                const phi = (90 - point.lat) * (Math.PI / 180) ; 
                const theta = -(point.lon) * (Math.PI / 180) ;
               // converting from spherical coords to cartesian
               //phi is from pos x to pos y and theta is from pos z 
               // theta - 0 to 2pi and phi - 0 to pi
                const x = 1.22 * Math.sin(phi) * Math.cos(theta);
                 const z = 1.22 * Math.sin(phi) * Math.sin(theta);
                 const y= 1.22 * Math.cos(phi);
                return (
                    <group key={index} position={[x,y,z]}>
                        <mesh>
                            <sphereGeometry args={[0.01, 16, 16]} />
                            <meshStandardMaterial color="red" />
                        </mesh>
                        <Text
                            position={[0, 0.02, 0]}
                            fontSize={0.02}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                        >
                            {console.log(point)} {`(${point.lat}, ${point.lon})`}

                        </Text>
                    </group>

                )
            })}
        </mesh>

    )
}

export default Globe