import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui";
import { ProfileButton } from "./profile-button";

export const UserAuth = () => {
  const { data: session } = useSession();
  console.log(session, 999);
  return (
    <div>
      <ProfileButton />
    </div>
  );
};
