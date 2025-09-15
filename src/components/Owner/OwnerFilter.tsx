import { useOwners } from "@/hooks/useOwners"
import { Filter, Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { ButtonComponent } from "../UI/Button/Button"
import { InputComponent } from "../UI/Input/Input"
import { HoverAnimation } from "../UI/Animation/HoverGesture"

const OwnerFilter = () => {
  const { fetchOwners, filterByName } = useOwners()
  const [name, setName] = useState("")

  useEffect(() => {
    fetchOwners()
  }, [fetchOwners])

  const handleSearch = () => {
    filterByName(name)
  }

  const handleClear = () => {
    setName("")
    filterByName("")
    fetchOwners()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Owners</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputComponent
          value={name}
          onChange={e => setName(e.target.value)}
          label="Owner Name"
          placeholder="Search by owner name..."
        />
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-4">
          <HoverAnimation>
            <ButtonComponent onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </ButtonComponent>
          </HoverAnimation>

          {name && (
            <ButtonComponent
              onClick={handleClear}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </ButtonComponent>
          )}
        </div>
      </div>
    </div>
  )
}

export default OwnerFilter
