import VideocardList from "app/components/videocard";
import Categories from "app/components/categories";
import Pages from "app/components/pagination";
import RecommendationsList from "app/components/recommendationslist";
import { json, redirect, createCookie } from "@remix-run/node";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { Suspense } from "react";
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
  let events = await api.archiveRequests(request.headers.get("Cookie"));
  return {
    events: events,
    banner: true,
    userAgent: request.headers.get("user-agent"),
  };
}

export default function Video() {
  const { events, banner, userAgent } = useLoaderData<typeof loader>();
  const [url, setURL] = React.useState("");

  async function newArchiveRequest() {
    let api = useApi();
    // GOD NO!!!!!!!!!!!!!!!!!!!!!!!! FIXME
    await api.newArchiveRequest(url, "jwt=" + Cookies.get("jwt"));
  }

  return (
    <div>
      <Navbar userAgent={userAgent} displayAvatar={banner}></Navbar>
      <div className="mx-6 mt-4">
        <TextField
          className="w-full"
          required
          id="outlined-required"
          label="New URL"
          size="small"
          value={url}
          onChange={(e) => setURL(e.target.value)}
        />
        <Button
          color="primary"
          className="text-single-100 w-full"
          variant="contained"
          onClick={newArchiveRequest}
        >
          Add URL
        </Button>
        <TableContainer className=" mt-4" component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">URL</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">Account</TableCell>
                <TableCell align="left">Archived videos</TableCell>
                <TableCell align="left">Total videos</TableCell>
                <TableCell align="left">Undownloadable</TableCell>
                <TableCell align="left">Backoff factor</TableCell>
                <TableCell align="left">Last Sync</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events != null
                ? events.map((row) => (
                    <TableRow
                      key={row.downloadID}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.url}
                      </TableCell>
                      <TableCell align="left">
                        {row.archivedVideos + row.undownloadableVideos ==
                        row.currentTotalVideos
                          ? "Synced"
                          : "Incomplete"}
                      </TableCell>
                      <TableCell align="left">{row.userID}</TableCell>
                      <TableCell align="left">{row.archivedVideos}</TableCell>
                      <TableCell align="left">
                        {row.currentTotalVideos}
                      </TableCell>
                      <TableCell align="left">
                        {row.undownloadableVideos}
                      </TableCell>
                      <TableCell align="left">{row.backoffFactor}</TableCell>
                      <TableCell align="left">{row.lastSynced}</TableCell>
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
