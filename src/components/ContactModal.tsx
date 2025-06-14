
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
      <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-0 border bg-gradient-to-br from-white to-gray-50 dark:from-[#1a1a1a] dark:to-[#141414] border-gray-200 dark:border-[#2a2a2a] p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg overflow-hidden">
        {/* Custom close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-transparent text-gray-600 dark:text-[#888] hover:text-gray-900 dark:hover:text-white transition-all duration-200 flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col lg:flex-row min-h-[500px]">
          {/* Left Section - Form */}
          <div className="flex-1 p-10 bg-gradient-to-br from-white to-gray-50 dark:from-[#1e1e1e] dark:to-[#181818]">
            <div className="mb-8">
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <Mail className="w-7 h-7 text-teal-600 dark:text-[#20b2aa]" />
                Let's Connect
              </h2>
              <p className="text-gray-600 dark:text-[#888] text-base leading-relaxed">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Full Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="John Doe"
                  required
                  className="h-12 bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-[#333] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#666] focus:border-teal-600 dark:focus:border-[#20b2aa] focus:ring-2 focus:ring-teal-600/20 dark:focus:ring-[#20b2aa]/10 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="h-12 bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-[#333] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#666] focus:border-teal-600 dark:focus:border-[#20b2aa] focus:ring-2 focus:ring-teal-600/20 dark:focus:ring-[#20b2aa]/10 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Subject *
                </label>
                <Input
                  id="subject"
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="How can we help you?"
                  required
                  className="h-12 bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-[#333] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#666] focus:border-teal-600 dark:focus:border-[#20b2aa] focus:ring-2 focus:ring-teal-600/20 dark:focus:ring-[#20b2aa]/10 transition-all duration-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 dark:text-white">
                  Message *
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us more about your inquiry..."
                  rows={4}
                  required
                  className="bg-white dark:bg-[#0a0a0a] border-gray-300 dark:border-[#333] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#666] focus:border-teal-600 dark:focus:border-[#20b2aa] focus:ring-2 focus:ring-teal-600/20 dark:focus:ring-[#20b2aa]/10 transition-all duration-200 resize-none min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 dark:from-[#20b2aa] dark:to-[#1a9a94] dark:hover:from-[#1a9a94] dark:hover:to-[#16857d] text-white font-semibold transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-600/30 dark:hover:shadow-[#20b2aa]/30 border-none"
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
          <div className="flex-1 p-10 bg-gray-50 dark:bg-[#141414] border-l border-gray-200 dark:border-[#2a2a2a]">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Get in touch</h3>
              <p className="text-gray-600 dark:text-[#888] text-sm leading-relaxed mb-6">
                Choose the best way to reach us. We're here to help and would love to hear from you!
              </p>

              {/* Contact Options */}
              <div className="space-y-4">
                {/* Email Support */}
                <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-5 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:border-teal-600/50 dark:hover:border-[#20b2aa] hover:transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-teal-600 dark:text-[#20b2aa]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Email Support</h4>
                  </div>
                  <p className="text-gray-600 dark:text-[#888] text-sm mb-1">support@commentcraft.ai</p>
                  <div className="text-teal-600 dark:text-[#20b2aa] text-sm font-medium">24/7 Support</div>
                </div>

                {/* Live Chat */}
                <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-5 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:border-blue-500/50 dark:hover:border-[#20b2aa] hover:transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-blue-500 dark:text-[#4a9eff]">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Live Chat</h4>
                  </div>
                  <p className="text-gray-600 dark:text-[#888] text-sm mb-1">Available Monday - Friday</p>
                  <div className="text-blue-500 dark:text-[#4a9eff] text-sm font-medium">9 AM - 6 PM PST</div>
                </div>

                {/* Phone Support */}
                <div className="bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-5 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:border-red-500/50 dark:hover:border-[#20b2aa] hover:transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-red-500 dark:text-[#ff6b6b]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Phone Support</h4>
                  </div>
                  <p className="text-gray-600 dark:text-[#888] text-sm mb-1">+1 (555) 123-4567</p>
                  <div className="text-red-500 dark:text-[#ff6b6b] text-sm font-medium">Business Hours</div>
                </div>
              </div>
            </div>

            {/* Response Times */}
            <div className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600 dark:text-[#888]" />
                Response Times
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-[#888] text-sm">Email:</span>
                  <span className="text-teal-600 dark:text-[#20b2aa] text-sm font-medium">&lt; 24 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-[#888] text-sm">Chat:</span>
                  <span className="text-teal-600 dark:text-[#20b2aa] text-sm font-medium">&lt; 2 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-[#888] text-sm">Phone:</span>
                  <span className="text-teal-600 dark:text-[#20b2aa] text-sm font-medium">Immediate</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-[#888] text-sm">Priority:</span>
                  <span className="text-teal-600 dark:text-[#20b2aa] text-sm font-medium">&lt; 1 hour</span>
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
