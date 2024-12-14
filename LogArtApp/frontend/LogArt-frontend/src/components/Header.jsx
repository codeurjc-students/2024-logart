import React, { useContext, useEffect, useState } from "react";
import { Link as LinkScroll } from "react-scroll";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ModalContext } from "../context/ModalContext";
import clsx from "clsx";
import NavItem from "./NavItem";

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { currentModal } = useContext(ModalContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isInAuthPage = ["/login", "/register"].includes(location.pathname);
  const isErrorPage = location.pathname === "/404-error";
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
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  const closeMenu = () => {
    setIsOpen(false);
  };
  if (currentModal || isErrorPage) {
    return null;
  }
  return (
    <header
      className={clsx(
        "fixed top-0 left-0 z-50 w-full py-6 transition-all duration-500 max-lg:py-4",
        hasScrolled && "py-2 bg-black-100 backdrop-blur-[8px]"
      )}
    >
      <div
        className={clsx(
          "container flex h-14 items-center max-lg:px-5",
          isInAuthPage ? "justify-center" : "justify-between"
        )}
      >
        {isInAuthPage ? (
          <Link
            to="/"
            className="lg:hidden cursor-pointer z-2 transform animate-pulse"
            onClick={closeMenu}
          >
            <img src="/images/logonb.svg" width={100} height={55} alt="logo" />
          </Link>
        ) : (
          <LinkScroll
            to="hero"
            offset={-250}
            spy
            smooth
            className="lg:hidden flex-1 cursor-pointer z-2"
            onClick={closeMenu}
          >
            <img src="/images/logonb.svg" width={100} height={55} alt="logo" />
          </LinkScroll>
        )}
        <div
          className={clsx(
            "w-full max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:w-full max-lg:bg-s2 max-lg:opacity-0",
            isOpen ? "max-lg:opacity-100" : "max-lg:pointer-events-none"
          )}
        >
          <div className="max-lg:relative max-lg:flex max-lg:flex-col max-lg:min-h-screen max-lg:p-6 max-lg:overflow-hidden sidebar-before max-md:px-4">
            <nav className="max-lg:relative max-lg:z-2 max-lg:my-auto">
              <ul className="flex max-lg:block max-lg:px-12">
                {!isAuthenticated && !isInAuthPage && (
                  <li className="nav-li">
                    <NavItem
                      type="scroll"
                      to="Posibilidades"
                      title="Posibilidades"
                      onClick={closeMenu}
                    />
                    <NavItem
                      type="scroll"
                      to="FAQ"
                      title="FAQ"
                      onClick={closeMenu}
                    />
                  </li>
                )}
                <li
                  className={clsx(
                    "nav-logo",
                    isInAuthPage ? "flex-none mx-auto" : ""
                  )}
                >
                  {isInAuthPage ? (
                    <Link
                      to="/"
                      className="max-lg:hidden cursor-pointer z-2 transform animate-pulse"
                      onClick={closeMenu}
                    >
                      <img
                        src="/images/logonb.svg"
                        width={100}
                        height={35}
                        alt="logo"
                      />
                    </Link>
                  ) : (
                    <LinkScroll
                      to="hero"
                      offset={-250}
                      spy
                      smooth
                      className="max-lg:hidden transition-transform duration-500 cursor-pointer"
                      onClick={closeMenu}
                    >
                      <img
                        src="/images/logonb.svg"
                        width={110}
                        height={35}
                        alt="logo"
                      />
                    </LinkScroll>
                  )}
                </li>
                {isAuthenticated ? (
                  <li className="nav-li mt-4">
                    <NavItem
                      type="router"
                      to="/profile"
                      title="Perfil"
                      onClick={closeMenu}
                    />
                    <NavItem
                      type="router"
                      to="/disciplines"
                      title="Galerías"
                      onClick={closeMenu}
                    />
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="base-bold text-p4 uppercase transition-colors duration-500 cursor-pointer hover:text-p1 max-lg:my-4 max-lg:h5"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                ) : (
                  !isInAuthPage && (
                    <li className="nav-li mt-4">
                      <NavItem
                        type="router"
                        to="/login"
                        title="Iniciar sesión"
                        onClick={closeMenu}
                      />
                      <NavItem
                        type="router"
                        to="/register"
                        title="Registrarse"
                        onClick={closeMenu}
                      />
                    </li>
                  )
                )}
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
        {!isInAuthPage && (
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
        )}
      </div>
    </header>
  );
};

export default Header;
