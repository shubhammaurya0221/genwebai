import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { useState } from "react";
import { Code2, MessageSquare, Monitor, Rocket, Send, X } from "lucide-react";
import { useRef } from "react";
import { AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

function WebsiteEditor() {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([]);
  const iframeRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [thinkingIndex, settTinkingIndex] = useState(0);

  const handleDeploy = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/website/deploy/${website._id}`,
        {
          withCredentials: true,
        },
      );
      window.open(result.data.url, "_blank");
    } catch (error) {
      console.log(error);
    }
  };

  const thinkingSteps = [
    "understanding your request...",
    "Planning layout changes...",
    "Improving responsiveness...",
    "Finalizing animations...",
    "Finalizing Update...",
  ];

  // handling update
  const handleUpdate = async () => {
    if (!prompt) return;
    setUpdateLoading(true);
    const text = prompt;
    setPrompt("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    try {
      const result = await axios.post(
        `${serverUrl}/api/website/update/${id}`,
        { prompt },
        { withCredentials: true },
      );
      setUpdateLoading(false);
      console.log(result);
      setMessages((m) => [...m, { role: "ai", content: result.data.message }]);
      setCode(result.data.code);
    } catch (error) {
      setUpdateLoading(false);
      console.log(error);
    }
  };

  // thinking
  useEffect(() => {
    if (!updateLoading) return;

    const interval = setInterval(() => {
      settTinkingIndex((i) => (i + 1) % thinkingSteps.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [updateLoading]);

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/get-by-id/${id}`,
          { withCredentials: true },
        );
        // console.log(result)
        setWebsite(result.data);
        setCode(result.data.latestCode);
        setMessages(result.data.conversation);
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
      }
    };
    handleGetWebsite();
  }, [id]);

  useEffect(() => {
    if (!iframeRef.current || !code) return;
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [code]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400">
        Loding...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
      {/* Left chat section */}
      <aside className="hidden lg:flex w-90 flex-col border boder-r border-white/10 bg-black/80">
        {/* Header */}
        <div className="h-14 px-4 flex items-center justify-between border-b bg-black border-white/10">
          <span className="font-semibold truncate">{website.title}</span>
        </div>
        {/* Chat section */}
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-black">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] ${
                  m.role === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-white text-black"
                      : "bg-white/5 border border-white/10 text-zinc-200"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {updateLoading && (
              <div className="max-w-[85%] mr-auto">
                <div className="px-4 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
                  {thinkingSteps[thinkingIndex]}
                </div>
              </div>
            )}
          </div>
          {/* TextArea for Chat */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                row="1"
                placeholder="Describe Changes..."
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
                className="flex-1
              resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm
              outline-none"
              />
              <button
                onClick={handleUpdate}
                disabled={updateLoading}
                className="px-4 py-3 rounded-2xl bg-white text-black"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </>
      </aside>
      {/* Preview Section */}
      <div className="flex-1 flex flex-col ">
        <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
          <span className="text-xs text-zinc-400">Live Preview</span>
          <div className="flex gap-2">
            {website.handleDeployed ? (
              ""
            ) : (
              <button
                onClick={() => handleDeploy}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition"
              >
                <Rocket size={14} /> Deploy
              </button>
            )}
            <button
              className="p-2 lg:hidden"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare size={18} />
            </button>
            <button className="p-2" onClick={() => setShowCode(!showCode)}>
              <Code2 size={18} />
            </button>
            <button
              className="p-2"
              onClick={() => setShowFullPreview(!showCode)}
            >
              <Monitor size={18} />
            </button>
          </div>
        </div>
        <iframe ref={iframeRef} className="flex-1 w-full bg-white" />
      </div>
      {/* Show Chat for mobile */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="
          fixed bottom-0 left-0 right-0
          sm:bottom-6 sm:right-6 sm:left-auto
          w-full sm:w-[380px]
          h-[100dvh] sm:h-[550px]
          bg-black/95 backdrop-blur-xl
          border border-white/10
          rounded-none sm:rounded-3xl
          shadow-2xl
          flex flex-col
          z-50"
          >
            {/* Header */}
            <div className="h-14 px-4 flex items-center gap-3 border-b border-white/10 bg-black sticky top-0 z-10">
              {/* ❌ Close Button */}
              <button
                onClick={() => setShowChat(false)}
                className="text-white/60 hover:text-white transition"
              >
                ✕
              </button>

              <span className="font-semibold truncate text-sm">
                {website.title}
              </span>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-black">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] ${
                    m.role === "user" ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                      m.role === "user"
                        ? "bg-white text-black"
                        : "bg-white/5 border border-white/10 text-zinc-200"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {updateLoading && (
                <div className="max-w-[85%] mr-auto">
                  <div className="px-4 py-2.5 rounded-xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
                    {thinkingSteps[thinkingIndex]}
                  </div>
                </div>
              )}
            </div>

            {/* Input Box */}
            <div className="p-3 border-t border-white/10 bg-black sticky bottom-0">
              <div className="flex gap-2">
                <input
                  placeholder="Describe Changes..."
                  onChange={(e) => setPrompt(e.target.value)}
                  value={prompt}
                  className="flex-1 rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none"
                />
                <button
                  onClick={handleUpdate}
                  disabled={updateLoading}
                  className="px-4 py-3 rounded-2xl bg-white text-black"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Monaco Code Editor */}
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-[#1e1e1e]
            flex flex-col"
          >
            <div
              className="h-12 px-4 flex justify-between items-center border-b
            border-white/10 bg-[#1e1e1e]"
            >
              <span className="text-sm font-medium">index.html</span>
              <button onClick={() => setShowCode(false)}>
                <X size={18} />
              </button>
            </div>
            <Editor
              height="100%"
              defaultLanguage="html"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Live Preview */}
      <AnimatePresence>
        {showFullPreview && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-0 z-[9999] bg-black"
          >
            <iframe
              className="h-full w-full bg-white"
              srcDoc={code}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
            <button
              onClick={() => setShowFullPreview(!showFullPreview)}
              className="absolute top-4 right-4 p-2 bg-black/70 rounded-lg"
            >
              X
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default WebsiteEditor;
