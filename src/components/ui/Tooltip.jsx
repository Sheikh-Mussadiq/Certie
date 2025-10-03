import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const Tooltip = ({
  children,
  content,
  position = "top",
  delay = 200, // Faster default delay for better UX
  className = "",
  theme = "dark", // Added theme prop for styling flexibility
  wrapperClassName = "inline-block relative",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const targetRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  // Get theme-based styling
  const getThemeStyles = () => {
    switch (theme) {
      case "light":
        return "bg-white text-secondary-black border border-grey-outline";
      case "primary":
        return "bg-primary-orange text-white";
      case "success":
        return "bg-green-600 text-white";
      case "info":
        return "bg-blue-600 text-white";
      default: // dark theme default
        return "bg-secondary-black text-white";
    }
  };

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };

  const updatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;

    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let x = 0;
    let y = 0;
    let arrowPosition = {};

    switch (position) {
      case "top":
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.top - tooltipRect.height - 8;
        arrowPosition = { bottom: -4, left: "50%" };
        break;
      case "bottom":
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.bottom + 8;
        arrowPosition = { top: -4, left: "50%" };
        break;
      case "left":
        x = targetRect.left - tooltipRect.width - 8;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        arrowPosition = { right: -4, top: "50%" };
        break;
      case "right":
        x = targetRect.right + 8;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        arrowPosition = { left: -4, top: "50%" };
        break;
      default:
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.top - tooltipRect.height - 8;
        arrowPosition = { bottom: -4, left: "50%" };
    }

    // Adjust for scroll position
    x += window.scrollX;
    y += window.scrollY;

    // Keep tooltip within viewport
    const viewport = {
      left: window.scrollX,
      top: window.scrollY,
      right: window.scrollX + window.innerWidth,
      bottom: window.scrollY + window.innerHeight,
    };

    // Adjust horizontally if needed
    if (x < viewport.left) x = viewport.left + 10;
    if (x + tooltipRect.width > viewport.right)
      x = viewport.right - tooltipRect.width - 10;

    // Adjust vertically if needed
    if (y < viewport.top) y = viewport.top + 10;
    if (y + tooltipRect.height > viewport.bottom)
      y = viewport.bottom - tooltipRect.height - 10;

    setCoordinates({ x, y, ...arrowPosition });
  };

  // Update position when window is resized
  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);

      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }
  }, [isVisible]);

  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // The component that wraps the children
  const themeClass = getThemeStyles();
  const arrowClass = `${themeClass.split(" ")[0]} ${
    theme === "light" ? "border-grey-outline" : ""
  }`;

  return (
    <div
      className={wrapperClassName}
      ref={targetRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && content && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-3 py-2 text-xs rounded-lg shadow-sm
            max-w-xs whitespace-normal break-words
            opacity-0 animate-fade-in
            ${themeClass}
            ${className}`}
          style={{
            left: `${coordinates.x}px`,
            top: `${coordinates.y}px`,
            animationDuration: "0.2s",
            animationFillMode: "forwards",
          }}
        >
          {content}
          <div
            className={`absolute w-2 h-2 rotate-45
              ${
                position === "top"
                  ? "bottom-[-4px] left-1/2 transform -translate-x-1/2"
                  : ""
              }
              ${
                position === "bottom"
                  ? "top-[-4px] left-1/2 transform -translate-x-1/2"
                  : ""
              }
              ${
                position === "left"
                  ? "right-[-4px] top-1/2 transform -translate-y-1/2"
                  : ""
              }
              ${
                position === "right"
                  ? "left-[-4px] top-1/2 transform -translate-y-1/2"
                  : ""
              }
              ${arrowClass}
            `}
          />
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  delay: PropTypes.number,
  className: PropTypes.string,
  theme: PropTypes.oneOf(["dark", "light", "primary", "success", "info"]),
  wrapperClassName: PropTypes.string,
};

export default Tooltip;
