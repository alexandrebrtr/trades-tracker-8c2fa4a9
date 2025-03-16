
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, ThumbsUp, Eye, Filter, Clock, TrendingUp, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";

// Définition du type pour les sujets de forum
interface ForumTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  views: number;
  replies_count: number;
  likes_count: number;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
  author?: string;
  authorAvatar?: string;
  date?: string;
  hot?: boolean;
}

const forumCategories = [
  { id: 'all', name: 'Tous' },
  { id: 'strategies', name: 'Stratégies' },
  { id: 'analysis', name: 'Analyses de marché' },
  { id: 'psychology', name: 'Psychologie' },
  { id: 'tools', name: 'Outils & Technologies' }
];

export function CommunityForums() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [forumTopics, setForumTopics] = useState<ForumTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    category: 'strategies',
    description: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    fetchForumTopics();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'forum_topics' }, 
        () => {
          fetchForumTopics();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchForumTopics = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('forum_topics')
        .select(`
          *,
          profiles:user_id (username, avatar_url)
        `);
      
      if (error) {
        throw error;
      }
      
      // Process the data to match our component's expected format
      const processedTopics: ForumTopic[] = data?.map(topic => ({
        id: topic.id,
        title: topic.title,
        category: topic.category,
        author: topic.profiles?.username || 'Utilisateur anonyme',
        authorAvatar: topic.profiles?.avatar_url || '',
        date: topic.created_at,
        views: topic.views || 0,
        replies_count: topic.replies_count || 0,
        likes_count: topic.likes_count || 0,
        hot: (topic.views || 0) > 300 || (topic.replies_count || 0) > 20,
        description: topic.description,
        created_at: topic.created_at,
        user_id: topic.user_id
      })) || [];
      
      setForumTopics(processedTopics);
    } catch (error) {
      console.error("Erreur lors de la récupération des forums:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTopic = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer un sujet.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newTopic.title.trim() || !newTopic.category || !newTopic.description.trim()) {
      toast({
        title: "Informations incomplètes",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('forum_topics')
        .insert({
          title: newTopic.title,
          category: newTopic.category,
          description: newTopic.description,
          user_id: user.id
        });
      
      if (error) throw error;
      
      toast({
        title: "Sujet créé",
        description: "Votre nouveau sujet a été créé avec succès."
      });
      
      // Reset form and close dialog
      setNewTopic({
        title: '',
        category: 'strategies',
        description: ''
      });
      setDialogOpen(false);
      
      // Refresh topics
      fetchForumTopics();
    } catch (error) {
      console.error("Erreur lors de la création du sujet:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du sujet.",
        variant: "destructive"
      });
    }
  };
  
  const filteredTopics = forumTopics
    .filter(topic => 
      selectedCategory === 'all' || topic.category === selectedCategory
    )
    .filter(topic => 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
      } else if (sortBy === 'popular') {
        return b.views - a.views;
      } else {
        return (b.likes_count + b.replies_count) - (a.likes_count + a.replies_count);
      }
    });
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Rechercher un sujet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
          
          <Tabs value={sortBy} onValueChange={setSortBy} className="space-y-0">
            <TabsList>
              <TabsTrigger value="latest" className="flex gap-1 text-xs items-center">
                <Clock className="h-3 w-3" />
                Récents
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex gap-1 text-xs items-center">
                <Eye className="h-3 w-3" />
                Populaires
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex gap-1 text-xs items-center">
                <TrendingUp className="h-3 w-3" />
                Tendances
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Catégories</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {forumCategories.map((category) => (
                <Button 
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-muted rounded-lg">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
            <p className="mt-2 text-muted-foreground">Aucune discussion trouvée pour cette catégorie.</p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <Card key={topic.id} className={topic.hot ? "border-primary/30 bg-primary/5" : ""}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg line-clamp-1 hover:text-primary cursor-pointer">
                      {topic.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-xs py-0.5 px-2 bg-secondary rounded-full">
                        {forumCategories.find(c => c.id === topic.category)?.name}
                      </div>
                      {topic.hot && (
                        <div className="text-xs py-0.5 px-2 bg-primary/20 text-primary rounded-full">
                          Populaire
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 pt-0">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={topic.authorAvatar} alt={topic.author} />
                    <AvatarFallback className="text-xs">
                      {topic.author?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{topic.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(topic.date || '').toLocaleDateString('fr-FR', { 
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{topic.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{topic.replies_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{topic.likes_count}</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost">Lire</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <div className="flex justify-center mt-6">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex gap-2">
              <Plus className="w-4 h-4" />
              <span>Créer une nouvelle discussion</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle discussion</DialogTitle>
              <DialogDescription>
                Partagez vos idées ou posez vos questions à la communauté.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  placeholder="Titre de votre discussion"
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={newTopic.category}
                  onValueChange={(value) => setNewTopic({...newTopic, category: value})}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {forumCategories.filter(c => c.id !== 'all').map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Détaillez votre sujet de discussion..."
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                  rows={5}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button onClick={handleCreateTopic}>Publier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
