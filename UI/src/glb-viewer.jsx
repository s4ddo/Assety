import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import "./injection-styles.css"

function Model({ url }) {
  const ref = useRef();

  useEffect(() => {
    if (!url) return;
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      const obj = gltf.scene;
      ref.current.clear();
      ref.current.add(obj);
    });
  }, [url]);

  return <group ref={ref} />;
}

export default function MeshCanvas({ meshUrl }) {
  return (
    <div className="viewer">
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        {meshUrl && <Model url={meshUrl} />}
        <OrbitControls />
      </Canvas>
    </div>
  );
}

