import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ user: null });
};

export default function ProfilePage() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Profile Settings">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Profile Management</h1>
        
        <form className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div>
              <button className="text-blue-600 hover:text-blue-800">Change Photo</button>
              <p className="text-sm text-gray-500">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" className="w-full border rounded-md px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea rows={4} className="w-full border rounded-md px-3 py-2"></textarea>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Save Changes
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
