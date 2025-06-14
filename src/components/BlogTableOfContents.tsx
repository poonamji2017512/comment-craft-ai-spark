
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TableOfContents } from 'lucide-react';

interface TableOfContentsProps {
  sections: { id: string; title: string; level: number }[];
}

const BlogTableOfContents = ({ sections }: TableOfContentsProps) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Card className="mb-8 bg-muted/50 border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <TableOfContents className="w-5 h-5" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className={`text-left w-full text-sm hover:text-primary transition-colors ${
                  section.level === 1 
                    ? 'font-medium text-foreground' 
                    : 'text-muted-foreground pl-4'
                }`}
              >
                {section.title}
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default BlogTableOfContents;
