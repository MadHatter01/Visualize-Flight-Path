import { Line, OrbitControls, Text } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import React, { useEffect, useRef, useState } from 'react'
import { TextureLoader, Vector3 } from 'three';


const points = [
    { lat: 39.78397490187944, lon: -120.30191565436742 },
    { lat: 37.78418122425514, lon: -78.95779763006966 },
    { lat: 32.75716166343337, lon: -117.11451349581553 },
    { lat: 17.371722992847285, lon: 78.5419414236944 }

];

const flightPaths = [
    {
        start: { lat: 37.7749, lon: -122.4194 }, // San Francisco, CA
        end: { lat: 40.7128, lon: -74.0060 }    // New York, NY
    },
    {
        start: { lat: 34.0522, lon: -118.2437 }, // Los Angeles, CA
        end: { lat: 51.5074, lon: -0.1278 }      // London, UK
    }
];

// const flightPaths = [
//     {
//         id: 'flight1',
//         path: [
//             { lat: 37.7749, lon: -122.4194 },
//             { lat: 40.7128, lon: -74.0060 }
//         ]
//     },
//     {
//         id: 'flight2',
//         path: [
//             { lat: 34.0522, lon: -118.2437 },
//             { lat: 51.5074, lon: -0.1278 }
//         ]
//     }
// ];

const Globe = ({flightRoutes, airports}) => {
    
    const [flights, setFlights] = useState([]);

    const ref = useRef();
    const texture = useLoader(TextureLoader, '/earth_texture.jpg');
    const bump = useLoader(TextureLoader, 'earth_bump.jpg')

    const getCoordinatesByIATA=(code)=>{
        const airport = airports.find(airport=>airport.iata === code);
        return airport ? {lat:parseFloat(airport.lat), lon:parseFloat(airport.lon)} : 'no data';
    }

    const latLonToXYZ = (lat, lon, radius) => {

        // Phi is lat and theta is for lon. Phi will be measured from top to down - so 0 degrees at north pole to 90 to equator and 180 at south pole
        // so equator which is a 0 lat and lon will be 90 degrees.

        // lon is how far east or west a point is from meridian. 
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = -(lon) * (Math.PI / 180);
        // converting from spherical coords to cartesian
        //phi is from pos x to pos y and theta is from pos z 
        // theta - 0 to 2pi and phi - 0 to pi
        const x = 1.22 * Math.sin(phi) * Math.cos(theta);
        const z = 1.22 * Math.sin(phi) * Math.sin(theta);
        const y = 1.22 * Math.cos(phi);
        return new Vector3(x, y, z);
    }


    const makeCurvedPath = (start, end, segments = 50) => {
        const startPos = latLonToXYZ(start.lat, start.lon, 1.22);
        const endPos = latLonToXYZ(end.lat, end.lon, 1.22);

        const curvePoints = [];

        for (let i = 0; i <= segments; i++) {
            const t = i / segments; // normalizes within 0  to 1

            const interpolated = new Vector3().lerpVectors(startPos, endPos, t); //linear interpolation - create evenly spaced points between startpos and endpos

            // Using sin because it's symmetric around pi/2. Math.sin(0) is 0 and Math.sin(pi) is 0. So curve starts and ends at the same level
            const height = Math.sin(Math.PI * t) * 0.1;
            // Making sure the points are normalized and then scaled to stay at the right distance from globe center.
            interpolated.normalize().multiplyScalar(1.22 + height);
            curvePoints.push(interpolated);

        }
        return curvePoints;
    }

    useEffect(()=>{
        if (flightRoutes.length > 0 && airports.length > 0) {
            const paths = flightRoutes.map(route=>{
                const sourceCoords = getCoordinatesByIATA(route.Source_Airport);
                const destCoords = getCoordinatesByIATA(route.Destination_Code);
                if(sourceCoords && destCoords){
                    return {
                        path:makeCurvedPath(sourceCoords, destCoords),
                        source:sourceCoords,
                        destination:destCoords
                    }
                }

            })

                setFlights(paths.slice(1,50));    
 
        }
    },[airports,flightRoutes])



    return (
        <mesh ref={ref} >
     
            <OrbitControls />
            <sphereGeometry args={[1.20, 32, 32]} />
            <meshStandardMaterial map={texture} bumpMap={bump} bumpScale={0.5} />
            
            { flights.map((flight, index)=>{

              return(  <group key={index}>
                <Line
                            points={flight.path}
                            color="yellow"
                            lineWidth={2}
                            dashed={false} />
                    <mesh position={latLonToXYZ(flight.source.lat, flight.source.lon, 1.22)}>
                    <sphereGeometry args={[0.01, 16, 16]} />
                    <meshStandardMaterial color="red" />
                    </mesh>
                    <mesh position={latLonToXYZ(flight.destination.lat, flight.destination.lon, 1.22)}>
                    <sphereGeometry args={[0.01, 16, 16]} />
                    <meshStandardMaterial color="red" />
                </mesh>
                </group>)
            }) }
             
            
 
            {flightPaths.map((flight, index) => {
                // const pathPoints = flight.path.map(point => latLonToXYZ(point.lat, point.lon, 1.22));
                const pathPoints = makeCurvedPath(flight.start, flight.end);
                return (
                    <group key={index}>
                      



                        <mesh position={latLonToXYZ(flight.start.lat, flight.start.lon, 1.22)}>
                            <sphereGeometry args={[0.02, 16, 16]} />
                            <meshStandardMaterial color="red" />
                        </mesh>

                        <mesh position={latLonToXYZ(flight.end.lat, flight.end.lon, 1.22)}>
                            <sphereGeometry args={[0.02, 16, 16]} />
                            <meshStandardMaterial color="red" />
                        </mesh>

                        <Line
                            points={pathPoints}
                            color="yellow"
                            lineWidth={2}
                            dashed={false} />
                        <Text position={pathPoints[0].clone().add(new Vector3(0, 0.05, 0))}
                            fontSize={0.02}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                        >{`${flight.start.lat},${flight.start.lon} `}</Text>
                        <Text position={pathPoints[pathPoints.length - 1].clone().add(new Vector3(0, 0.05, 0))}
                            fontSize={0.02}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                        >{`${flight.end.lat},${flight.end.lon} `}</Text>

                    </group>
                )
            })}




        </mesh>

    )
}

export default Globe