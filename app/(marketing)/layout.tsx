import Navbar from "../../components/Navbar";
import DotField from "./DotField";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-[var(--foreground)] transition-colors duration-300">
      {/* Global Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          cursorRadius={150}
          cursorForce={0.14}
          bulgeOnly={true}
          bulgeStrength={31}
          glowRadius={90}
          glowColor="#482a2a"
          gradientFrom="#7C3AED"
          gradientTo="#ed0707"
          className="absolute inset-0 h-full w-full opacity-65"
        />
        <div className="hero-glow absolute inset-0" />
        <div className="hero-noise absolute inset-0" />
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10">{children}</main>
    </div>
  );
};

export default MarketingLayout;
