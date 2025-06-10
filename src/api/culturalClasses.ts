import type { CreateCulturalClassDto, CulturalClass, UpdateCulturalClassDto } from "../interfaces/culturalClass";

const API_BASE_URL = 'http://localhost:8080/api';

export const getAllCulturalClasses = async (): Promise<CulturalClass[]> => {
  const response = await fetch(`${API_BASE_URL}/cultural-classes`);
  if (!response.ok) {
    throw new Error('Error al obtener las clases culturales');
  }
  return response.json();
};

export const getCulturalClassById = async (id: number): Promise<CulturalClass> => {
  const response = await fetch(`${API_BASE_URL}/cultural-classes/${id}`);
  if (!response.ok) {
    throw new Error(`Error al obtener la clase cultural con ID ${id}`);
  }
  return response.json();
};

export const createCulturalClass = async (classData: CreateCulturalClassDto): Promise<CulturalClass> => {
  const response = await fetch(`${API_BASE_URL}/cultural-classes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(classData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear la clase cultural');
  }
  return response.json();
};

export const updateCulturalClass = async (id: number, classData: UpdateCulturalClassDto): Promise<CulturalClass> => {
  const response = await fetch(`${API_BASE_URL}/cultural-classes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(classData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar la clase cultural');
  }
  return response.json();
};

export const deleteCulturalClass = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/cultural-classes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar la clase cultural');
  }
};