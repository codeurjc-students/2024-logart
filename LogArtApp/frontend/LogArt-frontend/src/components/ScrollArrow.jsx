import React from 'react';
import { FaArrowDown } from 'react-icons/fa';

const ScrollArrow = () => {
  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
      <FaArrowDown size={30} className="text-white" />
    </div>
  );
};

export default ScrollArrow;
