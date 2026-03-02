import { ArrowLeft, Check, Rocket, Share, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { serverUrl } from "../App";

function Dashboard() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [websites, setWebsites] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const handleDeploy = async (id) => {
    try {
      const result = await axios.get(`${serverUrl}/api/website/deploy/${id}`, {
        withCredentials: true,
      });

      window.open(result.data.url, "_blank");

      setWebsites((prev) =>
        prev.map((w) =>
          w._id === id
            ? { ...w, deployed: true, deployUrl: result.data.url }
            : w,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const handleGetAllWebsites = async () => {
      setLoading(true);
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, {
          withCredentials: true,
        });
        console.log("webites data", result.data);
        setWebsites(result.data.websites);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.response.data.message);
        setLoading(false);
      }
    };
    handleGetAllWebsites();
  }, []);

  const handleCopy = async (site) => {
    await navigator.clipboard.writeText(site.deployUrl);
    setCopiedId(site._id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Go Back buutton */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>

          {/* Create website */}
          <button
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition"
            onClick={() => navigate("/generate")}
          >
            + New Website
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm text-zinc-400 mb-1">Welcome Back</p>
          <h1 className="text-3xl font-bold">{userData?.name}</h1>
        </motion.div>
        {loading && <div>Loading YOur Websites...</div>}
        {error && !loading && (
          <div className="mt-24 text-center text-red-400">{error}</div>
        )}

        {websites?.length == 0 && (
          <div className="mt-24 text-center text-zinc-400">
            You have no websites
          </div>
        )}

        {!loading && !error && websites?.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {websites.map((w, i) => {
              const copied = copiedId === w._id;

              return (
                <motion.div
                  key={w._id}
                  onClick={() => navigate(`/editor/${w._id}`)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-3xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-purple-500/40 overflow-hidden transition-all shadow-xl hover:shadow-purple-500/10 flex flex-col"
                >
                  {/* PREVIEW */}
                  <div className="relative h-44 bg-black overflow-hidden">
                    {/* Glow Overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-purple-500/10 blur-2xl"></div>

                    <iframe
                      srcDoc={w.latestCode}
                      className="absolute top-0 left-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white"
                    />

                    {/* Top Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>

                    {/* Floating Status */}
                    {w.deployed && (
                      <div className="absolute top-3 right-3 text-[10px] px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                        Live
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 flex flex-col flex-1 gap-4">
                    <div>
                      <h3 className="text-base font-semibold line-clamp-2 group-hover:text-purple-300 transition">
                        {w.title || "Untitled Project"}
                      </h3>

                      <p className="text-xs text-zinc-400 mt-1">
                        Updated{" "}
                        {w.updatedAt
                          ? new Date(w.updatedAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>

                    {/* CTA */}
                    {w.deployed ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(w);
                        }}
                        className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                          copied
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "bg-white/10 hover:bg-white/20 border-white/10"
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check size={14} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Share2 size={14} />
                            Share
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeploy(w._id);
                        }}
                        className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-[1.02] transition shadow-lg"
                      >
                        <Rocket size={16} />
                        Deploy
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
