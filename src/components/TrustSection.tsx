import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { data: stats } = useQuery({
    queryKey: ["site-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_stats")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section ref={ref} className="py-20 bg-surface-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-heading font-bold text-surface-dark-foreground">
            Trusted Digital Solutions Provider
          </h2>
          <p className="mt-3 text-surface-dark-foreground/60 max-w-md mx-auto">
            Ethiopian businesses rely on Ezezun for their digital transformation
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(stats ?? []).map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-xl border border-surface-dark-foreground/10 bg-surface-dark-foreground/5"
            >
              <div className="text-4xl font-heading font-bold text-gold mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-surface-dark-foreground/70">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8 opacity-40"
        >
          {["TechCorp", "EduFirst", "MediCare", "GreenHotel", "SafeNGO"].map((name) => (
            <div
              key={name}
              className="font-heading text-lg font-semibold text-surface-dark-foreground tracking-wider"
            >
              {name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
