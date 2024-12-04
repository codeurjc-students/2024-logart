import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import clsx from 'clsx';

const NavItem = ({ type, to, title, onClick, className }) => {
  if (type === 'scroll') {
    return (
      <ScrollLink
        to={to}
        offset={-100}
        spy
        smooth
        activeClass="nav-active"
        onClick={onClick}
        className={clsx(
          "base-bold text-p4 uppercase transition-colors duration-500 cursor-pointer hover:text-p1 max-lg:my-4 max-lg:h5",
          className
        )}
      >
        {title}
      </ScrollLink>
    );
  } else if (type === 'router') {
    return (
      <RouterLink
        to={to}
        onClick={onClick}
        className={clsx(
          "base-bold text-p4 uppercase transition-colors duration-500 cursor-pointer hover:text-p1 max-lg:my-4 max-lg:h5",
          className
        )}
      >
        {title}
      </RouterLink>
    );
  } else {
    return null;
  }
};

export default NavItem;
