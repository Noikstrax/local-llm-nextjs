import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui";
import { ProfileSettings } from "../ui/profile/profile-settings";
import { LogOut } from "lucide-react";
import { Logo } from "../ui/icons/logo";

export const UserAuth = () => {
  const { data: session } = useSession();
  const firstLetterFromName = session?.user.name.split("")[0];
  return (
    <div className="flex justify-between max-w-full items-center">
      {!session ? (
        <>
          <Link href={"/login"}>Login</Link>
        </>
      ) : (
        <>
          <div>
            <Logo text={firstLetterFromName ?? ""} />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <ProfileSettings />
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
