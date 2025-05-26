
import React from "react";
import CommentGenerator from "@/components/CommentGenerator";
import AutoAuthModal from "@/components/AutoAuthModal";

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

      <AutoAuthModal />
    </div>
  );
};

export default Index;
