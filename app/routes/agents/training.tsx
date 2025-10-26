import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ trainings: [] });
};

export default function TrainingPage() {
  const { trainings } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Training Management">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Training Management</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Available Trainings</h3>
            <div className="space-y-3">
              <div className="border rounded p-4">
                <h4 className="font-medium">System Basics</h4>
                <p className="text-sm text-gray-600">Introduction to platform features</p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">Enroll</button>
              </div>
              <div className="border rounded p-4">
                <h4 className="font-medium">Document Management</h4>
                <p className="text-sm text-gray-600">Upload and verify documents</p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">Enroll</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">My Trainings</h3>
            {trainings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No enrollments yet</p>
            ) : (
              <div className="space-y-3">
                {trainings.map((training: any) => (
                  <div key={training.id} className="border rounded p-4">
                    <h4 className="font-medium">{training.name}</h4>
                    <p className="text-sm text-gray-600">Status: {training.status}</p>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: `${training.progress}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
