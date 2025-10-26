import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ settings: [] });
};

export default function SettingsPage() {
  const { settings } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="System Settings">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <h3 className="font-semibold mb-2">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Application Name</label>
                <input type="text" defaultValue="Ethio Agency Hub" className="w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Default Language</label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>English</option>
                  <option>Arabic</option>
                  <option>Amharic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time Zone</label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>Africa/Addis_Ababa</option>
                </select>
              </div>
            </div>
          </div>

          <hr />

          <div>
            <h3 className="font-semibold mb-2">File Upload Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Max File Size (MB)</label>
                <input type="number" defaultValue="10" className="w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Allowed File Types</label>
                <input type="text" defaultValue="pdf,jpg,jpeg,png" className="w-full border rounded-md px-3 py-2" />
              </div>
            </div>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Save Settings
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
