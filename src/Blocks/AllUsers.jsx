import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { parentURL } from "../Api/baseUrl";
import AllUsersTableRow from "../Componetns/AllUsersTableRow";
import { Toaster, toast } from "sonner";
import { AuthContext } from "../Poveiders/AuthProvider";
import { useForm } from "react-hook-form";
import countriesWithFlag from "../Api/country";
import ReactPaginate from "react-paginate";
import { listOfItemsPerPg } from "../Api/itemsPerPage";

const AllUsers = () => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  //create newuser with google createuser and also save to db
  const { createUser } = useContext(AuthContext);
  const [showPass, setShowPass] = useState(false);
  const [search, setSearch] = useState("");

  // hookform
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  // fetch fn
  const getUsers = async () => {
    const res = await axios.get(`${parentURL}/users`);
    return res.data;
  };

  // show all users
  const {
    data: allusers,
    isLoading,
    error,
    refetch,
  } = useQuery({ queryKey: ["allusers"], queryFn: getUsers });

  // console.log(allusers);
  if (isLoading) {
    return <p className="text-center px-20 py-20">Loading...</p>;
  }

  if (error) {
    return <p className="text-center px-20 py-20">{error.message}</p>;
  }

  // show pass toggler
  const toggler = (e) => {
    e.preventDefault();
    setShowPass(!showPass);
  };

  // const handle delete
  const handleDelete = (id) => {
    axios.delete(`${parentURL}/users/delete/${id}`);
  };

  const onSubmit = (data) => {
    // console.log(data);

    // send user data to backend -/users route
    const userData = {
      fullName: data.fullName,
      email: data.email,
      userName: data.userName,
      password: data.password,
      country: data.country.split(" ")[0],
      phone: data.phone,
      createdBy: "addedByAdmin",
    };

    reset();

    axios
      .post(`${parentURL}/users`, userData)
      .then((res) => {
        toast.success(`Added New User`);
        refetch();
        reset();
      })
      .catch((error) => {
        toast.error(error.message);
        reset();
      });
  };

  const password = watch("password");
  const confirmPass = watch("confirmPassword");
  const matchPassword = password === confirmPass;

  // react pagination

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = allusers.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(allusers.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % allusers.length;
    setItemOffset(newOffset);
  };

  // select items per page -> by me
  const handleItemsPerPage = (e) => {
    e.preventDefault();
    const form = e.target;
    const itemsPerPg = form.perPageData.value;
    setItemsPerPage(itemsPerPg);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      {/* navigation */}
      <div className="py-2 px-3 flex gap-5 items-center">
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Search by name/email/phone"
          className="input input-sm  input-bordered w-full max-w-xs"
        />
        {/* set items per page */}
        <form className="flex gap-3" onSubmit={handleItemsPerPage}>
          <div>
            <label className="form-control lg:w-fit w-full">
              <select
                className="select select-bordered select-sm"
                name="perPageData"
              >
                <option disabled selected>
                  Items Per Page
                </option>
                {listOfItemsPerPg.map((item, i) => (
                  <option value={item} key={i}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            className="text-xs font-semibold btn btn-sm btn-outline bg-yellow-200"
            type="submit"
          >
            Set items
          </button>
        </form>
      </div>
      <div className="overflow-x-auto py-3 font-roboto">
        <table className="table lg:table-md md:table-sm table-xs">
          {/* head */}
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Country</th>
              <th>User Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {currentItems
              .filter((item) =>
                search.toLowerCase() === ""
                  ? item
                  : item.fullName
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    item.email.toLowerCase().includes(search.toLowerCase()) ||
                    item.phone.toLowerCase().includes(search.toLowerCase())
              )
              .map((item, i) => (
                <AllUsersTableRow
                  key={i}
                  index={i + 1}
                  Name={item.fullName}
                  email={item.email}
                  id={item._id}
                  country={item.country}
                  phone={item.phone}
                  userStatus={item.activeStatus}
                  refetch={refetch}
                />
              ))}
          </tbody>
        </table>
      </div>
      {/* add new user */}
      <div className="flex flex-col justify-center items-center py-10">
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button
          className="btn btn-circle bg-emerald-200"
          onClick={() =>
            document.getElementById("my_modal_createUser").showModal()
          }
        >
          <img src="/add.svg" alt="add user" />
        </button>
        <div className="text-center">
          <h1 className="text-slate-400 font-bold text-md py-3">
            Add New User
          </h1>
        </div>
        <dialog id="my_modal_createUser" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm hover:bg-red-400 btn-circle btn-ghost absolute right-2 top-2">
                <img src="/cross.svg" alt="cross" />
              </button>
              <h1 className="font-bold text-lg text-slate-700">
                Create New User
              </h1>
              {/* <small className="py-2 animate-pulse">
                  This section is under maintainance ⚠️
                </small> */}
            </form>
            {/* form here goes your form */}
            <form className="pt-2" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                  {...register("fullName", { required: true })}
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="input input-bordered w-full"
                  {...register("userName", { required: true })}
                />
              </div>
              <div className="flex flex-col gap-3 mt-2">
                {/* <input
                type="text"
                placeholder="Country"
                className="input input-bordered w-full"
                {...register("country", { required: true })}
              /> */}

                <select
                  className="select select-bordered w-full"
                  {...register("country", { required: true })}
                >
                  <option className="text-lg text-slate-500" disabled selected>
                    Select your country
                  </option>
                  {countriesWithFlag.map((country, i) => (
                    <option key={i}>{country}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Phone Number"
                  className="input input-bordered w-full"
                  {...register("phone", { required: true })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                  {...register("email", { required: true })}
                />
              </div>
              {/* password */}
              <div className="mt-2 flex flex-col gap-y-2">
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    className="input input-bordered w-full"
                    {...register("password", {
                      required: true,
                      minLength: 6,
                      pattern:
                        /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z])/,
                    })}
                  />
                  <button
                    onClick={toggler}
                    className="absolute right-0 top-2 text-md px-2 pt-2 pb-1 rounded-tr-md rounded-br-md"
                  >
                    {showPass ? "🕶️" : "👀"}
                  </button>
                </div>

                {/* validations for ui */}
                {errors.password && errors.password?.type === "minLength" && (
                  <p className="text-xs font-bold pt-1 text-red-400 mt-1">
                    Password must be atleast 6 characters
                  </p>
                )}
                {errors.password && errors.password?.type === "required" && (
                  <p className="text-xs font-bold pt-1 text-red-400 mt-1">
                    Password is required
                  </p>
                )}
                {errors.password && errors.password?.type === "pattern" && (
                  <p className="text-xs font-bold pt-1 text-red-400 mt-1">
                    uppercase, number and special character required
                  </p>
                )}
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Confirm Password"
                    className="input input-bordered w-full "
                    {...register("confirmPassword", {
                      required: true,
                    })}
                  />
                  <button
                    onClick={toggler}
                    className="absolute right-0 top-2 text-md px-2 pt-2 pb-1 rounded-tr-md rounded-br-md"
                  >
                    {showPass ? "🕶️" : "👀"}
                  </button>
                </div>
                {matchPassword ? (
                  <p className="text-xs font-bold text-emerald-300 pt-1">
                    Password match
                  </p>
                ) : (
                  <p className="text-xs font-bold text-red-400 pt-1">
                    Password don't match
                  </p>
                )}
              </div>
              {matchPassword ? (
                <button
                  type="submit"
                  className="border-2 border-slate-500 rounded-md px-4 pt-2 pb-1 mt-2 bg-indigo-200 hover:bg-indigo-300 font-bold text-sm w-full  btn text-[#111110]"
                >
                  Add User
                </button>
              ) : (
                <button className="btn-disabled border-2 border-slate-500 rounded-md px-4 py-2 mt-2 bg-indigo-200 hover:bg-indigo-300 font-bold text-sm w-full  btn text-[#111110]">
                  Add User
                </button>
              )}
            </form>
          </div>
        </dialog>
      </div>
      {/* pagination */}
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< prev"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        previousLinkClassName="direction"
        pageLinkClassName="page-num"
        nextLinkClassName="direction"
        activeLinkClassName="active"
      />
    </>
  );
};

export default AllUsers;
