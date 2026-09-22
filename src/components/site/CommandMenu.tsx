import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Search,
  BookOpen,
  LayoutDashboard,
  BrainCircuit,
  GraduationCap,
  Briefcase,
  PlayCircle,
  FileText,
  User,
  HelpCircle,
  Code,
  Keyboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-full bg-surface/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64 border-border hover:bg-surface hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="hidden lg:inline-flex">Search anything...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Platform">
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/courses" }))}>
              <PlayCircle className="mr-2 h-4 w-4" />
              <span>Courses & Learning</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/practice" }))}>
              <Code className="mr-2 h-4 w-4" />
              <span>Practice & Quizzes</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/placement" }))}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Placement Prep</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/resources" }))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Notes & PYQs</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="EMO IQ (AI Tools)">
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/emoiq/doubt" }))}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Doubt Solver</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/emoiq/analyze" }))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Paper Analyzer</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/emoiq/predict" }))}>
              <BrainCircuit className="mr-2 h-4 w-4" />
              <span>Predict Next Question</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Personal Space">
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/dashboard" }))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/progress" }))}>
              <GraduationCap className="mr-2 h-4 w-4" />
              <span>My Progress</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/bookmarks" }))}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Bookmarks</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate({ to: "/profile" }))}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  document.dispatchEvent(new KeyboardEvent("keydown", { key: "?", bubbles: true }));
                })
              }
            >
              <Keyboard className="mr-2 h-4 w-4" />
              <span>Keyboard Shortcuts</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
