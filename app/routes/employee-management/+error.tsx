import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import { ErrorDisplay } from '~/components/ui/ErrorBoundary';

export default function EmployeeManagementError() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <ErrorDisplay
        title="Employee Management Error"
        message={error.data || 'An error occurred in employee management.'}
        showRetry={true}
      />
    );
  }

  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  
  return (
    <ErrorDisplay
      title="Employee Management Error"
      message={errorMessage}
      showRetry={true}
    />
  );
}
