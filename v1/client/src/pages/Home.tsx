import HeroSection from "@/components/HeroSection";
import { Shield, Zap, Globe, Lock } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "wouter";
// Import all 8 logos for the scrolling banner
import midnightLogoPath from "@assets/9_1751980298975.png";
import cardanoLogoPath from "@assets/11_1751980298976.png";
import xrplLedgerLogoPath from "@assets/MOVE VALUE NOT DATA_1751980310907.png";
import ugaLabzLogoPath from "@assets/eafew_1751980307614.png";
// Legacy logos for features section
import xrplLogoPath from "@assets/MOVE VALUE NOT DATA_1751902317440.png";
import midnightLegacyLogoPath from "@assets/9_1751902323120.png";
import cardanoLegacyLogoPath from "@assets/11_1751902324805.png";
// AGILITY logo for features section
import agilityMainLogoPath from "@assets/agii_1751981431112.png";
// VINE:MIND logo for section break
import vinemindSectionLogoPath from "@assets/rrrr_1751984061603.png";

// Interactive Lines Component
function InteractiveLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Line configuration
    const lines: { x: number; y: number; angle: number; restAngle: number; length: number }[] = [];
    const rows = 12;
    const cols = 25;
    const spacing = canvas.width / (cols + 1);
    const verticalSpacing = canvas.height / (rows + 1);

    // Initialize lines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        lines.push({
          x: (col + 1) * spacing,
          y: (row + 1) * verticalSpacing,
          angle: 0,
          restAngle: 0,
          length: 30
        });
      }
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let isMouseActive = false;

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseActive = true;
    };

    const handleMouseLeave = () => {
      isMouseActive = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach(line => {
        if (isMouseActive) {
          // Calculate angle toward cursor
          const dx = mouseX - line.x;
          const dy = mouseY - line.y;
          const targetAngle = Math.atan2(dy, dx);
          
          // Smooth rotation toward cursor
          line.angle = line.angle + (targetAngle - line.angle) * 0.1;
        } else {
          // Return to rest position
          line.angle = line.angle + (line.restAngle - line.angle) * 0.05;
        }

        // Draw line
        ctx.save();
        ctx.translate(line.x, line.y);
        ctx.rotate(line.angle);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.moveTo(-line.length / 2, 0);
        ctx.lineTo(line.length / 2, 0);
        ctx.stroke();
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="mt-10 h-[300px] w-full overflow-hidden bg-black relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection />
      
      {/* Infinite Scrolling Logo Banner */}
      <section className="bg-black border-t border-b border-white/10 h-20 overflow-hidden relative">
        <div className="flex animate-marquee-seamless h-full items-center whitespace-nowrap">
          {/* First complete set of all 8 logos */}
          <div className="flex items-center gap-x-12 shrink-0 px-8">
            <img 
              src={midnightLogoPath} 
              alt="Midnight" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={cardanoLogoPath} 
              alt="Cardano" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={xrplLedgerLogoPath} 
              alt="XRP Ledger" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={ugaLabzLogoPath} 
              alt="UgaLabz" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={midnightLogoPath} 
              alt="Midnight" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={cardanoLogoPath} 
              alt="Cardano" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={xrplLedgerLogoPath} 
              alt="XRP Ledger" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={ugaLabzLogoPath} 
              alt="UgaLabz" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
          </div>
          {/* Second complete identical set for seamless loop */}
          <div className="flex items-center gap-x-12 shrink-0 px-8">
            <img 
              src={midnightLogoPath} 
              alt="Midnight" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={cardanoLogoPath} 
              alt="Cardano" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={xrplLedgerLogoPath} 
              alt="XRP Ledger" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={ugaLabzLogoPath} 
              alt="UgaLabz" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={midnightLogoPath} 
              alt="Midnight" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={cardanoLogoPath} 
              alt="Cardano" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={xrplLedgerLogoPath} 
              alt="XRP Ledger" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
            <img 
              src={ugaLabzLogoPath} 
              alt="UgaLabz" 
              className="h-12 w-auto object-contain opacity-80 hover:opacity-60 hover:scale-110 transition-all duration-300"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powered by Cutting-Edge Technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              AGILITY combines the best of blockchain, privacy, and interoperability technologies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-5 p-6 md:p-8 border-l-2 border-t border-r border-b border-yellow-500 border-t-white/10 border-r-white/10 border-b-white/10 rounded bg-black hover:border-white/40 hover:scale-[1.02] hover:shadow-[0_0_10px_#FFD70044] transition-all duration-200">
              <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div>
                <div className="text-base md:text-lg font-semibold text-white">Fast XRPL Payments</div>
                <div className="text-sm md:text-base text-white/70 leading-relaxed mt-2">Lightning-fast transactions with minimal fees on the XRP Ledger</div>
              </div>
            </div>

            <div className="flex items-center gap-5 p-6 md:p-8 border-l-2 border-t border-r border-b border-yellow-500 border-t-white/10 border-r-white/10 border-b-white/10 rounded bg-black hover:border-white/40 hover:scale-[1.02] hover:shadow-[0_0_10px_#FFD70044] transition-all duration-200">
              <Lock className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div>
                <div className="text-base md:text-lg font-semibold text-white">Privacy via Midnight ZK</div>
                <div className="text-sm md:text-base text-white/70 leading-relaxed mt-2">Zero-knowledge proofs ensure complete transaction privacy</div>
              </div>
            </div>

            <div className="flex items-center gap-5 p-6 md:p-8 border-l-2 border-t border-r border-b border-yellow-500 border-t-white/10 border-r-white/10 border-b-white/10 rounded bg-black hover:border-white/40 hover:scale-[1.02] hover:shadow-[0_0_10px_#FFD70044] transition-all duration-200">
              <Shield className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div>
                <div className="text-base md:text-lg font-semibold text-white">Cardano Integration</div>
                <div className="text-sm md:text-base text-white/70 leading-relaxed mt-2">Seamless cross-chain transactions and interoperability</div>
              </div>
            </div>

            <div className="flex items-center gap-5 p-6 md:p-8 border-l-2 border-t border-r border-b border-yellow-500 border-t-white/10 border-r-white/10 border-b-white/10 rounded bg-black hover:border-white/40 hover:scale-[1.02] hover:shadow-[0_0_10px_#FFD70044] transition-all duration-200">
              <Globe className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div>
                <div className="text-base md:text-lg font-semibold text-white">Web3 Domain Integration</div>
                <div className="text-sm md:text-base text-white/70 leading-relaxed mt-2">NFT-based domain ownership with privacy benefits</div>
              </div>
            </div>
          </div>
          
          {/* AGILITY Logo */}
          <div className="mt-12 flex justify-center">
            <img 
              src={agilityMainLogoPath} 
              alt="AGILITY" 
              className="h-16 max-w-[200px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* Divider Line at Section Transition */}
      <div className="w-full h-px bg-white/20" />

      {/* VineMind Logo Section Break */}
      <div className="w-full bg-black mb-0">
        <img 
          src={vinemindSectionLogoPath} 
          alt="VINE:MIND" 
          className="w-full max-w-6xl mx-auto block object-contain h-[200px]"
          style={{ marginBottom: 0, paddingBottom: 0 }}
        />
      </div>

      {/* AI Agents Section */}
      <section className="py-8 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tokenized AI Agents Tailored for Real-World Needs
            </h2>
          </div>
          
          {/* Agent Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* XRPL Specialist Card */}
            <div className="bg-black border border-white/20 border-t-2 border-t-yellow-500 rounded-lg p-6 hover:border-white/40 hover:scale-[1.02] hover:shadow-[0_0_10px_#FFD70055] transition-all duration-200">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">XRPL Specialist & Advisor</h3>
              <p className="text-sm text-white/70 leading-relaxed">Expert guidance on XRPL integrations, asset issuance, and on-chain strategies.</p>
            </div>
            
            {/* Midnight Protocol Card */}
            <div className="bg-black border border-white/20 border-t-2 border-t-yellow-500 rounded-lg p-6 hover:border-white/40 hover:scale-[1.02] hover:shadow-[0_0_10px_#FFD70055] transition-all duration-200">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Midnight Protocol Consultant</h3>
              <p className="text-sm text-white/70 leading-relaxed">Leverage privacy-first zero-knowledge protocols with expert insight.</p>
            </div>
            
            {/* Customer Support Card */}
            <div className="bg-black border border-white/20 border-t-2 border-t-yellow-500 rounded-lg p-6 hover:border-white/40 hover:scale-[1.02] hover:shadow-[0_0_10px_#FFD70055] transition-all duration-200">
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Customer Support Agent</h3>
              <p className="text-sm text-white/70 leading-relaxed">Adaptable AI assistant for client interaction tailored to your business needs.</p>
            </div>
          </div>
          
          {/* Zero-Knowledge Disclaimer */}
          <div className="text-center mb-8">
            <p className="text-xs text-white/50">
              All agents are powered by Zero-Knowledge Proofs and tokenized as non-fungible tokens on the XRP Ledger to ensure privacy and ownership.
            </p>
          </div>
          
          {/* Agents Portal Button */}
          <div className="text-center">
            <Link href="/agents">
              <button className="px-8 py-3 border border-white/70 bg-transparent text-white font-semibold rounded-lg hover:border-white hover:text-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-200">
                [ AGENTS PORTAL ]
              </button>
            </Link>
          </div>
          
          {/* Interactive Lines Field */}
          <InteractiveLines />
        </div>
      </section>

      {/* Technology Logos Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-gray-300">Built on Industry-Leading Technologies</h3>
          </div>
          <div className="flex justify-center items-center space-x-12">
            <div className="group cursor-pointer">
              <div className="w-32 h-16 bg-black/50 rounded-2xl flex items-center justify-center border border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <img 
                  src={xrplLogoPath} 
                  alt="XRPL" 
                  className="h-8 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="w-32 h-16 bg-black/50 rounded-2xl flex items-center justify-center border border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <img 
                  src={midnightLegacyLogoPath} 
                  alt="Midnight" 
                  className="h-8 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="w-32 h-16 bg-black/50 rounded-2xl flex items-center justify-center border border-white/10 hover:border-yellow-400/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                <img 
                  src={cardanoLegacyLogoPath} 
                  alt="ADA" 
                  className="h-8 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
