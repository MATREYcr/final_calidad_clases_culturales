
export interface Enrollment {
  id: number;
  studentName: string;
  classId: number;
  enrollmentDateTime: number;
}

export interface CreateEnrollmentDto {
  studentName: string;
  classId: number;
  enrollmentDateTime: number;
}