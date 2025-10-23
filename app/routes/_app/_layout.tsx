import { Outlet } from '@remix-run/react'
import { requireAuth } from '~/middleware/authMiddleware.server'
import { AppSidebar } from '~/components/layouts/AppSidebar'
import { AppHeader } from '~/components/layouts/AppHeader'

export async function loader({ request }: { request: Request }) {
  await requireAuth(request)
  return null
}

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <div className="lg:pl-64">
        <AppHeader />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
