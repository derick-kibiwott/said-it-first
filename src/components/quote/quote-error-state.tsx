import { AlertCircle, ArrowUpRightIcon, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function QuotesErrorState({ message }: { message: string }) {
  return (
    <Empty className="border border-border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle />
        </EmptyMedia>
        <EmptyTitle>An error occurred while fetching the quotes</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>
            <RefreshCw />
            Retry
          </Button>
          <Button variant="outline">Contact Support</Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
