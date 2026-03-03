import { MessageCircle, Linkedin, Mail, Github } from "lucide-react";

const contacts = [
  {
    name: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/254700146313",
    color: "text-neon-green hover:text-neon-green-glow",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/joseph-charana-038328353/",
    color: "text-neon-yellow hover:text-neon-yellow-glow",
  },
  {
    name: "Gmail",
    icon: Mail,
    href: "mailto:charanajoseph@gmail.com",
    color: "text-neon-green hover:text-neon-green-glow",
  },
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/creeksonJoseph",
    color: "text-terminal-cursor hover:text-neon-yellow-glow",
  },
];

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-gui font-bold mb-16 text-neon-green">
          Let's Talk
        </h2>

        {/* Contact Icons */}
        <div className="flex flex-wrap justify-center gap-8">
          {contacts.map((contact, index) => (
            <a
              key={contact.name}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group ${contact.color} transition-all duration-300 hover:scale-110`}
              style={{
                animation: `fadeIn 0.6s ease-out ${index * 0.1 + 0.2}s both`,
              }}
            >
              <div className="flex flex-col items-center space-y-3 p-6 bg-card border border-neon-green/30 rounded-lg hover:border-current hover:shadow-lg hover:shadow-current/20">
                <contact.icon className="w-12 h-12" />
                <span className="font-gui font-medium text-foreground group-hover:text-current transition-colors">
                  {contact.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
