import {
  Form,
  Links,
  LiveReload,
  Meta,
  Scripts,
  Outlet,
  NavLink,
  Link,
  ScrollRestoration,
  useNavigation,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import videojs from "video.js/dist/video-js.css";
import stylesheet from "~/tailwind.css";
import { Navbar } from "app/components/navbar";

import { json } from "@remix-run/node";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: videojs },
];


export default function App() {
  const theme = createTheme({
    palette: {
      secondary: {
        main: "#f6869c",
      },
      primary: {
        main: "#c6d2fd",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
          <Meta />
          <Links />
        </head>
        {/* LOL NO!! FIXME w-full */}
        <body className="overflow-x-hidden bg-white-200">
          <Outlet></Outlet>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </ThemeProvider>
  );
}
