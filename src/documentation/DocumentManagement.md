# Document Management System Documentation

## Overview
The Document Management System provides a comprehensive solution for organizing, uploading, and managing documents within properties. It consists of three main components and a service layer that integrates with Supabase database and storage.

## Architecture

### Database Schema
The system uses two main tables:
- **document_folders**: Stores folder information for organizing documents
- **documents**: Stores document metadata and file references

### Storage
- Uses Supabase Storage bucket named 'documents'
- Files are organized by property ID in the storage structure
- Supports multiple file types: PDF, images, Word documents, Excel files, text files, and archives

## Components

### 1. DocumentsTab Component
**Location**: `src/components/properties/DocumentsTab.jsx`

**Purpose**: Main interface for viewing and managing documents within a property

**Key Features**:
- Displays folders and their contained documents
- Search functionality across all documents
- Expandable folder view
- Document download and deletion
- Integration with folder and upload modals

**State Management**:
- `folders`: Array of folder objects
- `documents`: Object mapping folder IDs to their documents
- `searchResults`: Array of documents matching search criteria
- `expandedFolders`: Array of currently expanded folder IDs

**Key Functions**:
- `fetchFoldersAndDocuments()`: Loads all folders and their documents
- `handleSearch()`: Searches documents by name
- `toggleFolder()`: Expands/collapses folders and loads documents on demand
- `handleDownloadDocument()`: Downloads a document file
- `handleDeleteDocument()`: Removes a document from storage and database

### 2. CreateFolderModal Component
**Location**: `src/components/properties/CreateFolderModal.jsx`

**Purpose**: Modal interface for creating new document folders

**Key Features**:
- Simple form with folder name input
- Validation for required fields
- Loading state during creation
- Error handling for duplicate folder names

**Props**:
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to close the modal
- `onSubmit`: Function to handle folder creation

### 3. UploadDocumentModal Component
**Location**: `src/components/properties/UploadDocumentModal.jsx`

**Purpose**: Modal interface for uploading documents to folders

**Key Features**:
- Drag and drop file upload
- Multiple file selection
- File type and size validation
- Upload progress tracking
- Folder selection dropdown

**Supported File Types**:
- PDF documents
- Images (JPEG, PNG, GIF)
- Microsoft Office documents (Word, Excel)
- Text files
- Archive files (ZIP, RAR)

**File Size Limit**: 10MB per file

**Upload Process**:
1. File validation and preview
2. Upload to Supabase Storage
3. Create database record
4. Update progress indicators
5. Refresh parent component data

## Services

### DocumentServices
**Location**: `src/services/documentServices.js`

**Purpose**: Handles all database and storage operations for documents

**Key Functions**:

#### Folder Management
- `createDocumentFolder(name, propertyId, createdBy)`: Creates a new folder
- `getDocumentFolders(propertyId)`: Retrieves all folders for a property
- `deleteDocumentFolder(folderId)`: Removes a folder

#### Document Management
- `uploadDocumentFile(file, propertyId, userId)`: Uploads file to storage
- `createDocument(documentData)`: Creates document database record
- `getDocuments(propertyId)`: Retrieves all documents for a property
- `getDocumentsByFolder(folderId)`: Gets documents in a specific folder
- `deleteDocument(documentId, filePath)`: Removes document and file
- `downloadDocument(filePath, fileName)`: Downloads a document file
- `searchDocuments(propertyId, searchTerm)`: Searches documents by name

## Database Integration

### Tables Used
1. **document_folders**
   - `id`: UUID primary key
   - `name`: Folder name (unique per property)
   - `property_id`: Reference to properties table
   - `created_at`: Timestamp
   - `created_by`: User who created the folder

2. **documents**
   - `id`: UUID primary key
   - `name`: Document name
   - `folder_id`: Reference to document_folders
   - `property_id`: Reference to properties table
   - `file_path`: Storage path
   - `file_type`: MIME type
   - `created_at`: Timestamp
   - `created_by`: User who uploaded the document

### Storage Integration
- **Bucket**: 'documents'
- **Path Structure**: `{propertyId}/{uniqueFileName}`
- **File Operations**: Upload, download, delete
- **Public URLs**: Generated for file access

## Error Handling

### Common Error Scenarios
1. **Duplicate Folder Names**: Handled with user-friendly error messages
2. **File Upload Failures**: Individual file error tracking
3. **Storage Quota**: File size validation before upload
4. **Network Issues**: Retry mechanisms and user feedback
5. **Permission Errors**: Proper error messages for unauthorized actions

### User Feedback
- Toast notifications for success/error states
- Loading indicators during operations
- Progress bars for file uploads
- Confirmation dialogs for destructive actions

## Security Considerations

### Access Control
- Row Level Security (RLS) enforced on database tables
- File access controlled through Supabase policies
- User authentication required for all operations

### File Validation
- File type restrictions
- File size limits
- Malicious file detection (basic MIME type checking)

## Performance Optimizations

### Lazy Loading
- Documents loaded only when folders are expanded
- Search results loaded on demand

### Caching
- Folder structure cached in component state
- Document lists cached per folder

### File Handling
- Efficient file upload with progress tracking
- Optimized storage paths for quick retrieval

## Usage Examples

### Creating a Folder
```javascript
const handleCreateFolder = async (folderName) => {
  try {
    await createDocumentFolder(folderName, propertyId, currentUser.id);
    // Refresh folder list
  } catch (error) {
    // Handle error
  }
};
```

### Uploading Documents
```javascript
const handleUpload = async ({ files, folderId }) => {
  for (const file of files) {
    const { filePath } = await uploadDocumentFile(file, propertyId, userId);
    await createDocument({
      name: file.name,
      folder_id: folderId,
      property_id: propertyId,
      file_path: filePath,
      file_type: file.type,
      created_by: userId
    });
  }
};
```

### Searching Documents
```javascript
const searchResults = await searchDocuments(propertyId, searchTerm);
```

## Future Enhancements

### Planned Features
1. **Document Versioning**: Track document versions and changes
2. **Bulk Operations**: Select and operate on multiple documents
3. **Advanced Search**: Search by content, date ranges, file types
4. **Document Preview**: In-browser preview for common file types
5. **Sharing**: Share documents with external users
6. **Audit Trail**: Track all document operations
7. **Tags and Categories**: Additional organization methods
8. **OCR Integration**: Extract text from images and PDFs

### Technical Improvements
1. **Caching Strategy**: Implement Redis for better performance
2. **CDN Integration**: Faster file delivery
3. **Compression**: Automatic file compression for storage efficiency
4. **Backup System**: Automated document backups
5. **Analytics**: Document usage and access analytics