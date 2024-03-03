import { FaTrash, FaUserEdit } from "react-icons/fa";
import { PiRadioactiveFill } from "react-icons/pi";
import { toast } from "sonner";
import { parentURL } from "../Api/baseUrl";
import { useForm } from "react-hook-form";
import countriesWithFlag from "../Api/country";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllUsersTableRow = ({
  index,
  Name,
  email,
  country,
  phone,
  id,
  userStatus,
  refetch,
}) => {
  // hookform
  const { register, handleSubmit, reset } = useForm();

  //* onSubmit update data to backend
  const onSubmit = (data) => {
    // console.log(data);
    const payLoad = {
      country: data.country.split(" ")[0],
      phone: data.phone,
      fullName: data.fullName,
    };

    const userID = data.userID;

    axios
      .patch(`${parentURL}/users/update/${userID}`, payLoad)
      .then((res) => {
        toast.info(res.status);
        reset();
        refetch();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // activate user
  const activateUser = (userID) => {
    axios
      .patch(`${parentURL}/users/activate/${userID}`)
      .then((res) => {
        toast.success(`${Name} Activated`);
        refetch();
        // notification payload
        const notificationPayload = {
          text: `${Name} your id have been Activated`,
          dateNotified: new Date(),
        };
        // todo: send notification
        axios
          .post(
            `${parentURL}/users/notifications/${userID}`,
            notificationPayload
          )
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error.message);
          });

        // end of noitification api
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // handle delete operation
  const handleDelete = (userID) => {
    // todo: delete from backend
    axios
      .delete(`${parentURL}/users/delete/${userID}`)
      .then((res) => {
        console.log(res.status);
        toast.warning(`Deleted ${Name}`);
        refetch();
      })
      .catch((error) => {
        console.log(error);
        toast.error(`${error.message}`);
      });

    // setBtnDisable(true);
  };

  //   handle deactivate
  const handleDeactivate = (userId) => {
    // todo: add a deactivate account status in backend
    axios
      .patch(`${parentURL}/users/deactivate/${userId}`)
      .then((res) => {
        console.log(res.status);
        toast.warning(`Deactivated ${Name}`);
        refetch();

        // notification payload
        const notificationPayload = {
          text: `${Name} your id have been deactivated`,
          dateNotified: new Date(),
        };
        // todo: send notification
        axios
          .post(
            `${parentURL}/users/notifications/${userId}`,
            notificationPayload
          )
          .then((res) => {
            console.log(res);
          })
          .catch((error) => {
            console.log(error.message);
          });

        // end of noitification api
      })
      .catch((err) => {
        console.log(err.message);
        toast.error(`Error: ${err.message}`);
      });
  };

  return (
    <>
      <tr>
        <th className="text-slate-400 font-semibold">{index}</th>
        <td>{Name}</td>
        <td>
          {email} <br /> <small>Phone: {phone}</small>
        </td>
        <td>{country}</td>
        <td>{userStatus === "activated" ? "Active" : "Not Active"}</td>
        <td className="flex gap-3">
          {/* edit */}
          <div>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <div className="lg:tooltip" data-tip="Edit">
              <button
                className="btn btn-outline btn-sm btn-circle bg-emerald-300"
                onClick={() =>
                  document.getElementById(`my_modal_${index}`).showModal()
                }
              >
                <FaUserEdit />
              </button>
            </div>
            <dialog id={`my_modal_${index}`} className="modal">
              <div className="modal-box">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost hover:bg-red-400 absolute right-2 top-2">
                    <img src="/cross.svg" alt="cross" />
                  </button>
                </form>
                <h3 className="font-bold text-lg">Edit {Name}'s Info ⌨</h3>
                <Link
                  to={`/user-details/${id}`}
                  className="text-slate-400 hover:text-indigo-400 text-xs font-bold"
                >
                  View user details <span className="text-lg">🥽</span>
                </Link>
                <form className="py-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-3">
                    <input
                      value={id}
                      type="text"
                      className="input input-bordered w-full input-xs hidden"
                      {...register("userID")}
                    />
                    <select
                      className="select select-bordered w-full"
                      {...register("country", { required: true })}
                    >
                      <option
                        className="text-lg text-slate-500"
                        disabled
                        selected
                      >
                        Select users country
                      </option>
                      {countriesWithFlag.map((country, i) => (
                        <option key={i}>{country}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Update phone number"
                      className="input input-bordered w-full"
                      {...register("phone", { required: true })}
                    />
                    <input
                      type="text"
                      placeholder="Update Display Name"
                      className="input input-bordered w-full"
                      {...register("fullName", { required: true })}
                    />
                  </div>
                  <div className="flex gap-x-3 pt-5">
                    <button
                      // onClick={() => updateUserInfo(id)}
                      type="submit"
                      className="btn btn-md btn-outline bg-green-300 font-bold"
                    >
                      Upadate User
                    </button>
                    <button
                      onClick={() => activateUser(id)}
                      className="btn btn-md btn-outline bg-cyan-300 font-bold"
                    >
                      Activate User
                    </button>
                  </div>
                </form>
                {/* action buttons */}
              </div>
            </dialog>
          </div>
          {/* delete */}
          <div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <div className="lg:tooltip" data-tip="Delete">
              <button
                className="btn btn-outline btn-sm btn-circle bg-red-300"
                onClick={() =>
                  document.getElementById(`my_modal_${Name}`).showModal()
                }
              >
                <FaTrash />
              </button>
            </div>
            <dialog id={`my_modal_${Name}`} className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Delete permanently🗑️</h3>
                <p className="pt-4">Account holder: {Name}</p>
                <p className="text-xs py-1">This can not be undone</p>
                <div className="modal-action flex justify-start">
                  <button
                    onClick={() => handleDelete(id)}
                    //   disabled={btnDisable}
                    className={"btn btn-outline btn-sm bg-red-300"}
                  >
                    Yes, Delete
                  </button>
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-outline btn-sm">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
          {/* deactivate */}
          <div className="lg:tooltip" data-tip="Deactivate">
            <button
              onClick={() => handleDeactivate(id)}
              disabled={userStatus === "deactivated" ? true : false}
              className={"btn btn-outline btn-sm btn-circle bg-yellow-300"}
            >
              <PiRadioactiveFill />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default AllUsersTableRow;
