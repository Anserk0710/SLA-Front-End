import { api } from "./axios";

type Coordinates = {
  latitude: string;
  longitude: string;
};

type ReverseGeocodeResponse = {
  latitude: number;
  longitude: number;
  full_address: string;
};

export async function reverseGeocodeCoordinates(
  coordinates: Coordinates
): Promise<string> {
  const { data } = await api.get<ReverseGeocodeResponse>(
    "/technician/location/reverse-geocode",
    {
      params: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    }
  );

  return data.full_address;
}
