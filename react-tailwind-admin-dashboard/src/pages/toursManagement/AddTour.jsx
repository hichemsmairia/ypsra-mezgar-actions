import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useSelect } from "@react-three/drei";
import { createTour, updateTour } from "../../services/TourServices";
import { uploadScene, saveScenes } from "../../services/SceneServices";
import { uploadPlan } from "../../services/PlanServices";
import MapWithSearchLeaflet from "./Maps";
import Contact from "./Contact";
import Modal from "./Modal";
import { useSelector } from "react-redux";
import { register } from "../../services/AuthServices";
import AdminLayout from "../../layout/AdminLayout";
import OwnerLayout from "../../layout/OwnerLayout";
import { fetchUsers } from "../../services/UserServices";

const AddTour = () => {
  const [scenes, setScenes] = useState([]);
  const [currentSceneId, setCurrentSceneId] = useState(null);
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [hotspotText, setHotspotText] = useState("");
  const [selectedScene, setSelectedScene] = useState("");
  const [isAddingHotspot, setIsAddingHotspot] = useState(false);
  const [message, setMessage] = useState("");
  const [previews, setPreviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tourName, setTourName] = useState("");
  const [tourId, setTourId] = useState(null);
  const [savedPlanId, setSavedPlanId] = useState(null);
  const [planImage, setPlanImage] = useState(null);
  const [planImageUrl, setPlanImageUrl] = useState(null);
  const [isAddingPlanHotspot, setIsAddingPlanHotspot] = useState(false);
  const [latPlan, setLatPlan] = useState(0);
  const [lonPlan, setLonPlan] = useState(0);
  const [selectedPlanScene, setSelectedPlanScene] = useState("");
  const [planHotspots, setPlanHotspots] = useState([]);
  const [activePlanHotspotIndex, setActivePlanHotspotIndex] = useState(null);
  const [localisation, setLocalisation] = useState({ lon: null, lat: null });
  const [contactInfos, setContactInfos] = useState(null);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [tempLocalisation, setTempLocalisation] = useState({});
  const [tempContactInfos, setTempContactInfos] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la récupération des utilisateurs :",
          error
        );
        setMessage("Échec de la récupération des utilisateurs.");
      });
  }, []);

  const handleLocalisationChange = (lat, lon) => {
    setTempLocalisation({ lon: lon, lat: lat });
  };

  const handleContactInfosChange = (data) => {
    setTempContactInfos(data);
  };

  const handleSaveMap = () => {
    setLocalisation(tempLocalisation);
    setIsMapModalOpen(false);
    setMessage("Localisation sauvegardée avec succès !");
  };

  const handleSaveContact = () => {
    setContactInfos(tempContactInfos);
    setIsContactModalOpen(false);
    setMessage("Informations de contact sauvegardées avec succès !");
  };

  const { user } = useSelector((state) => state.auth);

  const handleCreateTour = async () => {
    if (!tourName) {
      setMessage("Veuillez entrer un nom pour le tour.");
      return;
    }

    try {
      const tourData = await createTour({
        ownerId: selectedUser ? selectedUser : user.id,
        tourName: tourName,
        plans: [],
      });
      setTourId(tourData.id);
      setMessage("Tour créé avec succès !");
    } catch (error) {
      setMessage("Échec de la création du tour : " + error.message);
    }
  };

  const handleImageUpload = async (event) => {
    if (!tourId) {
      setMessage("Veuillez d'abord créer un tour.");
      return;
    }

    const files = event.target.files;
    if (!files) return;

    const uploadedImages = [];
    const dataForPreviews = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const data = await uploadScene(files[i], `Scene ${i + 1}`);
        const blobUrl = URL.createObjectURL(files[i]);

        uploadedImages.unshift({
          id: data.id,
          imagePath: data.textureUrl,
          hotspots: [],
        });

        dataForPreviews.unshift({
          id: data.textureUrl,
          blobUrl: blobUrl,
          file: files[i],
        });
      } catch (error) {
        console.error("Erreur lors du téléversement de l'image :", error);
        setMessage(
          "Erreur lors du téléversement d'une image : " + error.message
        );
      }
    }

    setPreviews([...dataForPreviews, ...previews]);
    setScenes([...uploadedImages, ...scenes]);
    setMessage("Scènes initialisées avec succès !");
  };

  const handleImageSelect = (imageId) => {
    setSelectedImage(imageId);
    setCurrentSceneId(imageId);
    const index = planHotspots.findIndex((hp) => hp.linkTo === imageId);
    setActivePlanHotspotIndex(index !== -1 ? index : null);
  };

  const addHotspot = () => {
    if (!selectedScene || !hotspotText) {
      setMessage(
        "Veuillez sélectionner une scène et entrer un texte pour le hotspot."
      );
      return;
    }

    const updatedScenes = scenes.map((scene) => {
      if (scene.imagePath === currentSceneId) {
        return {
          ...scene,
          hotspots: [
            ...scene.hotspots,
            { lat, lon, text: hotspotText, scene: selectedScene },
          ],
        };
      }
      return scene;
    });

    setScenes(updatedScenes);
    setMessage("Hotspot ajouté avec succès !");
    setHotspotText("");
    setSelectedScene("");
    setIsAddingHotspot(false);
  };

  const handlePlanUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setPlanImage(file);
      setPlanImageUrl(URL.createObjectURL(file));
    }
  };

  const addPlanHotspot = () => {
    if (!selectedPlanScene) {
      setMessage("Veuillez sélectionner une scène pour le hotspot du plan.");
      return;
    }

    const newPlanHotspot = {
      x: lonPlan,
      y: latPlan,
      linkTo: selectedPlanScene,
    };

    setPlanHotspots([...planHotspots, newPlanHotspot]);
    setMessage("Hotspot ajouté au plan !");
    setSelectedPlanScene("");
    setIsAddingPlanHotspot(false);
    setLatPlan(0);
    setLonPlan(0);
  };

  const saveAll = async () => {
    if (!tourId) {
      setMessage("Veuillez d'abord créer un tour.");
      return;
    }

    try {
      let planId = savedPlanId;
      if (planImage) {
        const planData = await uploadPlan(
          planImage,
          planHotspots.map((el) => ({
            name: "",
            linkTo: el.linkTo,
            position: [el.x, el.y, 0],
          }))
        );
        planId = planData.id;
        setSavedPlanId(planId);
      }

      const scenesToSave = scenes.map((scene) => ({
        name: scene.id,
        textureUrl: scene.imagePath,
        links: scene.hotspots.map((hotspot) => ({
          name: hotspot.text,
          linkTo: hotspot.scene,
          position: [hotspot.lat, hotspot.lon, 0],
        })),
      }));

      const savedScenes = await saveScenes(scenesToSave);
      const savedSceneIds = savedScenes.map((scene) => scene.id);
      await updateTour(
        tourId,
        tourName,
        savedSceneIds,
        planId,
        [localisation.lon, localisation.lat],
        [
          contactInfos?.ste_name || "",
          contactInfos?.email || "",
          contactInfos?.address || "",
          contactInfos?.tel || "",
        ]
      );

      setMessage("Tour, scènes et plan sauvegardés avec succès !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setMessage("Échec de la sauvegarde : " + error.message);
    }
  };

  const Scene = ({
    scene,
    lat,
    lon,
    setLat,
    setLon,
    onHotspotClick,
    previews,
  }) => {
    const convertTo3D = (lat, lon) => {
      const radius = 5;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      return new THREE.Vector3(x, y, z);
    };

    if (!scene || !scene.imagePath) return null;

    const preview = previews.find((p) => p.id === scene.imagePath);
    const textureUrl = preview ? preview.blobUrl : scene.imagePath;

    return (
      <>
        <mesh>
          <sphereGeometry args={[50, 60, 40]} />
          <meshBasicMaterial
            map={new THREE.TextureLoader().load(textureUrl)}
            side={THREE.BackSide}
          />
        </mesh>

        <mesh position={convertTo3D(lat, lon)}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>

        {scene.hotspots.map((hotspot, index) => {
          const position = convertTo3D(hotspot.lat, hotspot.lon);
          return (
            <group
              key={index}
              position={position}
              onClick={() => onHotspotClick(hotspot)}
            >
              <mesh>
                <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
                <meshBasicMaterial color="white" />
              </mesh>

              <mesh position={[0, 0.3, 0]}>
                <coneGeometry args={[0.15, 0.3, 16]} />
                <meshBasicMaterial color="white" />
              </mesh>
              <Html position={[0, 0.3, 0]}>
                <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-md text-sm dark:text-white/90 dark:border dark:border-white/10">
                  {hotspot.text}
                </div>
              </Html>
            </group>
          );
        })}

        <OrbitControls />
      </>
    );
  };

  let Layout =
    user.roles[0] === "ADMIN"
      ? AdminLayout
      : user.roles[0] === "owner"
      ? OwnerLayout
      : null;

  return (
    <Layout>
      {" "}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm p-6">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-white/[0.05] pb-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Créer un Tour Virtuel
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {message && (
              <div
                className={`p-3 rounded-lg ${
                  message.includes("succès")
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                }`}
              >
                {message}
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du Tour
              </label>
              <input
                type="text"
                placeholder="Nom du Tour"
                value={tourName}
                onChange={(e) => setTourName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:text-white/90"
              />
            </div>
            {user && user.roles[0] == "ADMIN" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Utilisateur
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:text-white/90"
                >
                  <option value="">Sélectionner un utilisateur</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </div>
            )}{" "}
            <button
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-2 dark:bg-blue-600 dark:hover:bg-blue-700"
              onClick={handleCreateTour}
            >
              Créer Tour
            </button>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Scènes
              </h3>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                disabled={!tourId}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-gray-700 dark:file:text-gray-200
                dark:hover:file:bg-gray-600"
              />
              <div className="grid grid-cols-3 gap-2 mt-3">
                {previews.map((image) => (
                  <div key={image.id}>
                    <img
                      src={image.blobUrl}
                      alt={`preview-${image.id}`}
                      onClick={() => handleImageSelect(image.id)}
                      className={`w-full h-20 object-cover rounded border cursor-pointer transition-colors ${
                        selectedImage === image.id
                          ? "border-blue-500 ring-2 ring-blue-300 dark:ring-blue-500/50"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    <h4 className="text-center text-white bg-black p-1 dark:bg-white/10 dark:backdrop-blur-sm">
                      {previews.indexOf(image) + 1}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              {!isAddingHotspot ? (
                <button
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  onClick={() => setIsAddingHotspot(true)}
                >
                  Ajouter Hotspot à la Scène
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Scène de destination
                    </label>
                    <select
                      value={selectedScene}
                      onChange={(e) => setSelectedScene(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:text-white/90"
                    >
                      <option value="">-- Choisir une Scène --</option>
                      {previews
                        .filter((item) => item.id !== currentSceneId)
                        .map((scene) => (
                          <option key={scene.id} value={scene.id}>
                            Scène {previews.indexOf(scene) + 1}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Texte du Hotspot
                    </label>
                    <input
                      type="text"
                      value={hotspotText}
                      onChange={(e) => setHotspotText(e.target.value)}
                      placeholder="Entrez le texte"
                      className="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:text-white/90"
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setLat(lat + 5)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={() => setLat(lat - 5)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() => setLon(lon - 5)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      ⬅️
                    </button>
                    <button
                      onClick={() => setLon(lon + 5)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                      ➡️
                    </button>
                  </div>

                  <button
                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                    onClick={addHotspot}
                  >
                    Sauvegarder Hotspot Scène
                  </button>
                </div>
              )}
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Plan
              </label>
              <input
                type="file"
                onChange={handlePlanUpload}
                disabled={!tourId}
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-gray-700 dark:file:text-gray-200
                dark:hover:file:bg-gray-600"
              />
              {planImageUrl && (
                <div
                  className="mt-3 relative"
                  style={{
                    maxWidth: "300px",
                    maxHeight: "300px",
                    overflow: "auto",
                  }}
                >
                  <h6 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Image du plan:
                  </h6>
                  <img
                    src={planImageUrl}
                    alt="Aperçu du plan"
                    className="w-full h-auto rounded border border-gray-300 dark:border-gray-600"
                    onClick={(e) => {
                      if (isAddingPlanHotspot) {
                        const rect = e.target.getBoundingClientRect();
                        const xPercent =
                          ((e.clientX - rect.left) / rect.width) * 100;
                        const yPercent =
                          ((e.clientY - rect.top) / rect.height) * 100;

                        const normalizedLonPlan = (xPercent / 100) * 2 - 1;
                        const normalizedLatPlan = -((yPercent / 100) * 2 - 1);

                        setLonPlan(normalizedLonPlan);
                        setLatPlan(normalizedLatPlan);
                      }
                    }}
                    style={{
                      cursor: isAddingPlanHotspot ? "crosshair" : "default",
                    }}
                  />
                  {isAddingPlanHotspot && (
                    <div
                      style={{
                        position: "absolute",
                        left: `calc(${((lonPlan + 1) / 2) * 100}% )`,
                        top: `calc(${((1 - latPlan) / 2) * 100}% )`,
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "red",
                        borderRadius: "50%",
                        width: "10px",
                        height: "10px",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  {planHotspots.map((hotspot, index) => {
                    const xPercent = ((hotspot.x + 1) / 2) * 100;
                    const yPercent = ((1 - hotspot.y) / 2) * 100;

                    const linkedSceneIndex = previews.findIndex(
                      (p) => p.id === hotspot.linkTo
                    );
                    const hotspotLabel =
                      linkedSceneIndex !== -1
                        ? `Scène ${linkedSceneIndex + 1}`
                        : "Scène inconnue";

                    const isActive = activePlanHotspotIndex === index;
                    const hotspotColor = isActive
                      ? "lime"
                      : "rgba(0, 123, 255, 0.7)";

                    return (
                      <div
                        key={index}
                        style={{
                          position: "absolute",
                          left: `${xPercent}%`,
                          top: `${yPercent}%`,
                          transform: "translate(-50%, -50%)",
                          backgroundColor: hotspotColor,
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setCurrentSceneId(hotspot.linkTo);
                          handleImageSelect(hotspot.linkTo);
                        }}
                        title={`Aller à ${hotspotLabel}`}
                      >
                        <span style={{ fontSize: "0.8em" }}>{index + 1}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {planImageUrl && (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                {!isAddingPlanHotspot ? (
                  <button
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                    onClick={() => setIsAddingPlanHotspot(true)}
                  >
                    Ajouter Hotspot au Plan
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Lier à la Scène
                      </label>
                      <select
                        value={selectedPlanScene}
                        onChange={(e) => setSelectedPlanScene(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700/50 dark:text-white/90"
                      >
                        <option value="">-- Choisir une Scène --</option>
                        {previews.map((scene) => (
                          <option key={scene.id} value={scene.id}>
                            Scène {previews.indexOf(scene) + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setLatPlan(latPlan + 0.1)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        ⬆️ Plan
                      </button>
                      <button
                        onClick={() => setLatPlan(latPlan - 0.1)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        ⬇️ Plan
                      </button>
                      <button
                        onClick={() => setLonPlan(lonPlan - 0.1)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        ⬅️ Plan
                      </button>
                      <button
                        onClick={() => setLonPlan(lonPlan + 0.1)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        ➡️ Plan
                      </button>
                    </div>

                    <button
                      className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                      onClick={addPlanHotspot}
                    >
                      Sauvegarder Hotspot Plan
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="flex space-x-2">
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={() => setIsMapModalOpen(true)}
              >
                Maps
              </button>
              <button
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                onClick={() => setIsContactModalOpen(true)}
              >
                Contact
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <button
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                onClick={saveAll}
                disabled={!planImage}
              >
                Sauvegarder Tour, Scènes et Plan
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <Canvas>
              <Scene
                scene={{
                  id: currentSceneId,
                  imagePath: selectedImage,
                  hotspots:
                    scenes.find((scene) => scene.imagePath === currentSceneId)
                      ?.hotspots || [],
                }}
                lat={lat}
                lon={lon}
                setLat={setLat}
                setLon={setLon}
                onHotspotClick={(hotspot) => {
                  setCurrentSceneId(hotspot.scene);
                  handleImageSelect(hotspot.scene);
                }}
                previews={previews}
              />
            </Canvas>
          </div>
        </div>

        <Modal
          isOpen={isMapModalOpen}
          onClose={() => setIsMapModalOpen(false)}
          onSave={handleSaveMap}
          title="Localisation du Tour"
        >
          <MapWithSearchLeaflet
            onLocalisationChange={handleLocalisationChange}
          />
        </Modal>

        <Modal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          onSave={handleSaveContact}
          title="Informations de Contact"
        >
          <div className="space-y-4">
            <Contact
              onContactInfosChange={handleContactInfosChange}
              initialData={contactInfos || tempContactInfos}
            />
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default AddTour;
