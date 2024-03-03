import axios from "axios";
import React, { useState } from "react";
import { parentURL } from "../Api/baseUrl";
import ReqLinkTbRow from "../Componetns/ReqLinkTbRow";
import { useQuery } from "react-query";
import { localServerURL } from "../Api/localURL";
import ReactPaginate from "react-paginate";
import { listOfItemsPerPg } from "../Api/itemsPerPage";

const ReqBackLink = () => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [search, setSearch] = useState("");

  // filter
  const [type, setType] = useState();

  const loadDataByFilter = (filter) => {
    console.log(filter);
    if (filter === "") {
      setType(null);
      refetch();
    }
    setType(filter);
    refetch();
  };

  const fetchLinks = async () => {
    const res = await axios.get(`${parentURL}/offer-backlink`);
    return res.data;
  };

  const {
    data: links,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["links"],
    queryFn: fetchLinks,
  });

  if (isLoading) {
    return <p className="px-10 py-10 text-center">Loading...</p>;
  }

  if (error) {
    return <p className="px-10 py-10 text-center">{error.message}</p>;
  }

  // react pagination

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = links.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(links.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % links.length;
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
    <div className="font-roboto">
      {/* search and filter elements */}
      <div className="py-2 px-3 flex gap-5 items-center">
        <input
          onChange={(e) => setSearch(e.target.value)}
          className="input input-sm  input-bordered w-full max-w-xs"
          placeholder="Search by site name"
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

        {/* filter */}
        {/* <details className="dropdown drop">
          <summary className="btn">Filter By</summary>
          <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
            <li>
              <button type="button" onClick={() => loadDataByFilter("Follow")}>
                Follow
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => loadDataByFilter("Not follow")}
              >
                Not Follow
              </button>
            </li>
            <li>
              <button type="button" onClick={() => loadDataByFilter("")}>
                Show All
              </button>
            </li>
          </ul>
        </details> */}
      </div>
      {/* table data */}
      <div className="overflow-x-auto overflow-y-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>index</th>
              <th>Request Backlink</th>
              <th>Site</th>
              <th>Launch Date</th>
            </tr>
          </thead>
          {currentItems
            .filter((item) =>
              search.toLowerCase() === ""
                ? item
                : item.addedSite.toLowerCase().includes(search.toLowerCase())
            )
            .map((item, i) => (
              <ReqLinkTbRow
                key={i}
                url={item.addedSite}
                index={i + 1}
                lanchDate={item.launchDate}
                id={item._id}
              />
            ))}
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

export default ReqBackLink;
