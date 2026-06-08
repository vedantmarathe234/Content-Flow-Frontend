import { motion, AnimatePresence } from "framer-motion";

const SlidingPanel = ({ isLogin, setIsLogin }) => {
  return (
    <motion.div
      initial={false}
      animate={{ x: isLogin ? "100%" : "0%" }}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
      className="absolute top-0 left-0 w-1/2 h-full z-20 hidden lg:flex"
    >
      <div
        className="relative w-full h-full overflow-hidden text-white flex flex-col justify-between p-10"
        style={{
          background: "linear-gradient(160deg, #051F23 0%, #0A3D45 45%, #0D4F59 100%)"
        }}
      >
      
        <div
          className="absolute top-0 right-0 w-72 h-72 opacity-[0.06]"
          style={{
            background: "radial-gradient(circle, #5ECFDC 0%, transparent 70%)"
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #5ECFDC 0%, transparent 70%)"
          }}
        />

        
        <div className="absolute top-0 left-0 w-full h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #2F8F9A, transparent)" }}
        />

        

       
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 flex flex-col gap-6"
          >
            
            <div className="inline-flex items-center gap-2 w-fit">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5ECFDC]" />
              <span className="text-[#5ECFDC] text-xs tracking-widest uppercase font-medium">
                {isLogin ? "Welcome back" : "Get started"}
              </span>
            </div>

            <h2 className="text-[2.1rem] font-bold leading-[1.15] tracking-tight text-white">
              {isLogin
                ? <>Plan.<br />Collaborate.<br />Deliver.</>
                : <>Build better<br />content.<br />Together.</>}
            </h2>

            <p className="text-white/45 text-sm leading-relaxed max-w-[260px]">
              {isLogin
                ? "Keep your content operations organized, approved and delivered on time."
                : "Join your team, manage workflows, and deliver content with confidence."}
            </p>
          </motion.div>
        </AnimatePresence>

       
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "img-login" : "img-register"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex justify-center"
          >
            <img
              src={isLogin ? "src/assets/Team-bro.svg" : "src/assets/Login-bro.svg"}
              alt=""
              className="w-[220px] opacity-90"
              style={{ filter: "brightness(1.05) saturate(0.9)" }}
            />
          </motion.div>
        </AnimatePresence>

        
        <div className="relative z-10 flex gap-6 border-t border-white/10 pt-6">
          {[
            { label: "Teams", value: "500+" },
            { label: "Uptime", value: "99.9%" },
            { label: "Workflows", value: "12k+" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-white text-sm font-semibold">{value}</p>
              <p className="text-white/35 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SlidingPanel;