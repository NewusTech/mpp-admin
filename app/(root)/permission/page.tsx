import ProtectedRoute from "@/components/ProtectedRoute";

const PermissionPage = () => {
  return (
    <ProtectedRoute roles={["Super Admin", "Admin Instansi", "Admin Layanan"]}>
      <section className="mr-16"></section>
    </ProtectedRoute>
  );
};

export default PermissionPage;
