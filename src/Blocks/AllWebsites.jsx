import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { parentURL } from "../Api/baseUrl";
import { toast } from "sonner";
import AllSiteTableRow from "../Componetns/AllSiteTableRow";
import { useForm } from "react-hook-form";
import { AuthContext } from "../Poveiders/AuthProvider";
import { webCategory } from "../Api/siteCategory";
import ReactPaginate from "react-paginate";
import { listOfItemsPerPg } from "../Api/itemsPerPage";

const AllWebsites = () => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [search, setSearch] = useState("");

  // get user
  const { user } = useContext(AuthContext);
  // hook form
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // gell all sites
  const getAllSites = async () => {
    const res = await axios.get(`${parentURL}/offer-backlink`);
    return res.data;
  };

  const {
    data: allSites = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allSites"],
    queryFn: getAllSites,
  });

  if (isLoading) {
    return <p className="px-10 py-10 text-center">Loading...</p>;
  }

  // submit new website
  const onSubmit = (data) => {
    // console.log(data);
    const payLoad = {
      addedSite: data.addedSite,
      category: data.category,
      launchDate: data.launchDate,
      monthlyOrgVisit: data.monthlyOrgVisit,
      rankingKeyWords: data.rankingKeyWords,
      type: data.type,
      user: user.email,
    };
    axios
      .post(`${parentURL}/offer-backlink`, payLoad)
      .then((res) => {
        // console.log(res);
        toast.info(`Data submitted`);
        refetch();
      })
      .then((error) => console.log(error));
    reset();
  };

  // react pagination

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = allSites.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(allSites.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % allSites.length;
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
      {/* navigation */}
      <div className="py-2 px-3 flex gap-5 items-center">
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Search here"
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
              <th>Added Site</th>
              <th>Category</th>
              <th>Monthly Visit</th>
              <th>Launch Date</th>
              <th>Times Requested</th>
              <th>Action Buttons</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {currentItems
              .filter((item) =>
                search.toLowerCase() === ""
                  ? item
                  : item.addedSite.toLowerCase().includes(search.toLowerCase())
              )
              .map((item, i) => (
                <AllSiteTableRow
                  key={i}
                  index={i + 1}
                  siteName={item.addedSite}
                  category={item.category}
                  monthlyVisit={item.monthlyOrgVisit}
                  launchDate={item.launchDate}
                  requestedCount={item.count}
                  siteID={item._id}
                  refetch={refetch}
                  siteStatus={item.status}
                  verified={item.isValid}
                  remove={true}
                  edit={true}
                  deactivate={true}
                />
              ))}
          </tbody>
        </table>
      </div>
      {/* add new website */}
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
            Add New Site
          </h1>
        </div>
        <dialog id="my_modal_createUser" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm hover:bg-red-400 btn-circle btn-ghost absolute right-2 top-2">
                <img src="/cross.svg" alt="cross" />
              </button>
              <h1 className="font-bold text-lg text-slate-700">Add new site</h1>
            </form>
            {/*here goes your form */}
            <form className="pt-3" onSubmit={handleSubmit(onSubmit)}>
              {/* add website input */}
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Add Your Website</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full input-md"
                  {...register("addedSite", {
                    required: true,
                    pattern: /^www\..+\.(com|net|org|io|info|co|edu)$/,
                  })}
                />
                {errors.addedSite && errors.addedSite?.type === "pattern" && (
                  <span className="text-xs py-2 font-semibold text-red-400">
                    Start with www. and end with .com or TLDs
                  </span>
                )}
              </label>
              {/* group input: category and monthly organic visit */}
              <div className="flex gap-5 pt-2">
                {/* category */}
                <label className="form-control w-fit max-w-xs">
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
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Monthly Organic Visits</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Type here"
                    className="input input-bordered w-full max-w-xs"
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
              {/* group input: launch date and type */}
              <div className="flex gap-5 pt-2">
                {/* launch date */}
                <label className="form-control w-fit max-w-xs">
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
                {/* type do follow / not follow */}
                <label className="form-control w-full max-w-xs">
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
              {/* key words */}
              <label className="form-control w-full pt-2">
                <div className="label">
                  <span className="label-text">Ranking Keywords</span>
                </div>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered w-full"
                  {...register("rankingKeyWords", {
                    required: true,
                    pattern: /^\w+(,\w+)*$/,
                  })}
                />
                {errors.rankingKeyWords &&
                  errors.rankingKeyWords?.type === "pattern" && (
                    <span className="text-xs py-2 font-semibold text-red-400">
                      Seperate words with commas (,)
                    </span>
                  )}
              </label>
              <input
                className="btn btn-md btn-outline mt-3 w-full bg-yellow-300 font-bold"
                type="submit"
              />
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

export default AllWebsites;
