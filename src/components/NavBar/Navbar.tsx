"use client";

import { useSyncExternalStore } from "react";
import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const emptySubscribe = () => () => {};

export interface NavbarProps {
  className?: string;
}

export function Navbar({ className = "" }: NavbarProps) {
  const { isMobile } = useMediaQuery();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  return (
    <>
      {/* Desktop Navbar View: Full context navigation, no menu button */}
      <div className="hidden md:block">
        {(!mounted || !isMobile) && <NavbarDesktop className={className} />}
      </div>

      {/* Mobile Navbar View: ONLY menu icon button, 30% unrolling sheet */}
      <div className="block md:hidden">
        {mounted && isMobile && <NavbarMobile className={className} />}
      </div>
    </>
  );
}

export { NavbarDesktop } from "./NavbarDesktop";
export { NavbarMobile } from "./NavbarMobile";
export {
  NAVBAR_SCROLL_SVG_CONFIG,
  MOBILE_NAV_ANIMATION,
  DESKTOP_NAV_LINKS,
  MOBILE_NAV_LINKS,
  useNavbarDevice,
  getRibbonGeometry,
  getMobileCenterline,
  RIBBON_ANCHORS,
  MOBILE_CENTERLINE,
  cubicBezier,
  getNavbarScrollConfig,
  getSVGPositionStyle,
  resolveCoord,
  resolveTransformCoord,
  getInitialScrollTransform,
  parseCoordinate,
} from "../../config/NavbarConfig";
export type {
  NavbarDevice,
  DesktopNavLink,
  MobileNavLink,
  RibbonAnchor,
  RibbonTrajectoryConfig,
  MobileCenterlineAnchor,
  MobileTrajectoryConfig,
  ScrollSVGVisualConfig,
  SVGPosition,
} from "../../config/NavbarConfig";
export default Navbar;

