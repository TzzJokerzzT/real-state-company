import { Header } from "@/components/UI/Header/Header"
import { MainLayout } from "./MainLayout"
import { usePropertyStore } from "@/store/PropertyStore"

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pagination } = usePropertyStore()
  return (
    <MainLayout>
      <Header pagination={pagination} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </MainLayout>
  )
}
