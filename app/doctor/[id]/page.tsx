"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Star, Clock, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import type { Doctor, FormattedDateTime, LoadingState } from "@/types"
import { findDoctorById } from "@/lib/mockData"

export default function DoctorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  })
  const [selectedSlot, setSelectedSlot] = useState<string>("")

  useEffect(() => {
    const loadDoctor = async (): Promise<void> => {
      try {
        setLoadingState({ isLoading: true, error: null })

        const doctorId = Number.parseInt(params.id as string)
        if (isNaN(doctorId)) {
          throw new Error("Invalid doctor ID")
        }

        const foundDoctor = await findDoctorById(doctorId)

        if (!foundDoctor) {
          throw new Error("Doctor not found")
        }

        setDoctor(foundDoctor)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load doctor"
        setLoadingState({ isLoading: false, error: errorMessage })
        console.error("Error loading doctor:", error)
      } finally {
        setLoadingState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    if (params.id) {
      loadDoctor()
    }
  }, [params.id])

  const formatDateTime = (dateTimeString: string): FormattedDateTime => {
    const date = new Date(dateTimeString)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }
  }

  const handleBookAppointment = (): void => {
    if (selectedSlot && doctor) {
      const { date, time } = formatDateTime(selectedSlot)
      const queryParams = new URLSearchParams({
        doctorId: doctor.id.toString(),
        doctorName: doctor.name,
        slot: selectedSlot,
        date,
        time,
      })
      router.push(`/confirmation?${queryParams.toString()}`)
    }
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available Today":
        return "bg-green-100 text-green-800 border-green-200"
      case "Fully Booked":
        return "bg-red-100 text-red-800 border-red-200"
      case "Available Tomorrow":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loadingState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    )
  }

  if (loadingState.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{loadingState.error}</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor not found</h2>
          <p className="text-gray-600 mb-4">The doctor you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
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
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Doctors
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Profile */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-6">
                  <div className="flex-shrink-0">
                    <Image
                      src={doctor.profileImage || "/placeholder.svg"}
                      alt={doctor.name}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover mx-auto md:mx-0"
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                    <p className="text-xl text-blue-600 font-medium mb-4">{doctor.specialization}</p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 mr-2" />
                        <span className="font-medium">{doctor.rating}</span>
                        <span className="text-gray-600 ml-1">rating</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-400 mr-2" />
                        <span>{doctor.experience} experience</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                        <span>{doctor.location}</span>
                      </div>
                    </div>

                    <Badge className={`mb-6 ${getAvailabilityColor(doctor.availability)}`}>{doctor.availability}</Badge>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                      <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appointment Booking */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {doctor.schedule.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Slots</h3>
                    <p className="text-gray-600 text-sm">
                      This doctor is currently fully booked. Please check back later.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Available Time Slots</h4>
                    <div className="space-y-2 mb-6">
                      {doctor.schedule.map((slot, index) => {
                        const { date, time } = formatDateTime(slot)
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedSlot(slot)}
                            className={`w-full p-3 text-left rounded-lg border transition-colors ${
                              selectedSlot === slot
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="font-medium">{date}</div>
                            <div className="text-sm text-gray-600">{time}</div>
                          </button>
                        )
                      })}
                    </div>

                    <Button onClick={handleBookAppointment} disabled={!selectedSlot} className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>

                    {!selectedSlot && (
                      <p className="text-sm text-gray-500 mt-2 text-center">Please select a time slot to continue</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
