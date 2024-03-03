import React, { useContext, useEffect, useState } from "react";
import { parentURL } from "../Api/baseUrl";
import axios from "axios";
import { AuthContext } from "../Poveiders/AuthProvider";
import PendingTableRow from "../Componetns/PendingTableRow";
import ReactPaginate from "react-paginate";
import { listOfItemsPerPg } from "../Api/itemsPerPage";

const PendingRequests = () => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [search, setSearch] = useState("");
  // get email from Auth
  const { user } = useContext(AuthContext);
  const [pendingData, setPendingData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios
        .get(`${parentURL}/requested-backlink/pending/${user?.email}`)
        .then((res) => {
          // console.log(res);
          setPendingData(res.data);
        })
        .catch((error) => {
          toast.error(error.message);
        });
      //   setPendingData(res.data);
    };

    fetchData();
  }, [parentURL]);

  // react pagination

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = pendingData.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(pendingData.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % pendingData.length;
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
          type="search"
          placeholder="www.example.com"
          onChange={(e) => setSearch(e.target.value)}
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
      <div className="overflow-x-auto font-roboto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Index</th>
              <th>Your Given Link</th>
              <th>Requested to</th>
              <th>Status</th>
              <th>Email</th>
              <th>Date Requested</th>
              <th>Requested By</th>
            </tr>
          </thead>
          {currentItems.map((pendingItem, i) => (
            <PendingTableRow
              key={i + 0.01}
              index={i + 1}
              givenLink={pendingItem.reqBackLink}
              requestedTo={pendingItem.selectedUrl4Request}
              status={pendingItem.status}
              email={pendingItem.reqUserEmail}
              date={pendingItem.date}
              requestedBy={pendingItem.reqUser}
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
    </>
  );
};

export default PendingRequests;
