import React from 'react';

type ContainerProps = {
  children: React.ReactNode;
};

export const Container: React.FC<ContainerProps> = ({children}) => {
  return <div className="px-4 max-w-7xl mx-auto">{children}</div>;
};
