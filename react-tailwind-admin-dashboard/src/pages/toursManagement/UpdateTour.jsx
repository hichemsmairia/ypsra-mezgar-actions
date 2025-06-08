import React, { useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useParams, useNavigate } from "react-router";
import {
  fetchTourById,
  updateTourWithScenes,
} from "../../services/TourServices";
import { updateScenes, deleteScene } from "../../services/SceneServices";
import { uploadScene } from "../../services/SceneServices";
import { deletePlanById, uploadPlan } from "../../services/PlanServices";
import axios from "axios";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaEdit,
  FaTrashAlt,
  FaTimesCircle,
} from "react-icons/fa";
import MapWithSearchLeaflet from "./Maps";
import Contact from "./Contact";
import Modal from "./Modal";
import AdminLayout from "../../layout/AdminLayout";
import OwnerLayout from "../../layout/OwnerLayout";
import { useSelector } from "react-redux";

const UpdateTour = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
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

  const handleHotspotNavigation = (linkTo) => {
    setCurrentSceneId(linkTo);
    setSelectedImage(linkTo);
  };

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const data = await fetchTourById(tourId);
        setTour(data);
        setTourName(data.tourName);
        setScenes(data.scenes || []);
        setPlan(data.plan || null);

        if (data.plan) {
          setPlanImageUrl(data.plan.imagePlan);
          // Convertir les positions des hotspots du plan dans le bon format
          const formattedHotspots = data.plan.links.map((hotspot) => ({
            x: hotspot.position[0],
            y: hotspot.position[1],
            linkTo: hotspot.linkTo,
          }));
          setPlanHotspots(formattedHotspots || []);
        }

        if (data.localisation && data.localisation.length === 2) {
          setLocalisation({
            lon: data.localisation[0],
            lat: data.localisation[1],
          });
        }

        if (data.contactInfos && data.contactInfos.length === 3) {
          setContactInfos({
            ste_name: data.contactInfos[0],
            email: data.contactInfos[1],
            address: data.contactInfos[2],
            tel: data.contactInfos[3],
          });
        }

        setPreviews(
          (data.scenes || []).map((scene) => ({
            id: scene.textureUrl,
            blobUrl: scene.textureUrl,
            _id: scene._id || scene.id,
          }))
        );
      } catch (error) {
        console.error("Error fetching tour:", error);
        setMessage("Failed to fetch tour data.");
      }
    };

    fetchTour();
  }, [tourId]);

  const removePlan = async () => {
    try {
      if (!plan) return;

      await deletePlanById(plan.id);

      const updatedTour = { ...tour, plan: null, planId: null };
      setTour(updatedTour);
      setPlan(null);
      setPlanImage(null);
      setPlanImageUrl(null);
      setPlanHotspots([]);

      setMessage("Plan supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting plan:", error);
      setMessage(`Échec de la suppression du plan: ${error.message}`);
    }
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files) return;

    const uploadedImages = [];
    const dataForPreviews = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const data = await uploadScene(
          files[i],
          `Scene ${previews.length + i + 1}`,
          tourId
        );
        const blobUrl = URL.createObjectURL(files[i]);

        uploadedImages.unshift({
          id: data.id,
          textureUrl: data.textureUrl,
          links: [],
        });

        dataForPreviews.unshift({
          id: data.textureUrl,
          _id: data.id,
          blobUrl: blobUrl,
          file: files[i],
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessage(`Échec du téléchargement de l'image: ${error.message}`);
      }
    }

    setPreviews([...dataForPreviews, ...previews]);
    setScenes([...uploadedImages, ...scenes]);
    setMessage("Scènes ajoutées avec succès !");
  };

  const handleImageSelect = (imageId) => {
    setSelectedImage(imageId);
    setCurrentSceneId(imageId);
    setEditingHotspot(null);
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
      if (scene.textureUrl === currentSceneId) {
        const newHotspots = [
          ...scene.links,
          { name: hotspotText, linkTo: selectedScene, position: [lat, lon, 0] },
        ];
        return {
          ...scene,
          links: newHotspots,
        };
      }
      return scene;
    });

    setScenes(updatedScenes);
    setMessage("Hotspot ajouté avec succès !");
    setHotspotText("");
    setSelectedScene("");
  };

  const handleHotspotClick = (hotspot) => {
    setEditingHotspot(hotspot);
    setHotspotText(hotspot.name);
    setSelectedScene(hotspot.linkTo);
    setLat(hotspot.position[0]);
    setLon(hotspot.position[1]);
  };

  const updateHotspot = () => {
    if (!editingHotspot || !hotspotText || !selectedScene) {
      setMessage(
        "Veuillez remplir tous les champs pour mettre à jour le hotspot."
      );
      return;
    }

    const updatedScenes = scenes.map((scene) => {
      if (scene.textureUrl === currentSceneId) {
        const updatedLinks = scene.links.map((link) =>
          link === editingHotspot
            ? {
                ...link,
                name: hotspotText,
                linkTo: selectedScene,
                position: [lat, lon, 0],
              }
            : link
        );
        return {
          ...scene,
          links: updatedLinks,
        };
      }
      return scene;
    });

    setScenes(updatedScenes);
    setMessage("Hotspot mis à jour avec succès !");
    setEditingHotspot(null);
    setHotspotText("");
    setSelectedScene("");
  };

  const deleteHotspot = (hotspot) => {
    const updatedScenes = scenes.map((scene) => {
      if (scene.textureUrl === currentSceneId) {
        const updatedLinks = scene.links.filter((link) => link !== hotspot);
        return {
          ...scene,
          links: updatedLinks,
        };
      }
      return scene;
    });

    setScenes(updatedScenes);
    setMessage("Hotspot supprimé avec succès !");
    setEditingHotspot(null);
  };

  const removeScene = async (sceneId) => {
    try {
      const sceneToDelete = scenes.find((scene) => scene.id === sceneId);
      if (!sceneToDelete) return;

      const updatedScenes = scenes.filter((scene) => scene.id !== sceneId);
      const scenesWithUpdatedLinks = updatedScenes.map((scene) => ({
        ...scene,
        links: scene.links.filter(
          (link) => link.linkTo !== sceneToDelete.textureUrl
        ),
      }));

      const updatedPlanHotspots = planHotspots.filter(
        (link) => link.linkTo !== sceneToDelete.textureUrl
      );

      setScenes(scenesWithUpdatedLinks);
      setPlanHotspots(updatedPlanHotspots);
      setPreviews(previews.filter((preview) => preview._id !== sceneId));
      setMessage("Scène supprimée avec succès !");

      await deleteScene(sceneId);
    } catch (error) {
      console.error("Error removing scene:", error);
      setMessage(`Échec de la suppression de la scène: ${error.message}`);
    }
  };

  const handlePlanUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.match("image.*")) {
        setMessage("Veuillez sélectionner un fichier image valide.");
        return;
      }

      setPlanImage(file);
      setPlanImageUrl(URL.createObjectURL(file));
      setMessage("Plan téléchargé avec succès !");
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
      let planId = plan?.id;

      // Gestion du plan
      if (
        planImage ||
        (planHotspots.length > 0 &&
          (!plan ||
            JSON.stringify(planHotspots) !== JSON.stringify(plan.links)))
      ) {
        const planData = await uploadPlan(
          planImage || plan?.imagePlan,
          planHotspots.map((el) => ({
            name: "",
            linkTo: el.linkTo,
            position: [el.x, el.y, 0],
          }))
        );
        planId = planData.id;
      }

      // Préparation des scènes à sauvegarder avec vérification
      const scenesToSave = Array.isArray(scenes)
        ? scenes.map((scene) => ({
            id: scene._id || scene.id,
            name: scene.name || `Scene ${scenes.indexOf(scene) + 1}`,
            textureUrl: scene.textureUrl,
            links: Array.isArray(scene.links)
              ? scene.links.map((hotspot) => ({
                  name: hotspot.name,
                  linkTo: hotspot.linkTo,
                  position: hotspot.position,
                }))
              : [],
          }))
        : [];

      // Sauvegarde des scènes
      await updateScenes(scenesToSave);

      // Préparation des IDs de scènes avec vérification
      const sceneIds = scenesToSave.map((scene) => scene.id).filter((id) => id);

      // Mise à jour du tour
      const updatedTour = await updateTourWithScenes(
        tourId,
        tourName,
        sceneIds,
        planId,
        localisation.lon && localisation.lat
          ? [localisation.lon, localisation.lat]
          : [],
        contactInfos
          ? [
              contactInfos.ste_name || "",
              contactInfos.email || "",
              contactInfos.address || "",
              contactInfos.tel || "",
            ]
          : []
      );

      setTour(updatedTour);
      setMessage("Tour mis à jour avec succès !");
    } catch (error) {
      console.error("Error updating tour:", error);
      setMessage(`Échec de la mise à jour du tour: ${error.message}`);
    }
  };

  const Scene = ({
    scene,
    lat,
    lon,
    setLat,
    setLon,
    onHotspotClick,
    onHotspotNavigation,
    previews,
    editingHotspot,
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

    if (!scene || !scene.textureUrl) return null;

    const preview = previews.find((p) => p.id === scene.textureUrl);
    const textureUrl = preview ? preview.blobUrl : scene.textureUrl;

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

        {scene.links?.map((hotspot, index) => {
          const position = convertTo3D(
            hotspot.position[0],
            hotspot.position[1]
          );
          return (
            <group
              key={index}
              position={position}
              onClick={(e) => {
                e.stopPropagation();
                onHotspotNavigation(hotspot.linkTo);
              }}
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
                  {hotspot.name}
                </div>
              </Html>
            </group>
          );
        })}

        <OrbitControls />
      </>
    );
  };
  const { user } = useSelector((state) => state.auth);
  let Layout =
    user.roles[0] === "ADMIN"
      ? AdminLayout
      : user.roles[0] === "owner"
      ? OwnerLayout
      : null;

  return (
    <Layout>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm p-6">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-white/[0.05] pb-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Modifier le Tour Virtuel
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {message && (
              <div
                className={`p-3 rounded-lg ${
                  message.includes("succès") || message.includes("success")
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

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Scènes
              </h3>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
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
                {previews.map((image, index) => (
                  <div key={image.id} className="relative">
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
                    <button
                      onClick={() => removeScene(scenes[index].id)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transform translate-x-1/2 -translate-y-1/2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {editingHotspot ? "Modifier Hotspot" : "Ajouter Hotspot"}
              </h3>
              <div className="space-y-3">
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
                  onClick={editingHotspot ? updateHotspot : addHotspot}
                >
                  {editingHotspot ? "Mettre à jour Hotspot" : "Ajouter Hotspot"}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Hotspots
              </h3>
              <div className="space-y-2">
                {scenes
                  .find((scene) => scene.textureUrl === currentSceneId)
                  ?.links?.map((hotspot, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {hotspot.name}
                      </span>
                      <div className="flex gap-1">
                        <button
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                          onClick={() => handleHotspotClick(hotspot)}
                          title="Modifier"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                          onClick={() => deleteHotspot(hotspot)}
                          title="Supprimer"
                        >
                          <FaTrashAlt size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Plan
                </label>
                {planImageUrl && (
                  <button
                    onClick={removePlan}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                    title="Supprimer le plan"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
              <input
                type="file"
                onChange={handlePlanUpload}
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
              >
                Sauvegarder Tour
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <Canvas>
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
                onHotspotNavigation={handleHotspotNavigation}
                previews={previews}
                editingHotspot={editingHotspot}
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
          <div className="space-y-4">
            <MapWithSearchLeaflet
              onLocalisationChange={handleLocalisationChange}
              initialPosition={
                localisation.lat && localisation.lon
                  ? [localisation.lat, localisation.lon]
                  : null
              }
            />
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="font-medium text-blue-800 dark:text-blue-200">
                Position sélectionnée:
              </p>
              <p className="text-sm">
                Latitude:{" "}
                {tempLocalisation.lat || localisation.lat || "Non définie"}
                <br />
                Longitude:{" "}
                {tempLocalisation.lon || localisation.lon || "Non définie"}
              </p>
            </div>
          </div>
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

export default UpdateTour;
