
import React from "react";
import CommentGenerator from "@/components/CommentGenerator";
import AutoAuthModal from "@/components/AutoAuthModal";
import FloatingAuthModal from "@/components/FloatingAuthModal";

const Index = () => {
  return (
    <div className="min-h-full bg-background flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your AI Comment Companion
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate thoughtful comments and replies with AI assistance. Perfect for social media, forums, and professional networks.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <CommentGenerator />
        </div>
      </main>

      {/* Simple transparent footer */}
      <footer className="bg-transparent border-t border-border/20 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Pro</a>
            <a href="#" className="hover:text-foreground transition-colors">Ultra</a>
            <a href="#" className="hover:text-foreground transition-colors">Enterprise</a>
            <a href="#" className="hover:text-foreground transition-colors">Shop</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </footer>

      <AutoAuthModal />
      <FloatingAuthModal />
    </div>
  );
};

export default Index;
