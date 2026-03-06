import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroDashboard from "@/assets/hero-dashboard.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Leading Software Solutions in Ethiopia
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-tight text-foreground">
              We Build{" "}
              <span className="text-gradient-primary">Powerful Software</span>{" "}
              That Helps Companies{" "}
              <span className="text-gradient-gold">Grow Digitally</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Ezezun delivers cutting-edge web applications, management systems,
              and digital solutions for Ethiopian businesses ready to scale.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg">
                <a href="#contact">Get Free Consultation</a>
              </Button>
              <Button variant="hero-outline" size="lg">
                <a href="#portfolio">View Our Work</a>
              </Button>
            </div>
          </motion.div>

          {/* Right Dashboard Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
              <img
                src={heroDashboard}
                alt="Ezezun Software Dashboard"
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
