"use client";
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
    { label: string; response: string }[][]
  >([]);

  useEffect(() => {
    if (formId) {
      trigger({ id: formId })
        .unwrap()
        .then((res) => {
          console.log("response", res);
          setHeaders(res.headers);
          setResponses(res.arrayOfResponses);
        });
    }
  }, [formId]);
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
              {responseRow.map((responseItem, colIndex) => (
                <td key={colIndex} className="border border-gray-400 px-4 py-2">
                  {responseItem.response || "—"}{" "}
                  {/* Show placeholder if empty */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Page;
