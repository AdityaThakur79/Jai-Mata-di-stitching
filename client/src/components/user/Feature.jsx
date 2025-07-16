import React from 'react';
import { Search, Globe, Users, Shield, Award } from 'lucide-react';

const features = [
  {
    icon: <Search className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" color="#2c3e50" strokeWidth={1.5} />,
    title: 'Order Tracking',
    subtitle: 'For all orders*',
  },
  {
    icon: <Globe className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" color="#2c3e50" strokeWidth={1.5} />,
    title: 'Global Fulfillment',
    subtitle: 'Worldwide Delivery',
  },
  {
    icon: <Users className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" color="#2c3e50" strokeWidth={1.5} />,
    title: '200K+',
    subtitle: 'Satisfied Customers',
  },
  {
    icon: <Shield className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" color="#2c3e50" strokeWidth={1.5} />,
    title: 'Certified Quality',
    subtitle: 'ISO Standards',
  },
  {
    icon: <Award className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" color="#2c3e50" strokeWidth={1.5} />,
    title: 'Premium Grade',
    subtitle: 'Superior Materials',
  },
  {
    icon: <Search className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" color="#2c3e50" strokeWidth={1.5} />,
    title: 'Order Tracking',
    subtitle: 'For all orders*',
  },
  {
    icon: <Globe className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" color="#2c3e50" strokeWidth={1.5} />,
    title: 'Global Fulfillment',
    subtitle: 'Worldwide Delivery',
  },
  {
    icon: <Users className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" color="#2c3e50" strokeWidth={1.5} />,
    title: '200K+',
    subtitle: 'Satisfied Customers',
  },
  {
    icon: <Shield className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" color="#2c3e50" strokeWidth={1.5} />,
    title: 'Certified Quality',
    subtitle: 'ISO Standards',
  },
  {
    icon: <Award className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10" color="#2c3e50" strokeWidth={1.5} />,
    title: 'Premium Grade',
    subtitle: 'Superior Materials',
  },
];

const Feature = () => {
  return (
    <div
      className="relative w-full overflow-hidden py-5 sm:py-6 md:py-10  "
      style={{
        background: 'linear-gradient(135deg, #f8f4e6 0%, #e8dcc0 50%, #d4c4a0 100%)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
      }}
    >
      <div className="w-full overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...features, ...features].map((feature, i) => (
            <div
              key={i}
              className="flex items-center mx-4 sm:mx-8 md:mx-16 min-w-[180px] sm:min-w-[220px] md:min-w-[260px] lg:min-w-[280px]"
            >
              <div className="mr-3 sm:mr-4 md:mr-6 flex-shrink-0 p-2 sm:p-3 rounded-full bg-white/30 backdrop-blur-sm border border-white/20">
                {feature.icon}
              </div>
              <div>
                <div className="mb-1 font-semibold text-sm sm:text-base md:text-lg lg:text-xl text-[#2c3e50] tracking-wide leading-snug [text-shadow:0_1px_2px_rgba(255,255,255,0.8)]">
                  {feature.title}
                </div>
                <div className="font-normal italic text-xs sm:text-sm md:text-base text-[#5a6c7d] tracking-tight leading-relaxed [text-shadow:0_1px_2px_rgba(255,255,255,0.6)]">
                  {feature.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Feature;
