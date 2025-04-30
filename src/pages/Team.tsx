
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Team() {
  const { t, language } = useLanguage();

  const team = [
    {
      name: "Alexandre Berthier",
      role: language === 'fr' ? "CEO & Fondateur" : "CEO & Founder",
      description: language === 'fr' 
        ? "Expert en trading, développement de stratégies et en codage" 
        : "Expert in trading, strategy development, and coding"
    },
    {
      name: "Neil Yammine",
      role: language === 'fr' ? "Directeur Marketing" : "Marketing Director",
      description: language === 'fr' 
        ? "Spécialiste en marketing" 
        : "Marketing specialist"
    },
    {
      name: "Sophie Martin",
      role: language === 'fr' ? "Analyste Trading" : "Trading Analyst",
      description: language === 'fr' 
        ? "Spécialiste en analyse technique et fondamentale" 
        : "Technical and fundamental analysis specialist"
    },
    {
      name: "Marc Dubois",
      role: language === 'fr' ? "Développeur Senior" : "Senior Developer",
      description: language === 'fr' 
        ? "Expert en développement web et applications mobiles" 
        : "Expert in web and mobile application development"
    },
    {
      name: "Julien Leroy",
      role: language === 'fr' ? "Designer UX/UI" : "UX/UI Designer",
      description: language === 'fr' 
        ? "Créateur d'expériences utilisateur intuitives et modernes" 
        : "Creator of intuitive and modern user experiences"
    },
    {
      name: "Marie Laurent",
      role: language === 'fr' ? "Support Client" : "Customer Support",
      description: language === 'fr' 
        ? "Toujours disponible pour vous aider à résoudre vos problèmes" 
        : "Always available to help you solve your problems"
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      <div className="w-full mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">{t('team.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('team.subtitle')}
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member) => (
            <Card key={member.name} className="p-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">{member.name[0]}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground">{member.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
