import React from 'react';
import { Search, Globe, Users, Shield, Award } from 'lucide-react';

const features = [
  {
    icon: <Search size={36} color="#2c3e50" strokeWidth={1.5} />,
    title: 'Order Tracking',
    subtitle: 'For all orders*',
  },
  {
    icon: <Globe size={36} color="#2c3e50" strokeWidth={1.5} />,
    title: 'Global Fulfillment',
    subtitle: 'Worldwide Delivery',
  },
  {
    icon: <Users size={36} color="#2c3e50" strokeWidth={1.5} />,
    title: '200K+',
    subtitle: 'Satisfied Customers',
  },
  {
    icon: <Shield size={36} color="#2c3e50" strokeWidth={1.5} />,
    title: 'Certified Quality',
    subtitle: 'ISO Standards',
  },
  {
    icon: <Award size={36} color="#2c3e50" strokeWidth={1.5} />,
    title: 'Premium Grade',
    subtitle: 'Superior Materials',
  },
];

const Feature = () => {
  return (
    <div className="relative w-full overflow-hidden py-8 mt-12" style={{
      background: 'linear-gradient(135deg, #f8f4e6 0%, #e8dcc0 50%, #d4c4a0 100%)',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)'
    }}>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />
      
      <div className="whitespace-nowrap flex items-center animate-scroll-infinite" style={{ animationDuration: '15s' }}>
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="flex">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center mx-20 min-w-[280px]">
                <div className="mr-6 flex-shrink-0 p-3 rounded-full bg-white/30 backdrop-blur-sm border border-white/20">
                  {feature.icon}
                </div>
                <div>
                  <div
                    style={{
                      color: '#2c3e50',
                      
                      fontWeight: 600,
                      fontSize: '1.125rem',
                      letterSpacing: '0.025em',
                      textShadow: '0 1px 2px rgba(255,255,255,0.8)',
                      lineHeight: 1.3,
                    }}
                    className="mb-1"
                  >
                    {feature.title}
                  </div>
                  <div
                    style={{
                      color: '#5a6c7d',
                      
                      fontWeight: 400,
                      fontSize: '0.875rem',
                      letterSpacing: '0.015em',
                      textShadow: '0 1px 2px rgba(255,255,255,0.6)',
                      fontStyle: 'italic',
                      lineHeight: 1.4,
                    }}
                  >
                    {feature.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes scroll-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-infinite {
          animation: scroll-infinite linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Feature;