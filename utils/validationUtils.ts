/**
 * Validates email format using regex
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

/**
 * Validates patient name (minimum 2 characters, only letters and spaces)
 */
export const validatePatientName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]{2,}$/
  return nameRegex.test(name.trim())
}

/**
 * Validates phone number (optional utility for future use)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/
  return phoneRegex.test(phone.trim())
}

/**
 * Generic validation result type
 */
export interface ValidationResult {
  isValid: boolean
  errorMessage?: string
}

/**
 * Comprehensive form validation
 */
export const validateFormField = (fieldName: string, value: string, isRequired = true): ValidationResult => {
  if (isRequired && !value.trim()) {
    return {
      isValid: false,
      errorMessage: `${fieldName} is required`,
    }
  }

  switch (fieldName.toLowerCase()) {
    case "email":
      if (value && !validateEmail(value)) {
        return {
          isValid: false,
          errorMessage: "Please enter a valid email address",
        }
      }
      break
    case "patientname":
    case "name":
      if (value && !validatePatientName(value)) {
        return {
          isValid: false,
          errorMessage: "Name must contain only letters and spaces (minimum 2 characters)",
        }
      }
      break
  }

  return { isValid: true }
}
