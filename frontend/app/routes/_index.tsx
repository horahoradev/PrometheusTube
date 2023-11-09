import Categories from "app/components/categories";
import Pages from "app/components/pagination";
import VideocardList from "app/components/videocard";
import loadable from "@loadable/component";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="px-6 w-full min-h-[calc(100%-53px)] flex flex-col justify-between">
      <div>
        <Categories></Categories>
        <div className="mt-6">
          <VideocardList></VideocardList>
        </div>
      </div>

      <span className="flex justify-center mb-2">
        <Pages></Pages>
      </span>
    </div>
  );
}
