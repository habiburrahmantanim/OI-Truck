export interface Truck {
  id: number;
  name: string;
  image?: string;
  capacity: string;
  price: number;
  category: string;
  description?: string;
  idealFor: string[];
  available: boolean;
}

export interface CreateTruckData {
  name: string;
  image?: string;
  capacity: string;
  price: number;
  category: string;
  description?: string;
  ideal_for: string[];
  available: boolean;
}
