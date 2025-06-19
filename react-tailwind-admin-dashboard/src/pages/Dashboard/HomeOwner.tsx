import DemographicCard from "../../components/visiteOwner/DemographicCardOwner";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import OwnerMonthlyVisitChart from "../Charts/OwnerMonthlyVisitChart";
import { getMonthlyVisitorsService } from "../../services/visitServices.js";
import { fetchTours } from "../../services/TourServices.js";
import { useSelector } from "react-redux";
export default function HomeOwner() {
  const [data, setData] = useState([]);
  const [tours, setTours] = useState([]);
  const [userToursIds, setTourIds] = useState<string[]>([]);
  const { user } = useSelector((state) => state.auth);

  const getMonthyVisitdata = async () => {
    const response = await getMonthlyVisitorsService();
    setData([...data, response]);
    console.log(response);
  };

  const getTours = async () => {
    await fetchTours().then((result: any) => {
      setTours(result.filter((el: any) => el.ownerId == user.id));
      console.log(result);
    });
  };

  useEffect(() => {
    getMonthyVisitdata();
    getTours();
  }, []);

  useEffect(() => {
    if (tours.length > 0) {
      const userTourIds = tours
        .filter((tour) => tour.ownerId === user.id)
        .map((tour) => tour.id);
      setTourIds(userTourIds);
      console.log("User Tours IDs:", userTourIds);
    }
  }, [tours, user.id]);

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
            {data.length > 0 && (
              <OwnerMonthlyVisitChart
                visitsData={[
                  Object.fromEntries(
                    Object.entries(data[0]).filter(([key]) =>
                      userToursIds.includes(key)
                    )
                  ),
                ]}
                chartHeight={300}
                fontSize="sm"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
