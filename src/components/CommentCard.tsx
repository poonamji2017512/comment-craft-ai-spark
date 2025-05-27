
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Twitter, Linkedin, Facebook, Instagram, MessageCircle, Youtube } from "lucide-react";
import { toast } from "sonner";

interface Comment {
  id: string;
  platform: string;
  original_post: string;
  generated_text: string;
  tone: string;
  character_count: number;
  created_at: string;
}

interface CommentCardProps {
  comment: Comment;
}

const platformIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  reddit: MessageCircle,
  youtube: Youtube,
};

const platformColors = {
  twitter: "bg-blue-500",
  linkedin: "bg-blue-700",
  facebook: "bg-blue-600",
  instagram: "bg-pink-500",
  reddit: "bg-orange-500",
  youtube: "bg-red-500",
};

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(comment.generated_text);
      toast.success("Comment copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy comment");
    }
  };

  const PlatformIcon = platformIcons[comment.platform as keyof typeof platformIcons] || MessageCircle;
  const platformColor = platformColors[comment.platform as keyof typeof platformColors] || "bg-gray-500";

  return (
    <Card className="bg-card border-border text-foreground hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${platformColor} p-2 rounded-lg`}>
              <PlatformIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-foreground capitalize">{comment.platform}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {comment.tone}
            </Badge>
            <Badge variant="outline" className="border-border text-foreground">
              {comment.character_count} chars
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Original Post:</h4>
            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg border border-border">
              {comment.original_post}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">Generated Comment:</h4>
            <p className="text-sm text-foreground bg-background p-3 rounded-lg border border-border">
              {comment.generated_text}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button 
            onClick={copyToClipboard} 
            variant="outline" 
            size="sm"
            className="border-border text-foreground hover:bg-muted"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
