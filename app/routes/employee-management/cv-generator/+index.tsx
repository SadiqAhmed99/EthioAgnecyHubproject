import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'

export async function loader({ request }: { request: Request }) {
  await requireAuth(request)
  return null
}

export default function CVGenerator() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">CV Generator</h1>
        <p className="text-gray-600">Create professional CVs for your employees</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Template Selection */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Templates</h2>
            <p className="text-sm text-gray-500">Choose a professional template</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Professional</h3>
                    <p className="text-xs text-gray-500">Clean and modern design</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Modern</h3>
                    <p className="text-xs text-gray-500">Contemporary layout</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Bilingual</h3>
                    <p className="text-xs text-gray-500">English and Arabic support</p>
                  </div>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/employee-management/cv-generator/templates"
                className="btn-primary w-full"
              >
                Select Template
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <p className="text-sm text-gray-500">Common CV tasks</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link
                to="/employee-management/cv-generator/preview"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Preview CV</h3>
                  <p className="text-xs text-gray-500">View and edit CV</p>
                </div>
              </Link>
              
              <Link
                to="/employee-management/cv-generator/download-share"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Download & Share</h3>
                  <p className="text-xs text-gray-500">Export CV as PDF</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* CV Database */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">CV Database</h2>
            <p className="text-sm text-gray-500">Manage existing CVs</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <Link
                to="/employee-management/cv-database"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Browse CVs</h3>
                  <p className="text-xs text-gray-500">View all employee CVs</p>
                </div>
              </Link>
              
              <Link
                to="/employee-management/cv-database/skill-matching"
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
              >
                <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Skill Matching</h3>
                  <p className="text-xs text-gray-500">Match skills to jobs</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent CV Activity</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
            <p className="mt-1 text-sm text-gray-500">CV activity will appear here once you start creating CVs.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
