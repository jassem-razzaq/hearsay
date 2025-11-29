import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";
import SearchBar from "@/components/SearchBar";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import podcast from "../assets/minimalistMicrophone.jpg";
import dateFormat from "@/utils/dateFormat";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "@radix-ui/react-label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ActiveModal = "createReview" | "updateReview" | "episode" | null;

type PodcastInfo = {
  name: string;
  description: string;
  releaseDate: string;
  genres: string;
};

type PodcastRatings = {
  globalAvgRating: string;
  globalAvgRatingByEp: string;
  friendsAvgRating: string;
  friendsAvgRatingByEp: string;
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

type UserReview = {
  rating: string;
  comment: string;
  createdAt: string;
};

const API_URL_BASE = import.meta.env.VITE_API_URL;

export default function Podcast() {
  const podcastID = useParams().podcastID;
  const { loggedIn, userID, token } = useContext(LoginContext);
  const [podcastInfo, setPodcastInfo] = useState<PodcastInfo>({
    name: "",
    description: "",
    releaseDate: "",
    genres: "",
  });

  const [ratings, setRatings] = useState<PodcastRatings>({
    globalAvgRating: "",
    globalAvgRatingByEp: "",
    friendsAvgRating: "",
    friendsAvgRatingByEp: "",
  });

  const [friendReviews, setFriendReviews] = useState<FriendReview[]>([]);
  const [userReview, setUserReview] = useState<UserReview | null>(null);
  const [formReview, setFormReview] = useState<{
    rating: string;
    comment: string;
  }>({ rating: "", comment: "" });
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [genreList, setGenreList] = useState<string[]>([]);

  useEffect(() => {
    if (loggedIn) return;
    fetchPodcastInfo();
    fetchPodcastRatings();
    setRatings((prevRatings) => ({
      ...prevRatings,
      friendsAvgRating: "",
      friendsAvgRatingByEp: "",
    }));
    setUserReview(null);
    setFriendReviews([]);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;

    async function getUserPodcastReview() {
      if (!loggedIn) return;
      try {
        const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/reviews/${userID}`);
        const data: UserReview = await response.json();
        if (data) {
          setFormReview({ rating: data.rating, comment: data.comment });
          setUserReview(data);
        }
      } catch (error) {
        console.log("Failed to fetch user's podcast review", error);
      }
    }

    async function fetchFriendReviews() {
      if (!loggedIn) return;
      try {
        const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/reviews/${userID}/friends`);
        const data = await response.json();
        setFriendReviews(data);
      } catch (error) {
        console.log("Failed to fetch user's friends podcast reviews", error);
      }
    }

    fetchPodcastInfo();
    fetchPodcastRatings();
    fetchFriendReviews();
    getUserPodcastReview();
  }, [loggedIn]);

  async function fetchPodcastInfo() {
    try {
      const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}`);
      const data = await response.json();
      setPodcastInfo(data);
    } catch (error) {
      console.log(`Failed to fetch podcast info`, error);
    }
  }

  async function fetchPodcastRatings() {
    try {
      let response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/ratings`);
      let data: PodcastRatings = await response.json();
      setRatings((prevRatings) => ({
        ...prevRatings,
        globalAvgRating: data.globalAvgRating,
        globalAvgRatingByEp: data.globalAvgRatingByEp,
      }));
      if (loggedIn) {
        response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/ratings/${userID}/friends`);
        data = await response.json();
        setRatings((prevRatings) => ({
          ...prevRatings,
          friendsAvgRating: data.friendsAvgRating,
          friendsAvgRatingByEp: data.friendsAvgRatingByEp,
        }));
      }
    } catch (error) {
      console.log(`Failed to fetch podcast ratings`, error);
    }
  }

  async function handleCreateReview(e: React.FormEvent) {
    e.preventDefault();
    if (!formReview.rating) {
      alert("Every review needs a rating!");
      return;
    }

    try {
      const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/reviews/${userID}`, {
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
        alert(data.detail);
        return;
      }
      setActiveModal(null);
      setUserReview({
        rating: formReview.rating,
        comment: formReview.comment,
        createdAt: Date.now().toString(),
      });
      fetchPodcastRatings();
    } catch (error) {
      console.log("Failed to insert the user's podcast review", error);
    }
  }

  async function handleUpdateReview(e: React.FormEvent) {
    e.preventDefault();
    if (!formReview.rating) {
      alert("Every review needs a rating!");
      return;
    }
    try {
      const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/reviews/${userID}`, {
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
        alert(data.detail);
        return;
      }
      setActiveModal(null);
      setUserReview({
        rating: formReview.rating,
        comment: formReview.comment,
        createdAt: Date.now().toString(),
      });
      fetchPodcastRatings();
    } catch (error) {
      console.log("Failed to update user's podcast review", error);
    }
  }

  async function handleDeleteReview() {
    try {
      const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/reviews/${userID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.detail);
      }
      setActiveModal(null);
      setUserReview(null);
      setFormReview({ rating: "", comment: "" });
    } catch (error) {
      console.log("Failed to delete the user's podcast review", error);
    }
  }

  useEffect(() => {
    setGenreList(podcastInfo.genres.split(","));
  }, [podcastInfo]);

  return (
    <>
      {/* Hero */}
      <Card className="bg-linear-to-br from-fuchsia-300 to-purple-800 p-6 rounded-sm mt-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="flex flex-col justify-end gap-3">
            <CardHeader className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              {podcastInfo.name}
            </CardHeader>
            <CardContent className="text-gray-700 text-lg md:text-xl">{podcastInfo.description}</CardContent>
            <CardFooter className="flex flex-row justify-between items-center">
              <span className="text-gray-700 text-sm">Released: {dateFormat(podcastInfo.releaseDate)}</span>
              <div className="flex flex-row gap-1">
                {genreList &&
                  genreList.map((genre) => (
                    <Button className="text-sm px-3 py-1 rounded-full bg-purple-300 text-purple-800 hover:bg-purple-300 hover:text-purple-800 hover:scale-98 duration-150">
                      {genre}
                    </Button>
                  ))}
              </div>
            </CardFooter>
          </div>
          <div className="h-80">
            <img
              src={podcast}
              alt={podcastInfo.name}
              className="w-full h-full object-cover rounded-sm shadow-lg hover:scale-98 duration-300"
            />
          </div>
        </div>
      </Card>

      {/* Ratings */}
      <Card className="flex flex-col bg-background border-none shadow-none px-5">
        <div className="flex flex-row justify-between">
          <CardTitle className="text-xl font-bold">Ratings</CardTitle>
          <Button>Review</Button>
        </div>
        <CardContent className="flex flex-row flex-wrap justify-evenly gap-5">
          <div className="shrink-0">
            <Card className="p-3 w-40 h-36 items-center justify-center text-center bg-background hover:scale-98 duration-150">
              <CardTitle className="font-medium">Average Rating</CardTitle>
              <CardContent className="flex flex-row gap-1 justify-center items-center">
                <p>{ratings.globalAvgRating}</p>
                <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
              </CardContent>
            </Card>
          </div>
          <div className="shrink-0">
            <Card className="p-3 w-40 h-36 items-center justify-center text-center bg-background hover:scale-98 duration-150">
              <CardTitle className="font-medium">Average Episode Rating</CardTitle>
              <CardContent className="flex flex-row gap-1 justify-center items-center">
                <p>{ratings.globalAvgRatingByEp}</p>
                <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="p-3 w-40 h-36 items-center justify-center text-center bg-background hover:scale-98 duration-150">
              <CardTitle className="font-medium">What your friends think</CardTitle>
              <CardContent className="flex flex-row gap-1 justify-center items-center">
                <p>{ratings.friendsAvgRating}</p>
                <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="p-3 w-40 h-36 items-center justify-center text-center bg-background hover:scale-98 duration-150">
              <CardTitle className="font-medium">How your friends rate each episode</CardTitle>
              <CardContent className="flex flex-row gap-1 justify-center items-center">
                <p>{ratings.friendsAvgRatingByEp}</p>
                <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {loggedIn && userReview ? (
        <button onClick={() => setActiveModal("updateReview")}>Update review</button>
      ) : (
        <button disabled={!loggedIn} onClick={() => setActiveModal("createReview")}>
          Review
        </button>
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
      <SearchBar
        searchType="episodes"
        onSearch={async (searchFilters) => {
          const params = new URLSearchParams();
          Object.entries(searchFilters).forEach(([filter, value]) => {
            if (value) params.append(filter, value);
          });
          const response = await fetch(`${API_URL_BASE}/podcasts/${podcastID}/episodes?${params.toString()}`);
          const data = await response.json();
          console.log(data);
        }}
        podcastID={podcastID}
      ></SearchBar>
      <div className="mb-1000"></div>
    </>
  );
}
