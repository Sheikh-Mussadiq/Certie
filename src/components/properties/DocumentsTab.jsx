import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, ChevronDown, Download } from 'lucide-react'
import CreateFolderModal from './CreateFolderModal'
import UploadDocumentModal from './UploadDocumentModal'

const DocumentsTab = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFolders, setExpandedFolders] = useState(['Fire Risk Assessments'])
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const documents = {
    'Fire Risk Assessments': [
      {
        name: 'Annual Fire Risk Assessment 2024.pdf',
        size: '5.11 MB',
        type: 'pdf'
      },
      {
        name: 'Annual Fire Risk Assessment 2024.pdf',
        size: '5.11 MB',
        type: 'pdf'
      },
      {
        name: 'Annual Fire Risk Assessment 2024.pdf',
        size: '5.11 MB',
        type: 'pdf'
      }
    ],
    'PAT Testing': [],
    'Sprinkler System': []
  }

  const toggleFolder = (folder) => {
    setExpandedFolders(prev =>
      prev.includes(folder)
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    )
  }

  const handleCreateFolder = async (folderName) => {
    try {
      // TODO: Implement folder creation
      console.log('Creating folder:', folderName)
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const handleUploadDocuments = async ({ files, folderId }) => {
    try {
      // TODO: Implement document upload
      console.log('Uploading files:', files, 'to folder:', folderId)
    } catch (error) {
      console.error('Error uploading documents:', error)
    }
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-xs font-medium text-blue-700">PDF</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCreateFolderModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-primary-black border border-grey-outline rounded-lg hover:bg-grey-fill transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create folder
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-black rounded-lg hover:bg-primary-black/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(documents).map(([folder, files]) => (
          <div key={folder} className="border border-grey-outline rounded-lg overflow-hidden">
            <button
              onClick={() => toggleFolder(folder)}
              className="w-full flex items-center justify-between p-4 hover:bg-grey-fill"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-orange/10 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-orange">📁</span>
                </div>
                <span className="font-medium">{folder}</span>
                <span className="text-sm text-primary-grey">{files.length} files</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedFolders.includes(folder) ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedFolders.includes(folder) && files.length > 0 && (
              <div className="border-t border-grey-outline divide-y divide-grey-outline">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 hover:bg-grey-fill"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-primary-grey">File size: {file.size}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-primary-orange rounded-full hover:bg-primary-orange/10 transition-colors">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        onSubmit={handleCreateFolder}
      />
      
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadDocuments}
        folders={Object.keys(documents).map((name, id) => ({ id, name }))}
      />
    </div>
  )
}

export default DocumentsTab