import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui";

interface Props {
  onClickSignIn?: () => void;
}

export const ProfileButton = ({ onClickSignIn }: Props) => {
  const { data: session } = useSession();
  return (
    <div>
      {!session ? (
        <>
          <Link href={"/login"}>Login</Link>
        </>
      ) : (
        <>
          <div>Logged</div>
          <Button variant="outline" onClick={() => signOut()}>
            Logout
          </Button>
        </>
      )}
    </div>
  );
};
