"use client";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import SearchHeader from "./components/search-header";
import DOMPurify from "dompurify";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import { Quote } from "../components/quote";
import { jsx, jsxs } from "react/jsx-runtime";
import { attachQuoteToUser, getActiveSub, QuoteArg } from "../actions/actions";
import Toast from "../components/toast";
import Loading from "../components/loading";
import DrawerShad from "./components/drawer";

const preProcessMarkdown = (text: string) => {
  return text.replace(/\[quote\](.*?)\[\/quote\]/g, "> $1");
};

export default function Page() {
  const [input, setInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState({
    text: "",
    subText: "",
  });

  const [isSubActive, setIsSubActive] = useState<boolean>(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInput(e.target.value);
  };

  const handleSearch = async () => {
    if (!isSubActive) {
      return <DrawerShad />;
    }

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

      if (!response.ok) {
        console.error("Error searching for book: ");
        setIsError(true);
        setErrorMessage("Something went wrong. Please try again later");
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
            <Quote
              {...props}
              onQuoteClicked={addedQuote}
              currentInput={input}
            />
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

  const addedQuote = async (quote: string) => {
    try {
      const addedQuote = DOMPurify.sanitize(quote);

      const attachmentObject: QuoteArg = {
        quote: addedQuote,
        book: input,
      };

      const awaitAttachment = await attachQuoteToUser(attachmentObject);

      if (awaitAttachment.status === 201) {
        setToastVisible(true);
        setToastMessage({
          text: "Quote added successfully",
          subText: "Check your dashboard for your quotes",
        });
        setTimeout(() => {
          setToastVisible(false);
        }, 3000);
        return;
      }
      // Show an error toast
      setToastVisible(true);
      setToastMessage({
        text: "Error adding quote",
        subText: "Please try again",
      });
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    } catch (error) {
      // Show an error toast
      setToastVisible(true);
      setToastMessage({
        text: "Error adding quote",
        subText: "Please try again",
      });
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };

  const renderToast = () => {
    if (!toastVisible) {
      return null;
    }
    return <Toast text={toastMessage.text} subText={toastMessage.subText} />;
  };

  useEffect(() => {
    const checkSub = async () => {
      const sub = await getActiveSub();

      console.log(sub);
      if (sub.status === 200) {
        setIsSubActive(sub.activeSub || false);
      }
    };

    checkSub();
  }, []);

  return (
    <div className="min-h-screen sm:mx-auto mx-14">
      <SearchHeader
        isActiveSub={isSubActive}
        handleSearchInput={handleSearchInput}
        handleSearch={handleSearch}
      />
      {isError && (
        <div className="text-red-500 text-center mt-4">{errorMessage} 😳</div>
      )}
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loading />
        </div>
      ) : (
        <div className="mt-16 space-y-6 pb-8">{renderMarkdown(output)}</div>
      )}

      {/* Toast */}
      {renderToast()}
    </div>
  );
}

function Header({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="font-bold text-base text-black">{children}</div>;
}

function Paragraph({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="text-black">{children}</div>;
}
