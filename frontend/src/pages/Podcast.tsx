import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API_URL_BASE = import.meta.env.VITE_API_URL;

export default function Podcast() {
  const token = localStorage.getItem("jwt");
  if (token) {
    const decoded = jwtDecode(token);
    console.log(decoded);
  }
  const podcastID = useParams().podcastID;

  useEffect(() => {
    async function fetchPodcastInfo() {
      const response: Response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/ratings`);
    }
    fetchPodcastInfo();
  }, []);
  return <h1>podcast page</h1>;
}
