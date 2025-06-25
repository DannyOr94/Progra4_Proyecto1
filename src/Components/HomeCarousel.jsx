import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2700,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 1 } }
  ]
};

const HomeCarousel = () => (
  <section className="bg-[#ecf0f1] py-16">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#2c3e50]">Nuestra Comunidad en Imágenes</h2>
      <Slider {...carouselSettings}>
        {[1,2,3,4,5,6,7,8].map((item) => (
          <div key={item} className="px-2">
            <div className="relative overflow-hidden rounded-xl shadow-xl h-64 group">
              <img src={`public/carousel/carousel${item}.jpg`} alt={`Imagen ${item}`} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2c3e50]/80 to-transparent flex items-end p-6" />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  </section>
);

export default HomeCarousel;
