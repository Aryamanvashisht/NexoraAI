import {
  Check,
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { easeInOut, motion } from "motion/react";
import Editor from "@monaco-editor/react";
import {detectLanguage} from "../../utils/detectLanguage.js"

const Artifact = () => {
  const { artifact } = useSelector((state) => state.message);
  const [collapse, setCollapsed] = useState(true);
  const [tab, setTab] = useState("preview");
  const [activeFile, setActiveFile] = useState(0);
  const [copyCode, setCopyCode] = useState(false);
  if (!artifact || artifact.length === 0) return null;

  const files = artifact[0]?.files || [];
  const file = artifact[0]?.files[activeFile]
  const htmlFile = files.find((f) => f.name === "index.html");
  const cssFile = files.find((f) => f.name === "style.css");
  const jsFile = files.find((f) => f.name === "script.js");
  const canPreview = Boolean(htmlFile);

   const handleCopyCode = async (code) => {
     await navigator.clipboard.writeText(code);
     setCopyCode(true);
     setTimeout(() => {
       setCopyCode(false);
     }, 1000);
   };

  const buildPreviewDoc = () => {
    let html = htmlFile?.content || "";
    const css = cssFile?.content || "";
    const js = jsFile?.content || "";

    html = html?.replace(
      /<link[^>]*href=["']style\.css["'][^>]*>/i,
      `<style>${css}</style>`,
    );

    html = html?.replace(
      /<script[^>]*src=["']script\.js["'][^>]*>\s*<\/script>/i,
      () => `<script>${js}<\/script>`,
    );

    return html;
  };
  const previewDoc = buildPreviewDoc();

  return (
    <motion.div
      initial={{ width: 48 }}
      animate={{ width: collapse ? 48 : 400 }}
      transition={{
        duration: 0.25,
        ease: easeInOut,
      }}
      className="hidden lg:flex h-full border border-white/6 flex-col overflow-hidden shrink-0 w-50"
    >
      {!collapse ? (
        <div className="flex flex-col h-full bg-[#0d0f14]">
          <div className="h-14 px-4 border-b border-white/6 flex items-center gap-3 shrink-0">
            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
              onClick={() => setCollapsed(true)}
            >
              <PanelRightClose />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500 shrink-0">
                <Code2 size={12} className="text-indigo-400" />
              </div>
              <div className="text-[13px] font-medium text-slate-200 truncate">
                {artifact[0]?.title}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                className="flex items-center gap-1.5 px-2.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer"
                onClick={() => handleCopyCode(file?.content)}
              >
                {copyCode ? <Check size={17} /> : <Copy size={17} />}
              </button>
            </div>
            {canPreview && (
              <div className="flex items-center gap-1 bg-white/4 border border-white/6 p-1 rounded-lg">
                <button
                  onClick={() => setTab("code")}
                  className={`cursor-pointer flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 ${tab === "code" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-200"}`}
                >
                  <Code2 size={17} />
                </button>
                <button
                  onClick={() => setTab("preview")}
                  className={`cursor-pointer flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150 ${tab === "preview" ? "bg-indigo-500 text-white" : "text-slate-500 hover:text-slate-200"}`}
                >
                  <Eye size={17} />
                </button>
              </div>
            )}
          </div>

          {tab === "code" && (
            <div className="h-auto flex border-b border-white/6 overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden shrink-0">
              {files?.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFile(i)}
                  className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/5 relative cursor-pointer bg-transparent ${activeFile === i ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
                >
                  {f?.name}
                  {activeFile === i && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            {tab === "preview" && canPreview ? (
              <motion.div
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <iframe
                  srcDoc={previewDoc}
                  title="Preview"
                  sandbox="allow-scripts"
                  className="h-full w-full bg-white"
                />
              </motion.div>
            ) : (
              <motion.div
                className="h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Editor
                  theme="vs-dark"
                  language={detectLanguage(file?.name)}
                  value={file?.content}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    wordWrap: "on",
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16 },
                    lineNumbers: "on",
                    renderLineHighlight: "none",
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex h-full border border-white/6 bg-[#0d0f14] flex-col items-center py-4 gap-3 shrink-0">
          <button
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
            onClick={() => setCollapsed(false)}
          >
            <PanelRightOpen />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap"
              style={{
                writingMode: "vertical-lr",
              }}
            >
              {artifact[0]?.title}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Artifact;
