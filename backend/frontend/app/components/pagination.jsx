import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
// import { useSearchParams } from "@remix-run/react";

export default function Pages() {
  // let [searchParams, setSearchParams] = useSearchParams();

  return <Pagination count={10} color="secondary" />;
}
