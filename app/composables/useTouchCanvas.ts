import { ref } from "vue";

export function useTouchCanvas(
  onPointerDown: (e: MouseEvent | TouchEvent) => void,
  onPointerMove: (e: MouseEvent | TouchEvent) => void,
  onPointerUp: () => void,
  onWheel: (e: WheelEvent) => void
) {
  // State
  const isTouchDevice = ref(false);
  const lastTouchDistance = ref(0);
  const touchStartDistance = ref(0);
  const zoomCenter = ref({ x: 0, y: 0 });

  /**
   * Check if the current device supports touch input
   */
  function checkTouchDevice() {
    isTouchDevice.value =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0;
  }

  /**
   * Convert single touch event to mouse-like event for compatibility
   */
  function touchToMouseEvent(
    touchEvent: TouchEvent,
    type: "down" | "move" | "up"
  ): MouseEvent | TouchEvent {
    if (touchEvent.touches.length === 1) {
      const touch = touchEvent.touches[0];
      if (touch) {
        return new MouseEvent(
          type === "down"
            ? "mousedown"
            : type === "move"
            ? "mousemove"
            : "mouseup",
          {
            clientX: touch.clientX,
            clientY: touch.clientY,
            button: 0,
          }
        );
      }
    }
    return touchEvent;
  }

  /**
   * Handle touch start event
   * - Single touch: Treat as mouse down
   * - Two finger touch: Prepare for pinch zoom
   */
  function handleTouchStart(e: TouchEvent) {
    e.preventDefault();

    if (e.touches.length === 1) {
      // Single touch - treat like mouse down
      const mouseEvent = touchToMouseEvent(e, "down");
      onPointerDown(mouseEvent);
    } else if (e.touches.length === 2) {
      // Two finger touch - prepare for pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (touch1 && touch2) {
        touchStartDistance.value = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        lastTouchDistance.value = touchStartDistance.value;

        // Store the initial zoom center point
        zoomCenter.value = {
          x: (touch1.clientX + touch2.clientX) / 2,
          y: (touch1.clientY + touch2.clientY) / 2,
        };
      }
    }
  }

  /**
   * Handle touch move event
   * - Single touch: Treat as mouse move
   * - Two finger touch: Handle pinch zoom
   */
  function handleTouchMove(e: TouchEvent) {
    e.preventDefault();

    if (e.touches.length === 1) {
      // Single touch - treat like mouse move
      const mouseEvent = touchToMouseEvent(e, "move");
      onPointerMove(mouseEvent);
    } else if (e.touches.length === 2) {
      // Two finger touch - handle pinch zoom
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (touch1 && touch2) {
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );

        if (lastTouchDistance.value > 0) {
          const scale = currentDistance / lastTouchDistance.value;

          // Create a synthetic wheel event for zoom with consistent center point
          const wheelEvent = new WheelEvent("wheel", {
            deltaY: scale > 1 ? -10 : 10,
            clientX: zoomCenter.value.x,
            clientY: zoomCenter.value.y,
          });

          onWheel(wheelEvent);
        }

        lastTouchDistance.value = currentDistance;
      }
    }
  }

  /**
   * Handle touch end event
   * - All fingers lifted: Treat as mouse up
   * - One finger remaining: Reset for single touch
   */
  function handleTouchEnd(e: TouchEvent) {
    e.preventDefault();

    if (e.touches.length === 0) {
      // All fingers lifted - treat like mouse up
      // Don't reset zoom center immediately to prevent flicker
      const currentZoomCenter = { ...zoomCenter.value };

      onPointerUp();
      lastTouchDistance.value = 0;

      // Delay zoom center reset to prevent flicker
      setTimeout(() => {
        zoomCenter.value = { x: 0, y: 0 };
      }, 50);
    } else if (e.touches.length === 1) {
      // One finger remaining - reset for single touch
      lastTouchDistance.value = 0;
      // Don't reset zoom center immediately when switching to single touch
      // This prevents flicker when transitioning from pinch to pan
    }
  }

  /**
   * Initialize touch support
   */
  function init() {
    checkTouchDevice();
  }

  return {
    // State
    isTouchDevice,

    // Methods
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    init,
  };
}
