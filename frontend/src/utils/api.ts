import { notFound } from "next/navigation";

export const SERVER_IP = process.env.NEXT_PUBLIC_SERVER!;
export const API_URL = process.env.NEXT_PUBLIC_API!;
export const API_PORT = process.env.API_PORT!;
export const API_BASE_URL = process.env.API_BASE_URL!;

export const fetchData = async (baseUrl: string, endpoint: string) => {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return notFound();
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};
