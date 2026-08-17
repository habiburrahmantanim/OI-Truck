export interface Truck {
  id: number;

  name: string;
  image: string;

  capacity: string;
  price: number;

  category: string;

  description: string;

  idealFor: string[];

  available: boolean;
}