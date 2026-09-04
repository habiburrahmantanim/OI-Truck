import { api } from "@/lib/api";
import { Truck, CreateTruckData } from "@/types/truck";

interface DjangoTruck {
  id: number;
  name: string;
  image?: string | null;
  capacity: string;
  price: string | number;
  category: string;
  description?: string | null;
  ideal_for: string[];
  available: boolean;
  created_at: string;
  updated_at: string;
}

function mapTruck(truck: DjangoTruck): Truck {
  return {
    id: truck.id,
    name: truck.name,
    image: truck.image || undefined,
    capacity: truck.capacity,
    price: Number(truck.price),
    category: truck.category,
    description: truck.description || undefined,
    idealFor: truck.ideal_for || [],
    available: truck.available,
  };
}

export async function getTrucks(token: string): Promise<Truck[]> {
  const response = await api.get<DjangoTruck[]>("/trucks/", token);

  return response.map(mapTruck);
}

export async function getTruck(id: number, token: string): Promise<Truck> {
  const response = await api.get<DjangoTruck>(`/trucks/${id}/`, token);

  return mapTruck(response);
}

export async function createTruck(
  data: CreateTruckData,
  token: string,
): Promise<Truck> {
  const response = await api.post<DjangoTruck>("/trucks/", data, token);

  return mapTruck(response);
}

export async function updateTruck(
  id: number,
  data: Partial<CreateTruckData>,
  token: string,
): Promise<Truck> {
  const response = await api.patch<DjangoTruck>(`/trucks/${id}/`, data, token);

  return mapTruck(response);
}

export async function deleteTruck(id: number, token: string): Promise<void> {
  await api.delete(`/trucks/${id}/`, token);
}
