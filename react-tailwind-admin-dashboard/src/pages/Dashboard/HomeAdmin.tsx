import MonthlySalesChart from "../../components/visiteAdmin/MonthlySalesChart";
import DemographicCard from "../../components/visiteAdmin/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import UserTypePieChart from "../../components/visiteAdmin/UserTypePieChart";
import AdminMonthlyVisitChart from "../../components/visiteAdmin/MonthlyRegistrationsChart";
import { useEffect, useState } from "react";

import { getMonthlyVisitorsService } from "../../services/visitServices.js";

export default function HomeAdmin() {
  const [data, setData] = useState([]);

  const getMonthyVisitdata = async () => {
    const response = await getMonthlyVisitorsService();
    setData([...data, response]);
    console.log(response);
  };

  useEffect(() => {
    getMonthyVisitdata();
  }, []);
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6 xl:gap-8">
        {" "}
        <div className="col-span-12 md:col-span-6">
          <MonthlySalesChart />
        </div>
        <div className="col-span-12 md:col-span-6">
          <UserTypePieChart />
        </div>
        <div className="col-span-12 md:col-span-6">
          <AdminMonthlyVisitChart
            visitsData={data}
            chartHeight={300}
            fontSize="sm"
          />
        </div>
        <div className="col-span-12 md:col-span-6">
          <DemographicCard />
        </div>
      </div>
    </>
  );
}
