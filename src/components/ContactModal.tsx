
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Phone, MapPin, Send } from "lucide-react";
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
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Contact Us
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {/* Contact Form */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Send us a message</h3>
              <p className="text-muted-foreground text-sm">
                Have a question or need help? We'd love to hear from you.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="How can we help you?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us more about your inquiry..."
                  rows={4}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Get in touch</h3>
              <p className="text-muted-foreground text-sm">
                Choose the best way to reach us. We're here to help!
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Email Support</h4>
                  <p className="text-sm text-muted-foreground">support@aicomment.com</p>
                  <Badge variant="secondary" className="mt-1">24/7 Support</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Live Chat</h4>
                  <p className="text-sm text-muted-foreground">Available Monday - Friday</p>
                  <Badge variant="secondary" className="mt-1">9 AM - 6 PM PST</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Phone Support</h4>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  <Badge variant="secondary" className="mt-1">Business Hours</Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">Office Location</h4>
                  <p className="text-sm text-muted-foreground">
                    123 Tech Street<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Response Times</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>< 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chat:</span>
                  <span>< 2 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>Immediate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Priority:</span>
                  <span>< 1 hour</span>
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
