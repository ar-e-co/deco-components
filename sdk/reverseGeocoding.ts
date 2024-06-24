export async function getLocationFromLatLng(lat: number, lng: number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
  );

  const data = await response.json();

  return data;
}
