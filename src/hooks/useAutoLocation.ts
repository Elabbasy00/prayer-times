// src/hooks/useAutoLocation.ts
import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { usePrayerStore } from '../store/prayerStore';
import { useUIStore } from '../store';
import { TRANSLATIONS, Language } from '../constants/translations';

export function useAutoLocation() {
  const { language } = useUIStore();
  const { location, setLocation } = usePrayerStore();
  const [isLoading, setIsLoading] = useState(false);
  const t = TRANSLATIONS[language as Language] || TRANSLATIONS.en;

  useEffect(() => {
    // Only auto-fetch if NOT set to manual
    if (location.manual) {
      return;
    }

    // Check if we already have valid coordinates (not default 0,0)
    if (location.latitude !== 0 && location.longitude !== 0) {
      return;
    }

    fetchLocation();
  }, []); // Run once on mount

  const fetchLocation = async () => {
    try {
      setIsLoading(true);

      // Request permission
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      // Get current position
      Geolocation.getCurrentPosition(
        async position => {
          const { latitude, longitude } = position.coords;

          // Reverse geocode to get city name
          let cityName = t.autoLocation || 'Auto Location';
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
              {
                headers: {
                  'User-Agent': 'PrayerTimesApp/1.0',
                },
              },
            );
            const data = await response.json();
            if (data?.address) {
              cityName =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county ||
                cityName;
            }
          } catch (error) {
            console.log('Reverse geocoding failed:', error);
          }

          // Update store
          setLocation({
            latitude,
            longitude,
            city: cityName,
            manual: false,
          });

          setIsLoading(false);
        },
        error => {
          console.log('Geolocation error:', error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch (error) {
      console.log('Location fetch error:', error);
      setIsLoading(false);
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      // iOS handles permissions automatically via Geolocation
      return true;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: t.locationPermissionTitle || 'Location Permission',
          message:
            t.locationPermissionMessage ||
            'This app needs access to your location for accurate prayer times.',
          buttonPositive: t.ok || 'OK',
          buttonNegative: t.cancel || 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log('Permission request error:', error);
      return false;
    }
  };

  return { isLoading, fetchLocation };
}

export default useAutoLocation;
