import React, { useContext, useState } from "react";
import { AuthContext } from "../Poveiders/AuthProvider";
import { Toaster, toast } from "sonner";
import { Link, Outlet } from "react-router-dom";
import PageBanner from "../Componetns/PageBanner";
import {
  FaCodePullRequest,
  FaHive,
  FaUsers,
  FaWandMagicSparkles,
  FaCircleCheck,
} from "react-icons/fa6";
import { FaUsersCog } from "react-icons/fa";
import { RiNotification4Fill } from "react-icons/ri";
import {
  MdAttachEmail,
  MdOutlineWebStories,
  MdOutlinePending,
  MdCancel,
  MdOutlineAllInclusive,
} from "react-icons/md";
import useAdmin from "../hooks/useAdmin";

const DashBoard = () => {
  const { logOut, user, setUser } = useContext(AuthContext);
  const [isAdmin, isAdminLoading] = useAdmin();

  // toggle role-demo
  /*  const [isAdmin, setIsAdmin] = useState(false);
  const toggleRole = () => {
    setIsAdmin((prevStat) => !prevStat);
  }; */
  // logout
  const handleLogout = () => {
    logOut()
      .then((res) => {
        toast.success(`Signed out successfully`);
        setUser(null); //setUser setted to null beacuse users who's acc was created by admin needs to be initially logged out when clicks
      })
      .catch((error) => {
        toast.error(`${error.message}`);
      });
  };
  return (
    <div className="font-roboto">
      <Toaster position="top-center" richColors />
      <PageBanner
        pagetitle={"Manage Your Actions"}
        pageDesc={"Browse all the category"}
      />

      <div className="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <Outlet />
          <div className="px-20 py-20 text-center">
            <p className="text-sm font-bold text-slate-400">
              You have been redirected to dashboard after login
            </p>
          </div>
          <div className="flex justify-center items-center my-3">
            <label
              htmlFor="my-drawer"
              className="btn btn-outline w-fit pt-4 drawer-button lg:hidden block"
            >
              Open Side Menu
            </label>
          </div>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu px-4 pt-5 w-fit h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            {isAdmin ? (
              <>
                <li className="mt-1">
                  <Link className="flex items-start" to={"/req-link"}>
                    <FaCodePullRequest /> Request Backlink
                  </Link>
                </li>
                <li className="mt-1">
                  <Link className="flex items-start" to={"/offer-link"}>
                    <FaWandMagicSparkles /> My Websites
                  </Link>
                </li>
                <li className="mt-1">
                  <Link className="flex items-start" to={"/marketplace"}>
                    <FaHive /> Market Place
                  </Link>
                </li>{" "}
              </>
            ) : (
              <>
                <li className="mt-1">
                  <Link className="flex items-start" to={"/req-link"}>
                    <FaCodePullRequest /> Request Backlink
                  </Link>
                </li>
                <li className="mt-1">
                  <Link className="flex items-start" to={"/offer-link"}>
                    <FaWandMagicSparkles /> My Websites
                  </Link>
                </li>
                <li className="mt-1">
                  <Link className="flex items-start" to={"/marketplace"}>
                    <FaHive /> Market Place
                  </Link>
                </li>
              </>
            )}
            <div className="divider"></div>
            {isAdminLoading && (
              <>
                <div className="text-center py-3 px-5">
                  <h1 className="font-bold">Loading...</h1>
                </div>
              </>
            )}
            {isAdmin ? (
              <>
                <li className="mt-1">
                  <Link to={"/notifications"} className="flex items-start">
                    <RiNotification4Fill /> Notifiactions
                  </Link>
                </li>
                <li className="mt-1">
                  <Link to={"/newsletter"} className="flex items-start">
                    <MdAttachEmail /> Newsletter
                  </Link>
                </li>
                <li className="mt-1">
                  <Link to={"/manageusers"} className="flex items-start">
                    <FaUsersCog /> Administration
                  </Link>
                </li>
                <li className="mt-1">
                  <Link to={"/allusers"} className="flex items-start">
                    <FaUsers /> All Users
                  </Link>
                </li>
                <li className="mt-1">
                  <Link to={"/allsites"} className="flex items-start">
                    <MdOutlineWebStories /> All Websites
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="mt-1">
                  <Link to={"/notifications"} className="flex items-start">
                    <RiNotification4Fill /> Notifiactions
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    to={"/incoming-request"}
                    className="flex items-start text-sm"
                  >
                    <MdOutlineAllInclusive /> Incoming Request
                  </Link>
                </li>
                <li className="mt-1">
                  <Link
                    to={"/pending"}
                    className="flex items-start text-sm animate-pulse"
                  >
                    <MdOutlinePending /> Pending Requests
                  </Link>
                </li>
                <li className="mt-1">
                  <Link className="flex items-start text-sm">
                    <FaCircleCheck className="text-sm" /> Accepted Request
                  </Link>
                </li>
                <li className="mt-1">
                  <Link className="flex items-start text-sm">
                    <MdCancel /> Rejected Request
                  </Link>
                </li>
              </>
            )}
            {/* <div className="form-control">
              <label className="label cursor-pointer flex flex-col">
                <p className="label-text">
                  {isAdmin ? "Switch to User" : "Switch to Admin"}
                </p>
                <input
                  onClick={() => toggleRole()}
                  type="checkbox"
                  className="toggle toggle-sm"
                />
              </label>
            </div> */}
            <li>
              <span className="text-xs mt-1">
                Interacting as {isAdmin ? "Admin" : "User"} <br />{" "}
                {user.displayName || user.fullName}
              </span>
            </li>
            <li
              onClick={handleLogout}
              className="btn btn-active btn-neutral mt-2"
            >
              Logout
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
