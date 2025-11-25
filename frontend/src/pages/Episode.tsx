import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";

type EpisodeRating = {
  globalEpisodeAvgRating: string;
  friendsEpisodeAvgRating: string;
};

type FriendReview = {
  id: string;
  rating: string;
  comment: string;
  createdAt: string;
  username: string;
  firstName: string;
  lastName: string;
};

const API_URL_BASE = import.meta.env.VITE_API_URL;

function convertToCamelCase(data: Record<string, string>[]): FriendReview[] {
  return data.map((review) => {
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      username: review.username,
      firstName: review.first_name,
      lastName: review.last_name,
    };
  });
}

export default function Episode() {
  const podcastID = useParams().podcastID;
  const episodeNum = useParams().episodeNum;
  const { loggedIn, userID } = useContext(LoginContext);
  const [ratings, setRatings] = useState<EpisodeRating>({
    globalEpisodeAvgRating: "",
    friendsEpisodeAvgRating: "",
  });
  const [friendReviews, setFriendReviews] = useState<FriendReview[]>([]);

  useEffect(() => {
    if (!userID) return;

    async function fetchEpisodeRatings() {
      try {
        let response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/episodes/${episodeNum}/ratings`);
        let data = await response.json();
        setRatings((prevRatings) => ({ ...prevRatings, globalEpisodeAvgRating: data.global_episode_avg_rating }));
        if (loggedIn) {
          response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/episodes/${episodeNum}/ratings/${userID}`);
          data = await response.json();
          setRatings((prevRatings) => ({ ...prevRatings, friendsEpisodeAvgRating: data.friends_episode_avg_rating }));
        }
      } catch (error) {
        console.error("Failed to fetch episode ratings", error);
      }
    }

    async function fetchFriendReviews() {
      if (!loggedIn) return;
      try {
        const response = await fetch(
          `${API_URL_BASE}/podcasts/${podcastID}/episodes/${episodeNum}/reviews/${userID}/friends`
        );
        const data = await response.json();
        setFriendReviews(convertToCamelCase(data));
      } catch (error) {
        console.error("Failed to fetch user's friends episode review", error);
      }
    }

    fetchEpisodeRatings();
    fetchFriendReviews();
  }, [userID]);

  useEffect(() => {
    console.log(friendReviews);
  }, [ratings, friendReviews]);

  return (
    <>
      <div>global review: {ratings.globalEpisodeAvgRating}</div>
      {loggedIn && <div>friends review: {ratings.friendsEpisodeAvgRating}</div>}
      {/* {friendReviews.length > 0 && } */}
    </>
  );
}
