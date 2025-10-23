import { ErrorBoundary } from '~/components/ui/ErrorBoundary';

export function ErrorBoundaryComponent() {
  return (
    <ErrorBoundary
      title="Employee Management Error"
      message="An error occurred in employee management. Please try again."
      showRetry={true}
    />
  );
}
