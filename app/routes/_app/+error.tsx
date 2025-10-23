import { ErrorBoundary } from '~/components/ui/ErrorBoundary';

export function ErrorBoundaryComponent() {
  return (
    <ErrorBoundary
      title="App Error"
      message="An error occurred in the application. Please try refreshing the page."
      showRetry={true}
    />
  );
}
