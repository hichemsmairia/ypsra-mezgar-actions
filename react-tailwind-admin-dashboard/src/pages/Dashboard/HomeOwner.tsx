import DemographicCard from "../../components/visiteOwner/DemographicCardOwner";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import OwnerMonthlyVisitChart from "../Charts/OwnerMonthlyVisitChart";
import { getMonthlyVisitorsService } from "../../services/visitServices.js";

export default function HomeOwner() {
  const [data, setData] = useState([]);

  const getMonthyVisitdata = async () => {
    const response = await getMonthlyVisitorsService()
    setData([...data, response]);
    console.log(response);
  };

  useEffect(() => {
    getMonthyVisitdata();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div className="w-full lg:w-[38%] xl:w-[35%] 2xl:w-[32%]">
          <div className="h-full">
            <DemographicCard />
          </div>
        </div>

        <div className="w-full lg:w-[60%] xl:w-[63%] 2xl:w-[65%]">
          <div className="h-full bg-white rounded-lg shadow-sm p-4 border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <OwnerMonthlyVisitChart
              visitsData={data}
              chartHeight={300}
              fontSize="sm"
            />
          </div>
        </div>
      </div>
    </>
  );
}
