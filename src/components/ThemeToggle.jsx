import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Button variant="outline" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </Button>
  );
}
