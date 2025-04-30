
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

interface JournalDeleteAllDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirmDelete: () => Promise<void>;
  isDeleting: boolean;
}

export function JournalDeleteAllDialog({
  isOpen,
  setIsOpen,
  onConfirmDelete,
  isDeleting,
}: JournalDeleteAllDialogProps) {
  const { t } = useLanguage();
  const [confirmText, setConfirmText] = useState("");
  const isConfirmEnabled = confirmText === "DELETE";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t("journal.deleteAllTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("journal.deleteAllDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm font-medium text-destructive">
            {t("journal.deleteAllWarning")}
          </p>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {t("journal.confirmDeleteAll", { confirmText: "DELETE" })}
            </p>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="border-destructive/50 focus-visible:ring-destructive/50"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirmDelete}
            disabled={!isConfirmEnabled || isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("journal.confirmDelete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
