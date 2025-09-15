import PropertyPreviewModal from "@/components/Property/PropertyPreviewModal"
import {
  EnterAnimation,
  FormEnterAnimation
} from "@/components/UI/Animation/EnterAnimation"
import { HoverAnimation } from "@/components/UI/Animation/HoverGesture"
import { ButtonComponent } from "@/components/UI/Button/Button"
import { InputComponent } from "@/components/UI/Input/Input"
import { Loader } from "@/components/UI/Loader/Loader"
import { OptionComponent } from "@/components/UI/Option/Option"
import { Layout } from "@/layout/Layout"
import { MessagesLayout } from "@/layout/MessagesLayout"
import { propertyApi } from "@/services/api"
import { useOwnerStore } from "@/store/OwnerStore"
import { usePropertyStore } from "@/store/PropertyStore"
import type { Property } from "@/types/Property"
import { AlertCircle } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function PropertyRegistrationView() {
  const navigate = useNavigate()
  const { owners } = useOwnerStore()
  const { loading, error, setError, setLoading } = usePropertyStore()
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>("")
  const [showForm, setShowForm] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<"preview" | "confirmation">(
    "preview"
  )
  const [newProperty, setNewProperty] = useState<Property | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    price: "",
    image: ""
  })

  const handleOwnerSelect = (ownerId: string) => {
    setSelectedOwnerId(ownerId)
    setShowForm(true)
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOwnerId) return

    // Validate form data
    if (!formData.name || !formData.address || !formData.price) {
      setError("Please fill in all required fields")
      return
    }

    // Show preview modal instead of submitting directly
    setModalMode("preview")
    setShowModal(true)
  }

  const handleConfirmCreation = async () => {
    if (!selectedOwnerId) return

    setLoading(true)
    setError(null)

    try {
      const propertyData = {
        idOwner: selectedOwnerId,
        name: formData.name,
        address: formData.address,
        price: parseFloat(formData.price),
        image: formData.image
      }

      const createdProperty = await propertyApi.createProperty(propertyData)
      setNewProperty(createdProperty)
      setModalMode("confirmation")

      // Reset form
      setFormData({ name: "", address: "", price: "", image: "" })
      setShowForm(false)
      setSelectedOwnerId("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create property")
      setShowModal(false)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    if (modalMode === "confirmation") {
      setShowModal(false)
      setNewProperty(null)
      // Redirect to home after closing confirmation
      navigate("/")
    } else {
      setShowModal(false)
    }
  }

  const handleGoHome = () => {
    navigate("/")
  }

  const showModalReviewConfirmation = () => {
    // Validate form before showing preview
    if (!formData.name || !formData.address || !formData.price) {
      setError("Please fill in all required fields")
      return
    }
    setError(null)
    setModalMode("preview")
    setShowModal(true)
  }

  return (
    <Layout>
      <FormEnterAnimation>
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Register New Property
          </h1>

          {loading && (
            <MessagesLayout>
              <Loader />
              <p className="text-gray-600 text-md">Loading...</p>
            </MessagesLayout>
          )}
          {error && (
            <MessagesLayout>
              <div className="text-center">
                <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-2">Error loading properties</p>
                <p className="text-gray-600 text-lg">{error}</p>
              </div>
            </MessagesLayout>
          )}

          {!showForm ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Owner
              </h2>
              <p className="text-gray-600 mb-4">
                Choose an owner to register a property under their name.
              </p>

              <OptionComponent
                label="Owner"
                options={owners as any[]}
                value={selectedOwnerId}
                onChange={handleOwnerSelect}
                placeholder="Select an owner"
                required
                getValue={(owner: any) => owner.id}
                getLabel={(owner: any) => owner.name}
              />
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Property Details
                </h2>
                <p className="text-sm text-gray-600">
                  Owner: {owners.find(o => o.id === selectedOwnerId)?.name}
                </p>
              </div>

              <div className="space-y-4">
                <InputComponent
                  value={formData.name}
                  onChange={e => handleInputChange("name", e.target.value)}
                  label="Property Name"
                  placeholder="Enter property name"
                  isRequired
                />

                <InputComponent
                  value={formData.address}
                  onChange={e => handleInputChange("address", e.target.value)}
                  label="Address"
                  placeholder="Enter property address"
                  isRequired
                />

                <InputComponent
                  value={formData.price}
                  onChange={e => handleInputChange("price", e.target.value)}
                  label="Price"
                  placeholder="Enter property price"
                  type="number"
                  isRequired
                />

                <InputComponent
                  value={formData.image}
                  onChange={e => handleInputChange("image", e.target.value)}
                  label="Image URL"
                  placeholder="Enter image URL"
                  type="url"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <HoverAnimation>
                  <ButtonComponent
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setSelectedOwnerId("")
                      setFormData({
                        name: "",
                        address: "",
                        price: "",
                        image: ""
                      })
                      setError(null)
                    }}
                    className="rounded-md h-[2.5rem] px-2 bg-gray-500 text-white"
                  >
                    Back to Owner Selection
                  </ButtonComponent>
                </HoverAnimation>

                <HoverAnimation>
                  <ButtonComponent
                    type="button"
                    onClick={showModalReviewConfirmation}
                    isDisabled={loading}
                  >
                    Preview
                  </ButtonComponent>
                </HoverAnimation>
              </div>
            </form>
          )}

          {/* Combined Preview/Confirmation Modal */}
          {showModal && (
            <PropertyPreviewModal
              propertyData={{
                name: formData.name,
                address: formData.address,
                price: parseFloat(formData.price) || 0,
                image: formData.image,
                ownerName:
                  owners.find(o => o.id === selectedOwnerId)?.name || ""
              }}
              createdProperty={newProperty || undefined}
              isOpen={showModal}
              onClose={handleCloseModal}
              onConfirm={handleConfirmCreation}
              onGoHome={handleGoHome}
              loading={loading}
              mode={modalMode}
            />
          )}
        </div>
      </FormEnterAnimation>
    </Layout>
  )
}
