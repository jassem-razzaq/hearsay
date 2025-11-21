type UserCardProps = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
};

export default function UserCard({ id, username, first_name, last_name, bio }: UserCardProps) {
  return <div className="bg-green-200">{username}</div>;
}
