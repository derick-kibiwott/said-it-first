import { Sparkles, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { Dispatch, SetStateAction } from "react";

export type NavbarProps = {
  setIsAddDialogOpen: Dispatch<SetStateAction<boolean>>;
};
export function Navbar({ setIsAddDialogOpen }: NavbarProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto gap-2 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
            <Sparkles className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
              Said it first
            </h1>
            <p className="text-sm text-muted-foreground line-clamp-1">
              Capture wisdom, one quote at a time
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Button onClick={() => setIsAddDialogOpen(true)} size="default">
            <Plus />
            Add Quote
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
