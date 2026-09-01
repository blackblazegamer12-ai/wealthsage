import { useEffect, useRef, useCallback } from "react";

/**
 * Custom hook to trap focus within a container (modals, drawers).
 * Cycles through focusable elements on Tab/Shift+Tab.
 * Auto-focuses first element on mount, restores focus on unmount.
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Save previous focus
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Auto-focus first element after a short delay (animation)
    const timer = setTimeout(() => {
      const elements = getFocusableElements();
      if (elements.length > 0) {
        elements[0].focus();
      }
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const elements = getFocusableElements();
      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: if on first element, jump to last
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: if on last element, jump to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus on unmount
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive, getFocusableElements]);

  return containerRef;
}
