import React from "react";
import { Link, useNavigate } from "react-router-dom";
import DownLoadBtn from "../Componetns/DownLoadBtn";
import { IoIosArrowBack, IoMdRefresh } from "react-icons/io";
import axios from "axios";
import { parentURL } from "../Api/baseUrl";
import { Toaster, toast } from "sonner";
import { localServerURL } from "../Api/localURL";

const VerificationPg = () => {
  // navigate to different page and show your site is verified modal
  const navigate = useNavigate();
  const sucess = "/offer-link";
  const fail = "/submit-website";

  // saving data and removing data

  const htmlString = localStorage.getItem("verificationString");

  const verifyURL = localStorage.getItem("verifyURL");

  console.log(htmlString);
  console.log(verifyURL);

  // refersh btn
  const handleRefresh = () => {
    const urlText = document.getElementById("urlToVerify");
    urlText.innerText =
      localStorage.getItem("verifyURL") +
      "/" +
      localStorage.getItem("verificationString");
  };

  // confirm verification
  const confirmVerification = () => {
    const payLoad = {
      siteName: verifyURL,
    };
    // console.log(payLoad);
    if (!verifyURL) {
      toast.warning(`Submit your site first`);
      localStorage.removeItem("verificationString");
      localStorage.removeItem("verifyURL");
      navigate(fail, { replace: true });
    } else {
      toast.success(`You are listed for verification`);
      localStorage.removeItem("verificationString");
      localStorage.removeItem("verifyURL");
      navigate(sucess, { replace: true });
    }
    // check verificcation status
    /* 
    axios
      .post(`${localServerURL}/offer-backlink/check-verification`, payLoad)
      .then((res) => {
        if (res.data.message === "verified") {
          localStorage.removeItem("verificationString");
          localStorage.removeItem("verifyURL");
          toast.success(`Congratulations 🎉, site verified`);
          // navigate(sucess, { replace: true });
        } else if (res.data.message === "notVerified") {
          toast.error(`Something went wrong , please add your site first`);
          localStorage.removeItem("verificationString");
          localStorage.removeItem("verifyURL");
        }
      })
      .catch((error) => {
        localStorage.removeItem("verificationString");
        localStorage.removeItem("verifyURL");
        toast.error(error.message);
        // navigate(fail, { replace: true });
      });

       */

    // console.log(htmlString);
    // console.log(verifyURL);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="px-5 py-1 font-roboto">
        <div className="pt-4 border-b pb-3 border-slate-200">
          <h1 className="text-xl font-semibold text-slate-600">
            Please Confirm your ownership of the website by followig the
            instructions
          </h1>
          <p className="text-xs font-semibold text-slate-500 pt-3">
            You may skip this step now and later verify your site from{" "}
            <Link className="text-indigo-400" to={"/offer-link"}>
              My Websites
            </Link>
          </p>
        </div>
        {/* verification steps */}
        <ol className="mt-5 py-3 bg-[#fdfff5] px-3 rounded-lg text-sm flex flex-col gap-8">
          <li className="flex items-center gap-5">
            1. Click
            <DownLoadBtn />
          </li>
          <li>2. Add downloaded file to your websites root directory</li>
          <li>
            3. After that the file should be accessible at:{" "}
            <a
              id="urlToVerify"
              className="text-indigo-600"
              target="_blank"
              href={`https://${verifyURL}/${htmlString}`}
            >
              {verifyURL}/{htmlString}
            </a>
            <div className="tooltip" data-tip="Refersh">
              <button
                onClick={handleRefresh}
                className="btn btn-outline btn-circle btn-xs bg-yellow-300 ml-3 mt-[1px]"
              >
                <IoMdRefresh className="text-sm" />
              </button>
            </div>
          </li>
          <li>4. Click "Confirm"</li>
          <li>5. Our system will check your website</li>
          <li>
            6. Once the verification is completed, you'll be notified about it's
            results
          </li>
        </ol>
        {/* buttons */}
        <div className="flex gap-3 mt-2">
          <Link
            className="w-28 btn btn-outline btn-md bg-indigo-400 font-bold text-white"
            to={"/submit-website"}
          >
            <IoIosArrowBack className="inline" /> Back
          </Link>
          <button
            onClick={() => confirmVerification()}
            className="w-28 btn btn-outline btn-md bg-emerald-400 font-bold text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  );
};

export default VerificationPg;
