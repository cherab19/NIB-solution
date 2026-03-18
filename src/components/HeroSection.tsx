import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import heroDashboard from "@/assets/hero-dashboard.png";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight text-foreground">
              {t("hero.title1")}
              <span className="text-gradient-primary">{t("hero.title.highlight1")}</span>
              {t("hero.title2")}
              <span className="text-gradient-gold">{t("hero.title.highlight2")}</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              {t("hero.desc")}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg">
                <a href="#contact">{t("hero.cta1")}</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
              <img
                src={heroDashboard}
                alt={t("hero.img.alt")}
                className="w-full h-auto animate-float"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
