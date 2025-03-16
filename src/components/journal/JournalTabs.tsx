
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface JournalTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export function JournalTabs({ activeTab, setActiveTab }: JournalTabsProps) {
  return (
    <Tabs value={activeTab} className="w-full sm:w-auto" onValueChange={setActiveTab}>
      <TabsList className="grid w-full sm:w-auto grid-cols-3">
        <TabsTrigger value="all">Tous</TabsTrigger>
        <TabsTrigger value="success">Gains</TabsTrigger>
        <TabsTrigger value="failure">Pertes</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
