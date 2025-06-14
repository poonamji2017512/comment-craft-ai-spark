
import React from 'react';
import { PortableText as PortableTextComponent } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';

const components = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <img
          src={urlFor(value).width(800).url()}
          alt={value.alt || 'Blog image'}
          className="w-full rounded-lg"
        />
        {value.caption && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            {value.caption}
          </p>
        )}
      </div>
    ),
    code: ({ value }: any) => (
      <div className="my-6">
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm font-mono">{value.code}</code>
        </pre>
        {value.filename && (
          <p className="text-xs text-muted-foreground mt-1">
            {value.filename}
          </p>
        )}
      </div>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-foreground mb-6 mt-8" id={children[0]?.toLowerCase().replace(/\s+/g, '-')}>
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-foreground mb-4 mt-8" id={children[0]?.toLowerCase().replace(/\s+/g, '-')}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold text-foreground mb-3 mt-6" id={children[0]?.toLowerCase().replace(/\s+/g, '-')}>
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-semibold text-foreground mb-2 mt-4" id={children[0]?.toLowerCase().replace(/\s+/g, '-')}>
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="text-lg leading-relaxed text-muted-foreground mb-4">
        {children}
      </p>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a 
        href={value.href} 
        className="text-primary hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic">{children}</em>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside my-4 space-y-2 text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside my-4 space-y-2 text-muted-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li>{children}</li>,
    number: ({ children }: any) => <li>{children}</li>,
  },
};

interface PortableTextProps {
  value: any[];
}

const PortableText = ({ value }: PortableTextProps) => {
  return <PortableTextComponent value={value} components={components} />;
};

export default PortableText;
