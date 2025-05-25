
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommentCard from "@/components/CommentCard";
import AutoAuthModal from "@/components/AutoAuthModal";

const Index = () => {
  // Sample data for the comment card
  const sampleSuggestion = {
    id: 1,
    text: "This is a great post! Thanks for sharing your insights. I particularly found the section about AI integration very helpful.",
    platform: "twitter",
    length: 125
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
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
          <CommentCard suggestion={sampleSuggestion} index={0} />
        </div>
      </main>

      <Footer />
      <AutoAuthModal />
    </div>
  );
};

export default Index;
