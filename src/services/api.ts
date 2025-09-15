import axios from "axios";
import type {
  CreatePropertyDto,
  Property,
  PropertyFilterDto,
  PropertyResponse,
  UpdatePropertyDto,
} from "../types/Property";
import type { CreateOwnerDto, Owner } from "../types/Owner";

const API_BASE_URL = "https://localhost:7000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Timeout configuration for better error handling
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const propertyApi = {
  // Get all properties
  getAllProperties: async (): Promise<Property[]> => {
    const response = await api.get<Property[]>("/properties");
    return response.data;
  },

  // Get properties with filtering and pagination
  getPropertiesByFilter: async (
    filter: PropertyFilterDto
  ): Promise<PropertyResponse> => {
    const response = await api.get<PropertyResponse>("/properties/search", {
      params: filter,
    });
    return response.data;
  },

  // Get property by ID
  getPropertyById: async (id: string): Promise<Property> => {
    const response = await api.get<Property>(`/properties/${id}`);
    return response.data;
  },

  // Create new property
  createProperty: async (property: CreatePropertyDto): Promise<Property> => {
    const response = await api.post<Property>("/properties", property);
    return response.data;
  },

  // Update property
  updateProperty: async (
    id: string,
    property: UpdatePropertyDto
  ): Promise<Property> => {
    const response = await api.put<Property>(`/properties/${id}`, property);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};

export const ownerApi = {
  // Get all owners
  getAllOwners: async (): Promise<Owner[]> => {
    const response = await api.get<Owner[]>("/owners");
    return response.data;
  },

  // Get owner by ID
  getOwnerById: async (id: string): Promise<Owner> => {
    const response = await api.get<Owner>(`/owners/${id}`);
    return response.data;
  },

  // Create new owner
  createOwner: async (owner: CreateOwnerDto): Promise<Owner> => {
    const response = await api.post<Owner>("/owners", owner);
    return response.data;
  },
};

export default api;
