import AdminLayout from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Welcome to the Admin Dashboard</h1>
      <p className="mt-4 text-gray-700">Manage your platform from here.</p>
    </AdminLayout>
  );
};

export default AdminDashboard;
