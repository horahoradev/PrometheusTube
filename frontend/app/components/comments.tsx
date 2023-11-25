import { NavLink } from "@remix-run/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import Avatar from "@mui/material/Avatar";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";
import { Button, TextField } from "@mui/material";
import * as React from "react";
import { useApi } from "~/lib/oapi";
import { Comments200ResponseInner } from "node_modules/promtube-backend";
import { useState, useEffect } from "react";
import moment from "moment";
export default function Comments({ videoID, cookie, commentsInp }) {
  const [comment, setComment] = React.useState("");
  const [comments, setComments] =
    React.useState<Array<Comments200ResponseInner>>(commentsInp);

  async function newComment() {
    let api = useApi();
    const utf8Encode = new TextEncoder();
    const commentEncoded = utf8Encode.encode(comment);
    await api.comment(0, commentEncoded, videoID, cookie);
    setCommentCounter((v) => v + 1);
  }

  const [commentCounter, setCommentCounter] = useState(0);
  useEffect(() => {
    async function fetchComments() {
      let api = useApi();
      let c = await api.comments(videoID);
      setComments(c);
    }
    fetchComments();
  }, [commentCounter]);

  return (
    <div className="mt-4 mb-6 p-2">
      <div className="text-text-single-400">{comments.length} replies</div>
      <div className="mt-4">
        <Avatar className="float-left" sx={{ width: 50, height: 50 }}>
          N
        </Avatar>
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="!ml-2 align-center inline-block text-white-700"
          id="standard-basic"
          label="Add a comment..."
          variant="standard"
        />
        <Button
          color="primary"
          className="text-single-100 !mt-3 !ml-2 inline-block"
          variant="contained"
          onClick={newComment}
        >
          Post
        </Button>
      </div>
      <br></br>
      {comments.length > 0 ? (
        <hr className="border-cherry-red-200 my-3"></hr>
      ) : null}
      {comments.length > 0
        ? comments.map((item) => (
            <div className="w-full h-24">
              <Avatar className="float-left" sx={{ width: 50, height: 50 }}>
                {item.fullname}
              </Avatar>
              {/* used a very funny trick by setting and overriding the font size to achieve text alignment */}
              <div className="text-text-single-300 inline-block ml-2 float-left text-bottom leading-5">
                <div className=" text-white-900 font-bold text-bottom float-left text-bottom">
                  {item.fullname}
                </div>
                <div className="inline-block text-white-800 ml-2 text-text-single-200 text-bottom font-normal">
                  {moment(item.created, "YYYY-MM-DDTh:mm:ssZ").fromNow()}
                </div>
                <div className="leading-5 text-text-single-200 font-normal">
                  {item.content}
                </div>
                <div className="font-sans text-white-700">
                  <HandThumbUpIcon className="w-4 inline-block relative align-middle" />
                  <span className="align-middle ml-1">{item.upvoteCount}</span>
                  <HandThumbDownIcon className="ml-2 w-4 inline-block relative align-middle" />
                </div>
              </div>
            </div>
          ))
        : null}
    </div>
  );
}
