"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function CollapsibleSettingsCard({
  title,
  description,
  children,
  danger = false,
}: {
  title: string;
  description: string;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <Card
      className={cn(
        "gap-0 py-0",
        danger &&
          "border-red-300 ring-red-200 dark:border-red-900 dark:ring-red-950",
      )}
    >
      <Collapsible>
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl p-4 text-left outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none [&[aria-expanded=true]>svg]:rotate-180">
          <span className="min-w-0">
            <span
              className={cn(
                "block font-heading text-base font-medium leading-snug",
                danger && "text-red-900 dark:text-red-200",
              )}
            >
              {title}
            </span>
            <span
              className={cn(
                "mt-1 block text-sm text-muted-foreground",
                danger && "text-red-800 dark:text-red-300",
              )}
            >
              {description}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "size-5 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
              danger && "text-red-700 dark:text-red-300",
            )}
            aria-hidden="true"
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-5 border-t py-4">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
