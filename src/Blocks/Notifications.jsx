import React, { useContext } from "react";
import { AuthContext } from "../Poveiders/AuthProvider";
import axios from "axios";
import { parentURL } from "../Api/baseUrl";
import { useQuery } from "react-query";
import ViewNotification from "../Componetns/ViewNotification";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
import { data } from "autoprefixer";
// ..
AOS.init();

const Notifications = () => {
  const { user } = useContext(AuthContext);

  // fetchLoggedin user
  const fetchCurrentUserNotification = async () => {
    const result = await axios.get(
      `${parentURL}/users/notifications/${user.email}`
    );
    return result.data;
    // .then((res) => {
    //   console.log(res.data);
    // })
    // .catch((error) => {
    //   console.log(error.message);
    // });
  };

  // react query
  const {
    data: notifications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: "notifications",
    queryFn: fetchCurrentUserNotification,
  });

  if (isLoading) {
    return <p className="px-10 py-10 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="px-10 py-10 text-center">{error.message}</p>;
  }

  if (!Array.isArray(notifications)) {
    return (
      <div className="px-5 py-5">
        <div
          data-aos="fade-right"
          className="border border-[#e2e2e2] shadow-md px-4 py-2 rounded-md bg-[#eaf4fc] h-16 font-roboto"
        >
          <h1 className="pt-1 font-semibold text-sm">Nothing right now</h1>
          <p className="text-xs font-bold pt-1 text-slate-500">
            Come back later
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-5 font-roboto">
      <div className="grid grid-cols-1 overflow-y-auto gap-4">
        {notifications.reverse().map((item, i) => (
          <ViewNotification key={i} message={item.text} date={item.date} />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
