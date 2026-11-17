import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import "./SplashScreen.css";

/* ---------------- EARTH ---------------- */

function Earth() {
  const earthRef = useRef();
  const cloudsRef = useRef();

  const [earthTexture, cloudTexture] = useTexture([
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
    "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
  ]);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.08;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Earth surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.3, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef} scale={1.008}>
        <sphereGeometry args={[2.3, 64, 64]} />
        <meshStandardMaterial
          map={cloudTexture}
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Blue atmosphere */}
      <mesh scale={1.035}>
        <sphereGeometry args={[2.3, 64, 64]} />
        <meshBasicMaterial
          color="#4aa9ff"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/* ---------------- SIMPLE AIRPLANE ---------------- */

function Airplane() {
  const planeRef = useRef();

  useFrame(({ clock }) => {
    if (!planeRef.current) return;

    const t = clock.getElapsedTime();

    planeRef.current.position.x = Math.sin(t * 0.25) * 4.5;
    planeRef.current.position.y = 1.8 + Math.sin(t * 0.5) * 0.15;
    planeRef.current.position.z = 1.5;

    planeRef.current.rotation.z = Math.sin(t * 0.25) * 0.08;
  });

  return (
    <group ref={planeRef} scale={0.18}>
      {/* Fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 4, 16]} />
        <meshStandardMaterial color="#f5f7fa" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Wings */}
      <mesh position={[0, 0, 0]} scale={[1, 0.08, 1]}>
        <boxGeometry args={[1.2, 1, 7]} />
        <meshStandardMaterial color="#e8edf5" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Tail */}
      <mesh position={[-1.6, 0.2, 0]} scale={[0.5, 0.08, 1]}>
        <boxGeometry args={[1, 1, 2]} />
        <meshStandardMaterial color="#174c9a" />
      </mesh>
    </group>
  );
}

/* ---------------- MOVING TRAVEL ELEMENTS ---------------- */

function TravelMotion() {
  const busRef = useRef();
  const trainRef = useRef();
  const parachuteRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (busRef.current) {
      busRef.current.position.x = Math.sin(t * 0.35) * 4;
    }

    if (trainRef.current) {
      trainRef.current.position.x = Math.sin(t * 0.25 + Math.PI) * 4;
    }

    if (parachuteRef.current) {
      parachuteRef.current.position.y = 2.8 - ((t * 0.25) % 4);
      parachuteRef.current.position.x = 2.8 + Math.sin(t * 0.4) * 0.25;
    }
  });

  return (
    <>
      {/* Bus - simplified 3D placeholder */}
      <group ref={busRef} position={[0, -2.2, 2]} scale={0.35}>
        <mesh>
          <boxGeometry args={[2.5, 0.8, 1]} />
          <meshStandardMaterial color="#f4f5f7" />
        </mesh>

        <mesh position={[0, 0.1, 0.52]}>
          <boxGeometry args={[2.1, 0.35, 0.05]} />
          <meshStandardMaterial color="#123a62" />
        </mesh>

        <mesh position={[-0.7, -0.5, 0.4]}>
          <cylinderGeometry args={[0.2, 0.2, 0.15, 24]} />
          <meshStandardMaterial color="#151515" />
        </mesh>

        <mesh position={[0.7, -0.5, 0.4]}>
          <cylinderGeometry args={[0.2, 0.2, 0.15, 24]} />
          <meshStandardMaterial color="#151515" />
        </mesh>
      </group>

      {/* Train - simplified 3D placeholder */}
      <group ref={trainRef} position={[0, -2.7, -1]} scale={0.3}>
        <mesh>
          <boxGeometry args={[4, 0.65, 0.8]} />
          <meshStandardMaterial color="#e9eef4" metalness={0.25} roughness={0.35} />
        </mesh>

        <mesh position={[0, 0.1, 0.42]}>
          <boxGeometry args={[3.2, 0.2, 0.05]} />
          <meshStandardMaterial color="#1767b1" />
        </mesh>
      </group>

      {/* Parachutist - simplified placeholder */}
      <group ref={parachuteRef} scale={0.25}>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[1.1, 24, 16, 0, Math.PI]} />
          <meshStandardMaterial color="#e83b4a" side={THREE.DoubleSide} />
        </mesh>

        <mesh position={[0, -0.4, 0]}>
          <capsuleGeometry args={[0.12, 0.6, 4, 8]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
      </group>
    </>
  );
}

/* ---------------- SCENE ---------------- */

function TravelScene() {
  return (
    <>
      <color attach="background" args={["#020817"]} />

      <ambientLight intensity={1.4} />

      <directionalLight
        position={[5, 4, 5]}
        intensity={3}
        color="#ffffff"
      />

      <pointLight
        position={[-5, 0, -3]}
        intensity={2}
        color="#3c9fff"
      />

      <Stars
        radius={100}
        depth={50}
        count={2500}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <Earth />
      <Airplane />
      <TravelMotion />
    </>
  );
}

/* ---------------- SPLASH SCREEN ---------------- */

export default function SplashScreen({ onComplete }) {
  const splashRef = useRef(null);
  const callbackRef = useRef(onComplete);

  useEffect(() => {
    callbackRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const root = splashRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => callbackRef.current?.(),
      });

      timeline
        .fromTo(
          ".freefly-splash-brand",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2 }
        )
        .fromTo(
          ".freefly-splash-tagline",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1.2 },
          "-=0.5"
        )
        .to({}, { duration: 5 })
        .to(".freefly-splash", {
          opacity: 0,
          duration: 1.5,
          ease: "power2.inOut",
        });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="freefly-splash" ref={splashRef}>
      <div className="freefly-splash-canvas">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <TravelScene />
        </Canvas>
      </div>

      <div className="freefly-splash-content">
        <h1 className="freefly-splash-brand">
          Free<span>Fly</span>
        </h1>

        <p className="freefly-splash-tagline">
          Explore the World
          <br />
          <span>with FreeFly</span>
        </p>

        <div className="freefly-splash-caption">
          YOUR JOURNEY BEGINS HERE
        </div>
      </div>
    </div>
  );
}