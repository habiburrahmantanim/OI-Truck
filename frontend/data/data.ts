
export interface Truck {
  id: number;
  name: string;
  capacity: string;
  price: number;
  image: string;
  description: string;
  category: string;
  idealFor: string[];
  features: string[];
}

export const trucks: Truck[] = [
  {
    id: 1,
    name: "Pickup Truck",
    capacity: "1 Ton",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=1200&q=80",
    description:
      "A compact and flexible truck, ideal for small household moves and local deliveries.",
    category: "Small",
    idealFor: [
      "Small furniture",
      "Electronics",
      "Office equipment",
      "Local deliveries",
    ],
    features: [
      "Quick booking",
      "Suitable for city roads",
      "Professional driver",
    ],
  },
  {
    id: 2,
    name: "Mini Covered Van",
    capacity: "1.5 Tons",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    description:
      "A covered vehicle that helps protect your cargo from dust, rain and changing weather.",
    category: "Small",
    idealFor: [
      "Furniture",
      "Packages",
      "Small business goods",
      "Sensitive cargo",
    ],
    features: [
      "Covered cargo area",
      "Weather protection",
      "Professional driver",
    ],
  },
  {
    id: 3,
    name: "Mini Truck",
    capacity: "2 Tons",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1586191582151-f73872dfd183?auto=format&fit=crop&w=1200&q=80",
    description:
      "A reliable option for medium-sized loads, business deliveries and household transportation.",
    category: "Medium",
    idealFor: [
      "Medium furniture",
      "Construction materials",
      "Business goods",
      "Equipment",
    ],
    features: [
      "Good cargo space",
      "Reliable transport",
      "Professional driver",
    ],
  },
  {
    id: 4,
    name: "Covered Truck",
    capacity: "3 Tons",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
    description:
      "A spacious covered truck designed for transporting valuable and weather-sensitive cargo.",
    category: "Medium",
    idealFor: [
      "Commercial goods",
      "Furniture",
      "Appliances",
      "Business inventory",
    ],
    features: [
      "Covered body",
      "Large cargo space",
      "Weather protection",
    ],
  },
  {
    id: 5,
    name: "Medium Cargo Truck",
    capacity: "5 Tons",
    price: 2800,
    image:
      "https://images.unsplash.com/photo-1592833159155-c62df1b65634?auto=format&fit=crop&w=1200&q=80",
    description:
      "Built for larger deliveries and commercial transportation with excellent cargo capacity.",
    category: "Large",
    idealFor: [
      "Large furniture",
      "Heavy equipment",
      "Bulk goods",
      "Commercial deliveries",
    ],
    features: [
      "High load capacity",
      "Spacious cargo area",
      "Long-distance ready",
    ],
  },
  {
    id: 6,
    name: "Heavy Duty Truck",
    capacity: "10 Tons",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1566576912327-8d3efb0d5779?auto=format&fit=crop&w=1200&q=80",
    description:
      "A powerful truck designed for heavy cargo, industrial materials and large-scale transportation.",
    category: "Heavy",
    idealFor: [
      "Industrial materials",
      "Heavy machinery",
      "Bulk construction goods",
      "Large commercial cargo",
    ],
    features: [
      "Heavy-duty transport",
      "Large capacity",
      "Suitable for long distances",
    ],
  },
  {
    id: 7,
    name: "Large Cargo Truck",
    capacity: "15 Tons",
    price: 6500,
    image:
      "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=1200&q=80",
    description:
      "A high-capacity solution for major commercial operations and large-volume cargo transportation.",
    category: "Heavy",
    idealFor: [
      "Factory goods",
      "Large inventory",
      "Bulk cargo",
      "Long-distance logistics",
    ],
    features: [
      "Maximum cargo space",
      "Commercial transport",
      "Long-distance capable",
    ],
  },
];