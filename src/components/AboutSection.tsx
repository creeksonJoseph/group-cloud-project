import { FaHtml5, FaReact, FaGitAlt, FaFigma, FaPython } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io";
import {
  SiTailwindcss,
  SiFlask,
  SiPostman,
  SiSqlite,
  SiPostgresql,
} from "react-icons/si";

const skills = [
  { name: "HTML", icon: FaHtml5 },
  { name: "JavaScript", icon: IoLogoJavascript },
  { name: "React", icon: FaReact },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Python", icon: FaPython },
  { name: "Flask", icon: SiFlask },
];

const tools = [
  { name: "Git/GitHub", icon: FaGitAlt },
  { name: "Figma", icon: FaFigma },
  { name: "Postman", icon: SiPostman },
  { name: "PostgreSQL", icon: SiPostgresql },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-gui font-bold text-center mb-8 text-neon-green">
          My Story
        </h2>

        {/* Description */}
        <div className="text-xl md:text-2xl text-center mb-16 text-foreground font-gui max-w-4xl mx-auto">
          <p className="mb-4">
            I like solving puzzles, but instead of pieces, I use code. I
            transform ideas into software by blending design and functionality.
            I craft software that's secure, creating digital experiences that
            are fast and effortless to use.
          </p>
          <p className="text-neon-yellow">
            If you've got the idea, I've got the code. Let's make your idea
            touch the internet.
          </p>
        </div>

        {/* Skills and Tools */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Skills */}
          <div>
            <h3 className="text-2xl font-gui font-semibold text-neon-yellow mb-8 text-center">
              Skills
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  className="bg-card border border-neon-green/30 rounded-lg p-6 hover:border-neon-green transition-all duration-300 hover:scale-105 group"
                  style={{
                    animation: `fadeIn 0.6s ease-out ${index * 0.1 + 0.2}s both`,
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <skill.icon className="w-12 h-12 text-neon-green mb-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_hsl(var(--neon-green)/0.9)]" />
                    <span className="text-foreground font-gui font-medium">
                      {skill.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-2xl font-gui font-semibold text-neon-yellow mb-8 text-center">
              Tools
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool, index) => (
                <div
                  key={tool.name}
                  className="bg-card border border-neon-green/30 rounded-lg p-6 hover:border-neon-green transition-all duration-300 hover:scale-105 group"
                  style={{
                    animation: `fadeIn 0.6s ease-out ${index * 0.1 + 0.6}s both`,
                  }}
                >
                  <div className="flex flex-col items-center text-center">
                    <tool.icon className="w-12 h-12 text-neon-green mb-4 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_hsl(var(--neon-green)/0.9)]" />
                    <span className="text-foreground font-gui font-medium">
                      {tool.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
