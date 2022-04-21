## Purpose

This project was completed as part of a group learning exercise. 

## Demo

![Podcastic Demo](https://user-images.githubusercontent.com/14803/164382669-ecaf83d2-aab2-4577-a06b-8a05abb2d49f.png)

[https://podcastic.netlify.app/](https://podcastic.netlify.app/)

## Project Features

### User Stories

1. ✅ User can search for a podcast show.
2. ✅ User can view a list of search results of podcast shows that matches their searched keyword.
3. ✅ User can select and view a podcast show from the list of search results.
4. ✅ User can see the podcast information including podcast name, description, thumbnail, publisher name.
5. ✅ User can click on a link that will redirect them to the podcast hosting site where they can view and listen to the podcast episodes.

## Technical

API provided by [https://podcastindex.org/](https://podcastindex.org/). I chose this due to the lack of specific limits.

### Dependencies

- typescript
- react
- remix
- tailwindcss

### API Authentication

The Podcast Index API had some specific directions on authentication requirements. Instead of a single API key, they require a "User-Agent", "X-Auth-Key", "X-Auth-Date", and "Authorization". The "Authorization" header is a sha1 hash encoded as hex. The value being hashed is the `sha1(apiKey+apiSecret+unixTime)`.

```javascript
const API_BASE_URL = "https://api.podcastindex.org/api/1.0";

const request = (url: string) => {
  // Store the time as UNIX time. Divide by 1000, because JS uses milliseconds instead of seconds.
  const time = Math.round(new Date().getTime() / 1000);
  const auth: HeadersInit = {
    "User-Agent": "Podcastic/1.0", // Any value is sufficient here, this identifies the application
    "X-Auth-Key": process.env.PODCAST_INDEX_KEY, // The key provided by Podcast Index
    "X-Auth-Date": String(time),
    // Using the crypto library we can create a hash for our serialized value, and encode it as hex
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
```

- [UNIX Time](https://en.wikipedia.org/wiki/Unix_time)

## Development

The Netlify CLI starts your app in development mode, rebuilding assets on file changes.

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000), and you should be ready to go!

## Deployment

```sh
npm run build

netlify deploy

netlify deploy --prod
```