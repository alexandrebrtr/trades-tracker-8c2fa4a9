
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Moon, Sun, Laptop } from "lucide-react";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thème</CardTitle>
        <CardDescription>
          Personnalisez l'apparence de l'application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            className="flex gap-2 items-center"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-4 w-4" />
            <span>Clair</span>
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            className="flex gap-2 items-center"
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-4 w-4" />
            <span>Sombre</span>
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            className="flex gap-2 items-center"
            onClick={() => setTheme("system")}
          >
            <Laptop className="h-4 w-4" />
            <span>Système</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
