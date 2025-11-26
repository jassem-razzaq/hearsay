type BaseReviewProps = {
  username: string;
  podcastName: string;
  rating: string;
  comment: string;
  createdAt: string;
  onClick: () => void;
};

type PodcastReviewProps = BaseReviewProps & {
  type: "podcast";
};

type EpisodeReviewProps = BaseReviewProps & {
  type: "episode";
  episodeNum: string;
};

type ReviewCardProps = {
  review: PodcastReviewProps | EpisodeReviewProps;
};

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <>
      <div className="bg-green-300 cursor-pointer" onClick={() => review.onClick()}>
        {review.podcastName}
        {review.type === "episode" && review.episodeNum}
        Rating: {review.rating}
      </div>
      <div>
        {review.username}
        <li>{review.comment}</li>
        <li>{review.createdAt}</li>
      </div>
    </>
  );
}
