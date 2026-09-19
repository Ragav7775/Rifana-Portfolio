"use client";

import React, { useRef, useMemo, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// ============================================================================
// THREE.Clock deprecation notice filter
// ============================================================================
if (typeof window !== "undefined") {
  const originalConsoleWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Clock: This module has been deprecated")
    ) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}

// ============================================================================
// Types
// ============================================================================

export interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;
  label?: string;
  size?: number;
}

export interface Globe3DConfig {
  /** Globe radius */
  radius?: number;
  /** Globe base color (used as fallback or tint) */
  globeColor?: string;
  /** URL to the Earth texture map */
  textureUrl?: string;
  /** URL to the bump/elevation map for terrain */
  bumpMapUrl?: string;
  /** Whether to show atmosphere glow */
  showAtmosphere?: boolean;
  /** Atmosphere color */
  atmosphereColor?: string;
  /** Atmosphere intensity */
  atmosphereIntensity?: number;
  /** Atmosphere blur/softness (higher = more diffuse, default 3) */
  atmosphereBlur?: number;
  /** Terrain bump scale (0 = flat, higher = more pronounced) */
  bumpScale?: number;
  /** Auto rotate speed (0 = disabled) */
  autoRotateSpeed?: number;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Enable pan */
  enablePan?: boolean;
  /** Min zoom distance */
  minDistance?: number;
  /** Max zoom distance */
  maxDistance?: number;
  /** Initial rotation */
  initialRotation?: { x: number; y: number };
  /** Marker default size */
  markerSize?: number;
  /** Show wireframe overlay */
  showWireframe?: boolean;
  /** Wireframe color */
  wireframeColor?: string;
  /** Ambient light intensity */
  ambientIntensity?: number;
  /** Point light intensity */
  pointLightIntensity?: number;
  /** Background color (null for transparent) */
  backgroundColor?: string | null;
  /** Whether to size canvas compactly around the globe (default: true) */
  compact?: boolean;
  /** Fraction of compact canvas occupied by the globe diameter (default: 0.78) */
  globeFitRatio?: number;
}

interface Globe3DProps {
  /** Array of markers to display on the globe */
  markers?: GlobeMarker[];
  /** Globe configuration */
  config?: Globe3DConfig;
  /** Additional CSS classes */
  className?: string;
  /** Callback when a marker is clicked */
  onMarkerClick?: (marker: GlobeMarker) => void;
  /** Callback when a marker is hovered */
  onMarkerHover?: (marker: GlobeMarker | null) => void;
  /** Callback when the complete globe scene is ready */
  onReady?: () => void;
}

// ============================================================================
// Constants - Earth Texture URLs (NASA Blue Marble)
// ============================================================================

const DEFAULT_EARTH_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Compute the exact perspective camera distance so that a sphere of given radius
 * subtends an exact target fraction of the canvas dimension with vertical FOV = 45 deg.
 *
 * In perspective projection:
 * sin(alpha) = radius / distance
 * tan(alpha) = radius / sqrt(distance^2 - radius^2)
 * fraction = tan(alpha) / tan(fov / 2)
 *
 * Solving for distance:
 * distance = radius * sqrt(1 + 1 / (fraction * tan(fov / 2))^2)
 */
function computeCameraDistance(radius: number, fitRatio: number = 0.78): number {
  const tanHalfFov = Math.tan((45 * Math.PI) / 360); // tan(22.5deg) = 0.41421356...
  const fTan = fitRatio * tanHalfFov;
  return radius * Math.sqrt(1 + 1 / (fTan * fTan));
}

/**
 * Convert latitude/longitude to 3D cartesian coordinates
 */
function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// ============================================================================
// Marker Component (static - rotation handled by parent group)
// ============================================================================

interface MarkerProps {
  marker: GlobeMarker;
  radius: number;
  defaultSize: number;
  onClick?: (marker: GlobeMarker) => void;
  onHover?: (marker: GlobeMarker | null) => void;
}

function Marker({
  marker,
  radius,
  defaultSize,
  onClick,
  onHover,
}: MarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const markerRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Surface position (where the pinpoint anchors on the globe surface)
  const surfacePosition = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.002);
  }, [marker.lat, marker.lng, radius]);

  // Check if marker is facing the camera
  useFrame(() => {
    if (!markerRef.current) return;
    const worldPos = new THREE.Vector3();
    markerRef.current.getWorldPosition(worldPos);
    const markerDirection = worldPos.clone().normalize();
    const cameraDirection = camera.position.clone().normalize();
    const dot = markerDirection.dot(cameraDirection);
    setIsVisible(dot > 0.08);
  });

  const handlePointerEnter = useCallback(() => {
    setHovered(true);
    onHover?.(marker);
  }, [marker, onHover]);

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    onHover?.(null);
  }, [onHover]);

  const handleClick = useCallback(() => {
    onClick?.(marker);
  }, [marker, onClick]);

  const avatarDimension = marker.size
    ? `${marker.size}px`
    : `${Math.round(defaultSize * 500)}px` || "32px";

  return (
    <group ref={markerRef} position={surfacePosition} visible={isVisible}>
      {/* Crystal-clear attached HTML Map Pin anchored at surfacePosition (Single authoritative dot) */}
      <Html
        position={[0, 0, 0]}
        style={{
          pointerEvents: isVisible ? "auto" : "none",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease-out",
        }}
      >
        <div
          className="relative flex flex-col items-center select-none"
          style={{
            transform: "translate(-50%, -100%)",
            transformOrigin: "bottom center",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            textRendering: "optimizeLegibility",
          }}
        >
          {/* Tooltip Address (revealed on hover with crisp resolution and no blur) */}
          {marker.label && (
            <div
              className={cn(
                "pointer-events-none mb-1.5 whitespace-nowrap rounded-md bg-[#0a1410] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[#fff6d3] shadow-[0_4px_14px_rgba(0,0,0,0.5)] ring-1 ring-[#d4af37]/60",
                "transition-all duration-200 ease-out",
                hovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-1"
              )}
              style={{
                filter: "none",
                backfaceVisibility: "hidden",
              }}
            >
              {marker.label}
            </div>
          )}

          {/* Avatar Circle with Crisp White/Gold Border & Subtle Hover Scale-Up */}
          <div
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-full bg-[#111111]",
              "ring-2 ring-white shadow-[0_2px_8px_rgba(0,0,0,0.45)]",
              hovered
                ? "ring-2 ring-[#d4af37] shadow-[0_4px_16px_rgba(212,175,55,0.7)] z-10"
                : "z-0"
            )}
            style={{
              width: avatarDimension,
              height: avatarDimension,
              filter: "none",
              backfaceVisibility: "hidden",
              transform: hovered ? "scale(1.45)" : "scale(1.10)",
              transformOrigin: "center center",
              transition:
                "transform 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms ease-in-out, ring-color 250ms ease-in-out",
              willChange: "transform",
            }}
            onMouseEnter={handlePointerEnter}
            onMouseLeave={handlePointerLeave}
            onTouchStart={handlePointerEnter}
            onTouchEnd={handlePointerLeave}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label={marker.label || "Globe location marker"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClick();
              }
            }}
          >
            <img
              src={marker.src}
              alt={marker.label || "Marker"}
              className="h-full w-full object-cover object-top"
              style={{
                display: "block",
                imageRendering: "-webkit-optimize-contrast",
              }}
              draggable={false}
            />
          </div>

          {/* Pin needle stem directly connecting avatar to the pinpoint on surface */}
          <div
            className="w-0.5 h-4 transition-colors duration-200"
            style={{
              background: hovered
                ? "linear-gradient(to bottom, #d4af37, #00dd61)"
                : "linear-gradient(to bottom, #d4af37, #ef4444)",
            }}
          />

          {/* Pinpoint Anchor Dot touching the globe surface */}
          <div
            className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: hovered ? "#00dd61" : "#ef4444",
              boxShadow: hovered
                ? "0 0 6px #00dd61"
                : "0 0 4px #ef4444",
            }}
          />
        </div>
      </Html>
    </group>
  );
}

// ============================================================================
// Rotating Globe with Markers (all rotate together)
// ============================================================================

interface RotatingGlobeProps {
  config: Required<Globe3DConfig>;
  markers: GlobeMarker[];
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function RotatingGlobe({
  config,
  markers,
  onMarkerClick,
  onMarkerHover,
}: RotatingGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load Earth textures
  const [earthTexture, bumpTexture] = useTexture([
    config.textureUrl,
    config.bumpMapUrl,
  ]);

  // Configure textures
  React.useEffect(() => {
    /* eslint-disable react-hooks/immutability */
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 16;
    }
    if (bumpTexture) {
      bumpTexture.anisotropy = 8;
    }
    /* eslint-enable react-hooks/immutability */
  }, [earthTexture, bumpTexture]);

  // Create geometries
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius, 64, 64);
  }, [config.radius]);

  const wireframeGeometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius * 1.002, 32, 16);
  }, [config.radius]);

  // Clean up GPU geometry buffers on unmount
  React.useEffect(() => {
    return () => {
      geometry.dispose();
      wireframeGeometry.dispose();
    };
  }, [geometry, wireframeGeometry]);

  return (
    <group
      ref={groupRef}
      rotation={[
        config.initialRotation?.x || 0,
        config.initialRotation?.y || 0,
        0,
      ]}
    >
      {/* Main globe mesh with Earth texture */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={config.bumpScale * 0.05}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Wireframe overlay */}
      {config.showWireframe && (
        <mesh geometry={wireframeGeometry}>
          <meshBasicMaterial
            color={config.wireframeColor}
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      )}

      {/* Markers - now inside the rotating group */}
      {markers.map((marker, index) => (
        <Marker
          key={`marker-${index}-${marker.lat}-${marker.lng}`}
          marker={marker}
          radius={config.radius}
          defaultSize={config.markerSize}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
        />
      ))}
    </group>
  );
}

// ============================================================================
// Atmosphere Component (stays static - doesn't rotate)
// ============================================================================

interface AtmosphereProps {
  radius: number;
  color: string;
  intensity: number;
  blur: number;
}

function Atmosphere({ radius, color, intensity, blur }: AtmosphereProps) {
  // blur controls the fresnel exponent: lower = more diffuse, higher = sharper edge
  // We invert it so higher blur value = more diffuse (lower exponent)
  const fresnelPower = Math.max(0.5, 5 - blur);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        atmosphereColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        fresnelPower: { value: fresnelPower },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
          gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color, intensity, fresnelPower]);

  React.useEffect(() => {
    return () => {
      atmosphereMaterial.dispose();
    };
  }, [atmosphereMaterial]);

  return (
    <mesh scale={[1.12, 1.12, 1.12]}>
      <sphereGeometry args={[radius, 64, 32]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

// ============================================================================
// Scene Component
// ============================================================================

interface SceneProps {
  markers: GlobeMarker[];
  config: Required<Globe3DConfig>;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
  onReady?: () => void;
}

function Scene({ markers, config, onMarkerClick, onMarkerHover, onReady }: SceneProps) {
  const { camera, size, gl } = useThree();
  const cameraInitializedRef = useRef(false);

  React.useEffect(() => {
    onReady?.();
  }, [onReady]);

  // Manage WebGL context loss safely during active lifecycle
  React.useEffect(() => {
    let isMounted = true;
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      if (!isMounted) return; // Clean unmount / HMR teardown: allow context release
      event.preventDefault(); // Unintended GPU interruption: allow browser recovery
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    return () => {
      isMounted = false;
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
    };
  }, [gl]);

  // Set the camera position once when the globe scene mounts.
  // In compact mode, the canvas is square and sized so the globe occupies fitRatio (0.78)
  // of the canvas. This guarantees that the entire projected sphere fits inside the
  // canvas with an ~11% safety margin on all sides, completely eliminating clipping.
  React.useEffect(() => {
    if (cameraInitializedRef.current) return;

    let distanceMultiplier: number;
    if (config.compact) {
      distanceMultiplier = computeCameraDistance(
        config.radius,
        config.globeFitRatio || 0.78
      );
    } else {
      const aspect = size.width / Math.max(1, size.height);
      distanceMultiplier =
        aspect < 1
          ? config.radius * (3.5 / Math.max(0.65, aspect))
          : config.radius * 3.5;
    }

    camera.position.set(0, 0, distanceMultiplier);
    camera.lookAt(0, 0, 0);
    cameraInitializedRef.current = true;

    if ("updateProjectionMatrix" in camera) {
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height, config.radius, config.compact, config.globeFitRatio]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.3}
        color="#88ccff"
      />

      {/* Rotating Globe with Markers */}
      <RotatingGlobe
        config={config}
        markers={markers}
        onMarkerClick={onMarkerClick}
        onMarkerHover={onMarkerHover}
      />

      {/* Atmosphere (static) */}
      {config.showAtmosphere && (
        <Atmosphere
          radius={config.radius}
          color={config.atmosphereColor}
          intensity={config.atmosphereIntensity}
          blur={config.atmosphereBlur}
        />
      )}

      {/* Controls: Explicit target locked at [0, 0, 0] ensures perfect optical centering at all times */}
      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.4}
        autoRotate={config.autoRotateSpeed > 0}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

// ============================================================================
// Loading Fallback
// ============================================================================

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex shrink-0 flex-col items-center gap-3">
        <span className="inline-block shrink-0 text-sm text-neutral-400">
          Loading globe...
        </span>
      </div>
    </Html>
  );
}

// ============================================================================
// Main Globe3D Component
// ============================================================================

const defaultConfig: Required<Globe3DConfig> = {
  radius: 2,
  globeColor: "#1a1a2e",
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  showAtmosphere: false,
  atmosphereColor: "#4da6ff",
  atmosphereIntensity: 0.5,
  atmosphereBlur: 2,
  bumpScale: 1,
  autoRotateSpeed: 0.3,
  enableZoom: false,
  enablePan: false,
  minDistance: 5,
  maxDistance: 15,
  initialRotation: { x: 0, y: 0 },
  markerSize: 0.06,
  showWireframe: false,
  wireframeColor: "#4a9eff",
  ambientIntensity: 0.6,
  pointLightIntensity: 1.5,
  backgroundColor: null,
  compact: true,
  globeFitRatio: 0.78,
};

export function Globe3D({
  markers = [],
  config = {},
  className,
  onMarkerClick,
  onMarkerHover,
  onReady,
}: Globe3DProps) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [compactSize, setCompactSize] = useState<number | null>(null);

  // Measure container layout footprint using clientWidth/clientHeight (unscaled layout dimensions)
  // to remain completely immune to parent CSS transforms (e.g. motion scale animation).
  React.useEffect(() => {
    if (!mergedConfig.compact) return;

    const el = containerRef.current;
    if (!el) return;

    const computeCompactSize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;

      const aspect = w / h;
      const lRef =
        aspect >= 1
          ? h
          : aspect >= 0.65
            ? w
            : 0.65 * h;

      // In the original unconstrained canvas with FOV = 45deg:
      // projected diameter = lRef * (tan(alphaOrig) / tan(22.5deg)) ~= lRef * 0.7198
      const tanHalfFov = Math.tan((45 * Math.PI) / 360);
      const sinAlphaOrig = mergedConfig.radius / (mergedConfig.radius * 3.5);
      const tanAlphaOrig = sinAlphaOrig / Math.sqrt(1 - sinAlphaOrig * sinAlphaOrig);
      const fOrig = tanAlphaOrig / tanHalfFov;

      const targetDiameter = lRef * fOrig;
      const fitRatio = mergedConfig.globeFitRatio || 0.78;
      const size = Math.round(targetDiameter / fitRatio);

      setCompactSize((prev) => (prev === size ? prev : size));
    };

    computeCompactSize();

    const ro = new ResizeObserver(computeCompactSize);
    ro.observe(el);

    return () => ro.disconnect();
  }, [mergedConfig.compact, mergedConfig.globeFitRatio, mergedConfig.radius]);

  // Initial camera distance calculation
  const initialCameraDistance = mergedConfig.compact
    ? computeCameraDistance(mergedConfig.radius, mergedConfig.globeFitRatio || 0.78)
    : mergedConfig.radius * 3.5;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full flex items-center justify-center overflow-visible",
        className
      )}
      style={{
        margin: "0 auto",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, initialCameraDistance],
        }}
        style={{
          position: "relative",
          width: compactSize ? `${compactSize}px` : "100%",
          height: compactSize ? `${compactSize}px` : "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          aspectRatio: "1 / 1",
          margin: "auto",
          display: "block",
          background: mergedConfig.backgroundColor || "transparent",
          pointerEvents: "auto",
          touchAction: "none",
        }}
        className={compactSize ? "shrink-0" : "w-full h-full"}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            markers={markers}
            config={mergedConfig}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
            onReady={onReady}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Globe3D;
