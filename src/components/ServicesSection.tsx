import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Code, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Globe,
    title: "Website Development",
    description:
      "Modern, responsive websites designed to attract customers and grow your online presence.",
  },
  {
    icon: Code,
    title: "Custom Software",
    description:
      "Tailored management systems and applications built for your specific business needs.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Beautiful interfaces that work perfectly on every device, from phones to desktops.",
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-gold uppercase tracking-widest">
            What We Do
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-foreground">
            Our Services
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            End-to-end digital solutions tailored for Ethiopian businesses
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative p-8 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-card-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <Button variant="link" className="p-0 text-primary">
                Learn More →
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
