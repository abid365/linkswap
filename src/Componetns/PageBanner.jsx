import React from "react";

const PageBanner = ({ pagetitle, pageDesc }) => {
  return (
    <div className="px-20 pt-5 pb-5 border-b border-slate-500">
      <h1 className="text-4xl font-bold text-center pt-2 text-slate-800">
        {pagetitle}
      </h1>
      <p className="text-center text-xs py-1 font-semibold">{pageDesc}</p>
    </div>
  );
};

export default PageBanner;
