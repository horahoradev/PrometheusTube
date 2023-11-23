import VideocardList from "app/components/videocard";
import Categories from "app/components/categories";
import Pages from "app/components/pagination";
import RecommendationsList from "app/components/recommendationslist";
import { json, redirect, createCookie } from "@remix-run/node";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { Suspense, useState, useEffect } from "react";
import * as React from "react";
import { ClientOnly } from "remix-utils/client-only";

import { useApi } from "~/lib/oapi";
import { useLoaderData, NavLink, useSearchParams } from "@remix-run/react";

import loadable from "@loadable/component";
import { VideoDetail200Response } from "node_modules/promtube-backend";
import { Navbar } from "app/components/navbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Cookies from "js-cookie";

export async function loader({ request, params }: LoaderFunctionArgs) {
  let api = useApi();
  let events = await api.getUnapprovedVideos(request.headers.get("Cookie"));
  return {
    events: events,
    banner: true,
    userAgent: request.headers.get("user-agent"),
  };
}

export default function Video() {
  const { events, banner, userAgent } = useLoaderData<typeof loader>();
  const [videos, setVideos] = React.useState(events);
  let api = useApi();
  const [videoCounter, setVideoCounter] = useState(0);

  useEffect(() => {
    async function fetchVideos() {
      let api = useApi();
      let c = await api.getUnapprovedVideos(Cookies.get("jwt"));
      setVideos(c);
    }
    fetchVideos();
  }, [videoCounter]);

  return (
    <div>
      <Navbar userAgent={userAgent} displayAvatar={banner}></Navbar>
      <div className="mx-6 mt-4">
        <TableContainer className=" mt-4" component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">URL</TableCell>
                <TableCell align="left">Category</TableCell>
                <TableCell align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {videos != null
                ? videos.map((row) => (
                    <TableRow
                      key={row.videoID}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.URL}
                      </TableCell>
                      <TableCell align="left">{row.category}</TableCell>
                      <TableCell align="left">
                        <Button
                          onClick={async () => {
                            api.approveDownload(row.videoID);
                            setVideoCounter((v) => v + 1);
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={async () => {
                            api.unapproveDownload(row.videoID);
                            setVideoCounter((v) => v + 1);
                          }}
                        >
                          Unapprove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
