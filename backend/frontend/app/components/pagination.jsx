import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useSearchParams } from "@remix-run/react";

export default function Pages({numPages}) {
  let [searchParams, setSearchParams] = useSearchParams();

  if (numPages < 2) {
    return null;
  }

  return <Pagination count={numPages} onChange={(event, page)=> {
    setSearchParams((prev) => {
      prev.set("page", page);
      return prev;
    });
  }} color="secondary" />;
}
