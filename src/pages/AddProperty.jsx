import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

const AddProperty = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    propertyType: '',
    residentialType: '',
    averagePeople: '',
    propertySystems: '',
    image: null
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 10485760, // 10MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles?.[0]) {
        setFormData(prev => ({
          ...prev,
          image: acceptedFiles[0]
        }))
      }
    }
  })

  const propertyTypes = [
    'Commercial',
    'Residential',
    'Mixed-Use',
    'Industrial',
    'Retail'
  ]

  const residentialTypes = [
    'Apartment',
    'House',
    'Condo',
    'Townhouse',
    'Multi-family'
  ]

  const propertySystems = [
    'Fire Alarm System',
    'Sprinkler System',
    'HVAC',
    'Security System',
    'Access Control'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement property creation
    console.log('Property data:', formData)
    navigate('/properties')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-primary-black">Add a Property</h1>
          <p className="text-sm text-primary-grey">Add task instructions and other association if any</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/properties')}
            className="px-4 py-2 text-primary-black hover:bg-grey-fill rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors"
          >
            Save Property
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-sm font-medium mb-2">Upload Property Image</h3>
          <p className="text-xs text-primary-grey mb-4">
            formats allowed are *.jpg, *.jpg, up to 10 MB
            <br />with a minimum size of 400px by 400px
          </p>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary-orange bg-red-50' : 'border-grey-outline hover:border-primary-orange'}`}
          >
            <input {...getInputProps()} />
            {formData.image ? (
              <div className="flex items-center justify-center">
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Property preview"
                  className="max-h-48 rounded"
                />
              </div>
            ) : (
              <>
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag & drop an image here, or click to select
                </p>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Property Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter property name"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Enter property address"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Property Type</label>
            <select
              value={formData.propertyType}
              onChange={(e) => setFormData(prev => ({ ...prev, propertyType: e.target.value }))}
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            >
              <option value="">Select property type</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Residential Type</label>
            <select
              value={formData.residentialType}
              onChange={(e) => setFormData(prev => ({ ...prev, residentialType: e.target.value }))}
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            >
              <option value="">Select residential type</option>
              {residentialTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Average Number of People</label>
            <input
              type="number"
              value={formData.averagePeople}
              onChange={(e) => setFormData(prev => ({ ...prev, averagePeople: e.target.value }))}
              placeholder="Enter average number"
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Property Systems</label>
            <select
              value={formData.propertySystems}
              onChange={(e) => setFormData(prev => ({ ...prev, propertySystems: e.target.value }))}
              className="w-full p-3 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
            >
              <option value="">Select property systems</option>
              {propertySystems.map(system => (
                <option key={system} value={system}>{system}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProperty