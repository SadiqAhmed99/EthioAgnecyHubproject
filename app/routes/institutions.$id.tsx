import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";
import { insforgeClient } from "~/lib/insforge.server";
import { notFound } from "remix-utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { id } = params;
  
  if (!id) {
    throw notFound({ message: "Institution not found" });
  }

  try {
    const { data: institution, error } = await insforgeClient.database
      .from('institutions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !institution) {
      throw notFound({ message: "Institution not found" });
    }

    return json({ institution, institutionId: id });
  } catch (error) {
    console.error('Error fetching institution:', error);
    throw notFound({ message: "Institution not found" });
  }
};

export default function InstitutionDetailPage() {
  const { institution, institutionId } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Institution Details">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Institution Details</h1>
            <p className="text-sm text-gray-500 mt-1">ID: {institution.id}</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Edit
            </button>
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition">
              Archive
            </button>
          </div>
        </div>

        {institution && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Basic Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Name:</span>
                  <span>{institution.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Type:</span>
                  <span className="capitalize">{institution.type || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Category:</span>
                  <span className="capitalize">{institution.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    institution.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {institution.status || 'UNKNOWN'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4 text-lg">Contact Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Phone:</span>
                  <span>{institution.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Email:</span>
                  <span>{institution.email || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Contact Person:</span>
                  <span>{institution.contact_person || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Website:</span>
                  <span>{institution.website ? (
                    <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Visit Website
                    </a>
                  ) : 'Not provided'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="font-semibold mb-4 text-lg">Address</h3>
              <p className="text-gray-700">{institution.address || 'Not provided'}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow col-span-2">
              <h3 className="font-semibold mb-4 text-lg">Description</h3>
              <p className="text-gray-700 text-sm">
                {institution.description || 'No description available'}
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
