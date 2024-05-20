"use client";

import Image from "next/image";
//import LegalMap from "./components/Map";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import Map from "./components/Map";
import { useEffect, useState } from "react";
import SchoolMap from "./components/SchoolsMap";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

interface Location {
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const success = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const error = () => {
      setError("Unable to retrieve your location.");
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);
  return (
    <>
      {/* <Map address={"kurt-eisner-straße 68, 04275 Leipzig, Germany"} /> */}
      <SchoolMap
        lat={location?.latitude as number}
        lng={location?.longitude as number}
      ></SchoolMap>
    </>
  );
}
