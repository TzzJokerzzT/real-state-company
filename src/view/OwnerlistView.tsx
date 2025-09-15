import OwnerFilter from "@/components/Owner/OwnerFilter"
import OwnerList from "@/components/Owner/OwnersList"
import { Layout } from "@/layout/Layout"

export function OwnerListView() {
  return (
    <Layout>
      <OwnerFilter />
      <OwnerList />
    </Layout>
  )
}
