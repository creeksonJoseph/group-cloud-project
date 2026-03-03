import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Folder, User, MessageCircle } from "lucide-react";

interface MenuOption {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface AnimatedMenuButtonProps {
  onViewProjects: () => void;
  onWhyHireMe: () => void;
  onLetsTalk: () => void;
}

const AnimatedMenuButton = ({ onViewProjects, onWhyHireMe, onLetsTalk }: AnimatedMenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuOptions: MenuOption[] = [
    {
      label: "View Projects",
      icon: <Folder className="w-4 h-4" />,
      onClick: () => {
        onViewProjects();
        setIsOpen(false);
      }
    },
    {
      label: "Why Hire Me",
      icon: <User className="w-4 h-4" />,
      onClick: () => {
        onWhyHireMe();
        setIsOpen(false);
      }
    },
    {
      label: "Let's Talk",
      icon: <MessageCircle className="w-4 h-4" />,
      onClick: () => {
        onLetsTalk();
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="relative">
      {/* Main button */}
      <Button
        variant="outline"
        size="lg"
        className="border-neon-green text-neon-green hover:bg-neon-green hover:text-background font-mono text-lg px-8 py-4 transition-all duration-300 hover:scale-105 neon-glow"
        onClick={() => setIsOpen(!isOpen)}
      >
        Access Terminal
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Menu options */}
      {isOpen && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-64 space-y-3 animate-fadeIn">
          {menuOptions.map((option, index) => (
            <Button
              key={option.label}
              variant="outline"
              className="w-full justify-start border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-background font-mono transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
              onClick={option.onClick}
            >
              {option.icon}
              <span className="ml-2">{option.label}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedMenuButton;