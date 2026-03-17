import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Palette, Code, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const steps = [
    { icon: MessageSquare, title: t("how.step1.title"), description: t("how.step1.desc") },
    { icon: Palette, title: t("how.step2.title"), description: t("how.step2.desc") },
    { icon: Code, title: t("how.step3.title"), description: t("how.step3.desc") },
    { icon: Rocket, title: t("how.step4.title"), description: t("how.step4.desc") },
  ];

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-gold uppercase tracking-widest">
            {t("how.label")}
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-foreground">
            {t("how.title")}
          </h2>
        </motion.div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative z-10 flex-1 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 shadow-glow">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-xs font-semibold text-gold mb-1">{t("how.step")} {i + 1}</div>
              <h3 className="font-heading font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-[180px]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
