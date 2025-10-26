import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AppLayout from "~/components/layouts/AppLayout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({ roles: [
    { name: 'SUPER_ADMIN', permissions: ['all'] },
    { name: 'ADMIN', permissions: ['manage_users', 'view_reports'] },
    { name: 'MANAGER', permissions: ['manage_employees', 'approve_documents'] },
    { name: 'AGENT', permissions: ['create_employees', 'upload_documents'] },
    { name: 'VIEWER', permissions: ['view_only'] },
  ]});
};

export default function RolesPage() {
  const { roles } = useLoaderData<typeof loader>();

  return (
    <AppLayout title="Roles & Permissions">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="font-semibold mb-4">System Roles</h3>
            
            <div className="space-y-4">
              {roles.map((role: any) => (
                <div key={role.name} className="border rounded p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{role.name}</h4>
                      <p className="text-sm text-gray-600">{role.permissions.join(', ')}</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
