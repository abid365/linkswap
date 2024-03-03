import FileSaver, { saveAs } from "file-saver";
import React from "react";
import { FaDownload } from "react-icons/fa6";

const DownLoadBtn = () => {
  // generate dynamic filename
  const generateFileName = () => {
    const uniqueStr = Math.random().toString(36).substring(2, 10);

    localStorage.setItem("verificationString", `${uniqueStr}.html`);
    return `${uniqueStr}.html`;
  };

  //   handle download
  const handleDownload = async () => {
    // generate a unique file name
    const fileName = generateFileName();
    const pathName = "/verify.html";
    try {
      // Fetch the HTML content from the public directory
      const response = await fetch(pathName);

      // Check if the fetch was successful (status code 200)
      if (!response.ok) {
        throw new Error(`Failed to fetch file. Status: ${response.status}`);
      }

      // Convert the response to a Blob
      const blob = new Blob([await response.text()], { type: "text/html" });
      // Trigger the download using FileSaver.js
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error fetching or saving file:", error);
    }
    // const blob = new Blob(["/verify.html"], { type: `html` });
    // triggering the download using Filesaver.js
    // saveAs(blob, fileName);
  };

  return (
    <div className="flex flex-col items-start">
      <button
        className="btn btn-outline btn-sm flex gap-1 items-center bg-yellow-300"
        onClick={handleDownload}
      >
        <FaDownload /> Download File
      </button>
    </div>
  );
};

export default DownLoadBtn;
