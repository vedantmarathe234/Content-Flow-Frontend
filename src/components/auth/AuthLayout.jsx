import SlidingPanel from "./SlidingPanel";

const AuthLayout = ({
  children,
  isLogin,
  setIsLogin
}) => {

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div
        className="
        relative
        w-full
        max-w-6xl
        h-[85vh]
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        "
      >

        <div className="grid lg:grid-cols-2 h-full">

  <div
    className={`
      flex items-center justify-center p-8 overflow-y-auto
      ${isLogin ? "order-1" : "order-2"}
    `}
  >
    {children}
  </div>

  <div
    className={`
      hidden lg:block
      ${isLogin ? "order-2" : "order-1"}
    `}
  />

</div>

        <SlidingPanel
          isLogin={isLogin}
          setIsLogin={setIsLogin}
        />

      </div>

    </div>
    
  );
};

export default AuthLayout;