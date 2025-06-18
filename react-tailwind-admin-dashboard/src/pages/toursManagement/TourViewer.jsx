import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import axios from "axios";
import { useParams, useNavigate, data } from "react-router";
import {
  FaPlay,
  FaPause,
  FaRedoAlt,
  FaExpand,
  FaCompress,
  FaImages,
  FaMap,
  FaBuilding,
  FaUsers,
  FaChevronRight,
  FaMapMarkerAlt,
  FaTimes,
  FaChevronLeft,
  FaChevronRight as FaNext,
  FaVolumeUp,
  FaVolumeMute,
  FaEnvelope,
  FaPhone,
  FaHome,
} from "react-icons/fa";
import { SiGooglemaps } from "react-icons/si";
import NavigationArrow from "./NavigationArrow";
import FieldOfViewUpdater from "./FieldOfView";
import povImg from "./pov.png";
import { trackVisitorService } from "../../services/visitServices";
import { fetchTourById } from "../../services/TourServices";

const TourViewer = () => {
  const { tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [plan, setPlan] = useState(null);
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [hotspotText, setHotspotText] = useState("");
  const [selectedScene, setSelectedScene] = useState("");
  const [message, setMessage] = useState("");
  const [previews, setPreviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tourName, setTourName] = useState("");
  const [editingHotspot, setEditingHotspot] = useState(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [showPlanOverlay, setShowPlanOverlay] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const audioRef = useRef(null);
  const [showLocalisation, setShowLocalisation] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [yawDeg, setYawDeg] = useState(0);
  const yawDegRef = useRef(0);
  const fovRef = useRef();

  useEffect(() => {
    const updateFOV = () => {
      if (fovRef.current) {
        fovRef.current.style.transform = `translate(-50%, -50%) rotate(${-yawDegRef.current}deg)`;
      }
      requestAnimationFrame(updateFOV);
    };
    updateFOV();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        trackVisitorService({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          tourId: tourId,
        });
      },
      (err) => {
        setError("Unable to retrieve location");
        console.error(err);
      }
    );
  }, []);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetchTourById(tourId);
        const data = response;
        setTour(data);
        setTourName(data.tourName);
        setScenes(data.scenes);
        setPlan(data.plan);
        setPreviews(
          data.scenes.map((scene) => ({
            id: scene.textureUrl,
            blobUrl: scene.textureUrl,
            name: scene.name || `Vue ${data.scenes.indexOf(scene) + 1}`,
          }))
        );
      } catch (error) {
        console.error("Error fetching tour:", error);
        setMessage("Failed to fetch tour data.");
      }
    };

    fetchTour();
  }, [tourId]);

  const handleImageSelect = async (imageId) => {
    setSelectedImage(imageId);
    setCurrentSceneId(imageId);
    setEditingHotspot(null);
  };

  const handleHotspotClick = (hotspot) => {
    setEditingHotspot(hotspot);
    handleImageSelect(hotspot.linkTo);
    setHotspotText(hotspot.name);
    setSelectedScene(hotspot.linkTo);
    setLat(hotspot.position[0]);
    setLon(hotspot.position[1]);
  };

  useEffect(() => {
    handleImageSelect(previews[0]?.id);
  }, [previews]);

  const navigate = useNavigate();

  const toggleAutoRotate = (e) => {
    e.stopPropagation();
    setAutoRotate(!autoRotate);
  };

  const togglePanel = (panel) => {
    if (panel === "plan") {
      setShowPlanOverlay(!showPlanOverlay);
      setShowGallery(false);
      setShowContact(false);
      setShowLocalisation(false);
      setActivePanel(activePanel === panel ? null : panel);
    } else if (panel === "localisation") {
      setShowLocalisation(!showLocalisation);
      setShowPlanOverlay(false);
      setShowGallery(false);
      setShowContact(false);
      setActivePanel(activePanel === panel ? null : panel);
    } else if (panel === "contact") {
      setShowContact(!showContact);
      setShowPlanOverlay(false);
      setShowGallery(false);
      setShowLocalisation(false);
      setActivePanel(activePanel === panel ? null : panel);
    } else if (panel === "gallery") {
      setShowGallery(!showGallery);
      setShowPlanOverlay(false);
      setShowContact(false);
      setShowLocalisation(false);
      setActivePanel(activePanel === panel ? null : panel);
    } else {
      setActivePanel(activePanel === panel ? null : panel);
      setShowGallery(false);
      setShowPlanOverlay(false);
      setShowContact(false);
      setShowLocalisation(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) =>
          console.error("Error attempting to enable fullscreen:", err)
        );
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) =>
          console.error("Error attempting to exit fullscreen:", err)
        );
    }
  };

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
    if (audioRef.current) {
      if (isSoundOn) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const nextGalleryImage = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % previews.length);
  };

  const prevGalleryImage = () => {
    setCurrentGalleryIndex(
      (prev) => (prev - 1 + previews.length) % previews.length
    );
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="relative h-screen w-full ">
      <audio
        ref={audioRef}
        loop
        src="/music.mp3"
        style={{ display: "none" }}
      />

      <div className="absolute inset-0 z-10  w-50  bg-black opacity-75 border-r border-gray-700 flex flex-col">
        <div
          className="p-4 border-b border-gray-700 cursor-pointer  transition"
          onClick={() => togglePanel("rotation")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg mr-3 ${
                  autoRotate ? "bg-gray-800" : "bg-gray-700"
                }`}
                onClick={toggleAutoRotate}
              >
                {autoRotate ? (
                  <FaPause size={18} className="text-white" />
                ) : (
                  <FaPlay size={18} className="text-white" />
                )}
              </div>
              <span className="text-white font-semibold text-base">
                Rotation
              </span>
            </div>
            <FaChevronRight
              className={`text-white transition-transform ${
                activePanel === "rotation" ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>

        <div
          className="p-4 border-b border-gray-700 cursor-pointer  transition"
          onClick={() => togglePanel("gallery")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3 bg-gray-700">
                <FaImages size={18} className="text-white" />
              </div>
              <spam className="text-white">Galerie</spam>
            </div>
            <FaChevronRight
              className={`text-white transition-transform ${
                activePanel === "gallery" ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>

        <div
          className="p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 transition"
          onClick={() => togglePanel("plan")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3 bg-gray-700">
                <FaMap size={18} className="text-white" />
              </div>
              <span className="text-white">Plan</span>
            </div>
            <FaChevronRight
              className={`text-white transition-transform ${
                activePanel === "plan" ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>

        <div
          className="p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 transition"
          onClick={() => togglePanel("localisation")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3 bg-gray-700">
                <SiGooglemaps size={18} className="text-white" />
              </div>
              <span className="text-white">localisation</span>
            </div>
            <FaChevronRight
              className={`text-white transition-transform ${
                activePanel === "localisation" ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>

        <div
          className="p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 transition"
          onClick={() => togglePanel("contact")}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3 ">
                <FaUsers size={18} className="text-white" />
              </div>
              <span className="text-white">Contact</span>
            </div>
            <FaChevronRight
              className={`text-white transition-transform ${
                activePanel === "contact" ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>

        <div className="mt-auto p-4 flex justify-center space-x-4">
          <button
            className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Quitter le mode plein écran" : "Plein écran"}
          >
            {isFullscreen ? <FaCompress size={20} /> : <FaExpand size={20} />}
          </button>

          <button
            className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
            onClick={toggleSound}
            title={isSoundOn ? "Couper le son" : "Activer le son"}
          >
            {isSoundOn ? <FaVolumeUp size={20} /> : <FaVolumeMute size={20} />}
          </button>
        </div>
      </div>

      <div className="flex-1 relative h-full z-0">
        <Canvas
          camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 0.1] }}
        >
          <Scene
            scene={{
              id: currentSceneId,
              textureUrl: selectedImage,
              links:
                scenes.find((scene) => scene.textureUrl === currentSceneId)
                  ?.links || [],
            }}
            lat={lat}
            lon={lon}
            setLat={setLat}
            setLon={setLon}
            onHotspotClick={handleHotspotClick}
            previews={previews}
            editingHotspot={editingHotspot}
            autoRotate={autoRotate}
            rotationSpeed={0.4}
            plan={plan}
            currentSceneId={currentSceneId}
            handleImageSelect={handleImageSelect}
          />

          <FieldOfViewUpdater
            setYawDeg={(yaw) => {
              yawDegRef.current = yaw; // Update the ref directly
            }}
          />
        </Canvas>

        {/* Plan miniature toujours visible */}
        {plan?.imagePlan && !showContact && !showLocalisation && (
          <div className="absolute bottom-4 right-4 z-10 bg-black bg-opacity-50 p-2 rounded-lg shadow-lg">
            <div
              className="relative"
              style={{ width: "200px", height: "200px" }}
            >
              <img
                src={plan?.imagePlan}
                alt="Mini plan"
                className="w-full h-full object-contain"
              />
              {plan?.links?.map((hotspot, index) => {
                // Convertir les coordonnées normalisées (-1 à +1) en pourcentage (0 à 100%)
                const xPercent = ((hotspot.position[0] + 1) / 2) * 100;
                const yPercent = ((1 - hotspot.position[1]) / 2) * 100;
                const isActive = currentSceneId === hotspot.linkTo;

                return (
                  <div
                    key={index}
                    style={{
                      position: "absolute",
                      left: `${xPercent}%`,
                      top: `${yPercent}%`,
                      transform: "translate(-50%, -50%)",
                      backgroundColor: isActive
                        ? "#00FF00"
                        : "rgba(0, 123, 255, 0.7)",
                      color: "white",
                      borderRadius: "50%",
                      width: "16px",
                      height: "16px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                    onClick={() => {
                      setCurrentSceneId(hotspot.linkTo);
                      handleImageSelect(hotspot.linkTo);
                    }}
                    title={`Aller à la scène ${index + 1}`}
                  >
                    <span style={{ fontSize: "0.7em" }}>{index + 1}</span>

                    {isActive && (
                      <div
                        ref={fovRef}
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          width: `${24}px`,
                          height: `${24}px`,
                          transform: `translate(-50%, -50%) rotate(${yawDeg}deg) translateY(-20px)`, // move outwards
                          transformOrigin: "center center",
                          pointerEvents: "none",
                          zIndex: 5,
                        }}
                      >
                        <img
                          src={povImg}
                          alt="POV"
                          style={{
                            width: "150%",
                            height: "150%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showContact && (
          <div className="absolute inset-0 bg-black opacity-70 z-50 flex items-center justify-center p-4">
            <div className=" rounded-lg p-8 w-[50vw] relative">
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                <FaTimes size={24} />
              </button>

              <h1 className="text-6xl font-bold text-white mb-6 text-center">
                Contactez Nous
              </h1>
              <h2 className="text-1xl font-bold text-white mb-6 text-center ">
                Besoin d'aide ? Contactez notre service client, disponible par
                téléphone ou email pour répondre à toutes vos demandes
              </h2>

              <h2 className="text-2xl font-bold text-white mb-6 text-center ">
                {" "}
                {tour?.contactInfos?.[0] || "Non disponible"}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-gray-800 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm font-medium">Email</h3>
                    <p className="text-white text-lg">
                      {tour?.contactInfos?.[1] || "Non disponible"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-800 p-3 rounded-full mr-4">
                    <FaHome className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm font-medium">
                      Adresse
                    </h3>
                    <p className="text-white text-lg">
                      {tour?.contactInfos?.[2] || "Non disponible"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-gray-800 p-3 rounded-full mr-4">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm font-medium">
                      Téléphone
                    </h3>
                    <p className="text-white text-lg">
                      {tour?.contactInfos?.[3] || "Non disponible"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLocalisation && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4">
            {/* Background overlay with opacity */}
            <div className="absolute inset-0 bg-black opacity-80"></div>

            {/* Content container (no opacity here) */}
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={() => setShowLocalisation(false)}
                className="absolute top-4 right-4 z-50 text-white hover:text-gray-300"
              >
                <FaTimes size={24} />
              </button>

              <iframe
                title="Google Map"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                src={`https://www.google.com/maps?q=${tour?.localisation[1]},${tour?.localisation[0]}&z=15&output=embed`}
                width="700"
                height="450"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="bg-white"
              ></iframe>
            </div>
          </div>
        )}
        {/* Plan Overlay (version agrandie) */}
        {showPlanOverlay && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4">
            {/* Background overlay with opacity */}
            <div className="absolute inset-0 bg-black opacity-80"></div>

            {/* Content container (no opacity here) */}
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                onClick={() => setShowPlanOverlay(false)}
                className="absolute top-4 right-4 z-50 text-white hover:text-gray-300"
              >
                <FaTimes size={24} />
              </button>

              <img
                src={plan?.imagePlan}
                alt="Plan du site"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Gallery Overlay */}
        {showGallery && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-4">
            {/* Background overlay with opacity */}
            <div className="absolute inset-0 bg-black opacity-80"></div>

            {/* Main content container (no opacity here) */}
            <div className="relative w-full max-w-4xl h-4/5  rounded-lg overflow-hidden">
              <button
                onClick={() => setShowGallery(false)}
                className="absolute top-4 right-4 z-50 text-white hover:text-gray-300"
              >
                <FaTimes size={24} />
              </button>

              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={previews[currentGalleryIndex]?.blobUrl}
                  alt={`Vue ${currentGalleryIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4">
                <button
                  onClick={prevGalleryImage}
                  className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                >
                  <FaChevronLeft size={24} />
                </button>

                <span className="text-white">
                  {currentGalleryIndex + 1} / {previews.length}
                </span>

                <button
                  onClick={nextGalleryImage}
                  className="p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                >
                  <FaChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* Thumbnail container (no opacity here) */}
            <div className="relative mt-4 grid grid-cols-4 gap-2 max-w-4xl">
              {previews.map((preview, index) => (
                <div
                  key={preview.id}
                  className={`cursor-pointer ${
                    currentGalleryIndex === index ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setCurrentGalleryIndex(index)}
                >
                  <img
                    src={preview.blobUrl}
                    alt={`Miniature ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Scene = ({
  scene,
  lat,
  lon,
  setLat,
  setLon,
  onHotspotClick,
  previews,
  editingHotspot,
  autoRotate,
  rotationSpeed,
}) => {
  const controlsRef = useRef();

  const convertTo3D = (lat, lon) => {
    const radius = 5;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = rotationSpeed;
    }
  }, [autoRotate, rotationSpeed]);

  if (!scene || !scene.textureUrl) return null;

  const preview = previews.find((p) => p.id === scene.textureUrl);
  const textureUrl = preview ? preview.blobUrl : scene.textureUrl;

  return (
    <>
      <mesh>
        <sphereGeometry args={[50, 64, 32]} />
        <meshBasicMaterial
          map={new THREE.TextureLoader().load(textureUrl)}
          side={THREE.BackSide}
        />
      </mesh>

      {scene.links?.map((hotspot, index) => {
        const position = convertTo3D(hotspot.position[0], hotspot.position[1]);
        return (
          <group
            key={index}
            position={position}
            onClick={() => onHotspotClick(hotspot)}
          >
            <NavigationArrow
              position={position}
              onClick={() => onHotspotClick(hotspot)}
            />
          </group>
        );
      })}

      <OrbitControls
        ref={controlsRef}
        autoRotate={autoRotate}
        autoRotateSpeed={rotationSpeed}
        enableZoom={true}
        enablePan={true}
        enableDamping={true}
        dampingFactor={0.25}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
};

export default TourViewer;
