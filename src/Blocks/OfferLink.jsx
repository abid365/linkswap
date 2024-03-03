import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { webCategory } from "../Api/siteCategory";
import DownLoadBtn from "../Componetns/DownLoadBtn";
import axios from "axios";
import { parentURL } from "../Api/baseUrl";
import { toast } from "sonner";
import { AuthContext } from "../Poveiders/AuthProvider";
import CehckWebStatus from "../Componetns/CheckWebStatus";
import { localServerURL } from "../Api/localURL";
import { MdVerified } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { FaLink } from "react-icons/fa6";
import { languages } from "../Api/language";

const OfferLink = () => {
  // get user
  const { user } = useContext(AuthContext);

  // navigate to verification page after submission
  const navigate = useNavigate();
  const to = "/verification";

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data.addedSite);

    // accept data with or without protocol
    const extractDomain = (url) => {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "http://" + url;
      }
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname;

      return domain;
    };

    // console.log(data);
    const payLoad = {
      addedSite: extractDomain(data.addedSite),
      category: data.category,
      launchDate: data.launchDate,
      monthlyOrgVisit: data.monthlyOrgVisit,
      lang: data.language,
      type: data.type,
      email: user.email,
    };
    axios
      .post(`${parentURL}/offer-backlink`, payLoad)
      .then((res) => {
        // console.log(res);
        toast.info(`Data submitted successfully`);
        localStorage.setItem("verifyURL", `${data.addedSite}`);
        // document.getElementById("my_modal_downloadBtnModal").showModal();
        navigate(to, { replace: true });
      })
      .catch((error) => {
        toast.error(error.message);
      });
    reset();
  };

  return (
    <div className="px-10 py-5 font-roboto">
      <h1 className="text-center text-lg font-bold text-slate-700">
        Add Your Website
      </h1>
      {/* form data */}
      <div className="mt-5">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex lg:flex-row flex-col items-start gap-3">
            {/* add website input */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Add Your Website</span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                {...register("addedSite", {
                  required: true,
                  // pattern: /^www\..+\.(com|net|org|io|info|co|edu)$/,
                })}
              />
              {errors.addedSite && (
                <span className="text-xs py-2 font-semibold text-red-400">
                  Please add your site
                </span>
              )}
            </label>
            {/* category */}
            <label className="form-control lg:w-fit w-full">
              <div className="label">
                <span className="label-text">Category</span>
              </div>
              <select
                className="select select-bordered"
                {...register("category", { required: true })}
              >
                <option disabled selected>
                  Pick one
                </option>
                {webCategory.map((item, i) => (
                  <option key={i}>{item}</option>
                ))}
              </select>
            </label>
            {/* monthly organic visits */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Monthly Organic Visits</span>
              </div>
              <input
                type="number"
                placeholder="Type here"
                className="input input-bordered w-full"
                {...register("monthlyOrgVisit", {
                  required: true,
                })}
              />
              {errors.monthlyOrgVisit &&
                errors.monthlyOrgVisist?.type === "valueAsNumber" && (
                  <span className="text-xs py-2 font-semibold text-red-400">
                    Numbers Only
                  </span>
                )}
            </label>
          </div>
          {/* second row */}
          <div className="mt-3 flex lg:flex-row flex-col gap-3">
            {/* launch date */}
            <label className="form-control lg:w-fit w-full">
              <div className="label">
                <span className="label-text">Launch Date</span>
              </div>
              <input
                type="date"
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
                {...register("launchDate", {
                  required: true,
                })}
              />
            </label>
            {/* key words */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Your Language</span>
              </div>
              <select
                className="select select-bordered w-full"
                {...register("language", { required: true })}
              >
                <option className="text-lg text-slate-500" disabled selected>
                  Select your language
                </option>
                {languages.map((item, i) => (
                  <option key={i}>{item}</option>
                ))}
              </select>
              {/*  {errors.rankingKeyWords &&
                errors.rankingKeyWords?.type === "pattern" && (
                  <span className="text-xs py-2 font-semibold text-red-400">
                    Seperate words with commas (,)
                  </span>
                )} */}
            </label>
            {/* type do follow / not follow */}
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Category</span>
              </div>
              <select
                className="select select-bordered"
                {...register("type", { required: true })}
              >
                <option disabled selected>
                  Pick one
                </option>
                <option>Follow</option>
                <option>Not follow</option>
              </select>
            </label>
          </div>
          <label className="form-control w-full mt-3 ">
            {/* download html */}
            <div className="py-4 flex justify-center">
              {/* <label
                className="form-control w-full tooltip"
                data-tip="This file helps you to verify your site. For example, run it in your root directory: wwww.example.com/downloadedFile.html. Later you can check status"
              >
                <div className="label">
                  <span className="label-text">Verify Your Website</span>
                </div>
                <DownLoadBtn />
              </label> */}
              <input
                className="btn btn-md btn-outline bg-indigo-300 w-[40%] text-center"
                type="submit"
              />
            </div>
          </label>
        </form>
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        {/*  <button
          className="btn"
          onClick={() =>
            document.getElementById("my_modal_downloadBtnModal").showModal()
          }
        >
          open modal
        </button> */}
        {/* open modal to download verifcation file */}
        <dialog id="my_modal_downloadBtnModal" className="modal">
          <div className="modal-box bg-[#101211] text-white">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-xs btn-circle btn-ghost absolute right-2 top-2 bg-white hover:bg-red-400">
                <img src="/cross.svg" alt="cross" />
              </button>
            </form>
            <h3 className="font-bold text-lg">Click on the download button</h3>
            <p className="py-2 text-sm">
              In order to verify your site, you can follow these steps
            </p>
            <ul className="text-xs pb-4 pt-2 text-slate-400">
              <li className="pt-1">
                Step-1: Download this file and upload it to your sites cpanel
              </li>
              <li className="pt-1">
                Step-2:Go to site and at the very end wirte (/verify.html){" "}
                <span className="text-red-400 inline-block">
                  ex: www.mysite.com/verify.html
                </span>
              </li>
              <li className="pt-1">
                Step-3: Your site will be verified (automated)
              </li>
              <li className="pt-1">
                Step-4: To check wheater it is verified or not click on the
                check status button
              </li>
            </ul>
            <DownLoadBtn />
          </div>
        </dialog>
        {/* check verification */}
        <div className="mt-5 border-2 border-salte-300 rounded-xl px-[3px] py-1 bg-gradient-to-r from-red-400 via-indigo-300 to-emerald-300">
          <div className="bg-[#101211] px-4 py-5 rounded-lg text-white">
            <h1 className="text-sm font-bold">
              Check verification status (Note)💡
            </h1>
            <p className="text-xs pt-2">
              Submit your site, download the verification file, and upload it to
              your cPanel for verification. Visit :{" "}
              <Link className="text-indigo-400 hover:text-cyan-200">
                How to verify website <FaLink className="inline-block" />
              </Link>{" "}
              for more details
            </p>
            <CehckWebStatus />
          </div>
          {/* <CehckWebStatus /> */}
        </div>
      </div>
    </div>
  );
};

export default OfferLink;
