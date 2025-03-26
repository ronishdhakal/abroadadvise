import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import Head from "next/head";
import {
  fetchUsers,
  createUser,
  updateUser,
} from "@/utils/api";
import Pagination from "@/pages/consultancy/Pagination";
import UserForm from "@/components/admin/users/UserForm";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null); // ✅ For editing
  const [showForm, setShowForm] = useState(false); // ✅ Toggle form

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers(page, search);
      setUsers(data.results);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (err) {
      console.error("❌ Failed to load users:", err);
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, data);
        alert("✅ User updated successfully.");
      } else {
        await createUser(data);
        alert("✅ User created successfully.");
      }

      setShowForm(false);
      setEditingUser(null);
      loadUsers(); // Refresh list
    } catch (error) {
      console.error("❌ Failed to submit user:", error);
      alert("❌ Failed to submit user.");
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  return (
    <AdminLayout>
      <Head>
        <title>Manage Users | Admin Panel</title>
        <meta name="description" content="Manage users in Abroad Advise admin panel." />
      </Head>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            + Add User
          </button>
        )}
      </div>

      {/* ✅ Search */}
      {!showForm && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg p-2 w-full"
          />
          <button onClick={loadUsers} className="bg-blue-500 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>
      )}

      {/* ✅ Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* ✅ Form */}
      {showForm && (
        <UserForm
          initialData={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      {/* ✅ User Table */}
      {!showForm && (
        <>
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <>
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">#</th>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">Full Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td className="border p-2">{(page - 1) * 10 + index + 1}</td>
                      <td className="border p-2">{user.username}</td>
                      <td className="border p-2">
                        {`${user.first_name || ""} ${user.last_name || ""}`}
                      </td>
                      <td className="border p-2">{user.email}</td>
                      <td className="border p-2 capitalize">{user.role}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ✅ Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default UsersPage;
