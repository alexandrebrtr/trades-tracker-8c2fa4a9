
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useContactMessages, ContactMessage } from '@/hooks/useContactMessages';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Check, X, Send, Trash2, Mail, Eye } from 'lucide-react';

export function ContactMessages() {
  const { messages, loading, markAsRead, respondToMessage, deleteMessage } = useContactMessages();
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [responding, setResponding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleRespondToMessage = async (id: string) => {
    if (!responseText.trim()) return;
    
    setResponding(true);
    try {
      await respondToMessage(id, responseText);
      setOpenMessageId(null);
      setResponseText('');
    } finally {
      setResponding(false);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    await deleteMessage(id);
    setConfirmDelete(null);
  };

  const getCurrentMessage = () => {
    if (!openMessageId) return null;
    return messages.find(m => m.id === openMessageId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterMessages = () => {
    if (activeTab === 'all') return messages;
    if (activeTab === 'unread') return messages.filter(msg => !msg.read);
    if (activeTab === 'responded') return messages.filter(msg => msg.response);
    if (activeTab === 'pending') return messages.filter(msg => !msg.response);
    return messages;
  };

  const filteredMessages = filterMessages();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement des messages...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Messages de contact</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Aucun message de contact pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Messages de contact</span>
            <Badge variant="outline" className="ml-2">
              {messages.length} messages
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                Tous
                <Badge variant="outline" className="ml-2 bg-slate-100">{messages.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Non lus
                <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">{messages.filter(m => !m.read).length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                En attente
                <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800">{messages.filter(m => !m.response).length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="responded">
                Répondus
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">{messages.filter(m => m.response).length}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <Card key={message.id} className="overflow-hidden">
                  <CardHeader className={`${!message.read ? 'bg-blue-50/50' : 'bg-muted/50'} py-3 px-4`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {!message.read && <Badge variant="default" className="bg-blue-500">Nouveau</Badge>}
                          {message.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {message.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8"
                          onClick={() => {
                            if (!message.read) markAsRead(message.id);
                            setOpenMessageId(message.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8"
                          onClick={() => setConfirmDelete(message.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-3 px-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-muted-foreground">
                        {formatDate(message.created_at)}
                      </p>
                      {message.response ? (
                        <Badge className="bg-green-500">Répondu</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                          En attente
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm line-clamp-2">
                      {message.message}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucun message ne correspond à ce filtre.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={!!openMessageId} onOpenChange={(open) => !open && setOpenMessageId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message de {getCurrentMessage()?.name}</DialogTitle>
            <DialogDescription>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {getCurrentMessage()?.email}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div>
              <h4 className="text-sm font-medium mb-1">Message reçu le {getCurrentMessage() && formatDate(getCurrentMessage()!.created_at)}</h4>
              <div className="bg-muted/30 p-4 rounded-md whitespace-pre-wrap">
                {getCurrentMessage()?.message}
              </div>
            </div>

            {getCurrentMessage()?.response && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-1">Votre réponse</h4>
                  <div className="bg-muted/30 p-4 rounded-md whitespace-pre-wrap">
                    {getCurrentMessage()?.response}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Envoyée le {getCurrentMessage()?.response_at && formatDate(getCurrentMessage()?.response_at)}
                  </p>
                </div>
              </>
            )}

            {!getCurrentMessage()?.response && (
              <>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-1">Répondre</h4>
                  <Textarea 
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Votre réponse..."
                    rows={5}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpenMessageId(null)}>
              Fermer
            </Button>
            
            {!getCurrentMessage()?.response && (
              <Button 
                onClick={() => openMessageId && handleRespondToMessage(openMessageId)}
                disabled={responding || !responseText.trim()}
              >
                {responding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer la réponse
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => confirmDelete && handleConfirmDelete(confirmDelete)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
