import React from "react";

interface QuoteProps {
  children: React.ReactNode;
  onQuoteClicked: (quote: string) => void;
}

export function Quote({ children, onQuoteClicked }: QuoteProps) {
  const handleClick = () => {
    if (onQuoteClicked) {
      const quoteText = React.Children.toArray(children)
        .map((child) => {
          if (typeof child === "string") {
            return child.trim(); // Remove unnecessary whitespace
          } else if (React.isValidElement(child)) {
            return React.Children.toArray(child.props.children)
              .map((subChild) =>
                typeof subChild === "string" ? subChild.trim() : ""
              )
              .join("");
          } else {
            return "";
          }
        })
        .join(" ")
        .trim();
      onQuoteClicked(quoteText);
    }
  };
  return (
    <blockquote className="bg-gray-100 border-l-4 border-blue-500 text-gray-700 italic p-4 flex justify-between">
      {children}
      <button onClick={handleClick} className="text-blue-500">
        Add
      </button>
    </blockquote>
  );
}
