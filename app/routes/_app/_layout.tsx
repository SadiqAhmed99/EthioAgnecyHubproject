import { Outlet, useLoaderData, useLocation } from '@remix-run/react';
import { json, type LoaderFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/middleware/authMiddleware.server';
import { AppSidebar } from '~/components/layouts/AppSidebar';
import { AppHeader } from '~/components/layouts/AppHeader';
import { ErrorBoundary } from '~/components/ui/ErrorBoundary';

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);
  
  return json({
    user,
    breadcrumbs: getBreadcrumbs(request.url),
  });
}

function getBreadcrumbs(url: string) {
  const pathname = new URL(url).pathname;
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return { label, path };
  });
  
  return breadcrumbs;
}

export default function AppLayout() {
  const { user, breadcrumbs } = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar user={user} currentPath={location.pathname} />
      
      <div className="lg:pl-64">
        <AppHeader user={user} breadcrumbs={breadcrumbs} />
        
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export function ErrorBoundaryComponent() {
  return (
    <ErrorBoundary
      title="Application Error"
      message="Something went wrong with the application. Please try again."
      showRetry={true}
    />
  );
}