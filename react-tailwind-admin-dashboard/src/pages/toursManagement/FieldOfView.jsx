import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

export default function FieldOfViewUpdater({ setYawDeg }) {
  const lastYawRef = useRef(null);

  useFrame(({ camera }) => {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir); // Get the camera's forward direction
    const yaw = Math.atan2(dir.x, dir.z); // Calculate yaw in radians
    const degrees = (yaw * 180) / Math.PI; // Convert radians to degrees

    // Only update if yaw has changed significantly
    if (
      lastYawRef.current === null ||
      Math.abs(degrees - lastYawRef.current) > 1
    ) {
      lastYawRef.current = degrees;
      setYawDeg(degrees); // Set yaw angle
    }
  });

  return null;
}
