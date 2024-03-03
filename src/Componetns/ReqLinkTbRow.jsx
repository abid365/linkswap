import React, { useContext } from "react";
import { AuthContext } from "../Poveiders/AuthProvider";
import { useForm } from "react-hook-form";
import { parentURL } from "../Api/baseUrl";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { FaBullseye, FaLink } from "react-icons/fa";

const ReqLinkTbRow = ({ index, url, lanchDate, id }) => {
  // logged in user data
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  //   submitted data from modal
  const onSubmit = (data) => {
    // console.log(data);

    // accept data with or without protocol
    const extractDomain = (url) => {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "http://" + url;
      }
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname;

      return domain;
    };

    // date
    const currentDate = new Date();
    const options = {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    };
    const formattedDate = currentDate.toLocaleDateString("en-US", options);

    // payload to send data in backend
    const payLoad = {
      reqBackLink: extractDomain(data.requestedBackLink),
      msg: data.message,
      status: "isPending",
      reqUser: user.displayName,
      reqUserEmail: user.email,
      reqUserPhone: user?.phone,
      date: formattedDate,
      selectedUrl4Request: url,
    };
    axios
      .post(`${parentURL}/requested-backlink`, payLoad)
      .then((res) => {
        // send request number to offer-backlink collection
        axios
          .post(`${parentURL}/offer-backlink/count/${id}`)
          .then((res) => {
            // console.log(res);
          })
          .then((error) => {
            console.log(error);
          });
        toast.success("Request Sent");
      })
      .catch((error) => {
        // console.log(error);
        toast.error(`${error}`);
      });
    reset();
  };

  const currentDate = new Date();
  const options = {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  return (
    <>
      <Toaster position="top-center" richColors />
      <tbody>
        {/* row 1 */}
        <tr>
          <th>{index}</th>
          <td>
            <button
              className="btn btn-sm btn-outline btn-circle bg-cyan-200"
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              <FaLink />
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box">
                <div>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <label className="form-control w-full">
                      <div className="label">
                        <span className="label-text">
                          Given Back-Link URL , Date:{formattedDate}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Type here"
                        className="input input-bordered w-full"
                        {...register("requestedBackLink", {
                          required: true,
                        })}
                      />
                      {errors.requestedBackLink && (
                        <span className="text-xs py-2 font-semibold text-red-400">
                          This field is required
                        </span>
                      )}
                    </label>
                    <label className="form-control pt-1">
                      <div className="label">
                        <span className="label-text">Your Message</span>
                      </div>
                      <textarea
                        className="textarea textarea-bordered h-24"
                        placeholder="Send this user a message"
                        {...register("message")}
                      ></textarea>
                    </label>
                    {/* if there is a button in form, it will close the modal */}
                    {/* <button className="btn">Close</button> */}
                    <div className="flex items-center gap-x-2 mt-3">
                      <input
                        className="btn btn-outline"
                        type="submit"
                        value={"Send Request"}
                      />
                      <form method="dialog">
                        <button className="btn btn-outline">Close</button>
                      </form>
                    </div>
                  </form>
                </div>
              </div>
            </dialog>
          </td>
          <td>{url}</td>
          <td>{lanchDate}</td>
        </tr>
      </tbody>
    </>
  );
};

export default ReqLinkTbRow;
