import React from 'react';
import Button from './Button';

export const HeroImage: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-[900px] bg-blend-darken bg-cover bg-no-repeat bg-[url('https://cdn.shopify.com/s/files/1/0847/4509/3413/files/lycklig-hast.jpg?v=1702640015')]">
      <div className="flex flex-1 h-full justify-center items-center bg-black/20 flex-col gap-4 text-center px-4">
        <h1 className="font-bold text-4xl text-white">
          Redo för ett säkrare stall?
        </h1>
        <Button
          to="/produkter/"
          variant="primary"
          label="Se alla produkter"
          type="button"
          loading={false}
          size="md"
        />
      </div>
    </div>
  );
};

// 0.5625 of screen width
