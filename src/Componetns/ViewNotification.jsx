import React from "react";

const ViewNotification = ({ message, date }) => {
  const timestamp = date;
  const dateObject = new Date(timestamp);

  // Format the date
  const formattedDate = dateObject.toLocaleDateString();

  // Format the time
  const formattedTime = dateObject.toLocaleTimeString();

  // Combine date and time
  const formattedDateTime = `${formattedDate} ${formattedTime}`;

  //   console.log(formattedDateTime);

  return (
    <div
      data-aos="fade-right"
      className="border border-[#e2e2e2] shadow-md px-4 py-2 rounded-md bg-[#eaf4fc] h-16 font-roboto"
    >
      <h1 className="pt-1 font-semibold text-sm">{message}</h1>
      <p className="text-xs font-bold pt-1 text-slate-500">
        On{formattedDate} at {formattedTime}
      </p>
    </div>
  );
};

export default ViewNotification;
