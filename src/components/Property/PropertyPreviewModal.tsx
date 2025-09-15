import {
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  MapPin,
  User
} from "lucide-react"
import { formatDate, formatPrice } from "../helpers/helper"
import { ButtonComponent } from "../UI/Button/Button"
import type { PropertyPreviewModalProps } from "./types"

const PropertyPreviewModal = ({
  propertyData,
  createdProperty,
  isOpen,
  onClose,
  onConfirm,
  onGoHome,
  loading = false,
  mode
}: PropertyPreviewModalProps) => {
  if (!isOpen) return null

  const isPreviewMode = mode === "preview"
  const isConfirmationMode = mode === "confirmation"

  // Use preview data or created property data
  const displayData = isPreviewMode
    ? propertyData
    : createdProperty
      ? {
          name: createdProperty.name,
          address: createdProperty.address,
          price: createdProperty.price,
          image: createdProperty.image,
          ownerName: propertyData?.ownerName || "Unknown Owner"
        }
      : null

  if (!displayData) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center">
            {isPreviewMode ? (
              <Eye className="w-6 h-6 text-blue-600 mr-3" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              {isPreviewMode
                ? "Property Preview"
                : "Property Created Successfully!"}
            </h2>
          </div>
          <ButtonComponent
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </ButtonComponent>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <img
              src={displayData.image || "/placeholder-property.svg"}
              alt={displayData.name}
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
                {displayData.name}
              </h3>
              <div className="flex items-center text-2xl font-semibold text-green-600 mb-4">
                <DollarSign className="w-6 h-6 mr-1" />
                {formatPrice(displayData.price)}
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
                    <p className="text-gray-600">{displayData.address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Owner</h4>
                    <p className="text-gray-600">{displayData.ownerName}</p>
                  </div>
                </div>
              </div>

              {/* Show additional info only in confirmation mode */}
              {isConfirmationMode && createdProperty && (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Created
                      </h4>
                      <p className="text-gray-600">
                        {formatDate(createdProperty.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Property ID
                      </h4>
                      <p className="text-gray-600 font-mono text-xs">
                        {createdProperty.id}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                {isPreviewMode ? (
                  <>
                    <ButtonComponent
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                      isDisabled={loading}
                    >
                      Cancel
                    </ButtonComponent>
                    <ButtonComponent
                      onClick={onConfirm}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      isDisabled={loading}
                    >
                      {loading ? "Creating..." : "Confirm & Create Property"}
                    </ButtonComponent>
                  </>
                ) : (
                  <>
                    <ButtonComponent
                      onClick={onClose}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                      Close
                    </ButtonComponent>
                    <ButtonComponent
                      onClick={onGoHome}
                      className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Go to Home
                    </ButtonComponent>
                    {createdProperty && (
                      <ButtonComponent
                        onClick={() => {
                          window.location.href = `/properties/${createdProperty.id}`
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                      >
                        View Property Details
                      </ButtonComponent>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyPreviewModal
