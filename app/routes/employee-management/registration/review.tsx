import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ employee: null });
};

export default function ReviewRegistrationPage() {
  const { employee } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Registration Review">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Registration Review</h1>
          <p className="text-gray-600">Review and submit employee registration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> </p>
              <p><span className="font-medium">Date of Birth:</span> </p>
              <p><span className="font-medium">Gender:</span> </p>
              <p><span className="font-medium">Phone:</span> </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Address:</span> </p>
              <p><span className="font-medium">Email:</span> </p>
              <p><span className="font-medium">Emergency Contact:</span> </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Skills</h3>
            <p className="text-gray-500 text-sm">No skills added</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-4">Documents</h3>
            <p className="text-gray-500 text-sm">No documents uploaded</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <a
            href="/employee-management/registration/personal"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Back to Edit
          </a>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Submit Registration
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
