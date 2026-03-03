import { Button } from "@/components/ui/button";

interface CommandButtonsProps {
  onCommand: (command: string) => void;
}

const CommandButtons = ({ onCommand }: CommandButtonsProps) => {
  const commands = [
    { label: "View Projects", command: "1", color: "text-neon-green hover:text-neon-green-glow" },
    { label: "Why Hire Me", command: "2", color: "text-neon-yellow hover:text-neon-yellow-glow" },
    { label: "Let's Talk", command: "3", color: "text-terminal-cursor hover:text-neon-yellow-glow" },
    { label: "Help", command: "help", color: "text-muted-foreground hover:text-foreground" },
    { label: "Home", command: "h", color: "text-muted-foreground hover:text-foreground" }
  ];

  return (
    <div className="mt-6 space-y-2">
      <div className="text-sm text-muted-foreground mb-3">
        Click a command or type it:
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {commands.map((cmd) => (
          <Button
            key={cmd.command}
            variant="ghost"
            size="sm"
            className={`justify-start font-mono text-sm ${cmd.color} hover:bg-neon-green/10 transition-all duration-200`}
            onClick={() => onCommand(cmd.command)}
          >
            <span className="text-neon-green mr-2">[{cmd.command}]</span>
            {cmd.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CommandButtons;