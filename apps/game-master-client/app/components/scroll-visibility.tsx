import { type ReactNode, useEffect, useState } from "react";

interface ScrollVisibilityOptions {
  threshold?: number;
  scrollUpOnly?: boolean;
}
export const useScrollVisibility = ({
  threshold = 50,
  scrollUpOnly = true,
}: ScrollVisibilityOptions) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (scrollUpOnly) {
        // Show when scrolling up or at top, hide when scrolling down
        if (currentScrollY > lastScrollY && currentScrollY > threshold) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } else {
        // Simply show/hide based on scroll position
        setIsVisible(currentScrollY <= threshold);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, threshold, scrollUpOnly]);

  return isVisible;
};

interface ScrollFadeProps {
  children: ReactNode;
  className?: string;
  topOffset?: string;
  threshold?: number;
  scrollUpOnly?: boolean;
}

export function ScrollFade({
  children,
  className = "",
  topOffset = "0px",
  threshold = 50,
  scrollUpOnly = true,
}: ScrollFadeProps) {
  const isVisible = useScrollVisibility({ threshold, scrollUpOnly });
  return (
    <div
      className={`
        flex sticky z-20 justify-between items-center w-full
        transition-all duration-300
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}
        ${className}
      `}
      style={{ top: topOffset }}
    >
      {children}
    </div>
  );
}
