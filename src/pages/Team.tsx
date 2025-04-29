
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
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      <div className="container mx-auto px-4 pt-32 pb-20">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
