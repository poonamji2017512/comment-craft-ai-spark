
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const ToneStyleSettings = () => {
  const [selectedTone, setSelectedTone] = useState("professional");

  const toneCategories = {
    short: [
      { id: "casual", name: "Casual", description: "Relaxed and friendly" },
      { id: "brief", name: "Brief", description: "Short and to the point" },
      { id: "witty", name: "Witty", description: "Clever and amusing" },
    ],
    medium: [
      { id: "professional", name: "Professional", description: "Formal business tone" },
      { id: "enthusiastic", name: "Enthusiastic", description: "Energetic and positive" },
      { id: "supportive", name: "Supportive", description: "Encouraging and helpful" },
      { id: "analytical", name: "Analytical", description: "Data-driven and logical" },
      { id: "conversational", name: "Conversational", description: "Natural dialogue style" },
      { id: "empathetic", name: "Empathetic", description: "Understanding and caring" },
    ],
    long: [
      { id: "detailed", name: "Detailed", description: "Comprehensive and thorough" },
      { id: "educational", name: "Educational", description: "Informative and instructive" },
      { id: "storytelling", name: "Storytelling", description: "Narrative and engaging" },
    ]
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "short": return "Short Form";
      case "medium": return "Medium Form";
      case "long": return "Long Form";
      default: return category;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "short": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "long": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Tone & Style Settings</h3>
        <p className="text-sm text-muted-foreground">
          Choose the tone and style for your AI-generated comments
        </p>
      </div>

      {Object.entries(toneCategories).map(([category, tones]) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className={getCategoryBadgeColor(category)}>
              {getCategoryTitle(category)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {tones.length} options
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tones.map((tone) => (
              <Card
                key={tone.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedTone === tone.id
                    ? "ring-2 ring-primary border-primary"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedTone(tone.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{tone.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {tone.description}
                      </p>
                    </div>
                    {selectedTone === tone.id && (
                      <div className="ml-2 flex-shrink-0">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t">
        <Button className="w-full">
          Save Tone & Style Settings
        </Button>
      </div>
    </div>
  );
};

export default ToneStyleSettings;
