import Link from "next/link";
import { ModeToggle } from "./toggle-mode";

export function CustomHeader() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur">
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center">
          <Link
            href="/"
            className="font-bold text-xl hover:opacity-80 transition-opacity"
          >
            App Polls
          </Link>
        </div>
        <div className="flex items-center">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
