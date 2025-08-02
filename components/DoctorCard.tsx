import type { Doctor } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface DoctorCardProps {
  doctor: Doctor
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const getAvailabilityColor = (availability: Doctor["availability"]): string => {
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

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Image
              src={doctor.profileImage || "/placeholder.svg"}
              alt={`Dr. ${doctor.name}`}
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

            <Badge className={`mb-4 ${getAvailabilityColor(doctor.availability)}`}>{doctor.availability}</Badge>

            <Link href={`/doctor/${doctor.id}`}>
              <Button className="w-full" disabled={doctor.availability === "Fully Booked"}>
                {doctor.availability === "Fully Booked" ? "Fully Booked" : "View Profile"}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
