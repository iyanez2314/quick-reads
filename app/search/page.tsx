"use client";
import React, { useState } from "react";
import SearchHeader from "./components/search-header";
import DOMPurify from "dompurify";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import { Quote } from "../components/quote";
import { jsx, jsxs } from "react/jsx-runtime";

export default function Page() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSearch = async () => {
    if (input.length <= 3) {
      return;
    }
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (response.status !== 200) {
        console.error("Error searching for book: ", response.statusText);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        // @ts-ignore
        const { value, done: isDone } = await reader?.read();
        done = isDone;
        if (value) {
          const chunk = decoder.decode(value);
          setOutput((prev) => prev + chunk);
        }
      }
    } catch (error) {
      console.error("Error searching for book: ", error);
    }
  };

  const renderMarkdown = (text: string) => {
    const cleanHtml = DOMPurify.sanitize(text);
    const processedContent = unified()
      .use(remarkParse) // Parse the Markdown text
      .use(remarkRehype) // Convert Markdown to HTML
      .use(rehypeReact, {
        jsx: jsx,
        jsxs: jsxs,
        createElement: React.createElement,
        components: {
          li: Quote,
          p: Header,
        },
        Fragment: React.Fragment,
      } as any)
      .processSync(cleanHtml).result;

    return processedContent;
  };

  return (
    <div className="min-h-screen sm:mx-auto mx-14">
      <SearchHeader
        handleSearchInput={handleSearchInput}
        handleSearch={handleSearch}
      />
      <div className="mx-14 mt-16 space-y-6">{renderMarkdown(output)}</div>
    </div>
  );
}

function Header({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="font-bold text-base text-black">{children}</div>;
}
