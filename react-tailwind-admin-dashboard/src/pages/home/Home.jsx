import { useEffect, useRef, useState } from "react";
import {
  FaCompass,
  FaMapMarkedAlt,
  FaGlobeAmericas,
  FaVrCardboard,
  FaArrowDown,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaMoon,
  FaSun,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";
import { fetchTours } from "../../services/TourServices";
//------------------------------
import ThemeTogglerTwo from '../../components/common/ThemeTogglerTwo' 
const Home = () => {
  const [activeSection, setActiveSection] = useState("Home");
  const [darkMode, setDarkMode] = useState(false);
  const sections = useRef([]);
  const [tours, setTours] = useState([]);

  const handleGetTours = async () => {
    await fetchTours().then((result) => {
      setTours(result);
    });
  };

  useEffect(() => {
    handleGetTours();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const addToRefs = (el) => {
    if (el && !sections.current.includes(el)) {
      sections.current.push(el);
    }
  };

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Define the icon color based on darkMode state
  const iconColor = darkMode ? "#1C2433" : "";

  return !darkMode ? (
    <div
      className={`font-sans text-slate-800 bg-white ${darkMode ? "dark" : ""}`}
    >
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-800/90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary dark:text-white">
            <span className="text-indigo-600 dark:text-indigo-400">360</span>
            Tour
          </div>
          <div className="hidden md:flex space-x-8">
            {["Home", "features", "gallery", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`capitalize transition-all duration-300 ${
                  activeSection === item
                    ? "text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-slate-600 hover:text-indigo-500 dark:text-gray-300 dark:hover:text-indigo-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="hidden md:flex space-x-4 items-center">
            <ThemeTogglerTwo />
           
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/signin")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Se connecter
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/dashboard_${user.roles[0]}`)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Tableau de board
                </button>

                <button
                  onClick={() => dispatch(logout())}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Déconnection
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="Home"
        ref={addToRefs}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 pt-20 dark:from-gray-800 dark:to-gray-900"
      >
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 animate-fadeIn">
            <h1 className="flex items-center text-5xl md:text-6xl font-bold leading-tight dark:text-white">
              <div className="flex">
                <span className="text-indigo-600 dark:text-indigo-400 mr-4">
                  Explore the World in 360°{" "}
                  <FaCompass
                    className="inline text-indigo-600 dark:text-indigo-400 text-6xl animate-spin-fast"
                    style={{ color: iconColor }}
                    title="compass"
                  />
                </span>{" "}
              </div>
            </h1>
            <p className="text-xl text-slate-600 dark:text-gray-300">
              Immersive virtual tours that transport you to the most amazing
              places on Earth.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => scrollToSection("gallery")}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Start Exploring
              </button>
              <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors text-lg dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-gray-700">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 animate-float">
            <div className="relative">
              <div className="w-full h-80 md:h-96 bg-indigo-200 rounded-2xl shadow-xl overflow-hidden dark:bg-gray-700">
                {/* Placeholder for 360 viewer */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-gray-600 dark:to-gray-800">
                  <img
                    className="px-2 rounded-4xl"
                    src="https://blog.virtualtoureasy.com/wp-content/uploads/2020/08/vr2_14d8abc47bd9d93f20e279579f16416b_2000.jpg"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg dark:bg-gray-700">
                <FaVrCardboard
                  className="text-indigo-600 text-3xl dark:text-indigo-400"
                  style={{ color: iconColor }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <FaArrowDown
            className="text-indigo-600 text-2xl dark:text-indigo-400"
            style={{ color: iconColor }}
          />
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={addToRefs}
        className="py-20 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">
              Why Choose Our 360 Tours
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto dark:text-gray-300">
              Cutting-edge technology meets breathtaking destinations for an
              unparalleled virtual experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: (
                  <FaCompass
                    className="text-4xl mb-4 text-white"
                    style={{ color: iconColor }}
                  />
                ),
                title: "Interactive Navigation",
                description:
                  "Seamlessly move between locations with our intuitive controls.",
              },
              {
                icon: (
                  <FaMapMarkedAlt
                    className="text-4xl mb-4 text-white"
                    style={{ color: iconColor }}
                    title="map"
                  />
                ),
                title: "Detailed Locations",
                description:
                  "Every tour includes comprehensive information about each point of interest.",
              },
              {
                icon: (
                  <FaGlobeAmericas
                    className="text-4xl mb-4 text-white"
                    style={{ color: iconColor }}
                    title="globe"
                  />
                ),
                title: "Global Destinations",
                description:
                  "Access world-famous landmarks from the comfort of your home.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white p-8 rounded-xl hover:bg-indigo-50 transition-colors duration-300 animate-fadeInUp dark:from-gray-700 dark:to-gray-900"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {feature.icon}
                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        id="gallery"
        ref={addToRefs}
        className="py-20 bg-slate-50 dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">
              Featured Tours
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto dark:text-gray-300">
              Explore our collection of stunning 360° virtual experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.length > 0 &&
              tours.map((item) => (
                <NavLink to={`/view_tour/${item.id}`} key={item.id}>
                  <div
                    className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 animate-fadeIn dark:bg-gray-800"
                    style={{ animationDelay: `${item * 0.1}s` }}
                  >
                    <div className="relative w-full h-64 bg-indigo-200 dark:bg-gray-700">
                      <img
                        className="absolute inset-0 w-full h-full object-cover"
                        src={item.scenes[0].textureUrl}
                        alt={item.tourName}
                      />
                      {/* Fallback icon centered */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaCompass
                          className="text-white text-5xl group-hover:scale-110 transition-transform duration-500"
                          style={{ color: iconColor }}
                        />
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div>
                        <h3 className="text-white text-xl font-semibold">
                          {item.tourName}
                        </h3>
                        <p className="text-white/90">
                          Explore this beautiful destination in 360°
                        </p>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium dark:bg-indigo-500">
                      New
                    </div>
                  </div>
                </NavLink>
              ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        ref={addToRefs}
        className="relative min-h-screen flex items-center justify-center bg-[#192434] pt-20 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-indigo-900 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-blue-900 blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-12 animate-fadeIn relative z-10">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white bg-clip-text">
              Get In Touch
            </h1>
            <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full"></div>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We'd love to hear from you! Whether you have a question about
              features, pricing, or anything else, our team is ready to answer
              all your questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Address Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 hover:-translate-y-1 transition-transform">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-900/50 rounded-lg">
                  <FaMapMarkerAlt className="text-indigo-400 text-xl" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-white mb-2">
                    Our Address
                  </h2>
                  <p className="text-gray-400">
                    123 Virtual Tour Ave
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 hover:-translate-y-1 transition-transform">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-900/50 rounded-lg">
                  <FaPhoneAlt className="text-indigo-400 text-xl" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-white mb-2">
                    Call Us
                  </h2>
                  <p className="text-gray-400">
                    +1 (555) 123-4567
                    <br />
                    Mon-Fri, 9am-5pm EST
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 hover:-translate-y-1 transition-transform">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-900/50 rounded-lg">
                  <FaEnvelope className="text-indigo-400 text-xl" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-white mb-2">
                    Email Us
                  </h2>
                  <p className="text-gray-400">
                    info@virtual360tours.com
                    <br />
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="pt-8">
            <p className="text-gray-400 mb-4">Follow us on social media</p>
            <div className="flex justify-center space-x-6">
              {[
                {
                  icon: <FaFacebookF className="text-xl" />,
                  color: "bg-blue-600",
                },
                {
                  icon: <FaTwitter className="text-xl" />,
                  color: "bg-sky-500",
                },
                {
                  icon: <FaInstagram className="text-xl" />,
                  color: "bg-pink-600",
                },
                {
                  icon: <FaLinkedinIn className="text-xl" />,
                  color: "bg-blue-700",
                },
                {
                  icon: <FaYoutube className="text-xl" />,
                  color: "bg-red-600",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`${social.color} text-white p-3 rounded-full hover:opacity-90 transition-opacity shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-transform`}
                  aria-label={`${social.color.split("-")[1]} social media`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 dark:bg-gray-800">
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400 dark:text-gray-300">
          <p>© {new Date().getFullYear()} 360Tour. All rights reserved.</p>
        </div>
      </footer>
    </div>
  ) : (
    <div className="font-sans text-slate-800 bg-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">
            <span className="text-indigo-600">360</span>Tour
          </div>
          <div className="hidden md:flex space-x-8">
            {["Home", "features", "gallery", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`capitalize transition-all duration-300 ${
                  activeSection === item
                    ? "text-indigo-600 font-medium"
                    : "text-slate-600 hover:text-indigo-500"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="hidden md:flex space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-gray-600" />
              )}
            </button>
            {!user ? (
              <>
                {" "}
                <button
                  onClick={() => navigate("/signin")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Se connecter
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate(`/dashboard_${user.roles[0]}`)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Tableau de board
                </button>

                <button
                  onClick={() => dispatch(logout())}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Déconnection
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="Home"
        ref={addToRefs}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 pt-20"
      >
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 animate-fadeIn">
            <h1 className="flex items-center text-5xl md:text-6xl font-bold leading-tight">
              <div className="flex">
                <span className="text-indigo-600 mr-4">
                  Explore the World in 360°{" "}
                  <FaCompass className="inline text-indigo-600 text-6xl animate-spin-fast" />
                </span>{" "}
              </div>
            </h1>
            <p className="text-xl text-slate-600">
              Immersive virtual tours that transport you to the most amazing
              places on Earth.
            </p>
            <div className="flex space-x-4">
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-lg">
                Start Exploring
              </button>
              <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors text-lg">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 animate-float">
            <div className="relative">
              <div className="w-full h-80 md:h-96 bg-indigo-200 rounded-2xl shadow-xl overflow-hidden">
                {/* Placeholder for 360 viewer */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
                  <img
                    className="px-2 rounded-4xl"
                    src="https://blog.virtualtoureasy.com/wp-content/uploads/2020/08/vr2_14d8abc47bd9d93f20e279579f16416b_2000.jpg"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                <FaVrCardboard className="text-indigo-600 text-3xl" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <FaArrowDown className="text-indigo-600 text-2xl" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={addToRefs} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Our 360 Tours
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Cutting-edge technology meets breathtaking destinations for an
              unparalleled virtual experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: (
                  <FaCompass
                    title="compass"
                    className="text-4xl mb-4 text-white"
                  />
                ),
                title: "Interactive Navigation",
                description:
                  "Seamlessly move between locations with our intuitive controls.",
              },
              {
                icon: (
                  <FaMapMarkedAlt
                    title="map"
                    className="text-4xl mb-4 text-white"
                  />
                ),
                title: "Detailed Locations",
                description:
                  "Every tour includes comprehensive information about each point of interest.",
              },
              {
                icon: (
                  <FaGlobeAmericas
                    title="globe"
                    className="text-4xl mb-4 text-white"
                  />
                ),
                title: "Global Destinations",
                description:
                  "Access world-famous landmarks from the comfort of your home.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white p-8 rounded-xl  hover:bg-indigo-50 transition-colors duration-300 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {feature.icon}
                <h3 className="text-2xl  font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-white">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" ref={addToRefs} className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Featured Tours</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explore our collection of stunning 360° virtual experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.length > 0 &&
              tours.map((item) => (
                <NavLink to={`/view_tour/${item.id}`}>
                  <div
                    key={item}
                    className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 animate-fadeIn"
                    style={{ animationDelay: `${item * 0.1}s` }}
                  >
                    <div className="relative w-full h-64 bg-indigo-200">
                      <img
                        className="absolute inset-0 w-full h-full object-cover"
                        src={item.scenes[0].textureUrl}
                        alt={item.tourName}
                      />
                      {/* Fallback icon centered */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaCompass
                          title="compass"
                          className="text-white text-5xl group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div>
                        <h3 className="text-white text-xl font-semibold">
                          {item.tourName}
                        </h3>
                        <p className="text-white/90">
                          Explore this beautiful destination in 360°
                        </p>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      New
                    </div>
                  </div>
                </NavLink>
              ))}
          </div>
        </div>
      </section>

      {/* Add more sections (Pricing, Testimonials, Contact) as needed */}
      <section
        id="contact"
        ref={addToRefs}
        className="relative min-h-screen flex items-center justify-center bg-[#192434] pt-20 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-indigo-900 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-blue-900 blur-3xl"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-20 text-center space-y-12 animate-fadeIn relative z-10">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white bg-clip-text">
              Get In Touch
            </h1>
            <div className="w-20 h-1.5 bg-indigo-500 mx-auto rounded-full"></div>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We'd love to hear from you! Whether you have a question about
              features, pricing, or anything else, our team is ready to answer
              all your questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {/* Address Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 hover:-translate-y-1 transition-transform">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-900/50 rounded-lg">
                  <FaMapMarkerAlt className="text-indigo-400 text-xl" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-white mb-2">
                    Our Address
                  </h2>
                  <p className="text-gray-400">
                    123 Virtual Tour Ave
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 hover:-translate-y-1 transition-transform">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-900/50 rounded-lg">
                  <FaPhoneAlt className="text-indigo-400 text-xl" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-white mb-2">
                    Call Us
                  </h2>
                  <p className="text-gray-400">
                    +1 (555) 123-4567
                    <br />
                    Mon-Fri, 9am-5pm EST
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 hover:-translate-y-1 transition-transform">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-indigo-900/50 rounded-lg">
                  <FaEnvelope className="text-indigo-400 text-xl" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-white mb-2">
                    Email Us
                  </h2>
                  <p className="text-gray-400">
                    info@virtual360tours.com
                    <br />
                    Response within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}

          {/* Social Media */}
          <div className="pt-8">
            <p className="text-gray-400 mb-4">Follow us on social media</p>
            <div className="flex justify-center space-x-6">
              {[
                {
                  icon: <FaFacebookF className="text-xl" />,
                  color: "bg-blue-600",
                },
                {
                  icon: <FaTwitter className="text-xl" />,
                  color: "bg-sky-500",
                },
                {
                  icon: <FaInstagram className="text-xl" />,
                  color: "bg-pink-600",
                },
                {
                  icon: <FaLinkedinIn className="text-xl" />,
                  color: "bg-blue-700",
                },
                {
                  icon: <FaYoutube className="text-xl" />,
                  color: "bg-red-600",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`${social.color} text-white p-3 rounded-full hover:opacity-90 transition-opacity shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-transform`}
                  aria-label={`${social.color.split("-")[1]} social media`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-slate-900 text-white py-12">
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>© {new Date().getFullYear()} 360Tour. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
export default Home;
