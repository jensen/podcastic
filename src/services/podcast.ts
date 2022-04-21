import crypto from "crypto";

const API_BASE_URL = "https://api.podcastindex.org/api/1.0";

const request = (url: string) => {
  const time = Math.round(new Date().getTime() / 1000);
  const auth: HeadersInit = {
    "User-Agent": "Podcastic/1.0",
    "X-Auth-Key": process.env.PODCAST_INDEX_KEY || "",
    "X-Auth-Date": String(time),
    Authorization: crypto
      .createHash("sha1")
      .update(
        `${process.env.PODCAST_INDEX_KEY}${process.env.PODCAST_INDEX_SECRET}${time}`
      )
      .digest("hex"),
  };

  return fetch(url, { headers: { ...auth } }).then((response) =>
    response.json()
  );
};

export const search = (query: string) => {
  const url = new URL(`${API_BASE_URL}/search/byterm`);
  url.search = new URLSearchParams({
    q: query,
  }).toString();

  return request(url);
};

export const show = (id: string) => {
  const url = new URL(`${API_BASE_URL}/podcasts/byfeedid`);

  url.search = new URLSearchParams({
    id,
  }).toString();

  return request(url);
};

export const episodes = (id: string) => {
  const url = new URL(`${API_BASE_URL}/episodes/byfeedid`);

  url.search = new URLSearchParams({
    id,
  }).toString();

  return request(url);
};
