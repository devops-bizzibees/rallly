import { Button } from "@rallly/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@rallly/ui/dialog";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Trans } from "@/components/trans";
import { trpc } from "@/trpc/client";
import { usePostHog } from "@/utils/posthog";

export const DeletePollDialog: React.FunctionComponent<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  urlId: string;
}> = ({ open, onOpenChange, urlId }) => {
  const posthog = usePostHog();
  const queryClient = trpc.useUtils();
  const router = useRouter();
  const deletePoll = trpc.polls.delete.useMutation({
    onSuccess: () => {
      queryClient.polls.invalidate();
      posthog?.capture("deleted poll");
      onOpenChange(false);
      router.replace("/polls");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Trans i18nKey="deletePoll" />
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm">
          <Trans i18nKey="deletePollDescription" />
        </p>
        <DialogFooter>
          <Button
            onClick={() => {
              onOpenChange(false);
            }}
          >
            <Trans i18nKey="cancel" />
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deletePoll.mutate({ urlId });
            }}
            loading={deletePoll.isLoading}
          >
            <Trans i18nKey="delete" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
