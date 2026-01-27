import {
  API_URL_NEXT,
  AuthApiError,
  Messages,
} from "@/libs/components/types/config";
import { getAuthToken } from "./signup";

// API Configuration
const API_URL = API_URL_NEXT;
const API_BASE = `${API_URL}/api`;

// Types
export interface Brand {
  id: string;
  name: string;
  brand_brief?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandData {
  name: string;
  brand_brief?: string;
}

export interface UpdateBrandData {
  name?: string;
  brand_brief?: string;
}

/**
 * Get authorization headers with JWT token
 * @returns Headers object with Authorization
 */
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Get all brands for the current user
 * @returns Promise with array of brands
 * @throws AuthApiError if request fails
 */
export async function getAllBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(`${API_BASE}/brands/getAllBrands`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessages = Array.isArray(responseData.message)
        ? responseData.message
        : [responseData.message || "Failed to fetch brands"];

      throw new AuthApiError(response.status, errorMessages, responseData);
    }

    return responseData as Brand[];
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    throw new AuthApiError(500, [Messages.CONNECTION_ERROR], {
      statusCode: 500,
      message: Messages.NETWORK_ERROR,
      error: Messages.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * Get a single brand by ID
 * @param id - Brand ID
 * @returns Promise with brand data
 * @throws AuthApiError if request fails
 */
export async function getBrand(id: string): Promise<Brand> {
  try {
    const response = await fetch(`${API_BASE}/brands/getBrand/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessages = Array.isArray(responseData.message)
        ? responseData.message
        : [responseData.message || "Failed to fetch brand"];

      throw new AuthApiError(response.status, errorMessages, responseData);
    }

    return responseData as Brand;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    throw new AuthApiError(500, [Messages.CONNECTION_ERROR], {
      statusCode: 500,
      message: Messages.NETWORK_ERROR,
      error: Messages.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * Create a new brand
 * @param data - Brand data (name, brand_brief)
 * @returns Promise with created brand
 * @throws AuthApiError if request fails
 */
export async function createBrand(data: CreateBrandData): Promise<Brand> {
  try {
    const response = await fetch(`${API_BASE}/brands/createBrand`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessages = Array.isArray(responseData.message)
        ? responseData.message
        : [responseData.message || "Failed to create brand"];

      throw new AuthApiError(response.status, errorMessages, responseData);
    }

    return responseData as Brand;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    throw new AuthApiError(500, [Messages.CONNECTION_ERROR], {
      statusCode: 500,
      message: Messages.NETWORK_ERROR,
      error: Messages.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * Update an existing brand
 * @param id - Brand ID
 * @param data - Update data (name, brand_brief)
 * @returns Promise with updated brand
 * @throws AuthApiError if request fails
 */
export async function updateBrand(
  id: string,
  data: UpdateBrandData
): Promise<Brand> {
  try {
    const response = await fetch(`${API_BASE}/brands/updateBrand/${id}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessages = Array.isArray(responseData.message)
        ? responseData.message
        : [responseData.message || "Failed to update brand"];

      throw new AuthApiError(response.status, errorMessages, responseData);
    }

    return responseData as Brand;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    throw new AuthApiError(500, [Messages.CONNECTION_ERROR], {
      statusCode: 500,
      message: Messages.NETWORK_ERROR,
      error: Messages.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * Delete a brand
 * @param id - Brand ID
 * @returns Promise with success message
 * @throws AuthApiError if request fails
 */
export async function deleteBrand(id: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE}/brands/deleteBrand/${id}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessages = Array.isArray(responseData.message)
        ? responseData.message
        : [responseData.message || "Failed to delete brand"];

      throw new AuthApiError(response.status, errorMessages, responseData);
    }

    return responseData as { message: string };
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    throw new AuthApiError(500, [Messages.CONNECTION_ERROR], {
      statusCode: 500,
      message: Messages.NETWORK_ERROR,
      error: Messages.INTERNAL_SERVER_ERROR,
    });
  }
}
