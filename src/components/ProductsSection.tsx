import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { useLanguage } from "@/contexts/LanguageContext";
import productMembership from "@/assets/product-membership.png";
import productSchool from "@/assets/product-school.png";
import productClinic from "@/assets/product-clinic.png";

const fallbackImages = [productMembership, productSchool, productClinic];

const ProductsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <section id="products" ref={ref} className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-gold uppercase tracking-widest">
            {t("products.label")}
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-foreground">
            {t("products.title")}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            {t("products.desc")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {(products ?? []).map((product, i) => {
            const liveUrl = (product as any).url;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <a
                  href={liveUrl || "#"}
                  target={liveUrl ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`block ${!liveUrl ? "pointer-events-none" : ""}`}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={product.image_url || fallbackImages[i] || fallbackImages[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                      {product.title}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                    )}
                    <ul className="space-y-2 mb-4">
                      {(product.features ?? []).map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {liveUrl && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                        {t("products.visit")} <span aria-hidden>→</span>
                      </span>
                    )}
                  </div>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
