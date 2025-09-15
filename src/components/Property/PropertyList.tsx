import { AlertCircle } from "lucide-react"
import type { PropertyListProps } from "./types"
import { lazy, Suspense } from "react"
import { Loader } from "../UI/Loader/Loader"
import { EnterAnimation } from "../UI/Animation/EnterAnimation"
import { AppLayout } from "@/layout/AppLayout"
import { MessagesLayout } from "@/layout/MessagesLayout"
import PropertyCard from "./PropertyCard"

export const PropertyList = ({
  properties,
  loading,
  error,
  onViewDetails
}: PropertyListProps) => {
  const proper = true
  if (loading) {
    return (
      <MessagesLayout>
        <Loader />
        <p className="text-gray-600 text-md">Loading properties...</p>
      </MessagesLayout>
    )
  }

  if (error) {
    return (
      <MessagesLayout>
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading properties</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </MessagesLayout>
    )
  }

  if (properties.length === 0) {
    return (
      <MessagesLayout>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No properties found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      </MessagesLayout>
    )
  }

  return (
    <AppLayout>
      {properties.map(property => (
        <EnterAnimation key={property.id}>
          <PropertyCard
            key={property.id}
            property={property}
            onViewDetails={onViewDetails}
          />
        </EnterAnimation>
      ))}
    </AppLayout>
  )
}
