import { useState, useEffect, useRef } from "react";

interface TerminalInputProps {
  onCommand: (command: string) => void;
  placeholder?: string;
}

const TerminalInput = ({ onCommand, placeholder = "joseph@haven:~$ " }: TerminalInputProps) => {
  const [input, setInput] = useState("");
  const [isBlinking, setIsBlinking] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Keep input focused
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    focusInput();
    window.addEventListener('click', focusInput);
    
    return () => {
      window.removeEventListener('click', focusInput);
    };
  }, []);

  useEffect(() => {
    // Blinking cursor effect
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCommand(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex items-center text-terminal-text font-mono">
      <span className="text-neon-green mr-2">{placeholder}</span>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-transparent border-none outline-none text-terminal-text font-mono w-full"
          style={{ caretColor: 'transparent' }}
        />
        <span 
          className={`absolute text-terminal-cursor transition-opacity duration-100 ${
            isBlinking ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ left: `${input.length * 0.6}em` }}
        >
          █
        </span>
      </div>
    </div>
  );
};

export default TerminalInput;
