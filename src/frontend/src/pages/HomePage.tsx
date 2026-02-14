import { Button } from '../components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { ShoppingBag, Zap, Globe, Headphones, BookOpen, Users, Code } from 'lucide-react';
import { ASSETS } from '../utils/assets';
import { useState, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { onboardingStorage } from '../utils/onboardingStorage';
import { toast } from 'sonner';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const { login, loginStatus } = useInternetIdentity();
  const emailSectionRef = useRef<HTMLDivElement>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      // Store email for post-login prefill
      onboardingStorage.setEmail(email);
      // Set redirect target to seller dashboard
      onboardingStorage.setRedirectTarget('/seller-dashboard');
      
      // Trigger Internet Identity login
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Failed to start login. Please try again.');
      // Clear stored data on error
      onboardingStorage.clearAll();
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-20" ref={emailSectionRef} id="landing-email">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Start an online store for free
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground">
                Shanju is the all-in-one platform to build, run, and grow your online boutique. Start free, then get 3 months for $1/month
              </p>
              
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                  disabled={isLoggingIn}
                />
                <Button type="submit" size="lg" className="whitespace-nowrap" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Starting...' : 'Start free trial'}
                </Button>
              </form>
              
              <p className="text-sm text-muted-foreground">
                You agree to receive Shanju marketing emails.
              </p>
            </div>

            <div className="relative">
              <img 
                src={ASSETS.landingHeroMockup} 
                alt="Store mockup" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Powering millions of businesses worldwide
          </p>
          <div className="flex justify-center">
            <img 
              src={ASSETS.landingPartnerLogos} 
              alt="Partner logos" 
              className="w-full max-w-4xl h-auto opacity-60"
            />
          </div>
        </div>
      </section>

      {/* Dark Features Section */}
      <section className="py-16 md:py-24 bg-[oklch(0.15_0.01_240)] text-white landing-dark-section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Smarter selling starts here
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-[oklch(0.2_0.01_240)] border-white/10 text-white">
              <CardHeader>
                <div className="h-16 w-16 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <CardTitle className="text-white">World's best checkout</CardTitle>
                <CardDescription className="text-white/70">
                  Fast, flexible, and converts 15% better than other platforms, on average.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-[oklch(0.2_0.01_240)] border-white/10 text-white">
              <CardHeader>
                <div className="h-16 w-16 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <CardTitle className="text-white">Built-in AI tools</CardTitle>
                <CardDescription className="text-white/70">
                  Get more done with AI functionality that's built into every store.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-[oklch(0.2_0.01_240)] border-white/10 text-white">
              <CardHeader>
                <div className="h-16 w-16 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8" />
                </div>
                <CardTitle className="text-white">Fast, reliable hosting</CardTitle>
                <CardDescription className="text-white/70">
                  Our 99.9% uptime keeps your store running smoothly, day and night.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The global platform for commerce
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl md:text-5xl font-bold mb-2">
                  $1.1+ trillion
                </CardTitle>
                <CardDescription className="text-base">
                  Total sales through Shanju worldwide.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl md:text-5xl font-bold mb-2">
                  175+ countries
                </CardTitle>
                <CardDescription className="text-base">
                  With businesses powered by Shanju.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Grid Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Build with help by your side
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-border/50 hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>24/7 support</CardTitle>
                <CardDescription>
                  Our support staff and virtual help assistant are here to help.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>16K+ apps</CardTitle>
                <CardDescription>
                  For whatever extra functionality your business might need.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Online courses</CardTitle>
                <CardDescription>
                  Lessons and tips from experts to help you succeed.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 hover:shadow-soft transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Partner network</CardTitle>
                <CardDescription>
                  Do more with commerce's largest network of partners.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-[oklch(0.15_0.01_240)] text-white landing-dark-section">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently asked questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border-white/10 bg-[oklch(0.2_0.01_240)] rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-white/80 text-left">
                How can I start my own online business?
              </AccordionTrigger>
              <AccordionContent className="text-white/70">
                Starting an online business is easy with our platform. Simply sign up, create your store, add your products, and start selling. No technical knowledge required.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-white/10 bg-[oklch(0.2_0.01_240)] rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-white/80 text-left">
                Can you start a business with no money?
              </AccordionTrigger>
              <AccordionContent className="text-white/70">
                Yes! You can start with our free trial and only pay when you're ready to launch. We offer flexible pricing plans to fit any budget.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-white/10 bg-[oklch(0.2_0.01_240)] rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-white/80 text-left">
                When should you start a business?
              </AccordionTrigger>
              <AccordionContent className="text-white/70">
                There's no better time than now! Our platform makes it easy to test your business idea and start selling immediately.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-white/10 bg-[oklch(0.2_0.01_240)] rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-white/80 text-left">
                How can I get a business license for my online store?
              </AccordionTrigger>
              <AccordionContent className="text-white/70">
                Business license requirements vary by location. We recommend checking with your local government for specific requirements in your area.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-white/10 bg-[oklch(0.2_0.01_240)] rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-white/80 text-left">
                What are the most successful small businesses?
              </AccordionTrigger>
              <AccordionContent className="text-white/70">
                Success varies by industry, but e-commerce stores in fashion, electronics, home goods, and specialty products tend to perform well on our platform.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-white/10 bg-[oklch(0.2_0.01_240)] rounded-lg px-6">
              <AccordionTrigger className="text-white hover:text-white/80 text-left">
                What is Shanju and how does it work?
              </AccordionTrigger>
              <AccordionContent className="text-white/70">
                Shanju is an all-in-one e-commerce solution that lets you create an online store, manage products, process payments, and ship orders—all from one dashboard.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Your ideas. Our platform.
            </h2>
            
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
                disabled={isLoggingIn}
              />
              <Button type="submit" size="lg" className="whitespace-nowrap" disabled={isLoggingIn}>
                {isLoggingIn ? 'Starting...' : 'Start free trial'}
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground">
              You agree to receive Shanju marketing emails.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
