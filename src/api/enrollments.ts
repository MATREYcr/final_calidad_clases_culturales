import type { Enrollment, CreateEnrollmentDto } from '../interfaces/enrollment';

const API_BASE_URL = 'http://localhost:8080/api';

export const createEnrollment = async (enrollmentData: CreateEnrollmentDto): Promise<Enrollment> => {
  const response = await fetch(`${API_BASE_URL}/enrollments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(enrollmentData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al crear la inscripción');
  }
  return response.json();
};

export const cancelEnrollment = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/enrollments/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al cancelar la inscripción');
  }
};

export const getEnrollmentsByClassId = async (classId: number): Promise<Enrollment[]> => {
  const response = await fetch(`${API_BASE_URL}/enrollments/class/${classId}`);
  if (!response.ok) {
    throw new Error(`Error al obtener las inscripciones para la clase con ID ${classId}`);
  }
  return response.json();
};