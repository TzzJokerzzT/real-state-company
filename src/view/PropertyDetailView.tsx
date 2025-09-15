import { formatDate, formatPrice } from "@/components/helpers/helper"
import { ButtonComponent } from "@/components/UI/Button/Button"
import { Layout } from "@/layout/Layout"
import { ownerApi, propertyApi } from "@/services/api"
import { useOwnerStore } from "@/store/OwnerStore"
import { usePropertyStore } from "@/store/PropertyStore"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

export function PropertyDetailView() {
  const { id } = useParams()
  const { property, loading, error, setError, setLoading, setProperty } =
    usePropertyStore()
  const { owner, ownerProperties, setOwner, setOwnerProperties } =
    useOwnerStore()
  const [listPage, setListPage] = useState(1)
  const [listPageSize] = useState(6)
  const [listTotalPages, setListTotalPages] = useState(1)
  const [listTotalCount, setListTotalCount] = useState(0)

  useEffect(() => {
    const loadInfo = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const property = await propertyApi.getPropertyById(id)
        setProperty(property)
        if (property.idOwner) {
          const owner = await ownerApi.getOwnerById(property.idOwner)
          setOwner(owner)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load property")
      } finally {
        setLoading(false)
      }
    }
    loadInfo()
  }, [id])

  // Load other properties from same owner (excluding current)
  useEffect(() => {
    const loadOwnerProperties = async () => {
      if (!owner?.id || !property?.id) return
      try {
        const response = await propertyApi.getPropertiesByFilter({
          idOwner: owner.id,
          page: listPage,
          pageSize: listPageSize
        })
        // Exclude the current property from the list
        const items = response.properties.filter(pr => pr.id !== property.id)
        setOwnerProperties(items)
        setListTotalPages(response.totalPages)
        setListTotalCount(
          response.totalCount - 1 >= 0 ? response.totalCount - 1 : 0
        )
      } catch {
        // Keep the detail visible even if the related list fails
      }
    }
    loadOwnerProperties()
  }, [owner?.id, property?.id, listPage, listPageSize])

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-4">
        <div className="mb-4">
          <Link to="/ownerlist" className="text-blue-600 hover:underline">
            ← Back to properties
          </Link>
        </div>

        {loading && <div className="text-gray-600">Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && property && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <img
                  src={property.image || "/placeholder-property.svg"}
                  alt={property.name}
                  className="w-full h-80 object-cover rounded-lg"
                  onError={e => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder-property.svg"
                  }}
                />
              </div>
              <div className="space-y-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {property.name}
                </h1>
                <div className="text-xl font-semibold text-green-600">
                  {formatPrice(property.price)}
                </div>
                <div className="text-gray-700">{property.address}</div>
                <div className="text-sm text-gray-600">
                  Created: {formatDate(property.createdAt)}
                </div>
                <div className="text-sm text-gray-600">
                  Updated: {formatDate(property.updatedAt)}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Owner
              </h2>
              {owner ? (
                <div className="bg-gray-50 rounded p-4">
                  <div>
                    <p className="text-gray-900 font-medium">Name:</p>
                    <p className="text-gray-700">{owner.name}</p>
                  </div>
                  <div className="my-2">
                    <p className="text-gray-900 font-medium">Email:</p>
                    <p className="text-gray-700">{owner.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Phone:</p>
                    <p className="text-gray-700">{owner.phone}</p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">
                  Owner information not available.
                </div>
              )}
            </div>

            {owner && (
              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Other properties from this owner
                  </h2>
                  <div className="text-sm text-gray-600">
                    {`Page ${listPage} of ${listTotalPages} (${listTotalCount} total)`}
                  </div>
                </div>
                {ownerProperties.length === 0 ? (
                  <div className="text-gray-600">
                    No more properties from this owner.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ownerProperties.map(op => (
                      <Link
                        key={op.id}
                        to={`/properties/${op.id}`}
                        className="border rounded p-4 hover:shadow transition bg-white"
                        onClick={() => window.scrollTo({ top: 0 })}
                      >
                        <div className="font-medium text-gray-900 truncate">
                          {op.name}
                        </div>
                        <div className="text-sm text-gray-700 truncate">
                          {op.address}
                        </div>
                        <div className="text-sm text-green-700 font-semibold">
                          {formatPrice(op.price)}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <div className="flex flex-row items-center justify-end gap-2 mt-4">
                  <ButtonComponent
                    onClick={() => setListPage(p => Math.max(1, p - 1))}
                    isDisabled={listPage <= 1}
                  >
                    Previous
                  </ButtonComponent>
                  <ButtonComponent
                    onClick={() =>
                      setListPage(p => Math.min(listTotalPages, p + 1))
                    }
                    isDisabled={listPage >= listTotalPages}
                  >
                    Next
                  </ButtonComponent>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
