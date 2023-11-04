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
  useLoaderData
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import appStylesHref from "./app.css";
import stylesheet from "~/tailwind.css";

import { json } from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
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
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
          {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                  <NavLink
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                  to={`contacts/${contact.id}`}
                >
                        {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                  </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>
        </div>
        <div 
          className={
            navigation.state === "loading" ? "loading" : ""
          }
        id="detail">
          <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
