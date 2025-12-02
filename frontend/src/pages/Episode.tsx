import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";
import ReviewCard from "../components/ReviewCard";
import PlaylistCard from "../components/PlaylistCard";
import { toast } from "sonner";

type ActiveModal = "createReview" | "updateReview" | "playlists" | null;

type EpisodeRating = {
  globalAvgRating: string;
  friendsAvgRating: string;
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

type EpisodeInfo = {
  episodeNum: string;
  name: string;
  description: string;
  duration: string;
  releaseDate: string;
  podcastId: string;
};

type Playlist = {
  userId: string;
  name: string;
  description: string;
};

type UserReview = {
  rating: string;
  comment: string;
  createdAt: string;
};

const API_URL_BASE = import.meta.env.VITE_API_URL;

export default function Episode() {
  const podcastID = useParams().podcastID;
  const episodeNum = useParams().episodeNum;
  const { loggedIn, userID, token } = useContext(LoginContext);
  const [episodeInfo, setEpisodeInfo] = useState<EpisodeInfo>({
    episodeNum: "",
    description: "",
    duration: "",
    name: "",
    releaseDate: "",
    podcastId: "",
  });
  const [ratings, setRatings] = useState<EpisodeRating>({
    globalAvgRating: "",
    friendsAvgRating: "",
  });
  const [friendReviews, setFriendReviews] = useState<FriendReview[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [userReview, setUserReview] = useState<UserReview | null>(null);
  const [formReview, setFormReview] = useState<Record<string, string>>({
    rating: "",
    comment: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) return;
    fetchEpisodeInfo();
    fetchEpisodeRatings();
    setRatings((prevRatings) => ({
      ...prevRatings,
      friendsAvgRating: "",
    }));
    setUserReview(null);
    setFriendReviews([]);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;

    async function fetchFriendReviews() {
      if (!loggedIn) return;
      try {
        const response = await fetch(
          `${API_URL_BASE}/podcasts/${podcastID}/episodes/${episodeNum}/reviews/${userID}/friends`
        );
        const data = await response.json();
        setFriendReviews(data);
      } catch (error) {
        console.error("Failed to fetch user's friends episode review", error);
      }
    }

    async function fetchUserReview() {
      if (!loggedIn) return;
      try {
        const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/episodes/${episodeNum}/reviews/${userID}`);
        const data: UserReview = await response.json();
        if (data) {
          setFormReview({ rating: data.rating, comment: data.comment });
          setUserReview(data);
        }
      } catch (error) {
        console.log("Failed to fetch user's episode review", error);
      }
    }

    fetchEpisodeInfo();
    fetchEpisodeRatings();
    fetchFriendReviews();
    fetchUserReview();
  }, [loggedIn]);

  async function fetchEpisodeInfo() {
    try {
      const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/episodes/${episodeNum}`);
      const data = await response.json();
      setEpisodeInfo(data);
    } catch (error) {
      console.error("Failed to fetch episode info", error);
    }
  }

  async function fetchEpisodeRatings() {
    try {
      let response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/episodes/${episodeNum}/ratings`);
      let data = await response.json();
      setRatings((prevRatings) => ({
        ...prevRatings,
        globalAvgRating: data.globalEpisodeAvgRating,
      }));
      if (loggedIn) {
        response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/episodes/${episodeNum}/ratings/${userID}`);
        data = await response.json();
        setRatings((prevRatings) => ({
          ...prevRatings,
          friendsAvgRating: data.friendsEpisodeAvgRating,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch episode ratings", error);
    }
  }

  // useEffect(() => {
  //   console.log(friendReviews);
  // }, [ratings, friendReviews]);

  async function handleCreateReview(e: React.FormEvent) {
    e.preventDefault();
    if (!formReview.rating) {
      toast.error("Every review needs a rating!");
      return;
    }

    try {
      const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/episodes/${episodeNum}/reviews/${userID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: formReview.rating,
          comment: formReview.comment,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail);
        return;
      }
      setActiveModal(null);
      setUserReview({
        rating: formReview.rating,
        comment: formReview.comment,
        createdAt: Date.now().toString(),
      });
      fetchEpisodeRatings();
    } catch (error) {
      console.log("Failed to insert the user's episode review", error);
    }
  }

  async function handleUpdateReview(e: React.FormEvent) {
    e.preventDefault();
    if (!formReview.rating) {
      toast.error("Every review needs a rating!");
      return;
    }
    try {
      const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/episodes/${episodeNum}/reviews/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: formReview.rating,
          comment: formReview.comment,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail);
        return;
      }
      setActiveModal(null);
      setUserReview({
        rating: formReview.rating,
        comment: formReview.comment,
        createdAt: new Date().toISOString().split("T")[0],
      });
      fetchEpisodeRatings();
    } catch (error) {
      console.log("Failed to update user's podcast review", error);
    }
  }

  async function handleDeleteReview() {
    try {
      const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/episodes/${episodeNum}/reviews/${userID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail);
      }
      setActiveModal(null);
      setUserReview(null);
      setFormReview({ rating: "", comment: "" });
    } catch (error) {
      console.log("Failed to delete the user's podcast review", error);
    }
  }

  async function handlePlaylistSearch() {
    try {
      const response = await fetch(`${API_URL_BASE}/users/${userID}/playlists`);
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error("Failed to get playlists", error);
    }
  }

  async function handleAddToPlaylist(playlistName: string) {
    try {
      const response = await fetch(`${API_URL_BASE}/users/${userID}/playlists/${playlistName}/episodes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          podcast_id: podcastID,
          episode_num: episodeNum,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.detail);
        return;
      }
    } catch (error) {
      console.error("Failed to add episode to playlist", error);
    }
  }

  return (
    <>
      <div>global review: {ratings.globalAvgRating}</div>
      {loggedIn && <div>friends review: {ratings.friendsAvgRating}</div>}
      {loggedIn && userReview ? (
        <button onClick={() => setActiveModal("updateReview")}>Update review</button>
      ) : (
        <button disabled={!loggedIn} onClick={() => setActiveModal("createReview")}>
          Review
        </button>
      )}
      <button
        className="cursor-pointer"
        disabled={!loggedIn}
        onClick={() => {
          handlePlaylistSearch();
          setActiveModal(activeModal !== "playlists" ? "playlists" : null);
        }}
      >
        Add to playlist
      </button>
      {loggedIn && friendReviews.length > 0 ? (
        friendReviews.map((review) => (
          // <ReviewCard
          //   review={{
          //     type: "podcast",
          //     username: review.username,
          //     podcastName: "",
          //     rating: review.rating,
          //     comment: review.comment,
          //     createdAt: review.createdAt,
          //     onClick: () => navigate(`/users/${review.id}`),
          //   }}
          // ></ReviewCard>
          <div></div>
        ))
      ) : (
        <h1>Create an account to see friend reviews</h1>
      )}

      {activeModal === "createReview" && (
        <div className="fixed bg-purple-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <form className="flex flex-col" onSubmit={(e) => handleCreateReview(e)}>
            <label>Rating</label>
            <input type="number" onChange={(e) => setFormReview({ ...formReview, rating: e.target.value })}></input>
            <label>Comment</label>
            <input type="text" onChange={(e) => setFormReview({ ...formReview, comment: e.target.value })}></input>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {activeModal === "updateReview" && (
        <div className="fixed bg-purple-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div>Written on {userReview?.createdAt}</div>
          <form className="flex flex-col" onSubmit={(e) => handleUpdateReview(e)}>
            <label>Rating</label>
            <input
              type="number"
              value={formReview.rating}
              onChange={(e) => setFormReview({ ...formReview, rating: e.target.value })}
            ></input>
            <label>Comment</label>
            <input
              type="text"
              value={formReview.comment}
              onChange={(e) => setFormReview({ ...formReview, comment: e.target.value })}
            ></input>
            <button type="submit">Update</button>
            <button type="button" onClick={handleDeleteReview}>
              Delete review
            </button>
          </form>
        </div>
      )}

      {activeModal === "playlists" && (
        <div className="fixed bg-purple-300 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex justify-center">Your playlists</div>
          {playlists.length > 0 &&
            playlists.map((playlist) => (
              <div className="flex bg-blue-200">
                <PlaylistCard
                  name={playlist.name}
                  description={playlist.description ? playlist.description : "No description provided"}
                  onClick={() => {}}
                  onDelete={() => {}}
                ></PlaylistCard>
                <button className="cursor-pointer" onClick={() => handleAddToPlaylist(playlist.name)}>
                  Add
                </button>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
