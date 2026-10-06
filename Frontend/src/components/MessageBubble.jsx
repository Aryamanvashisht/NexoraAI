import { useState } from "react";
import { createPortal } from "react-dom";
import Markdown from "react-markdown";
import { Check, Copy, ExternalLink, X } from "lucide-react";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageBubble = ({ role, content, images = [] }) => {
  const isUser = role === "user";
  const [imageBox, setImageBox] = useState(null);
  const [copyCode, setCopyCode] = useState("");

  const handleCopyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopyCode(code);
    setTimeout(() => {
      setCopyCode("");
    }, 2000);
  };

  return (
    <div className={`flex mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 py-2.5 rounded-2xl wrap-break-word overflow-hidden leading-relaxed ${
          isUser
            ? "bg-linear-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm"
            : "text-slate-200 rounded-tl-sm"
        }`}
      >
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setImageBox(img)}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => (e.currentTarget.style.display = "none")}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition"
              />
            ))}
          </div>
        )}
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mt-5 mb-3">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mt-4 mb-2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-semibold mt-3 mb-2">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="text-[15px] mb-3 whitespace-pre-wrap wrap-break-word">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 space-y-1 my-2">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 space-y-1 my-2">{children}</ol>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-white/10">
                  {children}
                </table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-white/10 bg-white/5 px-3 py-2 text-left">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-white/10 px-3 py-2">{children}</td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 underline inline-flex items-center gap-1"
              >
                {children}
                <ExternalLink />
              </a>
            ),
            code: ({ className, children }) => {
              const value = String(children).replace(/\n$/, "");
              const language = className?.replace("language-", "") || "text";
              const isInline = !className && !value.includes("\n");

              if (isInline) {
                return (
                  <code className="px-1.5 py-0.5 rounded bg-white/10 text-indigo-300">
                    {value}
                  </code>
                );
              }

              return (
                <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-[#111318]">
                  <div className="flex items-center justify-between bg-[#1b1d24] border-b border-white/10 px-4 py-2">
                    <span className="uppercase text-xs text-slate-400">
                      {language}
                    </span>
                    <button
                      className="flex items-center gap-1.5 text-xs text-slate-400 px-2 py-1 rounded-md cursor-pointer transition-colors duration-200 hover:text-white hover:bg-white/10"
                      onClick={() => handleCopyCode(value)}
                    >
                      {copyCode === value ? (
                        <>
                          <Check size={16} />
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                        </>
                      )}
                    </button>
                  </div>

                  <SyntaxHighlighter
                    language={language}
                    style={oneDark}
                    wrapLongLines
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      padding: "16px",
                      background: "#0d1117",
                      fontSize: "13px",
                    }}
                  >
                    {value}
                  </SyntaxHighlighter>
                </div>
              );
            },
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                referrerPolicy="no-referrer"
                loading="lazy"
                onClick={() => setImageBox(src)}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 my-2 cursor-zoom-in"
              />
            ),
          }}
        >
          {content}
        </Markdown>
      </div>

      {imageBox &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setImageBox(null)}
          >
            <button
              onClick={() => setImageBox(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2 cursor-pointer"
            >
              <X />
            </button>
            <img
              src={imageBox}
              onClick={(e) => e.stopPropagation()}
              className="h-[85vh] w-auto max-w-[90vw] rounded-2xl border border-white/10 shadow-2xl object-contain bg-white"
            />
          </div>,
          document.body,
        )}
    </div>
  );
};

export default MessageBubble;
