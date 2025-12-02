import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import minimalistAvatarM from "../assets/minimalistAvatarM.jpg";

type UserCardProps = {
  username: string;
  bio: string;
  onClick: () => void;
};

export default function UserCard({ username, bio, onClick }: UserCardProps) {
  return (
    <div className="flex w-full mx-auto flex-col gap-6">
      <Item
        variant="outline"
        className="cursor-pointer hover:scale-102 duration-150 active:scale-98"
        onClick={onClick}
      >
        <ItemMedia>
          <Avatar className="size-10">
            <AvatarImage src={minimalistAvatarM} />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{username}</ItemTitle>
          <ItemDescription className="break-all">{bio}</ItemDescription>
        </ItemContent>
        <ItemActions></ItemActions>
      </Item>
    </div>
  );
}
