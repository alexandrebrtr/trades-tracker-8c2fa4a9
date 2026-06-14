import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Plus, MessageSquare, Trash2, Brain } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onOpenMemory: () => void;
}

export function ConversationSidebar({ conversations, activeId, onSelect, onNew, onDelete, onOpenMemory }: Props) {
  return (
    <div className="flex h-full w-full flex-col gap-3">
      <Button onClick={onNew} className="w-full justify-start gap-2">
        <Plus className="h-4 w-4" />
        Nouvelle conversation
      </Button>

      <ScrollArea className="flex-1 -mr-2 pr-2">
        <div className="space-y-1">
          {conversations.length === 0 && (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">
              Aucune conversation pour le moment.
            </p>
          )}
          {conversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                "group flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                activeId === c.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
              )}
            >
              <button
                onClick={() => onSelect(c.id)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{c.title}</span>
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    aria-label="Supprimer la conversation"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer cette conversation ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est irréversible. Tous les messages de cette discussion seront supprimés.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(c.id)}>Supprimer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button variant="outline" onClick={onOpenMemory} className="w-full justify-start gap-2">
        <Brain className="h-4 w-4" />
        Mémoire de l'IA
      </Button>
    </div>
  );
}
