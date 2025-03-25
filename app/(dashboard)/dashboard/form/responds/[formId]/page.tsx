"use client";
import { restApi } from "@/api";
import { Button } from "@/components/ui/button";
import { useLazyGetFormResponsesQuery } from "@/redux/form/formApi";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const Page = (props: Props) => {
  const { formId } = useParams();
  const [trigger, { data, isError, isLoading, isSuccess }] =
    useLazyGetFormResponsesQuery();
  const [headers, setHeaders] = useState<string[]>([]);
  const [responses, setResponses] = useState<
    { label: string; response: string; type: string }[][]
  >([]);

  useEffect(() => {
    if (formId) {
      trigger({ id: formId })
        .unwrap()
        .then((res) => {
          setHeaders(res.headers);
          setResponses(res.arrayOfResponses);
        });
    }
  }, [formId]);

  const downloadFile = (fileName: string) => {
    restApi
      .get(`/api/response/download/${fileName}`, { responseType: "blob" })
      .then((res) => {
        // Ensure the filename header is present
        const filename = res.headers["x-filename"] || "downloadedFile"; // Get filename from custom header
        console.log("filename", filename);

        // Create a URL for the blob
        const url = window.URL.createObjectURL(res.data);

        // Create a temporary link to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename); // Use the filename from the header
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.log("Download error", error));
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-200">
            {headers.map((header, index) => (
              <th
                key={index}
                className="border border-gray-400 px-4 py-2 text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {responses.map((responseRow, rowIndex) => (
            <tr key={rowIndex} className="border border-gray-400">
              {responseRow.map((responseItem, colIndex) => {
                return (
                  <React.Fragment key={colIndex}>
                    <td
                      key={colIndex}
                      className="border border-gray-400 px-4 py-2"
                    >
                      {responseItem.type === "Fileupload" ? (
                        <>
                          {responseItem.response ? (
                            <>
                              {/* <a
                                href={`${process.env.NEXT_PUBLIC_API}/api/response/download/${responseItem.response}`} // File URL
                                download // Enables download functionality
                              >
                                <Button>Download</Button>
                              </a> */}
                              <Button
                                onClick={() =>
                                  downloadFile(responseItem.response)
                                }
                              >
                                Download
                              </Button>
                            </>
                          ) : (
                            <>{"—"}</>
                          )}
                        </>
                      ) : (
                        <>{responseItem.response || "—"}</>
                      )}

                      {/* Show placeholder if empty */}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
