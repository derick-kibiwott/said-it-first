import { ArrowUpRightIcon, Plus, Quote } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { NavbarProps } from "../navbar";

export function QuoteEmptyState({ setIsAddDialogOpen }: NavbarProps) {
  return (
    <Empty className="border border-border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Quote />
        </EmptyMedia>
        <EmptyTitle>No Quotes Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any quotes. Get started by creating your
          first quote.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus /> Create Quote
        </Button>
      </EmptyContent>
    </Empty>
  );
}
