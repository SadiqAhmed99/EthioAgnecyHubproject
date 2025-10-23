import { json, redirect } from '@remix-run/node'
import { Form, Link, useActionData, useNavigation, useLoaderData } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'
import { EmployeeService } from '~/services/employee/employeeService.server'
import { CreateEmployeeSchema } from '~/models/schemas/employee.schema'
import { useState } from 'react'

export async function loader({ request }: { request: Request }) {
  await requireAuth(request)
  return null
}

export async function action({ request }: { request: Request }) {
  const user = await requireAuth(request)
  
  try {
    const formData = await request.formData()
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      middleName: formData.get('middleName') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      gender: formData.get('gender') as string,
      nationality: formData.get('nationality') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      emergencyContact: formData.get('emergencyContact') as string,
      emergencyPhone: formData.get('emergencyPhone') as string,
      agencyId: user.agencyId,
    }

    // Validate input
    const validatedData = CreateEmployeeSchema.parse(data)

    // Create employee
    const employee = await EmployeeService.createEmployee(validatedData)

    if (!employee) {
      return json(
        { error: 'Failed to create employee' },
        { status: 500 }
      )
    }

    return redirect(`/employee-management/${employee.id}`)
  } catch (error) {
    console.error('Registration error:', error)
    return json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    )
  }
}

export default function PersonalInfo() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: '',
    nationality: 'Ethiopian',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
  })

  const isSubmitting = navigation.state === 'submitting'

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Employee Registration</h1>
        <p className="text-gray-600">Step 1: Personal Information</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
          <p className="text-sm text-gray-500">Basic information about the employee</p>
        </div>

        <Form method="post" className="p-6 space-y-6">
          {actionData?.error && (
            <div className="alert-error">
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

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 form-input"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                Middle Name
              </label>
              <input
                type="text"
                name="middleName"
                id="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
                className="mt-1 form-input"
                placeholder="Enter middle name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 form-input"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                required
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="mt-1 form-input"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender *
              </label>
              <select
                name="gender"
                id="gender"
                required
                value={formData.gender}
                onChange={handleInputChange}
                className="mt-1 form-select"
              >
                <option value="">Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
              Nationality *
            </label>
            <input
              type="text"
              name="nationality"
              id="nationality"
              required
              value={formData.nationality}
              onChange={handleInputChange}
              className="mt-1 form-input"
              placeholder="Enter nationality"
            />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 form-input"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 form-input"
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <textarea
              name="address"
              id="address"
              required
              rows={3}
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 form-textarea"
              placeholder="Enter full address"
            />
          </div>

          {/* Emergency Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                Emergency Contact Name *
              </label>
              <input
                type="text"
                name="emergencyContact"
                id="emergencyContact"
                required
                value={formData.emergencyContact}
                onChange={handleInputChange}
                className="mt-1 form-input"
                placeholder="Enter emergency contact name"
              />
            </div>
            <div>
              <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">
                Emergency Contact Phone *
              </label>
              <input
                type="tel"
                name="emergencyPhone"
                id="emergencyPhone"
                required
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                className="mt-1 form-input"
                placeholder="Enter emergency contact phone"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Link
              to="/employee-management"
              className="btn-outline"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="spinner mr-2" />
                  Creating...
                </div>
              ) : (
                'Create Employee'
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}
