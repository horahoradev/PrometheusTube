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

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: videojs },
];

export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};

import { createEmptyContact, getContacts } from "./data";

export const action = async () => {
  const contact = await createEmptyContact();
  return json({ contact });
};

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const theme = createTheme({
    palette: {
      secondary: {
        main: "#f6869c",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
        </head>
        {/* LOL NO!! FIXME w-full */}
        <body className="overflow-x-hidden">
          <Navbar></Navbar>
          <div className="bg-white-200 h-screen">
            <Outlet></Outlet>
          </div>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </ThemeProvider>
  );
}
