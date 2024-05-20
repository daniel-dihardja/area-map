// components/SchoolMap.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface SchoolMapProps {
  lat: number;
  lng: number;
}

const SchoolMap: React.FC<SchoolMapProps> = ({ lat, lng }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [schools, setSchools] = useState<google.maps.places.PlaceResult[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 15,
        });

        // Create a custom marker for the user's location
        new google.maps.Marker({
          map,
          position: { lat, lng },
          title: "Your Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new google.maps.Size(50, 50),
          },
        });

        const service = new google.maps.places.PlacesService(map);
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(lat, lng),
          radius: 500,
          type: "school",
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setSchools(results);
            results.forEach((place) => {
              if (place.geometry?.location) {
                // Create a marker for each school
                new google.maps.Marker({
                  map,
                  position: place.geometry.location,
                  title: place.name,
                });

                // Create a circle around each school with a radius of 300 meters
                new google.maps.Circle({
                  map,
                  center: place.geometry.location,
                  radius: 100,
                  fillColor: "#FF0000",
                  fillOpacity: 0.2,
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.1,
                  strokeWeight: 1,
                });
              }
            });
          }
        });
      }
    });
  }, [lat, lng]);

  return (
    <div>
      <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />
      <ul>
        {schools.map((school) => (
          <li key={school.place_id}>{school.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SchoolMap;
