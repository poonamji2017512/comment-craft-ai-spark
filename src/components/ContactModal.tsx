
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Phone, MapPin, Send, Clock, CheckCircle2, Sparkles } from "lucide-react";
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-primary/10 via-purple-50 to-blue-50 dark:from-primary/5 dark:via-purple-900/20 dark:to-blue-900/20 p-8 pb-6">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Let's Connect
                </DialogTitle>
              </div>
              <p className="text-muted-foreground text-lg">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </DialogHeader>
          </div>

          <div className="p-8 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Send us a message
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">
                          Full Name *
                        </label>
                        <Input 
                          id="name" 
                          type="text" 
                          value={formData.name} 
                          onChange={(e) => handleInputChange("name", e.target.value)} 
                          placeholder="John Doe" 
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium">
                          Email Address *
                        </label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => handleInputChange("email", e.target.value)} 
                          placeholder="john@example.com" 
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-medium">
                        Subject *
                      </label>
                      <Input 
                        id="subject" 
                        type="text" 
                        value={formData.subject} 
                        onChange={(e) => handleInputChange("subject", e.target.value)} 
                        placeholder="How can we help you?" 
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium">
                        Message *
                      </label>
                      <Textarea 
                        id="message" 
                        value={formData.message} 
                        onChange={(e) => handleInputChange("message", e.target.value)} 
                        placeholder="Tell us more about your inquiry..." 
                        rows={5} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                        required 
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-200" 
                      disabled={isSubmitting}
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
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Get in touch
                  </h3>
                  <p className="text-muted-foreground">
                    Choose the best way to reach us. We're here to help and would love to hear from you!
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Email Support */}
                  <div className="p-4 border border-border rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-800 dark:text-green-300">Email Support</h4>
                        <p className="text-sm text-green-700 dark:text-green-400 mb-2">support@commentcraft.ai</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          24/7 Support
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Live Chat */}
                  <div className="p-4 border border-border rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300">Live Chat</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">Available Monday - Friday</p>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                          <Clock className="w-3 h-3 mr-1" />
                          9 AM - 6 PM PST
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Phone Support */}
                  <div className="p-4 border border-border rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-800 dark:text-purple-300">Phone Support</h4>
                        <p className="text-sm text-purple-700 dark:text-purple-400 mb-2">+1 (555) 123-4567</p>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                          <Clock className="w-3 h-3 mr-1" />
                          Business Hours
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Response Times */}
                <div className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/40 dark:to-slate-900/40 rounded-xl border border-border">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Response Times
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium text-green-600">&lt; 24 hours</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="text-muted-foreground">Chat:</span>
                      <span className="font-medium text-blue-600">&lt; 2 minutes</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium text-purple-600">Immediate</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-lg">
                      <span className="text-muted-foreground">Priority:</span>
                      <span className="font-medium text-orange-600">&lt; 1 hour</span>
                    </div>
                  </div>
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
