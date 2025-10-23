import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react'
import type { LinksFunction, MetaFunction } from '@remix-run/node'
import stylesheet from './styles/globals.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
]

export const meta: MetaFunction = () => [
  { title: 'Ethio Agency Hub' },
  { name: 'description', content: 'Comprehensive digital management platform for Ethiopian foreign employment agencies' },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <html>
        <head>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </head>
        <body>
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {error.status} {error.statusText}
                </h1>
                <p className="text-gray-600 mb-6">
                  {error.status === 404 
                    ? "The page you're looking for doesn't exist."
                    : "Something went wrong. Please try again later."
                  }
                </p>
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Go Home
                </a>
              </div>
            </div>
          </div>
        </body>
      </html>
    )
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Application Error
              </h1>
              <p className="text-gray-600 mb-6">
                {errorMessage}
              </p>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
