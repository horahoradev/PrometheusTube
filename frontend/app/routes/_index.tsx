import VideocardList from "app/components/videocard";
import Categories from "app/components/categories";
import Pages from "app/components/pagination";

export default function Home() {
  return (
    <div className="px-6 w-full h-screen">
      <Categories></Categories>

      <div className="mt-6">
        <VideocardList></VideocardList>
      </div>

      <span className="absolute bottom-0 mb-6">
        <Pages></Pages>
      </span>
    </div>
  );
}
