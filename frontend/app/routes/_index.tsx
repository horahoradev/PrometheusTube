import Categories from "app/components/categories";
import Pages from "app/components/pagination";
import VideocardList from "app/components/videocard";
import loadable from "@loadable/component";
import { Suspense } from "react";
import { Videos200Response } from "node_modules/promtube-backend";
import { useLoaderData, useSearchParams} from "@remix-run/react";
import { useApi } from "~/lib/oapi";

export async function loader({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const utf8Encode = new TextEncoder();
  const searchEncoded = utf8Encode.encode(searchParams.get('search') !== undefined && searchParams.get('search')?.length > 0 ? searchParams.get('search') : 'none') as unknown as string;
  const categoryEncoded = utf8Encode.encode("undefined") as unknown as string;

  let api = useApi();
  return await api.videos(searchEncoded, searchParams.get('sortCategory') ?? undefined, searchParams.get('order') ?? "desc", "true", parseInt(searchParams.get('page') ?? "1"), categoryEncoded);
}

export default function Home() {
  const videos = useLoaderData<Videos200Response>();

  return (
    <div className="px-6 w-full min-h-[calc(100%-53px)] flex flex-col justify-between">
      <div>
        <Categories></Categories>
        <div className="mt-6">
          <VideocardList videos={videos.videos}></VideocardList>
        </div>
      </div>

      <span className="flex justify-center mb-2">
        <Pages></Pages>
      </span>
    </div>
  );
}
