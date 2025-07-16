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
  '/images/menindark.png',
  '/images/pathani1.jpg',

  '/images/suit1.jpg',
  '/images/trouser1.jpg',
  '/images/tshirt.jpg',
  '/images/jodh1.png',
  '/images/shirt2.png',
  '/images/shirts1.jpg',
];

export function Gallery() {
  return (
    <section id="photos">
      <div className="columns-2 gap-4 sm:columns-3">
        {images.map((imageUrl, idx) => (
          <BlurFade key={imageUrl} delay={0.25 + idx * 0.05} inView>
            <img
              className="mb-4 size-full rounded-lg object-contain"
              src={imageUrl}
              alt={`Random stock image ${idx + 1}`}
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}