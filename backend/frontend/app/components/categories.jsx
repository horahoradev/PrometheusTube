import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useSearchParams } from "@remix-run/react";
import {
  BrowserView,
  MobileView,
  getSelectorsByUserAgent,
} from "react-device-detect";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
export default function Categories({ userAgent, sortCategory, sortDirection, setSortCategory, setSortDirection }) {
  const { isMobile } = getSelectorsByUserAgent(userAgent);

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
    <div>
      { isMobile ? 
        <div>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="scrollable auto tabs example"
          >
            <Tab value="home" label="Home" />
            <Tab value="anime" label="Anime" />
            <Tab value="amv" label="AMV" />
            <Tab value="otomad" label="otoMAD" />
          </Tabs>
          <div className="w-full flex justify-center mt-4">
        <FormControl sx={{ width: 150, height: 35 }} variant="standard">
          <InputLabel>Sort Category</InputLabel>
          <Select
          labelId="sortCategory"
          id="sort"
          value={sortCategory}
          label="Sort Category"
          onChange={(e) => setSortCategory(e.target.value)}
        >
          <MenuItem value="views">Views</MenuItem>
          <MenuItem value="rating">Rating</MenuItem>
          <MenuItem value="upload_date">Upload Date</MenuItem>
        </Select>
      </FormControl>
      <FormControl className="!ml-2" sx={{ width: 150, height: 35 }} variant="standard">
          <InputLabel>Direction</InputLabel>
          <Select
          labelId="sortDirection"
          id="direction"
          value={sortDirection}
          label="Sort Direction"
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
      </div>
       </div>
       : (
        <div>
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
        <div className="w-full flex justify-center mt-4">
        <FormControl sx={{ width: 150, height: 35 }} variant="standard">
          <InputLabel>Sort Category</InputLabel>
          <Select
          labelId="sortCategory"
          id="sort"
          value={sortCategory}
          label="Sort Category"
          onChange={(e) => setSortCategory(e.target.value)}
        >
          <MenuItem value="views">Views</MenuItem>
          <MenuItem value="rating">Rating</MenuItem>
          <MenuItem value="upload_date">Upload Date</MenuItem>
        </Select>
      </FormControl>
      <FormControl className="!ml-2" sx={{ width: 150, height: 35 }} variant="standard">
          <InputLabel>Direction</InputLabel>
          <Select
          labelId="sortDirection"
          id="direction"
          value={sortDirection}
          label="Sort Direction"
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>
      </div>
        </div>
        )
        }
        </div>
  );
}
