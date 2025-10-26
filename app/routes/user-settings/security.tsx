import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({});
};

export default function SecurityPage() {
  return (
    <AppLayout title="Security Settings">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Security Settings</h1>
        
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Change Password</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input type="password" className="w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input type="password" className="w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input type="password" className="w-full border rounded-md px-3 py-2" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Update Password
              </button>
            </form>
          </div>

          <hr />

          <div>
            <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-600 mb-4">Enable 2FA for added security</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Enable 2FA
            </button>
          </div>

          <hr />

          <div>
            <h3 className="font-semibold mb-2">Active Sessions</h3>
            <p className="text-sm text-gray-500">No active sessions</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
