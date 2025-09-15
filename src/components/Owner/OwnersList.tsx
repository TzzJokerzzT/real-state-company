import { useOwnerStore } from "@/store/OwnerStore"
import { useState } from "react"
import OwnerDetailsModal from "./OwnerDetailsModal"

const OwnerList = () => {
  const { owners, loading, error } = useOwnerStore()
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  if (loading) {
    return <div className="text-gray-600">Loading owners...</div>
  }

  if (error) {
    return <div className="text-red-600">{error}</div>
  }

  if (!owners.length) {
    return <div className="text-gray-600">No owners found.</div>
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {owners.map(owner => (
          <button
            key={owner.id}
            className="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition"
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
          </button>
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
