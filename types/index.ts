// Core Doctor interface
export interface Doctor {
  id: number
  name: string
  specialization: string
  profileImage: string
  availability: AvailabilityStatus
  schedule: string[]
  experience: string
  rating: number
  location: string
  about: string
}

// Availability status enum for better type safety
export type AvailabilityStatus = "Available Today" | "Available Tomorrow" | "Fully Booked"

// Form data interfaces
export interface PatientFormData {
  patientName: string
  email: string
}

export interface FormErrors {
  patientName: string
  email: string
}

// Appointment related types
export interface AppointmentDetails {
  doctorId: number
  doctorName: string
  patientName: string
  email: string
  appointmentDate: string
  appointmentTime: string
  slot: string
}

// Search and filter types
export interface SearchFilters {
  searchTerm: string
  specialization?: string
}

// Component prop types
export interface DoctorCardProps {
  doctor: Doctor
}

export interface AppointmentSlotProps {
  slot: string
  isSelected: boolean
  onSelect: (slot: string) => void
}

// API response types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Time slot formatting
export interface FormattedDateTime {
  date: string
  time: string
}

// Loading states
export interface LoadingState {
  isLoading: boolean
  error: string | null
}
