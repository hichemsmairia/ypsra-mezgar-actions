import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { deleteTour, fetchTours } from "../../services/TourServices";

const ToursList = () => {
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTours().then((result) => {
      setTours(result);
    });
  }, []);

  const handleDelete = async (tourId) => {
    setTours(tours.filter((tour) => tour.id !== tourId));
    await deleteTour(tourId);
  };

  const handleUpdate = (tourId) => {
    navigate(`/update_tour/${tourId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Tours List  
      </h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Nom Tour
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr
                key={tour.id}
                className="hover:bg-gray-100 transition duration-300"
              >
                <td className="border border-gray-300 px-4 py-2">
                  {tour.tourName}
                </td>
                <td className="border w-[30vw] flex flex-row justify-around border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleDelete(tour.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleUpdate(tour.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => navigate("/view_tour/" + tour.id)}
                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ToursList;
