import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui";
import { ProfileSettings } from "../ui/profile/profile-settings";

export const UserAuth = () => {
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
          <ProfileSettings />
          <Button variant="outline" onClick={() => signOut()}>
            Logout
          </Button>
        </>
      )}
    </div>
  );
};
