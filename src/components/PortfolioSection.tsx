import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import productClinic from "@/assets/product-clinic.png";
import portfolioRestaurant from "@/assets/portfolio-restaurant.png";

const fallbackImages = [productClinic, portfolioRestaurant];

const PortfolioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { data: projects } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_projects")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="portfolio" ref={ref} className="py-24 bg-surface-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-gold uppercase tracking-widest">
            Portfolio
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-surface-dark-foreground">
            Our Work
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {(projects ?? []).map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-surface-dark-foreground/5 rounded-2xl overflow-hidden border border-surface-dark-foreground/10 hover:border-primary/30 transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image_url || fallbackImages[i] || fallbackImages[0]}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-heading font-semibold text-surface-dark-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-surface-dark-foreground/60 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(project.technologies ?? []).map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 text-xs rounded-full bg-primary/20 text-primary font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
