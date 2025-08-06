import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import agilityLogoPath from "@assets/boton 2_1752044752206.png";

// Interactive animation component for payment flow visualization
function PaymentFlowAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio);
      
      const centerX = canvas.width / devicePixelRatio / 2;
      const centerY = canvas.height / devicePixelRatio / 2;
      
      // Draw XRPL payment ripples (left to right flow)
      for (let i = 0; i < 3; i++) {
        const progress = (time * 0.002 + i * 0.3) % 1;
        const x = progress * (canvas.width / devicePixelRatio);
        const opacity = Math.sin(progress * Math.PI) * 0.6;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, centerY - 20);
        ctx.lineTo(x + 40, centerY);
        ctx.lineTo(x, centerY + 20);
        ctx.stroke();
      }

      // Draw privacy fade lines (data vanishing effect)
      for (let i = 0; i < 5; i++) {
        const fadeProgress = (time * 0.001 + i * 0.2) % 1;
        const fadeOpacity = Math.max(0, 1 - fadeProgress) * 0.4;
        const y = centerY + 40 + i * 8;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${fadeOpacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 60, y);
        ctx.lineTo(centerX + 60 * (1 - fadeProgress), y);
        ctx.stroke();
      }

      // Mouse interaction effect
      const distanceFromMouse = Math.sqrt(
        Math.pow(mousePos.x - centerX, 2) + Math.pow(mousePos.y - centerY, 2)
      );
      if (distanceFromMouse < 100) {
        const influence = (100 - distanceFromMouse) / 100;
        ctx.strokeStyle = `rgba(234, 179, 8, ${influence * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 20 * influence, 0, Math.PI * 2);
        ctx.stroke();
      }

      time++;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [mousePos]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-32 pointer-events-auto"
      style={{ width: '100%', height: '128px' }}
    />
  );
}

export default function AgilityGate() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Check password after a brief delay to show loading state
    setTimeout(() => {
      if (password === "GridteamUga2025") {
        setLocation("/dashboard");
      } else {
        setError("Invalid password. Please try again.");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 pt-20">
      {/* Static Agility Logo */}
      <div className="mb-4 mt-4">
        <img 
          src={agilityLogoPath} 
          alt="AGILITY"
          className="h-24 md:h-32 w-auto object-contain"
        />
      </div>

      {/* Headlines */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          Coming Soon
        </h1>
        <h2 className="text-sm md:text-base text-white/70 font-medium mb-8">
          [ Under Development ]
        </h2>
      </div>

      {/* Password Access Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 mb-12">
        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Enter Access Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border border-white/30 text-white placeholder-gray-400 rounded-md h-12 px-4 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
            disabled={isLoading}
          />
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isLoading || !password.trim()}
          className="w-full bg-transparent border border-white/70 text-white hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all duration-200 rounded-md h-12 disabled:opacity-50"
        >
          {isLoading ? "Checking..." : "Unlock Access"}
        </Button>
      </form>

      {/* Interactive Animation */}
      <div className="mb-12 w-full max-w-md">
        <PaymentFlowAnimation />
      </div>

      {/* Info Section */}
      <div className="text-center mb-8 max-w-lg">
        <h3 className="text-lg font-bold text-white mb-3">About Agility Payments</h3>
        <p className="text-white/70 text-sm md:text-base leading-relaxed">
          Agility combines lightning-fast XRPL payments with privacy-first ZK-proofs and seamless interoperability. 
          Experience the future of Web3 payments with enhanced security and speed.
        </p>
      </div>



      {/* Back to Home Button */}
      <div className="mt-8">
        <Button
          onClick={() => setLocation("/")}
          className="bg-transparent border border-white/30 text-white hover:border-white/60 hover:shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all duration-200 flex items-center gap-2 px-6 py-3 rounded-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}