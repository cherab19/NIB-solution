import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import blogDigital from "@/assets/blog-digital.png";

const posts = [
  {
    title: "Why Ethiopian Businesses Need Websites",
    description: "Discover how a professional website can transform your business reach and credibility in Ethiopia's growing digital economy.",
    image: blogDigital,
    date: "Mar 1, 2026",
  },
  {
    title: "Benefits of Digital Management Systems",
    description: "Learn how schools, clinics, and organizations save time and money with custom management software.",
    image: blogDigital,
    date: "Feb 20, 2026",
  },
  {
    title: "How Software Improves Business Efficiency",
    description: "Real case studies of Ethiopian companies that doubled their productivity through digital solutions.",
    image: blogDigital,
    date: "Feb 10, 2026",
  },
];

const BlogSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="blog" ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-gold uppercase tracking-widest">
            Blog
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-foreground">
            Latest Insights
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <span className="text-xs text-muted-foreground">{post.date}</span>
                <h3 className="mt-2 text-lg font-heading font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
                <span className="inline-block mt-4 text-sm font-medium text-primary">
                  Read More →
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
