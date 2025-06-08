import { useRef } from "react";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import arrowTexture from "./arrow.png";

const NavigationArrow = ({ position }) => {
  const texture = useLoader(THREE.TextureLoader, arrowTexture);
  const spriteRef = useRef();
  const { camera } = useThree();

  useFrame((state) => {
    if (!spriteRef.current) return;

    const target = new THREE.Vector3(...position);
    const cameraPos = camera.position.clone();

    // Vector from camera to hotspot
    const toTarget = target.clone().sub(cameraPos).normalize();

    // Place the arrow in front of camera (always visible)
    const cameraDir = camera.getWorldDirection(new THREE.Vector3());
    const arrowDistance = 4;
    const arrowPos = cameraPos
      .clone()
      .add(cameraDir.multiplyScalar(arrowDistance));
    spriteRef.current.position.copy(arrowPos);

    // Face camera
    spriteRef.current.quaternion.copy(camera.quaternion);

    // Calculate angle to rotate the sprite so it points to the hotspot
    const forward = camera.getWorldDirection(new THREE.Vector3()).normalize();
    const angle = Math.atan2(
      toTarget.x * forward.z - toTarget.z * forward.x,
      toTarget.x * forward.x + toTarget.z * forward.z
    );
    spriteRef.current.material.rotation = angle;

    // Blinking effect
    const scale = 1.5 + 0.3 * Math.sin(state.clock.elapsedTime * 4);
    spriteRef.current.scale.set(scale, scale, scale);
  });

  return (
    <sprite ref={spriteRef} frustumCulled={false}>
      <spriteMaterial attach="material" map={texture} transparent />
    </sprite>
  );
};

export default NavigationArrow;


// tnajem ta3mel ki l edge mta3 screen touch the hotspot arrow , we shuld fix it on his position 
