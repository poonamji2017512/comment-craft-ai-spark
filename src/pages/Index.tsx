
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles, Copy, Edit3, ThumbsUp, ThumbsDown, Globe, Upload, Mic, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import PerplexitySidebar from "@/components/PerplexitySidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const Index = () => {
  const [input, setInput] = useState('');
  const [platform, setPlatform] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [comments, setComments] = useState([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast({
        title: "Please enter content",
        description: "Add a post URL or text to generate comments.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockComments = [
        "This is such an insightful perspective! Thanks for sharing your thoughts on this topic. 🔥",
        "Really appreciate you breaking this down. The way you explained it makes so much sense.",
        "Absolutely agree! This aligns perfectly with what I've been experiencing lately. Great post! 👏",
        "Love this take! Have you considered exploring the implications for smaller businesses as well?",
        "This is exactly what I needed to read today. Thanks for the motivation and practical advice! 💯"
      ];
      
      setComments(mockComments.map((text, index) => ({
        id: index + 1,
        text,
        feedback: null
      })));
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Comment copied to clipboard.",
    });
  };

  const handleFeedback = (id, type) => {
    setComments(prev => prev.map(comment => 
      comment.id === id ? { ...comment, feedback: type } : comment
    ));
    toast({
      title: type === 'up' ? "Thanks for the feedback!" : "Feedback noted",
      description: "This helps improve our AI suggestions.",
    });
  };

  const mockWeatherData = {
    location: "Hindu Patti",
    temp: "35°C",
    condition: "Hazy clouds",
    forecast: [
      { day: "Sat", temp: "39°", icon: "☀️" },
      { day: "Sun", temp: "38°", icon: "⛅" },
      { day: "Mon", temp: "36°", icon: "🌤️" },
      { day: "Tue", temp: "37°", icon: "☀️" },
      { day: "Wed", temp: "34°", icon: "⛅" }
    ]
  };

  const mockStocks = [
    { symbol: "AAPL", price: "$195.27", change: "-3.02%" },
    { symbol: "AMZN", price: "$200.99", change: "-1.04%" }
  ];

  const mockNews = [
    { title: "Russia launches major drone and missile...", image: "📰" },
    { title: "Oilers rebound from brutal game 1 loss, sh...", image: "🏒" }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#1a1a1a]">
        <PerplexitySidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center p-4 relative">
            {/* Main Content */}
            <div className="w-full max-w-4xl mx-auto">
              {/* Logo */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-light text-white mb-2">AI Comment Companion</h1>
                <p className="text-gray-400 text-sm">Powered by Gemini 2.5 Pro</p>
              </div>

              {/* Search Input */}
              <div className="relative mb-8">
                <div className="relative">
                  <Textarea
                    placeholder="Enter post URL or paste content to generate comments..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full min-h-[120px] bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 rounded-xl px-4 py-4 pr-20 resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <Globe className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <Upload className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Platform Selection and Generate Button */}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-600 text-blue-400 hover:bg-blue-400/10"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-gray-600 text-gray-400 hover:bg-gray-600/20"
                    >
                      Research
                    </Button>
                  </div>
                  
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger className="w-40 bg-[#2a2a2a] border-gray-600 text-white">
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#2a2a2a] border-gray-600">
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="reddit">Reddit</SelectItem>
                      <SelectItem value="bluesky">Bluesky</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Comments
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Generated Comments */}
              {comments.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">Generated Comments</h3>
                  {comments.map((comment) => (
                    <Card key={comment.id} className="bg-[#2a2a2a] border-gray-600">
                      <CardContent className="p-4">
                        <p className="text-white mb-3">{comment.text}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(comment.text)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white"
                            >
                              <Edit3 className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleFeedback(comment.id, 'up')}
                              className={`${comment.feedback === 'up' ? 'text-green-400' : 'text-gray-400'} hover:text-green-400`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleFeedback(comment.id, 'down')}
                              className={`${comment.feedback === 'down' ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Info Cards */}
            <div className="w-full max-w-4xl mx-auto mt-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Weather Card */}
                <Card className="bg-[#2a2a2a] border-gray-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-white font-medium">{mockWeatherData.temp}</p>
                        <p className="text-gray-400 text-sm">{mockWeatherData.location}</p>
                        <p className="text-gray-400 text-xs">{mockWeatherData.condition}</p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-3">
                      {mockWeatherData.forecast.map((day, index) => (
                        <div key={index} className="text-center">
                          <p className="text-gray-400 text-xs">{day.day}</p>
                          <p className="text-white text-sm">{day.temp}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Stocks Card */}
                <Card className="bg-[#2a2a2a] border-gray-600">
                  <CardContent className="p-4">
                    {mockStocks.map((stock, index) => (
                      <div key={index} className="flex justify-between items-center mb-2">
                        <div>
                          <p className="text-white font-medium">{stock.symbol}</p>
                          <p className="text-gray-400 text-sm">{stock.price}</p>
                        </div>
                        <p className="text-red-400 text-sm">{stock.change}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* News Card */}
                <Card className="bg-[#2a2a2a] border-gray-600">
                  <CardContent className="p-4">
                    {mockNews.map((news, index) => (
                      <div key={index} className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-sm">
                          {news.image}
                        </div>
                        <p className="text-white text-sm leading-tight">{news.title}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Links */}
              <div className="flex justify-center space-x-6 text-gray-400 text-sm pb-6">
                <a href="#" className="hover:text-white">Pro</a>
                <a href="#" className="hover:text-white">Enterprise</a>
                <a href="#" className="hover:text-white">API</a>
                <a href="#" className="hover:text-white">Blog</a>
                <a href="#" className="hover:text-white">Privacy</a>
                <a href="#" className="hover:text-white">Careers</a>
                <a href="#" className="hover:text-white">Store</a>
                <a href="#" className="hover:text-white">Finance</a>
                <a href="#" className="hover:text-white">English</a>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
