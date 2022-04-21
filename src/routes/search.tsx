import { useState, useEffect } from "react";
import type { LoaderFunction } from "remix";
import { json, useLoaderData, Link } from "remix";
import { search } from "../services/podcast";

import { removeHTML, removeNonBreakingSpace } from "../utils/sanitation";

interface ILoaderData {
  results: {
    id: string;
    title: string;
    description: string;
    author: string;
    image: string;
    language: string;
  }[];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const query = new URL(request.url).searchParams.get("query");

  if (!query) {
    return json({
      results: [],
    });
  }

  const results = await search(query);

  return json({
    results: results.feeds.map((item) => ({
      ...item,
      description: removeHTML(removeNonBreakingSpace(item.description)),
    })),
    query,
  });
};

const ImageWrapper = (props) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();

    image.src = props.src;
    image.onload = () => setLoaded(true);
    image.onerror = () => setLoaded(false);
  }, [props.src]);

  if (loaded === false) {
    return (
      <div className={props.className}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="100%"
          height="100%"
          fill="rgba(255, 255, 255, 0.1)"
        >
          <path d="m437.02 74.98c-48.353-48.352-112.64-74.98-181.02-74.98-68.381 0-132.668 26.629-181.02 74.98-48.352 48.353-74.98 112.64-74.98 181.02 0 40.951 9.384 80.084 27.891 116.312 17.646 34.542 43.407 65.145 74.498 88.498 6.623 4.975 16.027 3.64 21.002-2.984s3.639-16.027-2.985-21.002c-57.454-43.157-90.406-109.065-90.406-180.824 0-124.617 101.383-226 226-226s226 101.383 226 226c0 71.76-32.952 137.667-90.407 180.823-6.624 4.976-7.96 14.378-2.985 21.002 2.947 3.924 7.448 5.992 12.005 5.992 3.135 0 6.297-.979 8.997-3.007 31.092-23.354 56.853-53.956 74.499-88.499 18.508-36.227 27.891-75.36 27.891-116.311 0-68.38-26.628-132.667-74.98-181.02z" />
          <path d="m397.205 360.517c22.545-30.413 34.461-66.554 34.461-104.517 0-96.863-78.803-175.666-175.666-175.666-96.864 0-175.668 78.803-175.668 175.666 0 37.964 11.917 74.105 34.464 104.517 2.943 3.97 7.473 6.068 12.062 6.068 3.104 0 6.236-.96 8.921-2.951 6.655-4.934 8.05-14.328 3.117-20.983-18.687-25.205-28.563-55.168-28.563-86.651 0-80.32 65.346-145.666 145.668-145.666 80.32 0 145.666 65.346 145.666 145.666 0 31.481-9.876 61.445-28.562 86.651-4.933 6.655-3.538 16.049 3.118 20.983 6.652 4.933 16.048 3.538 20.982-3.117z" />
          <path d="m351.333 256c0-52.567-42.766-95.333-95.332-95.333-52.567 0-95.334 42.766-95.334 95.333 0 33.703 17.58 63.376 44.051 80.334-26.471 16.957-44.051 46.63-44.051 80.333v80.333c0 8.284 6.716 15 15 15h160.666c8.284 0 15-6.716 15-15v-80.333c0-33.703-17.58-63.376-44.05-80.333 26.47-16.958 44.05-46.631 44.05-80.334zm-30 160.667v65.333h-130.666v-65.333c0-36.025 29.309-65.333 65.334-65.333 36.024 0 65.332 29.308 65.332 65.333zm-65.333-95.333c-36.025 0-65.334-29.309-65.334-65.334s29.309-65.333 65.334-65.333c36.024 0 65.332 29.308 65.332 65.333.001 36.025-29.307 65.334-65.332 65.334z" />
        </svg>
      </div>
    );
  }

  return <img className={props.className} src={props.src} alt="" />;
};

export default function Search() {
  const { query, results } = useLoaderData<ILoaderData>();

  return (
    <section className="flex flex-col items-center">
      <h1 className="py-4 text-4xl font-bold text-gray-200">{query}</h1>
      <ul className="sm:w-3/4">
        {results
          .filter((result) => result.language.startsWith("en"))
          .map((result) => {
            return (
              <li key={result.id} className="p-4 flex">
                <Link to={`/shows/${result.id}`} className="contents">
                  <ImageWrapper
                    className="w-24 h-24 rounded-lg block flex-shrink-0"
                    src={result.image}
                  />
                  <div className="px-4 flex-grow-0">
                    <h2 className="font-bold text-lg line-clamp-2">
                      {result.title}
                    </h2>
                    <h3 className="text-sm line-clamp-1 text-gray-800">
                      {result.author}
                    </h3>
                    <p className="text-md line-clamp-1 break-all">
                      {result.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
      </ul>
    </section>
  );
}
