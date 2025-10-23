import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'
import { useState } from 'react'

export async function loader({ request }: { request: Request }) {
  await requireAuth(request)
  return null
}

export async function action({ request }: { request: Request }) {
  const user = await requireAuth(request)
  
  try {
    const formData = await request.formData()
    const file = formData.get('cvFile') as File
    
    if (!file || file.size === 0) {
      return json(
        { error: 'Please select a file to upload' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return json(
        { error: 'Please upload a PDF or Word document' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Here you would typically save the file and process it
    // For now, we'll just redirect to the CV generator
    return redirect('/employee-management/cv-generator')
  } catch (error) {
    console.error('CV upload error:', error)
    return json(
      { error: 'An error occurred during file upload' },
      { status: 500 }
    )
  }
}

export default function CVUpload() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const isSubmitting = navigation.state === 'submitting'

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">CV Upload</h1>
        <p className="text-gray-600">Upload an existing CV or create a new one</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Upload CV</h2>
          <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
        </div>

        <Form method="post" encType="multipart/form-data" className="p-6">
          {actionData?.error && (
            <div className="alert-error mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-error-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-error-800">{actionData.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Drag and Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
              dragActive
                ? 'border-primary-400 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              name="cvFile"
              id="cvFile"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            
            <div className="space-y-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {selectedFile ? selectedFile.name : 'Drop your CV here'}
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse files
                </p>
              </div>
              
              {selectedFile && (
                <div className="text-sm text-gray-600">
                  <p>File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p>File type: {selectedFile.type}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
            <Link
              to="/employee-management"
              className="btn-outline"
            >
              Cancel
            </Link>
            <div className="flex space-x-3">
              <Link
                to="/employee-management/cv-generator"
                className="btn-secondary"
              >
                Create New CV
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !selectedFile}
                className="btn-primary"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2" />
                    Uploading...
                  </div>
                ) : (
                  'Upload CV'
                )}
              </button>
            </div>
          </div>
        </Form>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">CV Upload Tips</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure your CV is up-to-date with current skills and experience</li>
                <li>Include relevant certifications and training</li>
                <li>Use clear, professional formatting</li>
                <li>Keep file size under 10MB for faster processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
