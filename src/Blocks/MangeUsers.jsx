import axios from "axios";
import { parentURL } from "../Api/baseUrl";
import TableRow from "../Componetns/TableRow";
import { useQuery } from "react-query";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { listOfItemsPerPg } from "../Api/itemsPerPage";

const MangeUsers = () => {
  const [itemOffset, setItemOffset] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [search, setSearch] = useState("");

  const {
    data: users = [],
    refetch,
    error,
    isLoading,
  } = useQuery(["users"], async () => {
    const res = await axios.get(`${parentURL}/users`);
    return res.data;
  });

  if (isLoading) {
    return <p className="text-center px-20 py-20">Loading...</p>;
  }

  if (error) {
    return <p className="text-center px-20 py-20">{error.message}</p>;
  }

  // react pagination

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = users.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(users.length / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % users.length;
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
      <div className="overflow-x-auto font-roboto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <label>No</label>
              </th>
              <th>Name</th>
              <th>Email & Username</th>
              <th>Phone</th>
              <th>Admin Feature</th>
            </tr>
          </thead>
          <tbody>
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
                <TableRow
                  refetch={refetch}
                  id={item._id}
                  role={item.role}
                  key={i}
                  index={i + 1}
                  fullName={item.fullName}
                  country={item.country}
                  email={item.email}
                  userName={item.userName}
                  phone={item.phone}
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

export default MangeUsers;
