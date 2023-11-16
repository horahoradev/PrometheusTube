import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useSearchParams } from "@remix-run/react";

export default function Categories() {
  const [value, setValue] = React.useState("home");
  let [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSearchParams((prev) => {
      if (newValue == "home") {
        prev.set("category", "undefined");
        return prev;
      }
      prev.set("category", newValue);
      return prev;
    });
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      textColor="secondary"
      indicatorColor="secondary"
      aria-label="secondary tabs example"
      centered
    >
      <Tab value="home" label="Home" />
      <Tab value="anime" label="Anime" />
      <Tab value="amv" label="AMV" />
      <Tab value="otomad" label="otoMAD" />
    </Tabs>
  );
}
