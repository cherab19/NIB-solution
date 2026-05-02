import { Facebook, Linkedin, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import beeLogo from "@/assets/bee-logo.png";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface-dark py-16 border-t border-surface-dark-foreground/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="flex items-center gap-2 font-heading text-xl font-bold text-surface-dark-foreground mb-4">
              <img src={beeLogo} alt="NIB Solution logo" width={28} height={28} loading="lazy" className="h-7 w-7 object-contain" />
              NIB Solution
            </h3>
            <p className="text-surface-dark-foreground/60 text-sm">
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-surface-dark-foreground mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2">
              {[
                { label: t("footer.about"), href: "#" },
                { label: t("nav.services"), href: "#services" },
                { label: t("nav.products"), href: "#products" },
                { label: t("nav.blog"), href: "#blog" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-surface-dark-foreground/60 hover:text-gold transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-surface-dark-foreground mb-4">{t("nav.services")}</h4>
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

          <div>
            <h4 className="font-heading font-semibold text-surface-dark-foreground mb-4">{t("footer.contact")}</h4>
            <div className="flex gap-4 mt-2">
              <a href="https://t.me/axb_5" target="_blank" rel="noopener noreferrer" className="text-surface-dark-foreground/40 hover:text-gold transition-colors">
                <Send size={20} />
              </a>
              <a href="https://linkedin.com/in/cherenet-d-281437362" target="_blank" rel="noopener noreferrer" className="text-surface-dark-foreground/40 hover:text-gold transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://www.facebook.com/chernet.degefe.2025" target="_blank" rel="noopener noreferrer" className="text-surface-dark-foreground/40 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-surface-dark-foreground/10 text-center text-sm text-surface-dark-foreground/40">
          © {new Date().getFullYear()} NIB Solution. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
