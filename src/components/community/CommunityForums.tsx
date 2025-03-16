
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, ThumbsUp, Eye, Filter, Clock, TrendingUp } from 'lucide-react';

const forumCategories = [
  { id: 'all', name: 'Tous' },
  { id: 'strategies', name: 'Stratégies' },
  { id: 'analysis', name: 'Analyses de marché' },
  { id: 'psychology', name: 'Psychologie' },
  { id: 'tools', name: 'Outils & Technologies' }
];

const forumTopics = [
  {
    id: 1,
    title: 'Stratégie de trading sur les indices US',
    category: 'strategies',
    author: 'Jean Dupont',
    authorAvatar: '',
    date: '2024-05-15',
    views: 342,
    replies: 28,
    likes: 56,
    hot: true
  },
  {
    id: 2,
    title: 'Analyse fondamentale des cryptomonnaies',
    category: 'analysis',
    author: 'Marie Martin',
    authorAvatar: '',
    date: '2024-05-14',
    views: 189,
    replies: 15,
    likes: 32
  },
  {
    id: 3,
    title: 'Comment gérer le stress pendant les périodes volatiles',
    category: 'psychology',
    author: 'Sophie Bernard',
    authorAvatar: '',
    date: '2024-05-12',
    views: 412,
    replies: 45,
    likes: 87,
    hot: true
  },
  {
    id: 4,
    title: 'Les meilleurs indicateurs pour le day trading',
    category: 'tools',
    author: 'Thomas Leroy',
    authorAvatar: '',
    date: '2024-05-10',
    views: 276,
    replies: 19,
    likes: 41
  },
  {
    id: 5,
    title: 'Analyse technique: Crypto vs Actions',
    category: 'analysis',
    author: 'Laura Klein',
    authorAvatar: '',
    date: '2024-05-08',
    views: 198,
    replies: 23,
    likes: 37
  }
];

export function CommunityForums() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  
  const filteredTopics = forumTopics
    .filter(topic => 
      selectedCategory === 'all' || topic.category === selectedCategory
    )
    .filter(topic => 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'popular') {
        return b.views - a.views;
      } else {
        return (b.likes + b.replies) - (a.likes + a.replies);
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
        
        {filteredTopics.map((topic) => (
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
                    {topic.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{topic.author}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(topic.date).toLocaleDateString('fr-FR', { 
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
                  <span>{topic.replies}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{topic.likes}</span>
                </div>
              </div>
              <Button size="sm" variant="ghost">Lire</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Button className="flex gap-2">
          <MessageCircle className="w-4 h-4" />
          <span>Créer une nouvelle discussion</span>
        </Button>
      </div>
    </div>
  );
}
