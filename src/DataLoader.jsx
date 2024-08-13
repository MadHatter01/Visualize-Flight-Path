import React, { useEffect, useState } from 'react'
import Papa from 'papaparse';

const DataLoader = ({children}) => {
    const [flightRoutes, setFlightRoutes] = useState([]);
    const [airports, setAirports] = useState([]);
    // Data from https://github.com/jpatokal/openflights
    const loadFlights = ()=>{
        Papa.parse('data/routes.csv', {
            header:true,
            download:true,
            complete:(results)=>{
                setFlightRoutes(results.data);
            },
            error:(error)=>{
                console.error("Error loading flight routes", error);
            }
        })

    };

    const loadAirports = () =>{
        Papa.parse('data/airports.csv', {
            header:true,
            download:true,
            complete:(results)=>{
                setAirports(results.data);
            },
            error:(error)=>{
                console.error('error occured', error)
            }
        });
    }

    useEffect(()=>{
        loadFlights();
        loadAirports();
    },[])
  return children({flightRoutes, airports})
  
}

export default DataLoader