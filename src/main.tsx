import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { BrowserRouter } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AnimatePresence>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AnimatePresence>
  </StrictMode>
)
