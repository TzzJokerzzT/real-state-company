import { MapPin, Calendar, User } from "lucide-react"
import { ButtonComponent } from "../UI/Button/Button"
import { formatDate, formatPrice } from "../helpers/helper"
import type { PropertyCardProps } from "./types"

const PropertyCard = ({ property, onViewDetails }: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={property.image || "/placeholder-property.svg"}
          alt={property.name}
          className="w-full h-48 object-cover"
          onError={e => {
            const target = e.target as HTMLImageElement
            target.src = "/placeholder-property.svg"
          }}
        />
        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full shadow-md">
          <span className="text-green-600 font-semibold text-sm">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.name}
        </h3>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{property.address}</span>
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4">
          <User className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>Owner ID: {property.idOwner}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Added {formatDate(property.createdAt)}</span>
          </div>
        </div>

        {onViewDetails && (
          <ButtonComponent
            onClick={() => onViewDetails(property)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            View Details
          </ButtonComponent>
        )}
      </div>
    </div>
  )
}

export default PropertyCard
