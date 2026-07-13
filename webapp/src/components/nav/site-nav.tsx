"use client";

import * as React from "react";
import { Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/nav/theme-toggle";
import { CommandMenu } from "@/components/nav/command-menu";
import { NAV_ITEMS } from "@/components/nav/nav-items";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const [active, setActive] = React.useState<string>(NAV_ITEMS[0].id);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <a href="#samenvatting" className="flex shrink-0 items-center gap-2 font-semibold">
          <Zap className="h-5 w-5 text-primary" />
          <span className="hidden sm:inline">EV-Laadmarkt Dashboard</span>
        </a>

        <ScrollArea className="hidden max-w-[52vw] flex-1 lg:block">
          <nav className="flex gap-1 px-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                  active === item.id && "bg-accent font-medium text-foreground"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </ScrollArea>

        <div className="flex items-center gap-2">
          <CommandMenu />
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Inhoudsopgave</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
