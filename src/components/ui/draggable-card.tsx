"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from "motion/react";

type DraggableCardContextValue = {
  containerRef: RefObject<HTMLDivElement | null>;
  bringToFront: (id: string) => void;
  getZIndex: (id: string, defaultZ: number) => number;
};

const DraggableCardContext = createContext<DraggableCardContextValue | null>(null);

export const useDraggableCardContext = () => {
  return useContext(DraggableCardContext);
};

/* ============================================================
   DRAGGABLE CARD CONTAINER (Dialog Boundary & Z-Index Manager)
   ============================================================ */
export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zIndices, setZIndices] = useState<Record<string, number>>({});
  const maxZ = useRef<number>(30);

  const bringToFront = (id: string) => {
    maxZ.current += 1;
    setZIndices((prev) => ({
      ...prev,
      [id]: maxZ.current,
    }));
  };

  const getZIndex = (id: string, defaultZ: number) => {
    return zIndices[id] ?? defaultZ;
  };

  return (
    <DraggableCardContext.Provider
      value={{
        containerRef,
        bringToFront,
        getZIndex,
      }}
    >
      <div
        ref={containerRef}
        className={cn(
          "uiux-draggable-container relative w-full h-full overflow-hidden perspective-[3000px]",
          className
        )}
      >
        {children}
      </div>
    </DraggableCardContext.Provider>
  );
};

/* ============================================================
   DRAGGABLE CARD BODY (Smooth Drag Motion, Clear Opacity, Zero Angle)
   ============================================================ */
export const DraggableCardBody = ({
  className,
  initial_distance,
  children,
  index = 0,
  id,
  totalCards = 1,
}: {
  className?: string;
  initial_distance: { x: number, y: number };
  children?: ReactNode;
  index?: number;
  id?: string;
  totalCards?: number;
}) => {
  const context = useDraggableCardContext();
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const cardId = id ?? `card-${index}`;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Velocity tracking from mouse movement to regain smooth physics from previous code
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [25, -25]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-25, 25]),
    springConfig
  );

  // Stack ordering: Card 0 is on top of initial stack, followed by Card 1, Card 2, etc.
  const defaultZ = Math.max(1, totalCards - index);
  const currentZ = context ? context.getZIndex(cardId, defaultZ) : defaultZ;

  // Responsive uniform distance step (Zero angle/rotation!)
  const [step, setStep] = useState({ x: initial_distance.x, y: initial_distance.y });

  useEffect(() => {
    const updateStep = () => {
      if (typeof window !== "undefined") {
        const width = window.innerWidth;
        if (width < 768) {
          setStep({ x: 16, y: 12 });
        } else if (width < 1024) {
          setStep({ x: 24, y: 18 });
        } else {
          setStep({ x: 32, y: 24 });
        }
      }
    };
    updateStep();
    window.addEventListener("resize", updateStep);
    return () => window.removeEventListener("resize", updateStep);
  }, []);

  // Center-balanced uniform stack offsets without any rotation angle:
  const centerOffsetX = (index - (totalCards - 1) / 2) * step.x;
  const centerOffsetY = (index - (totalCards - 1) / 2) * step.y;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handlePointerDown = () => {
    context?.bringToFront(cardId);
  };

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={context?.containerRef}
      dragElastic={0.15}
      onPointerDown={handlePointerDown}
      onDragStart={() => {
        document.body.style.cursor = "grabbing";
        context?.bringToFront(cardId);
      }}
      onDragEnd={(event, info) => {
        document.body.style.cursor = "default";

        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: "spring",
            ...springConfig,
          },
        });

        const currentVelocityX = velocityX.get();
        const currentVelocityY = velocityY.get();

        const velocityMagnitude = Math.sqrt(
          currentVelocityX * currentVelocityX +
          currentVelocityY * currentVelocityY
        );
        const bounce = Math.min(0.8, velocityMagnitude / 1000);

        animate(info.point.x, info.point.x + currentVelocityX * 0.3, {
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: "spring",
          stiffness: 50,
          damping: 15,
          mass: 0.8,
        });

        animate(info.point.y, info.point.y + currentVelocityY * 0.3, {
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: "spring",
          stiffness: 50,
          damping: 15,
          mass: 0.8,
        });
      }}
      initial={{
        x: centerOffsetX,
        y: centerOffsetY,
      }}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        zIndex: currentZ,
        willChange: "transform",
        touchAction: "none",
      }}
      className={cn(
        "absolute inset-0 m-auto w-max h-max active:cursor-grabbing select-none transform-3d",
        className
      )}
    >
      {children}
    </motion.div>
  );
};