"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Star, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import type { Doctor, LoadingState, AvailabilityStatus } from "@/types"
import { fetchDoctorsData } from "@/lib/mockData"

export default function HomePage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const loadDoctors = async (): Promise<void> => {
      try {
        setLoadingState({ isLoading: true, error: null })
        const data = await fetchDoctorsData()
        setDoctors(data)
        setFilteredDoctors(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load doctors"
        setLoadingState({ isLoading: false, error: errorMessage })
        console.error("Error loading doctors:", error)
      } finally {
        setLoadingState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    loadDoctors()
  }, [])

  useEffect(() => {
    const filtered = doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredDoctors(filtered)
  }, [searchTerm, doctors])

  const getAvailabilityColor = (availability: AvailabilityStatus): string => {
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
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    )
  }

  if (loadingState.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {loadingState.error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H+</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">HealthCare</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-blue-600 font-medium">
                Find Doctors
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Find & Book Appointments with Top Doctors</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Connect with experienced healthcare professionals and book your appointment in just a few clicks
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search doctors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Doctors List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Available Doctors</h3>
          <p className="text-gray-600">
            {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} found
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={doctor.profileImage || "/placeholder.svg"}
                        alt={doctor.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 truncate">{doctor.name}</h4>
                      <p className="text-blue-600 font-medium mb-2">{doctor.specialization}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{doctor.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{doctor.experience}</span>
                        </div>
                      </div>

                      <div className="flex items-center mb-3">
                        <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{doctor.location}</span>
                      </div>

                      <Badge className={`mb-4 ${getAvailabilityColor(doctor.availability)}`}>
                        {doctor.availability}
                      </Badge>

                      <Link href={`/doctor/${doctor.id}`}>
                        <Button className="w-full" disabled={doctor.availability === "Fully Booked"}>
                          {doctor.availability === "Fully Booked" ? "Fully Booked" : "View Profile"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
