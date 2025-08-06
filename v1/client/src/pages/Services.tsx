import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Star, Zap, Palette, Video, Globe, Users, TrendingUp, X, ChevronLeft, ChevronRight } from "lucide-react";
import heroLogoPath from "@assets/YOUR_1752539280573.png";
import alexLogo from "@assets/4_1752541766462.png";
import ugaLabzLogo from "@assets/5_1752541768111.png";
import jungleRadioLogo from "@assets/7_1752541769817.png";
import snotsLogo from "@assets/8_1752541771467.png";
import percyVeranceLogo from "@assets/9_1752541775112.png";
import freedomPhoenixLogo from "@assets/I_1752541779661.png";
import xrposseLogo from "@assets/ads_1752541878839.png";
import webdevImage from "@assets/image_1752603861761.png";
import memesImage from "@assets/image_1752603880062.png";
import reelsImage from "@assets/image_1752603928629.png";
import longformImage from "@assets/image_1752603941636.png";
import nftartImage from "@assets/image_1752603950689.png";
import characterImage from "@assets/image_1752603961533.png";

interface PackageTier {
  name: string;
  website: string;
  videos: string;
  price: string;
  popular?: boolean;
  features: string[];
}

interface VideoUpgrade {
  service: string;
  openArt: string;
  veo3: string;
}

interface AlaCarteService {
  name: string;
  price: string;
  icon: any;
}

interface GalleryItem {
  id: string;
  title: string;
  images: string[];
  icon: any;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  gallery: GalleryItem | null;
}

function GalleryModal({ isOpen, onClose, gallery }: GalleryModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !gallery) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.images.length) % gallery.images.length);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <gallery.icon className="w-6 h-6 text-yellow-400" />
            {gallery.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Media Display */}
        <div className="relative aspect-video bg-black/50 flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center p-4">
            {gallery.images[currentImageIndex]?.endsWith('.mp4') ? (
              <video
                src={gallery.images[currentImageIndex]}
                controls
                autoPlay
                loop
                muted
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-opacity duration-300"
                style={{ objectFit: 'contain' }}
                onLoadedData={(e) => {
                  // Add fade-in effect
                  e.currentTarget.style.opacity = '1';
                }}
                onError={(e) => {
                  console.error('Video failed to load:', gallery.images[currentImageIndex]);
                  // Show fallback content with service icon
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = 'text-white text-center p-8';
                  fallbackDiv.innerHTML = `
                    <div class="w-32 h-32 bg-neutral-800 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <span class="text-yellow-400 text-2xl">🎬</span>
                    </div>
                    <p class="text-lg font-medium mb-2">Portfolio Sample</p>
                    <p class="text-gray-400">Sample ${currentImageIndex + 1} of ${gallery.images.length}</p>
                    <p class="text-sm text-gray-500 mt-4">Video loading...</p>
                  `;
                  e.currentTarget.parentNode?.replaceChild(fallbackDiv, e.currentTarget);
                }}
              />
            ) : (
              <img
                src={gallery.images[currentImageIndex]}
                alt={`${gallery.title} sample ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-opacity duration-300"
                style={{ objectFit: 'contain' }}
                onLoad={(e) => {
                  // Add fade-in effect
                  e.currentTarget.style.opacity = '1';
                }}
                onError={(e) => {
                  console.error('Image failed to load:', gallery.images[currentImageIndex]);
                  // Show fallback content with service icon
                  const fallbackDiv = document.createElement('div');
                  fallbackDiv.className = 'text-white text-center p-8';
                  fallbackDiv.innerHTML = `
                    <div class="w-32 h-32 bg-neutral-800 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <span class="text-yellow-400 text-2xl">📁</span>
                    </div>
                    <p class="text-lg font-medium mb-2">Portfolio Sample</p>
                    <p class="text-gray-400">Sample ${currentImageIndex + 1} of ${gallery.images.length}</p>
                    <p class="text-sm text-gray-500 mt-4">Images coming soon</p>
                  `;
                  e.currentTarget.parentNode?.replaceChild(fallbackDiv, e.currentTarget);
                }}
              />
            )}
          </div>

          {/* Navigation Arrows */}
          {gallery.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>

        {/* Image Counter */}
        <div className="flex items-center justify-center gap-2 p-4">
          {gallery.images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-yellow-400' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [galleryModal, setGalleryModal] = useState<{
    isOpen: boolean;
    gallery: GalleryItem | null;
  }>({
    isOpen: false,
    gallery: null,
  });

  // Gallery image collections using public asset paths
  const galleryImages = {
    websites: [
      "/assets/portfolio/websites/uga-gnosis.png",
      "/assets/portfolio/websites/nuts-sports.png", 
      "/assets/portfolio/websites/gnosis-trading.png",
      "/assets/portfolio/websites/alex-token.png",
      "/assets/portfolio/websites/freedom-phoenix.png",
      "/assets/portfolio/websites/percy-verance.png",
      "/assets/portfolio/websites/jungle-radio.png"
    ],
    memes: [
      "/assets/portfolio/memes/dammit-uga.png",
      "/assets/portfolio/memes/drake-meme-variants.jpg",
      "/assets/portfolio/memes/wizard-prediction.png",
      "/assets/portfolio/memes/freefuga-character.jpg",
      "/assets/portfolio/memes/scult-religious.jpg",
      "/assets/portfolio/memes/freefuga-campfire.jpg",
      "/assets/portfolio/memes/lord-mittens.jpg",
      "/assets/portfolio/memes/joe-rogan-uga.jpg",
      "/assets/portfolio/memes/knight-lore.jpg",
      "/assets/portfolio/memes/uga-meme-creator.jpg",
      "/assets/portfolio/memes/crypto-party.png",
      "/assets/portfolio/memes/xrp-holders.jpg"
    ],
    reels: [
      "/assets/portfolio/reels/moon-video.mp4",
      "/assets/portfolio/reels/phone-video.mp4",
      "/assets/portfolio/reels/wake-up-video.mp4"
    ],
    longform: [
      "/assets/portfolio/longform/spiffy-lock-in.mp4"
    ],
    nft: [
      "/assets/portfolio/nft/character-collection.png"
    ],
    character: [
      "/assets/portfolio/character/character-concepts.png"
    ]
  };

  const serviceGalleries: GalleryItem[] = [
    {
      id: "webdev",
      title: "Website Development",
      images: galleryImages.websites,
      icon: Globe,
    },
    {
      id: "memes",
      title: "Memes & Art Creation",
      images: galleryImages.memes,
      icon: Palette,
    },
    {
      id: "reels",
      title: "Short Form Content / Reels",
      images: galleryImages.reels,
      icon: Video,
    },
    {
      id: "longform",
      title: "Long Form Content",
      images: galleryImages.longform,
      icon: Video,
    },
    {
      id: "nft",
      title: "NFT Art",
      images: galleryImages.nft,
      icon: Star,
    },
    {
      id: "character",
      title: "Character Creation",
      images: galleryImages.character,
      icon: Users,
    },
  ];

  const openGallery = (galleryId: string) => {
    const gallery = serviceGalleries.find(g => g.id === galleryId);
    if (gallery) {
      setGalleryModal({
        isOpen: true,
        gallery,
      });
    }
  };

  const closeGallery = () => {
    setGalleryModal({
      isOpen: false,
      gallery: null,
    });
  };

  const packageTiers: PackageTier[] = [
    {
      name: "Basic Presence",
      website: "1–5 Page Site (Design + Dev)",
      videos: "1 Short Video (30–60s, vertical, OpenArt)",
      price: "$700",
      features: ["Responsive Design", "Mobile Optimized", "Basic SEO", "Contact Forms"]
    },
    {
      name: "Startup Spark",
      website: "Same as Basic",
      videos: "3 Short Videos + Light Branding Help",
      price: "$900",
      features: ["Everything in Basic", "Brand Guidelines", "Social Media Assets", "Logo Variations"]
    },
    {
      name: "Momentum Boost",
      website: "Same as Basic",
      videos: "5 Shorts + 1 Long-Form Video (1–2 min)",
      price: "$1,200",
      popular: true,
      features: ["Everything in Startup", "Content Strategy", "Video Editing", "Platform Optimization"]
    },
    {
      name: "Full Launch",
      website: "Up to 7 Pages + Branding",
      videos: "10 Shorts + 2 Long-Form Videos",
      price: "$1,500",
      features: ["Complete Brand Package", "Advanced Analytics", "E-commerce Ready", "Custom Animations"]
    },
    {
      name: "Cinematic Upgrade",
      website: "Same as Full Launch",
      videos: "Veo 3 videos: 10 Shorts + 2 Long-Form Premium",
      price: "$1,900",
      features: ["Premium Video Quality", "Advanced AI Video", "Professional Voice-over", "Custom Transitions"]
    },
    {
      name: "Custom Build",
      website: "Tailored Features & Pages",
      videos: "Custom videos (OpenArt or Veo 3) + Copywriting & SEO",
      price: "$2,000+",
      features: ["Fully Custom Solution", "Advanced Integrations", "Priority Support", "Unlimited Revisions"]
    }
  ];

  const videoUpgrades: VideoUpgrade[] = [
    {
      service: "Extra Short Video (30–60s)",
      openArt: "$50",
      veo3: "$100"
    },
    {
      service: "Extra Long Video (1–3 min)",
      openArt: "$150",
      veo3: "$250"
    },
    {
      service: "Voice-over (Custom AI)",
      openArt: "Included",
      veo3: "Included"
    },
    {
      service: "Captions / Subtitles",
      openArt: "Included",
      veo3: "Included"
    },
    {
      service: "Platform Formatting",
      openArt: "Included",
      veo3: "Included"
    }
  ];

  const alaCarteServices: AlaCarteService[] = [
    { name: "Logo Design (AI-assisted)", price: "$100", icon: Palette },
    { name: "Landing Page", price: "$100/page", icon: Globe },
    { name: "Copywriting (5 sections)", price: "$100", icon: Users },
    { name: "SEO Optimization (Lite)", price: "$75", icon: TrendingUp },
    { name: "Domain & Hosting Setup", price: "+$70/year", icon: Zap }
  ];

  const portfolioItems = [
    { type: "website", title: "DeFi Platform", image: "/api/placeholder/300/200" },
    { type: "video", title: "Token Launch Video", image: "/api/placeholder/300/200" },
    { type: "branding", title: "Crypto Brand Package", image: "/api/placeholder/300/200" },
    { type: "meme", title: "Viral Meme Campaign", image: "/api/placeholder/300/200" },
    { type: "website", title: "NFT Marketplace", image: "/api/placeholder/300/200" },
    { type: "video", title: "Protocol Explainer", image: "/api/placeholder/300/200" }
  ];

  const filteredPortfolio = activeFilter === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.type === activeFilter);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 pt-20">
        {/* Background gradient from black to gold */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-yellow-900/20"></div>
        
        {/* Subtle ambient glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/10 via-yellow-500/15 to-yellow-600/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Background Logo - positioned behind text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
            <img
              src={heroLogoPath}
              alt="GRID Logo Background"
              className="w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] object-contain opacity-20"
              style={{ 
                imageRendering: 'smooth'
              }}
            />
          </div>

          {/* Main Heading */}
          <h1 className="relative z-20 text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
            <span className="block text-white mb-3">PREMIUM WEB3 LAUNCH SERVICES</span>
            <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              FOR BUILDERS, VISIONARIES & CREATORS
            </span>
          </h1>

          {/* Subheading */}
          <p className="relative z-20 text-base md:text-lg lg:text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            End-to-end Web3 services from websites to AI video, branding, memetics & launch strategy.
          </p>

          {/* Checkmarks Row */}
          <div className="relative z-20 flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-12 mb-8">
            <div className="flex items-center space-x-2 text-white">
              <CheckCircle className="w-5 h-5 text-yellow-400" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 221, 0, 0.5))' }} />
              <span className="text-sm md:text-base font-medium">AI-Powered Delivery</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <CheckCircle className="w-5 h-5 text-yellow-400" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 221, 0, 0.5))' }} />
              <span className="text-sm md:text-base font-medium">Web3-Native Execution</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <CheckCircle className="w-5 h-5 text-yellow-400" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 221, 0, 0.5))' }} />
              <span className="text-sm md:text-base font-medium">Guaranteed Brand Impact</span>
            </div>
          </div>

          {/* Metrics Tab */}
          <div className="relative z-20 mb-10">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-full px-8 py-4 border border-white/10">
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12 text-gray-300">
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-white">12+</div>
                  <div className="text-xs md:text-sm text-gray-400">Clients</div>
                </div>
                <div className="w-px h-8 bg-white/20 hidden md:block"></div>
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-white">25+</div>
                  <div className="text-xs md:text-sm text-gray-400">Years Dev Experience</div>
                </div>
                <div className="w-px h-8 bg-white/20 hidden md:block"></div>
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-white">10+</div>
                  <div className="text-xs md:text-sm text-gray-400">DApps & Websites</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button 
            className="relative z-20 bg-transparent border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black px-10 py-5 text-lg font-bold rounded-lg transition-all duration-300"
            style={{ 
              filter: 'drop-shadow(0 0 20px rgba(255, 221, 0, 0.5))',
              boxShadow: '0 0 30px rgba(255, 221, 0, 0.3)'
            }}
          >
            [ View Packages ]
          </Button>
        </div>
      </section>

      {/* Brand Logos Section */}
      <section className="py-16 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-lg md:text-xl text-gray-400 uppercase tracking-wide mb-12">
            Brands We've Worked With
          </h2>
          
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll">
              {/* First set of logos */}
              <div className="flex items-center justify-center min-w-0 shrink-0">
                <img
                  src={alexLogo}
                  alt="Alex"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={ugaLabzLogo}
                  alt="UgaLabz"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={jungleRadioLogo}
                  alt="Jungle Radio"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={snotsLogo}
                  alt="Snots"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={percyVeranceLogo}
                  alt="Percy Verance"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={freedomPhoenixLogo}
                  alt="Freedom Phoenix"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={xrposseLogo}
                  alt="XRPosse"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="flex items-center justify-center min-w-0 shrink-0">
                <img
                  src={alexLogo}
                  alt="Alex"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={ugaLabzLogo}
                  alt="UgaLabz"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={jungleRadioLogo}
                  alt="Jungle Radio"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={snotsLogo}
                  alt="Snots"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={percyVeranceLogo}
                  alt="Percy Verance"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={freedomPhoenixLogo}
                  alt="Freedom Phoenix"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
                <img
                  src={xrposseLogo}
                  alt="XRPosse"
                  className="h-12 md:h-16 w-auto mx-8 md:mx-12 opacity-70 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Team Services Section */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              BACKED BY A MULTI-TALENTED EXPERT TEAM
            </h2>
            <p className="text-lg md:text-xl text-gray-400">
              Artists, Software Developers, Web3 Builders & Web2 Marketers
            </p>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Website Development */}
            <button
              onClick={() => openGallery("webdev")}
              className="group bg-black/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer text-left"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={webdevImage}
                  alt="Website Development"
                  className="h-32 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-white text-center">
                Website Development
              </h3>
            </button>

            {/* Memes & Art Creation */}
            <button
              onClick={() => openGallery("memes")}
              className="group bg-black/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer text-left"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={memesImage}
                  alt="Memes & Art Creation"
                  className="h-32 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-white text-center">
                Memes & Art Creation
              </h3>
            </button>

            {/* Short Form Content / Reels */}
            <button
              onClick={() => openGallery("reels")}
              className="group bg-black/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer text-left"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={reelsImage}
                  alt="Short Form Content / Reels"
                  className="h-32 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-white text-center">
                Short Form Content / Reels
              </h3>
            </button>

            {/* Long Form Content */}
            <button
              onClick={() => openGallery("longform")}
              className="group bg-black/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer text-left"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={longformImage}
                  alt="Long Form Content"
                  className="h-32 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-white text-center">
                Long Form Content
              </h3>
            </button>

            {/* NFT Art */}
            <button
              onClick={() => openGallery("nft")}
              className="group bg-black/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer text-left"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={nftartImage}
                  alt="NFT Art"
                  className="h-32 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-white text-center">
                NFT Art
              </h3>
            </button>

            {/* Character Creation */}
            <button
              onClick={() => openGallery("character")}
              className="group bg-black/50 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer text-left"
            >
              <div className="flex justify-center mb-6">
                <img
                  src={characterImage}
                  alt="Character Creation"
                  className="h-32 w-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-white text-center">
                Character Creation
              </h3>
            </button>
          </div>
        </div>
      </section>

      {/* Package Tiers Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Package Tiers</h2>
            <p className="text-gray-400 text-lg">Choose the perfect package for your project's needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packageTiers.map((tier, index) => (
              <Card key={index} className={`bg-[#1e1e1e] border-[#444444] hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105 relative ${
                tier.popular ? 'ring-2 ring-yellow-500/50' : ''
              }`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-black font-semibold">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-yellow-400 text-xl">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-white">{tier.price}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Website:</h4>
                    <p className="text-gray-300 text-sm">{tier.website}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Videos:</h4>
                    <p className="text-gray-300 text-sm">{tier.videos}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-yellow-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full bg-black border border-yellow-500 text-white hover:bg-yellow-500 hover:text-black transition-colors">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Upgrade Options */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Video Upgrade Options</h2>
            <p className="text-gray-400 text-lg">Enhance your video content with premium options</p>
          </div>

          <div className="bg-[#1e1e1e] rounded-lg border border-[#444444] overflow-hidden">
            <div className="grid grid-cols-3 bg-[#2a2a2a]">
              <div className="p-4 text-center">
                <h3 className="font-bold text-white">Service</h3>
              </div>
              <div className="p-4 text-center border-l border-[#444444]">
                <h3 className="font-bold text-yellow-400">OpenArt AI</h3>
              </div>
              <div className="p-4 text-center border-l border-[#444444]">
                <h3 className="font-bold text-yellow-400">Veo 3</h3>
              </div>
            </div>
            
            {videoUpgrades.map((upgrade, index) => (
              <div key={index} className="grid grid-cols-3 border-t border-[#444444]">
                <div className="p-4">
                  <p className="text-white font-medium">{upgrade.service}</p>
                </div>
                <div className="p-4 text-center border-l border-[#444444]">
                  <p className="text-gray-300">{upgrade.openArt}</p>
                </div>
                <div className="p-4 text-center border-l border-[#444444]">
                  <p className="text-gray-300">{upgrade.veo3}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A La Carte Services */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">A La Carte Services</h2>
            <p className="text-gray-400 text-lg">Individual services to complement your package</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alaCarteServices.map((service, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <service.icon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">{service.name}</h3>
                  <p className="text-2xl font-bold text-yellow-400">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-2">Contract Terms</p>
            <p className="text-white font-semibold">50% upfront, 50% on delivery</p>
          </div>
        </div>
      </section>

      {/* Past Work Showcase */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Past Work Showcase</h2>
            <p className="text-gray-400 text-lg">Explore our portfolio of successful projects</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-2">
              {["all", "websites", "videos", "branding", "memes"].map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  className={`capitalize ${
                    activeFilter === filter 
                      ? "bg-yellow-500 text-black" 
                      : "border-gray-600 text-gray-300 hover:border-yellow-500"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolio.map((item, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="aspect-video bg-gray-800 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                    <div className="p-4">
                      <Badge className="bg-yellow-500 text-black mb-2 capitalize">{item.type}</Badge>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Services */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Special Services</h2>
            <p className="text-gray-400 text-lg">Meme & Character Development</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-900/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-yellow-400 text-xl">Meme Creation Pack</CardTitle>
                <CardDescription className="text-gray-300">
                  Professional meme development for your brand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">4 Weeks Package</span>
                    <span className="text-yellow-400 font-bold">30 Memes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">6 Weeks Package</span>
                    <span className="text-yellow-400 font-bold">45 Memes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-yellow-400 text-xl">Character Development</CardTitle>
                <CardDescription className="text-gray-300">
                  Complete 3D character creation and poses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white">3D Full Character</span>
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white">Poses Sheet</span>
                    <CheckCircle className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get started with a custom package tailored to your vision
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-yellow-500 text-black hover:bg-yellow-400 px-8 py-4 text-lg font-semibold">
              Get Custom Quote
            </Button>
            <Button variant="outline" className="border-gray-600 text-white hover:border-yellow-500 px-8 py-4 text-lg">
              View Portfolio
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={galleryModal.isOpen}
        onClose={closeGallery}
        gallery={galleryModal.gallery}
      />
    </div>
  );
}