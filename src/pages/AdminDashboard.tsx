import Layout from "@/components/Layout";

/**
 * Admin UI is intentionally not exposed in the app router.
 * Use backend GET /api/bookings and GET /api/export/excel with EXPORT_SECRET / x-export-key.
 */
export default function AdminDashboard() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        <p>Admin features are available via secure backend APIs only.</p>
      </div>
    </Layout>
  );
}
