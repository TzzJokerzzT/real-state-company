import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { useProperties } from "./hooks/useProperties"
import { OwnersPage } from "./pages/OwnersPage"
import { PropertyPage } from "./pages/PropertyPage"
import { PropertyDetailPage } from "./pages/PropertyDetailPage"
import { PropertyRegistrationPage } from "./pages/PropertyRegistrationPage"

function App() {
  const { fetchProperties } = useProperties()

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  return (
    <Routes>
      <Route path="/" element={<PropertyPage />} />
      <Route path="/ownerlist" element={<OwnersPage />} />
      <Route path="/properties/:id" element={<PropertyDetailPage />} />
      <Route path="/register-property" element={<PropertyRegistrationPage />} />
    </Routes>
  )
}

export default App
