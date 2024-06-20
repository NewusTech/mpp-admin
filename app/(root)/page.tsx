// import InputComponent from "@/components/InputComponent";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import CardDashboardQueue from "@/components/Dashboard/CardDashboardQueue";
// import ChartDashboard from "@/components/Dashboard/ChartDashboard";
//
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { columns } from "@/constants";
// import { DataTables } from "@/components/Datatables";
// import { Payment } from "@/types/type";

import DashboardSuperadmin from "@/components/Dashboard/Superadmin";
import InstanceDashboard from "@/components/Dashboard/Instance";

export default function Home() {
  return (
    <section className="mr-16">
      {/*<DashboardSuperadmin />*/}
      <InstanceDashboard />
    </section>
  );
}
