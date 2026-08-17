import { Truck } from "@/types/truck";

export type { Truck } from "@/types/truck";

export const trackingSteps = [
  { label: "Booking confirmed", time: "Awaiting dispatch" },
  { label: "Driver assigned", time: "Driver notified" },
  { label: "In transit", time: "Cargo is on the way" },
  { label: "Delivered", time: "Delivery completed" },
];

export const trucks: Truck[] = [
  {
    id: 1,
    name: "Pickup Truck",
    image: "/trucks/pickup.jpg",
    capacity: "1 Ton",
    price: 2500,
    category: "Small",
    description:
      "Perfect for small deliveries, furniture and local transportation.",
    idealFor: [
      "Furniture",
      "Small Business",
      "Local Delivery",
    ],
    available: true,
  },

  {
    id: 2,
    name: "Covered Van",
    image: "/trucks/covered-van.jpg",
    capacity: "1.5 Ton",
    price: 3500,
    category: "Medium",
    description:
      "A covered vehicle suitable for protecting goods during transportation.",
    idealFor: [
      "Electronics",
      "Furniture",
      "Business Delivery",
    ],
    available: true,
  },

  {
    id: 3,
    name: "Mini Truck",
    image: "/trucks/mini-truck.jpg",
    capacity: "3 Ton",
    price: 5000,
    category: "Medium",
    description:
      "Suitable for medium-sized cargo and commercial deliveries.",
    idealFor: [
      "Construction Materials",
      "Business Goods",
      "Bulk Delivery",
    ],
    available: true,
  },

  {
    id: 4,
    name: "Medium Cargo Truck",
    image: "/trucks/medium-truck.jpg",
    capacity: "5 Ton",
    price: 7500,
    category: "Large",
    description:
      "Reliable transportation for large business and industrial cargo.",
    idealFor: [
      "Industrial Goods",
      "Construction",
      "Large Cargo",
    ],
    available: true,
  },

  {
    id: 5,
    name: "Heavy Duty Truck",
    image: "/trucks/heavy-truck.jpg",
    capacity: "10 Ton",
    price: 12000,
    category: "Heavy",
    description:
      "Designed for heavy cargo and long-distance transportation.",
    idealFor: [
      "Heavy Equipment",
      "Industrial Cargo",
      "Long Distance",
    ],
    available: true,
  },

  {
    id: 6,
    name: "Large Cargo Truck",
    image: "/trucks/large-truck.jpg",
    capacity: "15 Ton",
    price: 18000,
    category: "Heavy",
    description:
      "High-capacity truck for large-scale logistics operations.",
    idealFor: [
      "Factory Goods",
      "Heavy Cargo",
      "Large Logistics",
    ],
    available: true,
  },
];
