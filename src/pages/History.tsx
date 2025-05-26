
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  original_post: string;
  platform: string;
  tone: string;
  generated_text: string;
  character_count: number;
  created_at: string;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching history:', error);
        toast.error('Failed to load comment history');
        return;
      }

      setHistory(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while loading history');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Comment copied to clipboard!');
  };

  const deleteComment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('generated_comments')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
        return;
      }

      setHistory(history.filter(item => item.id !== id));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while deleting the comment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Comment History</h1>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading your comment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Comment History</h1>
      
      <div className="space-y-4">
        {history.map((item) => (
          <Card key={item.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{item.platform}</Badge>
                  <Badge variant="outline">{item.tone}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(item.created_at)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4 leading-relaxed">
                {item.generated_text}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(item.generated_text)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteComment(item.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {history.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No comment history yet. Generate your first comment to see it here!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;
