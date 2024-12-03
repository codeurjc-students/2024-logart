import React, { useContext } from "react";
import { Link as LinkScroll } from "react-scroll";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import clsx from "clsx";
import NavItem from "./NavItem"; 

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 32);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try{
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 z-50 w-full py-10 transition-all duration-500 max-lg:py-4",
        hasScrolled && "py-2 bg-black-100 backdrop-blur-[8px]",
      )}
    >
      <div className="container flex h-14 items-center max-lg:px-5">
        <a className="lg:hidden flex-1 cursor-pointer z-2">
          <img src="/images/logonb.svg" width={100} height={55} alt="logo" />
        </a>

        <div
          className={clsx(
            "w-full max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:bg-s2 max-lg:opacity-0",
            isOpen ? "max-lg:opacity-100" : "max-lg:pointer-events-none",
          )}
        >
          <div className="max-lg:relative max-lg:flex max-lg:flex-col max-lg:min-h-screen max-lg:p-6 max-lg:overflow-hidden sidebar-before max-md:px-4">
            <nav className="max-lg:relative max-lg:z-2 max-lg:my-auto">
              <ul className="flex max-lg:block max-lg:px-12">
                {!isAuthenticated && (
                  
                <li className="nav-li">
                  <NavItem type="scroll" to="Posibilidades" title="Posibilidades" onClick={closeMenu} />
                  <div className="dot" />
                  <NavItem type="scroll" to="FAQ" title="FAQ" onClick={closeMenu} />
                </li>
                )}
                <li className="nav-logo">
                  <LinkScroll
                    to="hero"
                    offset={-250}
                    spy
                    smooth
                    className={clsx(
                      "max-lg:hidden transition-transform duration-500 cursor-pointer",
                    )}
                    onClick={closeMenu} 
                  >
                    <img
                      src="/images/logonb.svg"
                      width={110} 
                      height={35}
                      alt="logo"
                    />
                  </LinkScroll>
                </li>

                <li className="nav-li mt-4">
                  {isAuthenticated ? (
                    <>
                      <NavItem type="router" to="/profile" title="Perfil" onClick={closeMenu} />
                      <button
                        onClick={() => { handleLogout(); closeMenu(); }}
                        className="base-bold text-p4 uppercase transition-colors duration-500 cursor-pointer hover:text-p1 max-lg:my-4 max-lg:h5"
                      >
                        Cerrar sesión
                      </button>
                      <NavItem type="router" to="/disciplines" title="Galerías" onClick={closeMenu} />
                    </>
                  ) : (
                    <>
                      <NavItem type="router" to="/login" title="Iniciar sesión" onClick={closeMenu} />
                      <div className="dot" />
                      <NavItem type="router" to="/register" title="Registrarse" onClick={closeMenu} />
                    </>
                  )}
                </li>
              </ul>
            </nav>

            <div className="lg:hidden block absolute top-1/2 left-0 w-[960px] h-[380px] translate-x-[-290px] -translate-y-1/2 rotate-90">
              <img
                src="/images/bg-outlines.svg"
                width={960}
                height={380}
                alt="outline"
                className="relative z-2"
              />
              <img
                src="/images/bg-outlines-fill.png"
                width={960}
                height={380}
                alt="outline"
                className="absolute inset-0 mix-blend-soft-light opacity-5"
              />
            </div>
          </div>
        </div>

        <button
          className="lg:hidden z-2 size-10 border-2 border-s4/25 rounded-full flex justify-center items-center"
          onClick={() => setIsOpen((prevState) => !prevState)}
        >
          <img
            src={`/images/${isOpen ? "close" : "magic"}.svg`}
            alt="magic"
            className="size-1/2 object-contain"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
