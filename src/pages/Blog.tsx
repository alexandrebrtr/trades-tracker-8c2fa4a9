
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

export default function Blog() {
  const { t, language } = useLanguage();
  
  const blogPosts = [
    {
      id: 1,
      title: language === 'fr' 
        ? "Les fondamentaux de l'analyse technique pour traders débutants"
        : "Technical Analysis Fundamentals for Beginner Traders",
      description: language === 'fr'
        ? "Découvrez les bases de l'analyse technique et comment les mettre en pratique pour améliorer vos décisions de trading."
        : "Discover the basics of technical analysis and how to apply them to improve your trading decisions.",
      date: language === 'fr' ? "25 Avril 2025" : "April 25, 2025",
      category: language === 'fr' ? "Analyse Technique" : "Technical Analysis",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=500&q=80",
      readTime: "8 min",
      author: "Alexandre Berthier"
    },
    {
      id: 2,
      title: language === 'fr'
        ? "Comment gérer efficacement votre capital et vos risques"
        : "How to Effectively Manage Your Capital and Risks",
      description: language === 'fr'
        ? "La gestion de capital est souvent négligée mais représente l'élément le plus important pour assurer une carrière de trader durable."
        : "Capital management is often overlooked but represents the most important element for ensuring a sustainable trading career.",
      date: language === 'fr' ? "18 Avril 2025" : "April 18, 2025",
      category: language === 'fr' ? "Gestion de Risque" : "Risk Management",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=500&q=80",
      readTime: "10 min",
      author: "Neil Yammine"
    },
    {
      id: 3,
      title: language === 'fr' 
        ? "Les meilleurs indicateurs pour le scalping"
        : "Best Indicators for Scalping",
      description: language === 'fr'
        ? "Le scalping est une stratégie qui nécessite des outils spécifiques pour être efficace. Découvrez les indicateurs les plus précis."
        : "Scalping is a strategy that requires specific tools to be effective. Discover the most accurate indicators.",
      date: language === 'fr' ? "12 Avril 2025" : "April 12, 2025",
      category: language === 'fr' ? "Scalping" : "Scalping",
      imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=500&q=80",
      readTime: "12 min",
      author: "Sophie Martin"
    },
    {
      id: 4,
      title: language === 'fr' 
        ? "Comment développer une mentalité de trader gagnant"
        : "How to Develop a Winning Trader Mindset",
      description: language === 'fr'
        ? "La psychologie est souvent le facteur déterminant entre un trader profitable et un trader perdant. Apprenez à maîtriser votre mental."
        : "Psychology is often the determining factor between a profitable trader and a losing one. Learn to master your mindset.",
      date: language === 'fr' ? "5 Avril 2025" : "April 5, 2025",
      category: language === 'fr' ? "Psychologie" : "Psychology",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=500&q=80",
      readTime: "15 min",
      author: "Thomas Dubois"
    }
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
          <h1 className="text-4xl font-bold mb-4">{t('blog.title')}</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {t('blog.subtitle')}
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
                  <span>{post.readTime} {language === 'fr' ? "de lecture" : t('blog.readTime')}</span>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between items-center">
                <div className="text-sm">{t('blog.by')} {post.author}</div>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/blog/${post.id}`}>{t('blog.readArticle')}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            {t('blog.newArticles')}
          </p>
        </div>
      </div>
    </div>
  );
}
