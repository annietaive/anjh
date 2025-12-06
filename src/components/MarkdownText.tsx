import React from 'react';

interface MarkdownTextProps {
  content: string;
  className?: string;
}

export function MarkdownText({ content, className = '' }: MarkdownTextProps) {
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Empty line - add spacing
      if (line.trim() === '') {
        elements.push(<div key={key++} className="h-2" />);
        continue;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="font-semibold text-lg mt-4 mb-2">
            {parseLine(line.substring(4))}
          </h3>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="font-semibold text-xl mt-4 mb-2">
            {parseLine(line.substring(3))}
          </h2>
        );
        continue;
      }
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="font-semibold text-2xl mt-4 mb-2">
            {parseLine(line.substring(2))}
          </h1>
        );
        continue;
      }

      // Lists with bullets
      if (line.match(/^[•✨✅❌📚🎯🔢💬✍️→➜⭐🌟]/)) {
        elements.push(
          <div key={key++} className="flex gap-2 my-1">
            <span className="flex-shrink-0">{line[0]}</span>
            <span className="flex-1">{parseLine(line.substring(1).trim())}</span>
          </div>
        );
        continue;
      }

      // Lists with - or *
      if (line.match(/^[\s]*[-*]\s/)) {
        const indent = line.match(/^[\s]*/)?.[0].length || 0;
        elements.push(
          <div key={key++} className="flex gap-2 my-1" style={{ paddingLeft: `${indent * 8}px` }}>
            <span className="flex-shrink-0">•</span>
            <span className="flex-1">{parseLine(line.replace(/^[\s]*[-*]\s/, ''))}</span>
          </div>
        );
        continue;
      }

      // Numbered lists
      if (line.match(/^\d+\.\s/)) {
        elements.push(
          <div key={key++} className="flex gap-2 my-1">
            <span className="flex-shrink-0">{line.match(/^\d+\./)?.[0]}</span>
            <span className="flex-1">{parseLine(line.replace(/^\d+\.\s/, ''))}</span>
          </div>
        );
        continue;
      }

      // Code blocks (inline)
      if (line.trim().startsWith('```')) {
        const codeLines: string[] = [];
        i++; // Skip opening ```
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre key={key++} className="bg-gray-100 text-gray-800 p-3 rounded-lg my-2 overflow-x-auto text-sm">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        continue;
      }

      // Regular paragraph
      elements.push(
        <p key={key++} className="my-1">
          {parseLine(line)}
        </p>
      );
    }

    return elements;
  };

  const parseLine = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold + Italic: ***text***
      const boldItalicMatch = remaining.match(/^\*\*\*(.+?)\*\*\*/);
      if (boldItalicMatch) {
        parts.push(
          <strong key={key++} className="font-semibold">
            <em className="italic">{boldItalicMatch[1]}</em>
          </strong>
        );
        remaining = remaining.substring(boldItalicMatch[0].length);
        continue;
      }

      // Bold: **text**
      const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
      if (boldMatch) {
        parts.push(
          <strong key={key++} className="font-semibold">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.substring(boldMatch[0].length);
        continue;
      }

      // Italic: *text*
      const italicMatch = remaining.match(/^\*(.+?)\*/);
      if (italicMatch) {
        parts.push(
          <em key={key++} className="italic">
            {italicMatch[1]}
          </em>
        );
        remaining = remaining.substring(italicMatch[0].length);
        continue;
      }

      // Inline code: `code`
      const codeMatch = remaining.match(/^`(.+?)`/);
      if (codeMatch) {
        parts.push(
          <code key={key++} className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm">
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.substring(codeMatch[0].length);
        continue;
      }

      // Links: [text](url)
      const linkMatch = remaining.match(/^\[(.+?)\]\((.+?)\)/);
      if (linkMatch) {
        parts.push(
          <a
            key={key++}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.substring(linkMatch[0].length);
        continue;
      }

      // Regular text - find next special character
      const nextSpecial = remaining.search(/[\*`\[]/);
      if (nextSpecial === -1) {
        // No more special characters
        parts.push(<span key={key++}>{remaining}</span>);
        break;
      } else if (nextSpecial > 0) {
        // Add text before next special character
        parts.push(<span key={key++}>{remaining.substring(0, nextSpecial)}</span>);
        remaining = remaining.substring(nextSpecial);
      } else {
        // Special character at start but no match - treat as regular text
        parts.push(<span key={key++}>{remaining[0]}</span>);
        remaining = remaining.substring(1);
      }
    }

    return parts;
  };

  return <div className={className}>{parseMarkdown(content)}</div>;
}
