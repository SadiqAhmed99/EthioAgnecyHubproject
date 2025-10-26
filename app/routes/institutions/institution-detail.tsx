import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ institution: null });
};

export default function InstitutionDetailPage() {
  return (
    <AppLayout title="Add Institution">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Add Institution</h1>
        
        <form className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Institution Name</label>
            <input type="text" className="w-full border rounded-md px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option>GOVERNMENT</option>
              <option>BANKING</option>
              <option>INSURANCE</option>
              <option>MEDICAL</option>
              <option>EDUCATION</option>
              <option>OTHER</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea rows={3} className="w-full border rounded-md px-3 py-2" required></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input type="tel" className="w-full border rounded-md px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="w-full border rounded-md px-3 py-2" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Person</label>
            <input type="text" className="w-full border rounded-md px-3 py-2" required />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Create Institution
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
