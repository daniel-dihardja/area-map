"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { LoaderOptions } from "@googlemaps/js-api-loader";

interface MapProps {
  address: string;
}

const Map: React.FC<MapProps> = ({ address }) => {
  console.log("GOOGLE_MAPS_API_KEY: ", process.env.GOOGLE_MAPS_API_KEY);
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loaderOptions: LoaderOptions = {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
    };

    const loader = new Loader(loaderOptions);
    loader.load().then(() => {
      if (!mapRef.current) return;

      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          console.log(address);
          const map = new google.maps.Map(mapRef.current, {
            center: results[0].geometry.location,
            zoom: 8,
          });

          new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
          });
        } else {
          console.error(
            `Geocode was not successful for the following reason: ${status}`
          );
        }
      });
    });
  }, []);

  return <div style={{ height: "400px" }} ref={mapRef} />;
};

export default Map;
