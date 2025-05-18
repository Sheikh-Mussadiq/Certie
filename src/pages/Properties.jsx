import { motion } from "framer-motion"
import { Download, Upload, Plus } from "lucide-react"
import { useState } from "react"
import TableHeader from "../components/properties/TableHeader"
import TableFooter from "../components/properties/TableFooter"
import PropertyTable from "../components/properties/PropertyTable"
import { mockProperties } from "../data/mockProperties"

const Properties = () => {
  const [selectedProperties, setSelectedProperties] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter properties based on search term
  const filteredProperties = mockProperties.filter(property =>
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProperties = filteredProperties.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-primary-black">Properties</h1>
        <div className="flex gap-3">
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-grey-outline rounded-lg text-primary-black hover:bg-grey-fill transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="px-4 py-2 border border-grey-outline rounded-lg text-primary-black hover:bg-grey-fill transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <button className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-grey-outline overflow-hidden">
        <TableHeader
          onSearch={setSearchTerm}
          onSort={() => {}}
          onFilter={() => {}}
          onViewChange={() => {}}
        />
        <PropertyTable
          properties={currentProperties}
          selectedProperties={selectedProperties}
          onSelectProperty={setSelectedProperties}
        />
        <TableFooter
          totalItems={filteredProperties.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>
    </div>
  )
}

export default Properties