import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { parentURL } from "../Api/baseUrl";
import { AuthContext } from "../Poveiders/AuthProvider";
import { FaLink } from "react-icons/fa6";
import { Link } from "react-router-dom";
import AllSiteTableRow from "../Componetns/AllSiteTableRow";
import ReactPaginate from "react-paginate";
import { listOfItemsPerPg } from "../Api/itemsPerPage";

const MyWebSites = () => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [search, setSearch] = useState("");
  // logged in user
  const { user } = useContext(AuthContext);
  const mySubmittedSites = async () => {
    const res = await axios.get(
      `${parentURL}/offer-backlink/submitted-sites/${user.email}`
    );
    return res.data;
  };

  // load all websites submitted by logged in user
  const {
    data: mysites = [],
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["mysites"],
    queryFn: mySubmittedSites,
  });

  //   console.log(mysites);

  if (isLoading) {
    return <p className="px-10 py-10 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="px-10 py-10 text-center">{error.message}</p>;
  }
  // react pagination

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = mysites.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(mysites.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % mysites.length;
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
    <div>
      {/* navigation */}
      <div className="py-2 px-3 flex gap-5 items-center">
        <input
          type="search"
          placeholder="www.example.com"
          onChange={(e) => setSearch(e.target.value)}
          className="input input-sm  input-bordered w-full max-w-xs"
        />
        {/* add new website */}
        <Link
          to={"/submit-website"}
          className="btn btn-sm bg-[#f0fff0] btn-outline hover:bg-[#EEEEFF]"
        >
          <FaLink className="text-lg font-bold" /> Add new website
        </Link>
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
      {/* show tables of website */}
      <div className="overflow-x-auto py-3 font-roboto">
        <table className="table lg:table-md md:table-sm table-xs">
          {/* head */}
          <thead>
            <tr>
              <th>No.</th>
              <th>Submitted Site</th>
              <th>Category</th>
              <th>Monthly Visit</th>
              <th>Launch Date</th>
              <th>Times Requested</th>
              <th>Action Buttons</th>
            </tr>
          </thead>
          <tbody>
            {/* row-1 */}
            {currentItems
              .filter((item) =>
                search.toLowerCase() === ""
                  ? item
                  : item.addedSite.toLowerCase().includes(search.toLowerCase())
              )
              .map((item, i) => (
                <AllSiteTableRow
                  index={i + 1}
                  key={i}
                  siteName={item.addedSite}
                  category={item.category}
                  monthlyVisit={item.monthlyOrgVisit}
                  launchDate={item.launchDate}
                  requestedCount={item.count}
                  siteStatus={item.status}
                  verified={item.isValid}
                  siteID={item._id}
                  refetch={refetch}
                  remove={true}
                />
              ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default MyWebSites;
