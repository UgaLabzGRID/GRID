import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import agilityButtonLogoPath from "@assets/boton 2_1752044752206.png";
import vinemindButtonLogoPath from "@assets/culocagao_1752044874654.png";
import newHeroLogoPath from "@assets/asf_1752423954387.png";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center"
             style={{
               background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0d0d0d 50%, #000000 100%)'
             }}>
      {/* Ambient lighting overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-transparent to-gray-700/10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">The Future of</span><br/>
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Web3 Payments</span>
            </h1>
            <p className="text-xl text-gray-300 mt-6 max-w-2xl">
              Experience lightning-fast XRPL payments with privacy-first ZK-proofs, seamless interoperability.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/agility">
                <Button className="px-8 py-4 bg-black text-white border border-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.6),0_0_25px_rgba(234,179,8,0.3)] hover:brightness-110 transition-all duration-300 font-semibold text-lg h-14 flex items-center justify-center min-w-[160px]">
                  <img 
                    src={agilityButtonLogoPath} 
                    alt="AGILITY"
                    className="h-6 w-auto object-contain"
                  />
                </Button>
              </Link>
              <Link href="/agents">
                <Button className="px-8 py-4 bg-black text-white border border-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.6),0_0_25px_rgba(234,179,8,0.3)] hover:brightness-110 transition-all duration-300 font-semibold text-lg h-14 flex items-center justify-center min-w-[160px]">
                  <img 
                    src={vinemindButtonLogoPath} 
                    alt="VINEMIND"
                    className="h-6 w-auto object-contain"
                  />
                </Button>
              </Link>
              <Button className="px-8 py-4 bg-black text-white border border-yellow-500 hover:shadow-[0_0_15px_rgba(234,179,8,0.6),0_0_25px_rgba(234,179,8,0.3)] hover:brightness-110 transition-all duration-300 font-semibold text-lg h-14 flex items-center justify-center min-w-[160px]">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative flex items-center justify-center">
            {/* Cinematic logo - clean and minimal */}
            <img
              src={newHeroLogoPath}
              alt="Logo"
              className="w-[600px] md:w-[750px] lg:w-[900px] xl:w-[1000px] max-w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
