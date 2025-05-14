
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FAQ() {
  const { t, language } = useLanguage();
  
  const faqs = [
    {
      question: language === 'fr' ? "Comment commencer avec Trades Tracker ?" : "How to get started with Trades Tracker?",
      answer: language === 'fr' 
        ? "Inscrivez-vous gratuitement, connectez-vous à votre compte, et commencez à enregistrer vos trades. Notre interface intuitive vous guidera tout au long du processus."
        : "Sign up for free, log in to your account, and start recording your trades. Our intuitive interface will guide you through the process."
    },
    {
      question: language === 'fr' ? "Quelles fonctionnalités sont incluses dans la version gratuite ?" : "What features are included in the free version?",
      answer: language === 'fr'
        ? "La version gratuite comprend l'enregistrement des trades, les statistiques de base, et le journal de trading. Pour des fonctionnalités avancées comme les analyses détaillées, envisagez notre version premium."
        : "The free version includes trade recording, basic statistics, and trading journal. For advanced features like detailed analytics, consider our premium version."
    },
    {
      question: language === 'fr' ? "Comment passer à la version premium ?" : "How do I upgrade to premium?",
      answer: language === 'fr'
        ? "Vous pouvez passer à la version premium à tout moment depuis votre tableau de bord. Cliquez sur 'Mettre à niveau' et suivez les instructions pour compléter votre abonnement."
        : "You can upgrade to premium at any time from your dashboard. Click on 'Upgrade' and follow the instructions to complete your subscription."
    },
    {
      question: language === 'fr' ? "Mes données sont-elles sécurisées ?" : "Is my data secure?",
      answer: language === 'fr'
        ? "Oui, nous prenons la sécurité très au sérieux. Toutes les données sont cryptées et stockées de manière sécurisée conformément aux normes de l'industrie."
        : "Yes, we take security very seriously. All data is encrypted and securely stored according to industry standards."
    },
    {
      question: language === 'fr' ? "Puis-je exporter mes données de trading ?" : "Can I export my trading data?",
      answer: language === 'fr'
        ? "Oui, vous pouvez exporter vos données de trading dans divers formats depuis la section 'Paramètres' de votre compte."
        : "Yes, you can export your trading data in various formats from the 'Settings' section of your account."
    },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--landing-background))] text-[hsl(var(--landing-foreground))]">
      <LandingHeader />
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-10 pt-32 pb-20">
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">
            {language === 'fr' ? "Questions Fréquemment Posées" : "Frequently Asked Questions"}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-center">
            {language === 'fr' 
              ? "Trouvez des réponses aux questions les plus courantes sur Trades Tracker"
              : "Find answers to the most common questions about Trades Tracker"}
          </p>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg shadow-sm">
                <AccordionTrigger className="px-4 py-3 hover:bg-accent/50 rounded-t-lg font-medium text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3 pt-1 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
