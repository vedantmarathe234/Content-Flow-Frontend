import { motion, AnimatePresence } from "framer-motion";

const SlidingPanel = ({ isLogin, setIsLogin }) => {
  return (
    <motion.div
      initial={false}
      animate={{ x: isLogin ? "100%" : "0%" }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      className="absolute top-0 left-0 w-1/2 h-full z-20 hidden lg:flex font-sans"
    >
      <div
        className="relative w-full h-full overflow-hidden text-white flex flex-col justify-between p-12 select-none"
        style={{
         
          background: "linear-gradient(160deg, #031C1C 0%, #063A3A 50%, #095252 100%)"
        }}
      >
      
        <div
          className="absolute top-0 right-0 w-80 h-80 opacity-[0.12] pointer-events-none"
          style={{
            background: "radial-gradient(circle, #0D7A80 0%, transparent 70%)"
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 opacity-[0.08] pointer-events-none"
          style={{
            background: "radial-gradient(circle, #0D7A80 0%, transparent 70%)"
          }}
        />

        <div className="absolute top-0 left-0 w-full h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #0D7A80, transparent)" }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 flex flex-col gap-5 mt-4"
          >
            <div className="inline-flex items-center gap-2 w-fit bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0D7A80] animate-pulse" />
              <span className="text-white text-[10px] tracking-widest uppercase font-bold">
                {isLogin ? "Welcome back" : "Get started"}
              </span>
            </div>

            <h2 className="text-[2.2rem] font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-sm">
              {isLogin
                ? <>Plan.<br />Collaborate.<br />Deliver.</>
                : <>Build better<br />content.<br />Together.</>}
            </h2>

            <p className="text-white/60 text-sm leading-relaxed max-w-[280px] font-medium">
              {isLogin
                ? "Keep your content operations organized, approved and delivered on time."
                : "Join your team, manage workflows, and deliver content with confidence."}
            </p>
          </motion.div>
        </AnimatePresence>

    
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "img-login" : "img-register"}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex justify-center my-auto py-4"
          >
            <img
              src={isLogin ? "src/assets/Team-bro.png" : "src/assets/Login-bro.png"}
              alt="Auth Illustration"
              className="w-[340px] h-[240px] object-contain transition-all duration-300"
              style={{ filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15)) brightness(1.02)" }}
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex gap-10 border-t border-white/10 pt-3">
          {[
            { label: "Active Teams", value: "500+" },
            { label: "Platform Uptime", value: "99.9%" },
            { label: "Workflows Done", value: "12k+" },
          ].map(({ label, value }) => (
            <div key={label} className="transition-transform hover:translate-y-[-2px] duration-200">
              <p className="text-white text-base font-black tracking-tight">{value}</p>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SlidingPanel;