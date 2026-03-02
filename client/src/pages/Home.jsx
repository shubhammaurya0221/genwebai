import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LoginModal from "../components/loginModal";
import { useDispatch, useSelector } from "react-redux";
import { Coins } from "lucide-react";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
import { Share2, Check } from "lucide-react"; // Import these for the button

function Home() {
  const highlights = [
    "AI Generated Code",
    "Fully Responsive Layouts",
    "Production Ready Output",
  ];
  const dispatch = useDispatch();
  const [openLogin, setOpenLogin] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [openProfile, setOpenProfile] = useState(false);
  const [websites, setWebsites] = useState(null);
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (site) => {
    await navigator.clipboard.writeText(site.deployUrl);
    setCopiedId(site._id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setOpenProfile(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!userData) return;
    const handleGetAllWebsites = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/website/get-all`, {
          withCredentials: true,
        });
        console.log("webites data", result.data);
        setWebsites(result.data.websites);
      } catch (error) {
        console.log(error);
      }
    };
    handleGetAllWebsites();
  }, [userData]);

  return (
    <div className="relative min-h-screen bg-[#040404] text-white overflow-hidden">
      {/* HEADER SECTION */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-lg font-semibold">GenWeb.AI</div>
          <div className="flex items-center gap-5">
            <div
              className="hidden md:inline text-sm text-zinc-400 hover:text-white cursor-pointer"
              onClick={() => navigate("/pricing")}
            >
              Pricing
            </div>
            {userData && (
              <div
                onClick={() => navigate("/pricing")}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition"
              >
                <Coins size={14} className="text-yellow-400 " />
                <span className="text-zinc-300">Credits</span>
                <span>{userData.credits}</span>
                <span className="font-semibold">+</span>
              </div>
            )}

            {!userData ? (
              <button
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm"
                onClick={() => setOpenLogin(true)}
              >
                Get Started
              </button>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center"
                  onClick={() => setOpenProfile(!openProfile)}
                >
                  <img
                    src={
                      userData?.avatar ||
                      userData?.picture ||
                      `https://ui-avatars.com/api/?name=${userData.name}`
                    }
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-full border border-white/20 object-cover"
                  />
                </button>
                <AnimatePresence>
                  {openProfile && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-sm truncate">
                            {userData.name}
                          </p>
                          <p className="text-sm font-medium truncate">
                            {userData.email}
                          </p>
                        </div>
                        <button className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition">
                          <Coins size={14} className="text-yellow-400 " />
                          <span className="text-zinc-300">Credits</span>
                          <span>{userData.credits}</span>
                          <span className="font-semibold">+</span>
                        </button>

                        <button
                          className="w-full px-4 py-3 text-left text-sm hover:bg-white/5"
                          onClick={() => navigate("/dashboard")}
                        >
                          Dashboard
                        </button>
                        <button
                          className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5"
                          onClick={handleLogOut}
                        >
                          Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      {/* HERO SECTION */}
      <section className="pt-44 pb-32 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Build Stunning Website <br />
          <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            With AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 max-w-2xl mx-auto text-zinc-400 text-lg"
        >
          Describe your idea and let AI generate a modern, responsive and
          production ready website.
        </motion.p>
        <button
          className="px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition mt-12"
          onClick={() => {
            if (userData) {
              navigate("/dashboard");
            } else {
              setOpenLogin(true);
            }
          }}
        >
          {userData ? "Go to Dashboard" : "Get Started"}
        </button>
      </section>
      {/* CARD SHOWCASE */}
      {!userData && (
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {highlights.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-white/5 border border-white/10 p-8"
              >
                <h1 className="text-xl font-semibold mb-3">{h}</h1>
                <p className="text-sm text-zinc-400">
                  GenWeb.ai builds real websites - clear code, animation,
                  responsivenss and scalable structure.
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
      {/* WEBSITE PREVIEW SECTION */}
      {userData && websites?.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">Your Recent Projects</h3>
              <p className="text-zinc-400">Pick up where you left off</p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm text-purple-400 hover:text-purple-300 font-medium"
            >
              View All Projects →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {websites.slice(0, 3).map((w, i) => (
              <motion.div
                key={w._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/editor/${w._id}`)}
                className="group relative cursor-pointer rounded-2xl bg-[#0b0b0b] border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all shadow-xl"
              >
                {/* Preview Window Header */}
                <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between gap-2">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50 flex-shrink-0" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 flex-shrink-0" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 flex-shrink-0" />

                    <span className="ml-2 text-[10px] text-zinc-400 truncate uppercase tracking-widest font-medium">
                      {w.title || "Untitled Project"}
                    </span>
                  </div>

                  {/* RIGHT SIDE */}
                  <button
                    // onClick={() => handleCopy(w)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(w);
                    }}
                    className="flex-shrink-0 p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-all relative"
                  >
                    <AnimatePresence mode="wait">
                      {copiedId === w._id ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                        >
                          <Check size={14} className="text-green-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="share"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                        >
                          <Share2 size={14} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>

                {/* Iframe Preview Container */}
                <div className="h-52 bg-[#050505] relative pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 z-10 w-full h-full">
                    {/* This scales the content correctly for the card size */}
                    <iframe
                      srcDoc={w.latestCode}
                      title={w.name}
                      className="w-[1280px] h-[800px] border-none origin-top-left scale-[0.25] absolute top-0 left-0 opacity-80"
                      style={{ width: "400%", height: "400%" }}
                    />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 z-20 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold transition-all transform translate-y-4 group-hover:translate-y-0 shadow-2xl">
                      Open in Editor
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} GenWeb.AI
      </footer>
      {openLogin && (
        <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
      )}
    </div>
  );
}

export default Home;
