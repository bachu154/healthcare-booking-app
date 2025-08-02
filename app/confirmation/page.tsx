"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, User, Mail, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import type { PatientFormData, FormErrors, LoadingState } from "@/types"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [formData, setFormData] = useState<PatientFormData>({
    patientName: "",
    email: "",
  })
  const [errors, setErrors] = useState<FormErrors>({
    patientName: "",
    email: "",
  })
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  })

  const doctorName = searchParams.get("doctorName") || ""
  const appointmentDate = searchParams.get("date") || ""
  const appointmentTime = searchParams.get("time") || ""
  const slot = searchParams.get("slot") || ""

  useEffect(() => {
    // Redirect if no appointment data
    if (!doctorName || !appointmentDate || !appointmentTime) {
      router.push("/")
    }
  }, [doctorName, appointmentDate, appointmentTime, router])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      patientName: "",
      email: "",
    }

    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return !newErrors.patientName && !newErrors.email
  }

  const handleInputChange = (field: keyof PatientFormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoadingState({ isLoading: true, error: null })

    try {
      // Simulate API call with proper error handling
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional API failures for demonstration
          if (Math.random() > 0.9) {
            reject(new Error("Booking service temporarily unavailable"))
          } else {
            resolve()
          }
        }, 1500)
      })

      setIsSubmitted(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to book appointment"
      setLoadingState({ isLoading: false, error: errorMessage })
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H+</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">HealthCare</h1>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">Appointment Confirmed!</h1>

              <p className="text-lg text-gray-600 mb-8">
                Your appointment has been successfully booked with <strong>{doctorName}</strong>
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Appointment Details</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Patient:</span>
                    <span className="font-medium ml-2">{formData.patientName}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium ml-2">{formData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium ml-2">{appointmentDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium ml-2">{appointmentTime}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <p className="text-blue-800 text-sm">
                  <strong>Important:</strong> Please arrive 15 minutes before your scheduled appointment time. A
                  confirmation email has been sent to {formData.email}.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    Book Another Appointment
                  </Button>
                </Link>
                <Button className="w-full sm:w-auto" onClick={() => window.print()}>
                  Print Confirmation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href={`/doctor/${searchParams.get("doctorId")}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Doctor
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H+</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">HealthCare</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Doctor</Label>
                  <p className="font-semibold text-gray-900">{doctorName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Date</Label>
                  <p className="font-semibold text-gray-900">{appointmentDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Time</Label>
                  <p className="font-semibold text-gray-900">{appointmentTime}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="patientName">
                    Patient Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="patientName"
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => handleInputChange("patientName", e.target.value)}
                    placeholder="Enter patient name"
                    className={errors.patientName ? "border-red-500" : ""}
                  />
                  {errors.patientName && <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>}
                </div>

                <div>
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loadingState.isLoading}>
                  {loadingState.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Confirming...
                    </>
                  ) : (
                    "Confirm Appointment"
                  )}
                </Button>
                {loadingState.error && <p className="text-red-500 text-sm mt-1">{loadingState.error}</p>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
