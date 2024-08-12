import React, { useEffect, useState } from 'react'
import Papa from 'papaparse';

const DataLoader = ({children}) => {
    const [flightRoutes, setFlightRoutes] = useState([]);

    // Data from https://github.com/jpatokal/openflights
    const loadFlights = ()=>{
        Papa.parse('routes.csv', {
            header:true,
            download:true,
            complete:(results)=>{
                setFlightRoutes(results.data);
                console.log(flightRoutes)
            },
            error:(error)=>{
                console.error("Error loading flight routes", error);
            }
        })

    }

    useEffect(()=>{
        loadFlights();
    },[])
  return (
    <div>{children}</div>
  )
}

export default DataLoader