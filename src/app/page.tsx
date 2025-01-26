import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-4">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <ThemeToggle />
        <UserButton />
        <SignOutButton />
      </SignedIn>
    </div>
  );
}
