import { useEffect, useState } from "react";

import { getCurrentLocation } from "../../../services/api/locationService";

export const useUserLocation = () => {
  const [userLatitude, setUserLatitude] = useState<number | null>(null);
  const [userLongitude, setUserLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const location = await getCurrentLocation();
      if (location) {
        setUserLatitude(location.latitude);
        setUserLongitude(location.longitude);
      }
      setLoading(false);
    };

    fetchUserLocation();
  }, []);

  return { userLatitude, userLongitude, loading };
};

