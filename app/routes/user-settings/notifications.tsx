import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({});
};

export default function NotificationsPage() {
  return (
    <AppLayout title="Notification Preferences">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Notification Preferences</h1>
        
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h3 className="font-semibold">Email Notifications</h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span>Document verification updates</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" defaultChecked />
              <span>Travel schedule changes</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Weekly reports</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>System announcements</span>
            </label>
          </div>

          <hr className="my-6" />

          <h3 className="font-semibold">SMS Notifications</h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Urgent document requests</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>Travel confirmations</span>
            </label>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mt-6">
            Save Preferences
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
