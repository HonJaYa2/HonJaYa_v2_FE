import { useState } from "react";

const useCurrentLocation = () => {
  const [location, setLocation] = useState<{lat: number, lon: number}>({ lat: 0, lon: 0 });
  const [error, setError] = useState<string>("");

  const setCurrentLocation = () => {
    if ("geolocation" in navigator) {
      // 참고: https://developer.mozilla.org/ko/docs/Web/API/Geolocation/getCurrentPosition
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        },
        {
          enableHighAccuracy: true,
        }
      );    
    } else {
      setError("Geolocation not supported");
    }
  };

  return { location, error, setCurrentLocation };
};

export default useCurrentLocation;
