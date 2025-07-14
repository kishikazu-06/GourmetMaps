import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RestaurantWithStats } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { MapPin, LocateFixed } from 'lucide-react';

// Fix for default marker icon issue with Webpack
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface Location {
  latitude: number;
  longitude: number;
}

// Haversine formula to calculate distance between two lat/lon points
const haversineDistance = (coords1: Location, coords2: Location) => {
  const toRad = (x: number) => x * Math.PI / 180;
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRad(coords2.latitude - coords1.latitude);
  const dLon = toRad(coords2.longitude - coords1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const MapPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<RestaurantWithStats[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearestRestaurant, setNearestRestaurant] = useState<RestaurantWithStats | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Fetch restaurants
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('/api/restaurants');
        const data: RestaurantWithStats[] = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      }
    };
    fetchRestaurants();

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && restaurants.length > 0) {
      let minDistance = Infinity;
      let nearest: RestaurantWithStats | null = null;

      restaurants.forEach(restaurant => {
        if (restaurant.latitude && restaurant.longitude) {
          const distance = haversineDistance(userLocation, { latitude: restaurant.latitude, longitude: restaurant.longitude });
          if (distance < minDistance) {
            minDistance = distance;
            nearest = { ...restaurant, distance };
          }
        }
      });
      setNearestRestaurant(nearest);
    }
  }, [userLocation, restaurants]);

  const handleLocateMe = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo([userLocation.latitude, userLocation.longitude], 15);
    } else {
      alert('現在地を取得できませんでした。');
    }
  };

  const handleGoToNearest = () => {
    if (nearestRestaurant && mapRef.current) {
      mapRef.current.flyTo([nearestRestaurant.latitude!, nearestRestaurant.longitude!], 15);
    } else {
      alert('最寄りの飲食店が見つかりませんでした。');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <h1 className="text-2xl font-bold">飲食店マップ</h1>
      </header>
      <div className="relative flex-grow">
        <MapContainer
          center={userLocation ? [userLocation.latitude, userLocation.longitude] : [36.78, 137.02]}
          zoom={userLocation ? 15 : 13}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
          whenReady={(map: L.Map) => { mapRef.current = map; }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker position={[userLocation.latitude, userLocation.longitude]}>
              <Popup>現在地</Popup>
            </Marker>
          )}
          {restaurants.map((restaurant) => (
            restaurant.latitude && restaurant.longitude && (
              <Marker key={restaurant.id} position={[restaurant.latitude, restaurant.longitude]}>
                <Popup>
                  <h3 className="font-bold">{restaurant.name}</h3>
                  <p>{restaurant.genre}</p>
                  <p>{restaurant.address}</p>
                  {restaurant.distance && <p>現在地から: {restaurant.distance.toFixed(2)} km</p>}
                  <a href={`/restaurant/${restaurant.id}`} className="text-blue-500 hover:underline">詳細を見る</a>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
        <div className="absolute bottom-4 left-4 z-10 flex flex-col space-y-2">
          <Button onClick={handleLocateMe} className="shadow-lg">
            <LocateFixed className="w-5 h-5 mr-2" />
            現在地へ移動
          </Button>
          <Button onClick={handleGoToNearest} className="shadow-lg">
            <MapPin className="w-5 h-5 mr-2" />
            最寄りの飲食店へ
          </Button>
        </div>
        {nearestRestaurant && (
          <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="font-bold">最寄りの飲食店:</h3>
            <p>{nearestRestaurant.name}</p>
            <p>{nearestRestaurant.genre}</p>
            <p>現在地から: {nearestRestaurant.distance?.toFixed(2)} km</p>
            <a href={`/restaurant/${nearestRestaurant.id}`} className="text-blue-500 hover:underline">詳細を見る</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
