"use client";

import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import Configuration from "@/components/admin/Configuration";

const ConfigurationsPage = () => {
  return (
    <AdminLayout>
      <Head>
        <title>Configurations | Admin Panel</title>
      </Head>

      <h1 className="text-2xl font-bold mb-4">Configurations</h1>

      {/* ✅ Load the central Configuration component */}
      <Configuration />
    </AdminLayout>
  );
};

export default ConfigurationsPage;
