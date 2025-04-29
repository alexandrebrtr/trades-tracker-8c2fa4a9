
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Les fondamentaux de l'analyse technique pour traders débutants",
      description: "Découvrez les bases de l'analyse technique et comment les mettre en pratique pour améliorer vos décisions de trading.",
      date: "25 Avril 2025",
      category: "Analyse Technique",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=500&q=80",
      readTime: "8 min",
      author: "Alexandre Berthier"
    },
    {
      id: 2,
      title: "Comment gérer efficacement votre capital et vos risques",
      description: "La gestion de capital est souvent négligée mais représente l'élément le plus important pour assurer une carrière de trader durable.",
      date: "18 Avril 2025",
      category: "Gestion de Risque",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=500&q=80",
      readTime: "10 min",
      author: "Neil Yammine"
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Des articles et analyses pour améliorer votre trading et la gestion de votre portefeuille
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 mr-1" />
                  <span>{post.readTime} de lecture</span>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between items-center">
                <div className="text-sm">Par {post.author}</div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/blog/${post.id}`}>Lire l'article</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            De nouveaux articles sont publiés chaque semaine. Revenez bientôt !
          </p>
        </div>
      </div>
    </div>
  );
}
