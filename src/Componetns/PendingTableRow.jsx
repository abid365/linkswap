import React from "react";

const PendingTableRow = ({
  index,
  givenLink,
  requestedTo,
  status,
  email,
  date,
  requestedBy,
}) => {
  return (
    <>
      <tbody>
        <tr>
          <th>{index}</th>
          <td>{givenLink}</td>
          <td>{requestedTo}</td>
          <td className={status ? "text-yellow-600" : ""}>
            {status && "Pending"}
          </td>
          <td>{email}</td>
          <td>{date}</td>
          <td>{requestedBy}</td>
        </tr>
      </tbody>
    </>
  );
};

export default PendingTableRow;
