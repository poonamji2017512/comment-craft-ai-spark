
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, ThumbsUp, ThumbsDown, Edit, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommentSuggestion {
  id: number;
  text: string;
  platform: string;
  length: number;
}

interface CommentCardProps {
  suggestion: CommentSuggestion;
  index: number;
}

const CommentCard: React.FC<CommentCardProps> = ({ suggestion, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(suggestion.text);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      toast({
        title: "Copied!",
        description: "Comment copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const saveEdit = () => {
    setIsEditing(false);
    toast({
      title: "Comment updated",
      description: "Your changes have been saved.",
    });
  };

  const cancelEdit = () => {
    setEditedText(suggestion.text);
    setIsEditing(false);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    toast({
      title: "Feedback received",
      description: `Thanks for your ${type === 'up' ? 'positive' : 'negative'} feedback!`,
    });
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      twitter: 'bg-blue-50 text-blue-700 border-blue-200',
      linkedin: 'bg-blue-50 text-blue-700 border-blue-200',
      reddit: 'bg-orange-50 text-orange-700 border-orange-200',
      bluesky: 'bg-sky-50 text-sky-700 border-sky-200'
    };
    return colors[platform as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getCharacterCount = () => {
    const maxLengths = {
      twitter: 280,
      linkedin: 3000,
      reddit: 10000,
      bluesky: 300
    };
    const max = maxLengths[suggestion.platform as keyof typeof maxLengths] || 280;
    const current = editedText.length;
    const percentage = (current / max) * 100;
    
    let colorClass = 'text-green-600';
    if (percentage > 80) colorClass = 'text-yellow-600';
    if (percentage > 95) colorClass = 'text-red-600';
    
    return { current, max, colorClass };
  };

  const charCount = getCharacterCount();

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Suggestion #{index + 1}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full border ${getPlatformColor(suggestion.platform)}`}>
              {suggestion.platform.charAt(0).toUpperCase() + suggestion.platform.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback('up')}
              className={`h-8 w-8 p-0 ${feedback === 'up' ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-green-600'}`}
            >
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFeedback('down')}
              className={`h-8 w-8 p-0 ${feedback === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600'}`}
            >
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-20 resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className={`text-sm ${charCount.colorClass}`}>
                {charCount.current}/{charCount.max} characters
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelEdit}
                  className="text-gray-600"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={saveEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-800 leading-relaxed mb-4 text-base">
              {editedText}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`text-sm ${charCount.colorClass}`}>
                {charCount.current} characters
              </span>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="text-gray-600 hover:text-gray-900 border-gray-200"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentCard;
