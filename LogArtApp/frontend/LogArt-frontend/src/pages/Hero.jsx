import { Element, Link as LinkScroll } from "react-scroll";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Faq from "../components/Faq.jsx";
import Carousel from "../components/Carousel.jsx";
import SwipeCarousel from "../components/SwipeCarousel.jsx";
const Hero = () => {
  const images = [
    "/images/image1.png",
    "/images/image2.png",
    "/images/image3.png",
    "/images/image4.png",
  ];
  return (
    <section className="relative pt-80 overflow-hidden max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32 bg-gradient-to-r from-blue-950 via-blue-600 to-blue-900 opacity-90">
      <Element name="hero">
        <div className="container">
          <div className="relative z-2 max-w-512 max-lg:max-w-388">
            <div className="caption small-2 uppercase text-p3">LogArt APP</div>
            <h1 className="mb-6 h1 text-p4 uppercase max-lg:mb-7 max-lg:h2 max-md:mb-4 max-md:text-5xl max-md:leading-12">
              Galería de recuerdos
            </h1>
            <p className="max-w-440 mb-14 body-1 max-md:mb-10">
              Diseñada para guardar tus experiencias sobre cualquier forma de
              entretenimento de una forma sencilla.
            </p>
            <div className="relative">
              <div className="absolute -top-20 right-20">
                <Link to="/register">
                  <Button icon="/images/zap.svg">¡Pruébalo!</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute top-40 left-[calc(50%-740px)] w-[1230px] pointer-events-none hero-img_res ">
            <img
              src="/images/spidernobg.png"
              className="size-1800 max-lg:h-auto"
              alt="hero"
            />
          </div>
        </div>
      </Element>

      <Faq />

      <Carousel images={images} width="250px" height="250px" />

      <Element name="Posibilidades" className="relative">
        <SwipeCarousel />
      </Element>
    </section>
  );
};

export default Hero;
