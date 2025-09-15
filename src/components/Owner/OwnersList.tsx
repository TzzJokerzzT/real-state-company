import { useOwnerStore } from "@/store/OwnerStore"
import { useState } from "react"
import OwnerDetailsModal from "./OwnerDetailsModal"
import { ButtonComponent } from "../UI/Button/Button"
import { HoverAnimation, HoverGesture } from "../UI/Animation/HoverGesture"
import { MessagesLayout } from "@/layout/MessagesLayout"
import { AlertCircle, Loader, User } from "lucide-react"

const OwnerList = () => {
  const { owners, loading, error } = useOwnerStore()
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  if (loading) {
    return (
      <MessagesLayout>
        <Loader />
        <p className="text-gray-600 text-md">Loading owners...</p>
      </MessagesLayout>
    )
  }

  if (error) {
    return (
      <MessagesLayout>
        <div className="text-center">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2">Error loading properties</p>
          <p className="text-gray-600 text-lg">{error}</p>
        </div>
      </MessagesLayout>
    )
  }

  if (!owners.length) {
    return (
      <MessagesLayout>
        <div className="text-center">
          <User className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-2 text-lg">No owners found</p>
        </div>
      </MessagesLayout>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {owners.map(owner => (
          <HoverAnimation>
            <ButtonComponent
              key={owner.id}
              className="bg-white w-full rounded-lg shadow p-4 text-left hover:shadow-md hover:bg-gray-50 transition"
              onClick={() => {
                setSelectedOwnerId(owner.id)
                setIsOpen(true)
              }}
            >
              <div className="text-lg font-semibold text-gray-900">
                {owner.name}
              </div>
              <div className="text-sm text-gray-700">{owner.email}</div>
              <div className="text-sm text-gray-700">{owner.phone}</div>
            </ButtonComponent>
          </HoverAnimation>
        ))}
      </div>

      <OwnerDetailsModal
        ownerId={selectedOwnerId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

export default OwnerList
