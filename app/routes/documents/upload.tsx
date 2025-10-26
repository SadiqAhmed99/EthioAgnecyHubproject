import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ employees: [] });
};

export default function UploadDocumentPage() {
  const { employees } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Upload Document">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Upload Document</h1>
        
        <form className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>Select employee</option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>NATIONAL_ID</option>
              <option>PASSPORT</option>
              <option>BIRTH_CERTIFICATE</option>
              <option>MEDICAL_CERTIFICATE</option>
              <option>EDUCATIONAL_CERTIFICATE</option>
              <option>POLICE_CLEARANCE</option>
              <option>OTHER</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Document Name</label>
            <input type="text" className="w-full border rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload File</label>
            <input type="file" className="w-full border rounded-md px-3 py-2" />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Upload Document
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
