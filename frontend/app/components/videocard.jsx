import { NavLink } from "@remix-run/react";
import { HandThumbUpIcon, EyeIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { useTheme } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";

export default function VideocardList() {
  const theme = useTheme();
  // TODO: expand responsiveness
  const matches = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <ImageList className="mt-3 overflow-visible" cols={6} gap={16}>
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            className="rounded-lg"
            srcSet={`${item.img}`}
            src={`${item.img}`}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            subtitle={
              <span>
                <div className="font-semibold font-sans">{item.title}</div>
                <div className="mt-1 text-white-800 font-sans font-medium">
                  {item.author}
                </div>
                <div className="mt-1 font-sans text-white-700">
                  <HandThumbUpIcon className="w-4 inline-block relative align-middle" />
                  <span className="align-middle ml-1">0</span>
                  <EyeIcon className="ml-2 w-4 inline-block relative align-middle" />
                  <span className="align-middle ml-1">0</span>
                </div>
              </span>
            }
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    author: "bkristastucchio",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
    author: "rollelflex_graphy726",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    author: "helloimnik",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    author: "nolanissac",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    author: "hjrc33",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    author: "arwinneil",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
    author: "tjdragotta",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    author: "katie_wasserman",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    author: "silverdalex",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
    author: "shelleypauls",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
    author: "peterlaster",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    author: "southside_customs",
  },
];