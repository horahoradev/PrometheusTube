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

import stylesheet from "~/tailwind.css";
import { Navbar } from "app/components/navbar";

import { json } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
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

  return (
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
  );
}
