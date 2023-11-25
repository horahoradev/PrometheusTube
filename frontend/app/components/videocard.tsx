import { NavLink, useSearchParams} from "@remix-run/react";
import { HandThumbUpIcon, EyeIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { useTheme } from "@mui/material/styles";
import React, { Suspense } from "react";
import { useLoaderData } from "@remix-run/react";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useApi } from "~/lib/oapi";
import { Videos200ResponseVideosInner } from "node_modules/promtube-backend";
import { json, MetaFunction } from "@remix-run/node";

export default function VideocardList({videos}) {
  return (
    <ImageList
      className="mt-3 overflow-visible index-video-list"
      // rowHeight={350}
      // rowWidth={450}
      gap={6}
    >
      {videos === undefined ? <div></div> : videos.map((item) => (
        <ImageListItem key={item.videoID}>
          <img
            className="rounded-lg !w-128 !h-64"
            srcSet={`${item.thumbnailLoc}`}
            src={`${item.thumbnailLoc}`}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            subtitle={
              <span>
                <NavLink to={"/video/" + item.videoID}>
                  <div className="font-semibold text-white-900 text-text-single-400">
                    {item.title}
                  </div>
                </NavLink>
                <div className="mt-1 text-white-800 text-text-single-400 font-medium">
                  <NavLink to={'/profile/' + item.authorID}>{item.authorName}</NavLink>
                </div>
                <NavLink to={"/video/" + item.videoID}>
                  <div className="mt-1 text-white-700 text-text-single-upper-200">
                    <HandThumbUpIcon className="w-5 inline-block relative align-middle" />
                    <span className="align-middle ml-1">{item.rating}</span>
                    <EyeIcon className="ml-2 w-5 inline-block relative align-middle" />
                    <span className="align-middle ml-1">{item.views}</span>
                  </div>
                </NavLink>
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
