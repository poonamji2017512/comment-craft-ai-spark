
import React from 'react';
import { PortableText as BasePortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity';

const PortableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <img
          src={urlFor(value).width(800).height(400).url()}
          alt={value.alt || 'Blog image'}
          className="rounded-lg w-full object-cover"
        />
        {value.alt && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            {value.alt}
          </p>
        )}
      </div>
    ),
    code: ({ value }: any) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
        <code className="text-sm">{value.code}</code>
      </pre>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-foreground mb-6 mt-8">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-foreground mb-4 mt-6">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold text-foreground mb-3 mt-5">
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p className="text-muted-foreground leading-relaxed mb-4">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
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
    code: ({ children }: any) => (
      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
};

interface PortableTextProps {
  value: any[];
}

const PortableText: React.FC<PortableTextProps> = ({ value }) => {
  return (
    <BasePortableText
      value={value}
      components={PortableTextComponents}
    />
  );
};

export default PortableText;
