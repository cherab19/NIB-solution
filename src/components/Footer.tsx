import { Facebook, Linkedin, Send } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-surface-dark py-16 border-t border-surface-dark-foreground/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Company */}
          <div>
            <h3 className="font-heading text-xl font-bold text-surface-dark-foreground mb-4">
              Mela Tech
            </h3>
            <p className="text-surface-dark-foreground/60 text-sm">
              Building powerful digital solutions for Ethiopian businesses.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-surface-dark-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              {["About", "Services", "Products", "Blog"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-sm text-surface-dark-foreground/60 hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-surface-dark-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {["Website Development", "Custom Software", "Mobile-First Design"].map((link) => (
                <li key={link}>
                  <a href="#services" className="text-sm text-surface-dark-foreground/60 hover:text-gold transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-surface-dark-foreground mb-4">Contact</h4>
            <div className="flex gap-4 mt-2">
              <a href="https://t.me/axb_5" target="_blank" rel="noopener noreferrer" className="text-surface-dark-foreground/40 hover:text-gold transition-colors">
                <Send size={20} />
              </a>
              <a href="https://linkedin.com/in/cherenet-d-281437362" target="_blank" rel="noopener noreferrer" className="text-surface-dark-foreground/40 hover:text-gold transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://facebook.com/cherenet.d" target="_blank" rel="noopener noreferrer" className="text-surface-dark-foreground/40 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-dark-foreground/10 text-center text-sm text-surface-dark-foreground/40">
          © {new Date().getFullYear()} Mela Tech. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
