/* eslint-disable @next/next/no-img-element */
import { BlurFade } from "@/components/magicui/blur-fade";

const images = [
  '/images/jiodh2.jpg',
  '/images/suit2.jpg',
  '/images/jeanss2.png',
  '/images/formal1.jpg',
  '/images/jeans.png',
  '/images/kurta1.jpg',
  '/images/formal2.jpg',
  '/images/formal2.jpg',
  '/images/menindark.png',
  '/images/pathani1.jpg',
  '/images/pathani1.jpg',
  '/images/pathani1.jpg',

  // '/images/suit1.jpg',
  // '/images/trouser1.jpg',
  // '/images/tshirt.jpg',
  // '/images/tshirt.jpg',
  // '/images/jodh1.png',
  // '/images/jodh1.png',
  // '/images/shirt2.png',
  // '/images/shirts1.jpg',
  // '/images/shirts1.jpg',
];

export function Gallery() {
  return (
    <section id="photos">
      <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
        <BlurFade direction="up" offset={24}>
          <h2 className="text-xs font-bold text-amber-600 tracking-[0.2em] uppercase mb-4 font-serif">CRAFTED VISIONS</h2>
          <h1 className="text-3xl md:text-5xl font-light text-gray-800 mb-4 font-serif leading-tight">Our Gallery</h1>
          <div className="flex justify-center mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-px bg-amber-300"></div>
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <div className="w-8 h-px bg-amber-300"></div>
            </div>
          </div>
        </BlurFade>
      </div>
      <div className="columns-2 gap-4 sm:columns-3">
        {images.map((imageUrl, idx) => (
          <BlurFade key={imageUrl} delay={0.25 + idx * 0.05} inView>
            <div className="mb-4 group relative overflow-hidden rounded-lg cursor-pointer">
              {/* Image */}
              <img
                className="size-full object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-110"
                src={imageUrl}
                alt={`Gallery image ${idx + 1}`}
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out"></div>
              
              {/* Golden Border Effect */}
              <div 
                className="absolute inset-0 border-2 opacity-0 group-hover:opacity-80 transition-all duration-300 ease-out rounded-lg"
                style={{ borderColor: '#e3b873' }}
              ></div>
              
              {/* Subtle Glow Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-all duration-500 ease-out rounded-lg blur-sm"
                style={{ 
                  background: 'radial-gradient(circle at center, #e3b873 0%, transparent 70%)',
                  transform: 'scale(1.1)'
                }}
              ></div>
              
              {/* Corner Accents */}
              <div className="absolute top-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-60 transition-all duration-300 delay-100">
                <div 
                  className="absolute top-0 right-0 w-full h-0.5 transform origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ background: '#e3b873' }}
                ></div>
                <div 
                  className="absolute top-0 right-0 h-full w-0.5 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 delay-75"
                  style={{ background: '#e3b873' }}
                ></div>
              </div>
              
              <div className="absolute bottom-2 left-2 w-4 h-4 opacity-0 group-hover:opacity-60 transition-all duration-300 delay-150">
                <div 
                  className="absolute bottom-0 left-0 w-full h-0.5 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ background: '#e3b873' }}
                ></div>
                <div 
                  className="absolute bottom-0 left-0 h-full w-0.5 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300 delay-75"
                  style={{ background: '#e3b873' }}
                ></div>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </section>
  );
}