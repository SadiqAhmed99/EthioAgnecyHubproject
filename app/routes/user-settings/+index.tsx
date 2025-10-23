import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData, useNavigation } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'
import { getUserById } from '~/services/auth/authService.server'
import { useState } from 'react'

export async function loader({ request }: { request: Request }) {
  const user = await requireAuth(request)
  const userData = await getUserById(user.userId)
  
  if (!userData) {
    throw new Response('User not found', { status: 404 })
  }

  return json({
    user: {
      id: userData.id,
      username: userData.username,
      role: userData.role,
      createdAt: userData.createdAt,
    },
  })
}

export async function action({ request }: { request: Request }) {
  const user = await requireAuth(request)
  const formData = await request.formData()
  const action = formData.get('_action')

  if (action === 'update-profile') {
    // Handle profile update
    const username = formData.get('username') as string
    
    if (!username) {
      return json({ error: 'Username is required' }, { status: 400 })
    }

    // Update user profile logic would go here
    return json({ success: 'Profile updated successfully' })
  }

  if (action === 'change-password') {
    // Handle password change
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
      return json({ error: 'All password fields are required' }, { status: 400 })
    }

    if (newPassword !== confirmPassword) {
      return json({ error: 'New passwords do not match' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Password change logic would go here
    return json({ success: 'Password changed successfully' })
  }

  return json({ error: 'Invalid action' }, { status: 400 })
}

export default function UserSettings() {
  const { user } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState('profile')

  const isSubmitting = navigation.state === 'submitting'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'profile', name: 'Profile', icon: '👤' },
              { id: 'security', name: 'Security', icon: '🔒' },
              { id: 'notifications', name: 'Notifications', icon: '🔔' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {actionData?.error && (
            <div className="mb-6 alert-error">
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

          {actionData?.success && (
            <div className="mb-6 alert-success">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-success-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-success-800">{actionData.success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Form method="post" className="space-y-6">
              <input type="hidden" name="_action" value="update-profile" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    defaultValue={user.username}
                    className="mt-1 form-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    value={user.role}
                    className="mt-1 form-input"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">
                  Member Since
                </label>
                <input
                  type="text"
                  id="createdAt"
                  value={new Date(user.createdAt).toLocaleDateString()}
                  className="mt-1 form-input"
                  disabled
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </Form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Form method="post" className="space-y-6">
              <input type="hidden" name="_action" value="change-password" />
              
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  className="mt-1 form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="mt-1 form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  className="mt-1 form-input"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                >
                  {isSubmitting ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </Form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive email updates about system activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">Receive SMS alerts for urgent updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive browser notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="btn-primary"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
