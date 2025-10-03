import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-black mb-4 text-accent">FITZONE</div>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Transform your body and mind with our premium fitness experience. 
              Professional equipment, expert trainers, and personalized programs.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-light">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-light">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-light">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:text-accent hover:bg-primary-light">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-accent">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-primary-foreground/80 hover:text-accent transition-athletic">Home</a></li>
              <li><a href="#products" className="text-primary-foreground/80 hover:text-accent transition-athletic">Shop</a></li>
              <li><a href="#classes" className="text-primary-foreground/80 hover:text-accent transition-athletic">Classes</a></li>
              <li><a href="#trainers" className="text-primary-foreground/80 hover:text-accent transition-athletic">Trainers</a></li>
              <li><a href="#membership" className="text-primary-foreground/80 hover:text-accent transition-athletic">Membership</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-accent">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-athletic">Personal Training</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-athletic">Group Classes</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-athletic">Nutrition Coaching</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-athletic">Diet Planning</a></li>
              <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-athletic">Equipment Sales</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-accent">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm">123 Fitness Street, Gym City, GC 12345</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/80">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm">info@fitzone.com</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-bold mb-3 text-accent">Hours</h4>
              <div className="text-sm text-primary-foreground/80 space-y-1">
                <div>Mon - Fri: 5:00 AM - 11:00 PM</div>
                <div>Sat - Sun: 6:00 AM - 10:00 PM</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-light pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-primary-foreground/60">
              © 2024 FITZONE. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-athletic">Privacy Policy</a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-athletic">Terms of Service</a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-athletic">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;