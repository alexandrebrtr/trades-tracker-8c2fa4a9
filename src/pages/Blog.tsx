
import { useState } from "react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ChevronRight, Users, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";

export default function Blog() {
  const { t, language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: t("blog.all") },
    { id: "trading", label: t("blog.trading") },
    { id: "analysis", label: t("blog.analysis") },
    { id: "psychology", label: t("blog.psychology") },
    { id: "education", label: t("blog.education") },
  ];

  const blogPosts = [
    {
      id: "1",
      title: language === "fr" ? "Comment tenir un journal de trading efficace" : "How to keep an effective trading journal",
      excerpt: language === "fr" ? "Découvrez les meilleures pratiques pour suivre vos trades et améliorer vos performances." : "Discover the best practices for tracking your trades and improving your performance.",
      category: "trading",
      author: "Alexandre Berthier",
      date: "2023-04-15",
      readingTime: "8 min",
      image: "/lovable-uploads/7b5e102a-70c9-4618-a03e-87c1f375227e.png"
    },
    {
      id: "2",
      title: language === "fr" ? "5 indicateurs techniques à connaître absolument" : "5 technical indicators you absolutely need to know",
      excerpt: language === "fr" ? "Ces indicateurs peuvent transformer votre approche du marché et améliorer vos prises de décision." : "These indicators can transform your approach to the market and improve your decision making.",
      category: "analysis",
      author: "Sophie Martin",
      date: "2023-05-22",
      readingTime: "12 min",
      image: "/lovable-uploads/6b9faeba-9821-4d33-be9c-6a099aa8c1fe.png"
    },
    {
      id: "3",
      title: language === "fr" ? "Psychologie du trader : gérer les émotions" : "Trader psychology: managing emotions",
      excerpt: language === "fr" ? "La gestion émotionnelle est souvent ce qui sépare les traders à succès des autres." : "Emotional management is often what separates successful traders from others.",
      category: "psychology",
      author: "Neil Yammine",
      date: "2023-06-08",
      readingTime: "10 min",
      image: "/lovable-uploads/68631625-1d14-4206-b940-611ff6fce57e.png"
    },
    {
      id: "4",
      title: language === "fr" ? "Les bases du risk management en trading" : "The basics of risk management in trading",
      excerpt: language === "fr" ? "Apprenez à protéger votre capital grâce à des techniques de gestion des risques." : "Learn to protect your capital through risk management techniques.",
      category: "education",
      author: "Marc Dubois",
      date: "2023-07-14",
      readingTime: "15 min",
      image: "/lovable-uploads/add96841-d5f8-4327-a5d6-5f1b97236b33.png"
    },
    {
      id: "5",
      title: language === "fr" ? "Analyser ses trades : méthodologie complète" : "Analyzing your trades: comprehensive methodology",
      excerpt: language === "fr" ? "Un guide étape par étape pour extraire des insights précieux de votre historique de trades." : "A step-by-step guide to extracting valuable insights from your trading history.",
      category: "analysis",
      author: "Alexandre Berthier",
      date: "2023-08-29",
      readingTime: "14 min",
      image: "/lovable-uploads/75bc79d3-a83c-4eac-88bb-45983d822da6.png"
    },
    {
      id: "6",
      title: language === "fr" ? "Les erreurs courantes des traders débutants" : "Common mistakes of beginner traders",
      excerpt: language === "fr" ? "Évitez ces pièges classiques qui peuvent compromettre votre parcours de trading." : "Avoid these classic pitfalls that can compromise your trading journey.",
      category: "education",
      author: "Sophie Martin",
      date: "2023-09-10",
      readingTime: "9 min",
      image: "/lovable-uploads/670604e6-f3d4-410a-90ea-fc3b3decc42a.png"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === "fr" 
      ? date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const filteredPosts = selectedCategory === "all" 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen w-full bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      <div className="w-full px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">{t('blog.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Categories */}
        <div className="max-w-7xl mx-auto mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button 
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Blog posts grid */}
        <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="text-sm text-muted-foreground mb-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                    {categories.find(cat => cat.id === post.category)?.label || post.category}
                  </span>
                </div>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTime}</span>
                </div>
              </CardFooter>
              <CardFooter className="flex justify-between items-center pt-0">
                <div className="text-sm text-muted-foreground">
                  {formatDate(post.date)}
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to={`/blog/${post.id}`} className="flex items-center">
                    {t('blog.readMore')} 
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
