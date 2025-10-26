import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import { ErrorDisplay } from '~/components/ui/ErrorBoundary';

export default function AppErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorDisplay
        title={`${error.status} ${error.statusText}`}
        message={error.data || 'An error occurred in the application.'}
      />
    );
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  
  return (
    <ErrorDisplay
      title="App Error"
      message={errorMessage}
      showRetry={true}
    />
  );
}
