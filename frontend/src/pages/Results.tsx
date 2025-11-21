import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PodcastCard from "../components/PodcastCard";
const API_URL_BASE = import.meta.env.VITE_API_URL;

type PodcastResults = {
  podcast_id: string;
  name: string;
  description: string;
  release_date: string;
  genres: string;
};

type UserResults = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
};

export default function Results() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchType = params.get("type");
  params.delete("type");
  const [results, setResults] = useState<PodcastResults[] | UserResults[]>([]);

  useEffect(() => {
    async function fetchResults() {
      let url = "";
      if (searchType === "podcasts") {
        url = `${API_URL_BASE}/podcasts?${params.toString()}`;
      } else {
        const username = params.get("name");
        if (!username) {
          url = `${API_URL_BASE}/users/all`;
        } else {
          url = `${API_URL_BASE}/users/username/${username}`;
        }
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch search results", error);
      }
    }
    fetchResults();
  }, [location.search]);

  return (
    <div>
      {searchType === "podcasts" &&
        (results as PodcastResults[]).map((podcast) => (
          <PodcastCard
            key={podcast.podcast_id}
            podcast_id={podcast.podcast_id}
            name={podcast.name}
            description={podcast.description}
            release_date={podcast.release_date}
            genres={podcast.genres}
          />
        ))}
    </div>
  );
}
