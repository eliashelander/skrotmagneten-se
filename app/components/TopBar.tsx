import {useLocation} from '@remix-run/react';
import React from 'react';
import {Container} from './Container';

export const TopBar: React.FC = () => {
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className={`${isHome ? 'bg-black md:bg-transparent' : 'bg-black'}`}>
      <Container>
        <div className="flex justify-end items-center h-10 text-white px-4">
          <span className="z-40">Alltid Gratis frakt!</span>
        </div>
      </Container>
    </div>
  );
};
