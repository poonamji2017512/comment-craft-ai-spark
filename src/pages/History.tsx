
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import CommentCard from "@/components/CommentCard";
import { Search, Filter, Calendar, BarChart3 } from "lucide-react";

interface Comment {
  id: string;
  platform: string;
  original_post: string;
  generated_text: string;
  tone: string;
  character_count: number;
  created_at: string;
}

const History = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedTone, setSelectedTone] = useState<string>("all");

  useEffect(() => {
    if (user) {
      fetchComments();
    }
  }, [user]);

  useEffect(() => {
    filterComments();
  }, [comments, searchTerm, selectedPlatform, selectedTone]);

  const fetchComments = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('generated_comments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterComments = () => {
    let filtered = comments;

    if (searchTerm) {
      filtered = filtered.filter(comment =>
        comment.original_post.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.generated_text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPlatform !== "all") {
      filtered = filtered.filter(comment => comment.platform === selectedPlatform);
    }

    if (selectedTone !== "all") {
      filtered = filtered.filter(comment => comment.tone === selectedTone);
    }

    setFilteredComments(filtered);
  };

  const getUniqueValues = (key: keyof Comment) => {
    return Array.from(new Set(comments.map(comment => comment[key])));
  };

  const getStats = () => {
    const totalComments = comments.length;
    const platforms = getUniqueValues('platform').length;
    const avgLength = comments.length > 0 
      ? Math.round(comments.reduce((sum, comment) => sum + comment.character_count, 0) / comments.length)
      : 0;
    const thisMonth = comments.filter(comment => 
      new Date(comment.created_at).getMonth() === new Date().getMonth()
    ).length;

    return { totalComments, platforms, avgLength, thisMonth };
  };

  const stats = getStats();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Please sign in to view your comment history.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">Comment History</h1>
        <Button onClick={fetchComments} variant="outline" className="border-border text-foreground hover:bg-muted">
          <Calendar className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Comments</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalComments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Platforms Used</p>
                <p className="text-2xl font-bold text-foreground">{stats.platforms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Length</p>
                <p className="text-2xl font-bold text-foreground">{stats.avgLength}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-foreground">{stats.thisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 border border-border bg-background text-foreground rounded-md"
              >
                <option value="all">All Platforms</option>
                {getUniqueValues('platform').map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>

              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="px-3 py-2 border border-border bg-background text-foreground rounded-md"
              >
                <option value="all">All Tones</option>
                {getUniqueValues('tone').map(tone => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
            </div>
          </div>

          {(searchTerm || selectedPlatform !== "all" || selectedTone !== "all") && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  Search: {searchTerm}
                </Badge>
              )}
              {selectedPlatform !== "all" && (
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  Platform: {selectedPlatform}
                </Badge>
              )}
              {selectedTone !== "all" && (
                <Badge variant="secondary" className="bg-muted text-muted-foreground">
                  Tone: {selectedTone}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedPlatform("all");
                  setSelectedTone("all");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading your comments...</p>
        </div>
      ) : filteredComments.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              {comments.length === 0 
                ? "No comments generated yet. Start by creating your first AI comment!"
                : "No comments match your current filters."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredComments.length} of {comments.length} comments
            </p>
          </div>
          
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
