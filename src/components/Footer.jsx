import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium">Health Tracker</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 Health Tracker. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
