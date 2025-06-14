
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageCircle, Phone, Clock, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactModal = ({ open, onOpenChange }: ContactModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully! ✨",
        description: "We'll get back to you within 24 hours."
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 bg-gradient-to-br from-background to-muted/20 dark:from-gray-900 dark:to-gray-800 border-border/50 shadow-2xl">
        {/* Custom close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-md bg-transparent hover:bg-muted/50 dark:hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Left Section - Form */}
          <div className="flex-1 p-10 bg-gradient-to-br from-background to-background/50 dark:from-gray-900/95 dark:to-gray-900/50">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-foreground mb-2 flex items-center gap-3">
                <Mail className="w-7 h-7 text-primary" />
                Let's Connect
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  required
                  className="h-12 bg-background dark:bg-gray-950 border-border dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="h-12 bg-background dark:bg-gray-950 border-border dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-foreground">
                  Subject *
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="How can we help you?"
                  required
                  className="h-12 bg-background dark:bg-gray-950 border-border dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-foreground">
                  Message *
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us more about your inquiry..."
                  rows={4}
                  required
                  className="bg-background dark:bg-gray-950 border-border dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right Section - Contact Info */}
          <div className="flex-1 p-10 bg-muted/30 dark:bg-gray-800/50 border-l border-border/50 dark:border-gray-700/50">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Get in touch</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Choose the best way to reach us. We're here to help and would love to hear from you!
              </p>

              {/* Contact Options */}
              <div className="space-y-4">
                {/* Email Support */}
                <div className="bg-background dark:bg-gray-900/60 border border-border dark:border-gray-700 rounded-xl p-5 transition-all duration-200 hover:bg-muted/50 dark:hover:bg-gray-800/60 hover:border-primary/50 hover:transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-foreground">Email Support</h4>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">support@commentcraft.ai</p>
                  <div className="text-primary text-sm font-medium">24/7 Support</div>
                </div>

                {/* Live Chat */}
                <div className="bg-background dark:bg-gray-900/60 border border-border dark:border-gray-700 rounded-xl p-5 transition-all duration-200 hover:bg-muted/50 dark:hover:bg-gray-800/60 hover:border-blue-500/50 hover:transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-blue-500">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-foreground">Live Chat</h4>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">Available Monday - Friday</p>
                  <div className="text-blue-500 text-sm font-medium">9 AM - 6 PM PST</div>
                </div>

                {/* Phone Support */}
                <div className="bg-background dark:bg-gray-900/60 border border-border dark:border-gray-700 rounded-xl p-5 transition-all duration-200 hover:bg-muted/50 dark:hover:bg-gray-800/60 hover:border-red-500/50 hover:transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-red-500">
                      <Phone className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-foreground">Phone Support</h4>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">+1 (555) 123-4567</p>
                  <div className="text-red-500 text-sm font-medium">Business Hours</div>
                </div>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-background dark:bg-gray-900/60 border border-border dark:border-gray-700 rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Response Times
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Email:</span>
                  <span className="text-primary text-sm font-medium">< 24 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Chat:</span>
                  <span className="text-primary text-sm font-medium">< 2 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Phone:</span>
                  <span className="text-primary text-sm font-medium">Immediate</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Priority:</span>
                  <span className="text-primary text-sm font-medium">< 1 hour</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
