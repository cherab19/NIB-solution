import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import productMembership from "@/assets/product-membership.png";
import productSchool from "@/assets/product-school.png";
import productClinic from "@/assets/product-clinic.png";

// Fallback images mapped by index
const fallbackImages = [productMembership, productSchool, productClinic];

const ProductsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
            Our Products
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-foreground">
            Software Built by Mela Tech
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Ready-to-deploy solutions designed for Ethiopian organizations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {(products ?? []).map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
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
                <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
                  {product.title}
                </h3>
                <ul className="space-y-2 mb-6">
                  {(product.features ?? []).map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Button variant="hero" size="sm">Request Demo</Button>
                  <Button variant="ghost" size="sm" className="text-primary">Learn More</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
