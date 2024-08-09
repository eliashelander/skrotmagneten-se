import React from 'react';
import Button from './Button';

export const HeroVideo: React.FC = () => {
  return (
    <div className="relative h-[56.25vw] 2xl:max-h-[864px] 3xl:max-h-[992px] 8xl:max-h-[1200px] bg-white overflow-hidden">
      <div className="absolute w-full h-full bg-black opacity-20 z-20"></div>
      <video
        src="https://cdn.shopify.com/videos/c/o/v/caca53c61eb54c1c93841aa98b8d996d.mp4"
        autoPlay
        muted
        loop // Add loop attribute
        className="absolute z-10 w-full mx-auto 4xl:-mt-16 5xl:-mt-40 6xl:-mt-56 7xl:-mt-64 8xl:-mt-72"
      />
      <div className="absolute h-full w-full z-30 flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-bold text-4xl text-white text-center">
          Aldrig mer punka med Skrotmagneten
        </h1>
        <Button
          to="/produkter/"
          variant="primary"
          label="Köp nu"
          type="button"
          loading={false}
          size="md"
        />
      </div>
    </div>
  );
};

// 0.5625 of screen width
