import { NavLink } from "@remix-run/react";
export default function TermsOfService() {
  return (
    <NavLink to="/">
      <span className="font-bold text-cherry-red-100">Terms of Service</span>
    </NavLink>
  );
}
