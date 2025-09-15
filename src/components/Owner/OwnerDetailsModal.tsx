import { ownerApi, propertyApi } from "@/services/api"
import { useOwnerStore } from "@/store/OwnerStore"
import { usePropertyStore } from "@/store/PropertyStore"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { formatPrice } from "../helpers/helper"
import { ButtonComponent } from "../UI/Button/Button"
import type { OwnerDetailsModalProps } from "./types"

const OwnerDetailsModal = ({
  ownerId,
  isOpen,
  onClose
}: OwnerDetailsModalProps) => {
  const { selectedOwner: owner, setSelectedOwner } = useOwnerStore()
  const { selectedProperty: properties, setSelectedProperty } =
    usePropertyStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      if (!isOpen || !ownerId) return
      setLoading(true)
      setError(null)
      try {
        const [o, props] = await Promise.all([
          ownerApi.getOwnerById(ownerId),
          propertyApi
            .getPropertiesByFilter({ idOwner: ownerId, page: 1, pageSize: 10 })
            .then(r => r.properties)
        ])
        setSelectedOwner(o)
        setSelectedProperty(props)
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Failed to load owner details"
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isOpen, ownerId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Owner details</h2>
          <ButtonComponent onClick={onClose}>Close</ButtonComponent>
        </div>

        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && owner && (
          <>
            <div className="mb-4">
              <div className="text-lg font-semibold text-gray-900">
                {owner.name}
              </div>
              <div className="text-sm text-gray-700">{owner.email}</div>
              <div className="text-sm text-gray-700">{owner.phone}</div>
            </div>

            <div>
              <h3 className="text-md font-semibold text-gray-900 mb-2">
                Properties
              </h3>
              {properties?.length === 0 ? (
                <div className="text-gray-600">No properties found.</div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-auto">
                  {properties?.map(p => (
                    <div
                      key={p.id}
                      className="border rounded p-3 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        onClose()
                        navigate(`/properties/${p.id}`)
                      }}
                    >
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-700">{p.address}</div>
                      <div className="text-sm text-gray-700">
                        {formatPrice(p.price)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OwnerDetailsModal
