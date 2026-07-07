const AuthBackground = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="hero-grid absolute inset-0" />
      <div className="hero-glow absolute inset-0" />
      <div className="hero-noise absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(239,90,111,0.2),_transparent_60%)]" />
      <div className="absolute left-8 top-1/4 h-48 w-48 rounded-full bg-[#EF5A6F]/15 blur-[120px]" />
      <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-[#EF5A6F]/10 blur-[140px]" />
    </div>
  );
};

export default AuthBackground;
