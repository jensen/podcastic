import { LoaderFunction, useLoaderData } from "remix";
import { json } from "remix";
import { show, episodes } from "../services/podcast";

import { removeHTML, removeNonBreakingSpace } from "../utils/sanitation";

import useAudio from "../hooks/useAudio";

import PlayButton from "../components/PlayButton";
import PauseButton from "../components/PauseButton";

interface IEpisode {
  id: number;
  title: string;
  description: string;
  enclosureUrl: string;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (params.id === undefined) {
    throw new Response("Must provide `id` param", {
      status: 401,
    });
  }

  const [podcast, eps] = await Promise.all([
    show(params.id),
    episodes(params.id),
  ]);

  podcast.feed.episodes = (eps.items as IEpisode[]).map((item) => ({
    ...item,
    description: removeHTML(removeNonBreakingSpace(item.description)),
  }));

  return json({
    show: podcast.feed,
  });
};

interface IEpisodeProps extends IEpisode {
  play: () => void;
  playing: boolean;
}

const Episode = ({ title, description, play, playing }: IEpisodeProps) => {
  return (
    <li className="py-2 flex">
      <div className="p-4 flex justify-center items-center" onClick={play}>
        {playing ? <PauseButton /> : <PlayButton />}
      </div>
      <div className="pl-2 pr-4">
        <h2 className="line-clamp-1">{title}</h2>
        <h3 className="line-clamp-3 text-xs text-gray-500">{description}</h3>
      </div>
    </li>
  );
};

interface IEpisodesProps {
  episodes: IEpisode[];
}

const Episodes = ({ episodes }: IEpisodesProps) => {
  const { toggle, playing } = useAudio();

  return (
    <ul>
      {episodes.map((episode) => (
        <Episode
          key={episode.id}
          {...episode}
          play={() => toggle(episode.enclosureUrl)}
          playing={playing(episode.enclosureUrl)}
        />
      ))}
    </ul>
  );
};

export default function Show() {
  const { show } = useLoaderData();

  return (
    <section className="flex flex-col items-center">
      <div className="sm:w-3/4 px-4 py-8">
        <a href={show.link}>
          <div className="relative">
            <span className="absolute right-4 bottom-[-1.2rem] bg-green-400 px-4 py-2 rounded-md font-bold shadow-md">
              {show.episodes.length}/{show.episodeCount} EPISODES
            </span>
            <img
              src={show.image}
              className="border-4 border-green-400 rounded-xl sm:w-1/2"
              alt=""
            />
          </div>
          <h2 className="mt-6 mb-2 text-4xl font-bold pr-4">{show.title}</h2>
          <h3 className="my-2 font-semibold text-xs text-green-400">
            {show.author}
          </h3>
        </a>
        <Episodes episodes={show.episodes} />
      </div>
    </section>
  );
}
