import React from 'react';

const Carousel = ({ images, width, height, reverse = false }) => {
  const quantity = images.length;

  return (
    <section
      className="relative overflow-hidden w-full mask-gradient group mt-10"
      style={{
        '--width': width,
        '--height': height,
        '--quantity': quantity,
        height: height,
      }}
    >
      <div
        className="flex w-full relative"
        style={{
          minWidth: `calc(${width} * ${quantity})`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute left-full ${
              reverse ? 'animate-reversePlay' : 'animate-autoRun'
            } group-hover:animation-play-state-paused filter transition-all duration-500 group-hover:grayscale`}
            style={{
              width: width,
              height: height,
              animationDelay: `calc((10s / var(--quantity)) * ${index} - 10s)`,
            }}
          >
            <img src={image} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Carousel;
