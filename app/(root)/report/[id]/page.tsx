"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import ReportTab from "@/components/Report";

const ReportDetail = ({
  params,
}: {
  params: {
    id: number;
  };
}) => {
  return (
    <ProtectedRoute roles={["Admin Instansi", "Super Admin", "Admin Layanan"]}>
      <section className="mr-16">
        <ReportTab serviceId={params.id} />
      </section>
    </ProtectedRoute>
  );
};

export default ReportDetail;
