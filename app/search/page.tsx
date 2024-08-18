"use client";
import React, { Fragment, useState } from "react";
import SearchHeader from "./components/search-header";
import DOMPurify from "dompurify";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import { Quote } from "../components/quote";
import { jsx, jsxs } from "react/jsx-runtime";

const preProcessMarkdown = (text: string) => {
  return text.replace(/\[quote\](.*?)\[\/quote\]/g, "> $1");
};

export default function Page() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSearch = async () => {
    if (input.length <= 3) {
      return;
    }

    setOutput("");
    setLoading(true);
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
        setLoading(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        // @ts-ignore
        const { value, done: isDone } = await reader?.read();
        done = isDone;
        let isFirstChunk: boolean = true;
        if (value) {
          const chunk = decoder.decode(value);

          if (isFirstChunk) {
            setLoading(false);
            isFirstChunk = false;
          }
          setOutput((prev) => prev + chunk);
        }
      }
    } catch (error) {
      console.error("Error searching for book: ", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const addedQuote = (quote: string) => {
    console.log(DOMPurify.sanitize(quote));
    console.log(input);
  };

  const renderMarkdown = (text: string) => {
    const preProcessed = preProcessMarkdown(text);
    const processedContent = unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeReact, {
        jsx: jsx,
        jsxs: jsxs,
        components: {
          blockquote: (props: any) => (
            <Quote {...props} onQuoteClicked={addedQuote} />
          ),
          p: Paragraph,
          li: Paragraph,
          h1: Header,
          h2: Header,
          h3: Header,
        },
        Fragment,
      } as any)
      .processSync(preProcessed).result;

    return processedContent;
  };

  return (
    <div className="min-h-screen sm:mx-auto mx-14">
      <SearchHeader
        handleSearchInput={handleSearchInput}
        handleSearch={handleSearch}
      />
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : (
        <div className="mt-16 space-y-6 pb-8">{renderMarkdown(output)}</div>
      )}
    </div>
  );
}

function Header({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="font-bold text-base text-black">{children}</div>;
}

function Paragraph({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="text-black">{children}</div>;
}
