type PodcastCardProps = {
  podcast_id: string;
  name: string;
  description: string;
  release_date: string;
  genres: string;
};

export default function PodcastCard({ podcast_id, name, description, release_date, genres }: PodcastCardProps) {
  return <div className="bg-green-300">{name}</div>;
}
