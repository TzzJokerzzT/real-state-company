import { Calendar, DollarSign, MapPin, User, X } from "lucide-react"
import { formatDate, formatPrice } from "../helpers/helper"
import { ButtonComponent } from "../UI/Button/Button"
import type { PropertyDetailsProps } from "./types"
import { useNavigate } from "react-router-dom"
import { TransitionAnimation } from "../UI/Animation/Transition"
import { HoverAnimation } from "../UI/Animation/HoverGesture"

export const PropertyDetails = ({
  property,
  onClose,
  isOpen
}: PropertyDetailsProps) => {
  const navigate = useNavigate()
  if (!isOpen || !property) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <TransitionAnimation>
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Property Details
            </h2>
            <ButtonComponent
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </ButtonComponent>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <img
                src={property.image || "/placeholder-property.svg"}
                alt={property.name}
                className="w-full h-64 object-cover rounded-lg"
                onError={e => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder-property.svg"
                }}
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.name}
                </h3>
                <div className="flex items-center text-2xl font-semibold text-green-600 mb-4">
                  <DollarSign className="w-6 h-6 mr-1" />
                  {formatPrice(property.price)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Address
                      </h4>
                      <p className="text-gray-600">{property.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Owner ID
                      </h4>
                      <p className="text-gray-600">{property.idOwner}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Created
                      </h4>
                      <p className="text-gray-600">
                        {formatDate(property.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Last Updated
                      </h4>
                      <p className="text-gray-600">
                        {formatDate(property.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-4">
                  <HoverAnimation>
                    <ButtonComponent
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 shadow-lg shadow-gray-100 transition-colors duration-200"
                    >
                      Close
                    </ButtonComponent>
                  </HoverAnimation>
                  <HoverAnimation>
                    <ButtonComponent
                      onClick={() => {
                        navigate(`/properties/${property.id}`)
                      }}
                    >
                      More Details
                    </ButtonComponent>
                  </HoverAnimation>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionAnimation>
    </div>
  )
}
