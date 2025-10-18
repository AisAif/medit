import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import type { Ref } from "vue";
import type { useEditorStore } from "@/stores/editor";

export function usePointerInteractions(
  canvasContainer: Ref<HTMLDivElement | null>,
  store: ReturnType<typeof useEditorStore>
) {
  // Extract reactive state from store
  const { baseImage, scale, offset, flip, tool } = storeToRefs(store);
  // State
  const isPanning = ref(false);
  const isSelectingCrop = ref(false);
  const panStart = ref({ x: 0, y: 0 });
  const offsetStart = ref({ x: 0, y: 0 });
  const rectStart = ref({ startX: 0, startY: 0, endX: 0, endY: 0 });

  // Helper function to get coordinates from mouse or touch event
  function getEventCoordinates(e: MouseEvent | TouchEvent) {
    if ("touches" in e && e.touches.length > 0) {
      const touch = e.touches[0];
      return touch ? { x: touch.clientX, y: touch.clientY } : null;
    } else {
      const mouseEvent = e as MouseEvent;
      return { x: mouseEvent.clientX, y: mouseEvent.clientY };
    }
  }

  // Convert screen coordinates to image coordinates
  function screenToImageCoordinates(screenX: number, screenY: number) {
    if (!baseImage.value || !canvasContainer.value) return null;

    const rect = canvasContainer.value.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    // Convert screen coordinates to canvas container coordinates
    const containerX = screenX - rect.left;
    const containerY = screenY - rect.top;

    // Calculate image position and size in canvas container coordinates
    const img = baseImage.value;
    const imgScreenWidth = img.width * scale.value * Math.abs(flip.value.x);
    const imgScreenHeight = img.height * scale.value * Math.abs(flip.value.y);
    const imgLeft = canvasWidth / 2 + offset.value.x - imgScreenWidth / 2;
    const imgTop = canvasHeight / 2 + offset.value.y - imgScreenHeight / 2;

    // Check if click is within image bounds (in container coordinates)
    if (
      containerX < imgLeft ||
      containerX > imgLeft + imgScreenWidth ||
      containerY < imgTop ||
      containerY > imgTop + imgScreenHeight
    ) {
      return null;
    }

    // Convert to image coordinates (accounting for transformations)
    let imgX = (containerX - imgLeft) / scale.value;
    let imgY = (containerY - imgTop) / scale.value;

    // Handle flip transformations by adjusting the coordinate system
    if (flip.value.x < 0) {
      imgX = img.width - Math.abs(imgX);
    }
    if (flip.value.y < 0) {
      imgY = img.height - Math.abs(imgY);
    }

    return {
      x: Math.max(0, Math.min(imgX, img.width)),
      y: Math.max(0, Math.min(imgY, img.height)),
    };
  }

  // Handle pointer down
  function onPointerDown(e: MouseEvent | TouchEvent) {
    if (!baseImage.value || !canvasContainer.value) return;

    const coords = getEventCoordinates(e);
    if (!coords) return;

    const rect = canvasContainer.value.getBoundingClientRect();
    const x = coords.x - rect.left;
    const y = coords.y - rect.top;

    if (tool.value === "crop") {
      // Start crop selection
      isSelectingCrop.value = true;
      const imageCoords = screenToImageCoordinates(coords.x, coords.y);
      if (imageCoords) {
        rectStart.value = {
          startX: imageCoords.x,
          startY: imageCoords.y,
          endX: imageCoords.x,
          endY: imageCoords.y,
        };
        store.setCropSelection(null);
      }
    } else {
      // Handle panning
      isPanning.value = true;
      panStart.value = { x, y };
      offsetStart.value = { ...offset.value };
    }
  }

  // Handle pointer move
  function onPointerMove(e: MouseEvent | TouchEvent) {
    if (!baseImage.value || !canvasContainer.value) return;

    const coords = getEventCoordinates(e);
    if (!coords) return;

    const rect = canvasContainer.value.getBoundingClientRect();
    const x = coords.x - rect.left;
    const y = coords.y - rect.top;

    if (tool.value === "crop" && isSelectingCrop.value) {
      // Update crop selection rectangle
      const imageCoords = screenToImageCoordinates(coords.x, coords.y);
      if (imageCoords && baseImage.value) {
        rectStart.value.endX = imageCoords.x;
        rectStart.value.endY = imageCoords.y;

        const selectionX = Math.min(
          rectStart.value.startX,
          rectStart.value.endX
        );
        const selectionY = Math.min(
          rectStart.value.startY,
          rectStart.value.endY
        );
        const width = Math.abs(rectStart.value.endX - rectStart.value.startX);
        const height = Math.abs(rectStart.value.endY - rectStart.value.startY);

        // Ensure selection is within image bounds
        const boundedX = Math.max(
          0,
          Math.min(selectionX, baseImage.value.width - width)
        );
        const boundedY = Math.max(
          0,
          Math.min(selectionY, baseImage.value.height - height)
        );
        const boundedWidth = Math.min(width, baseImage.value.width - boundedX);
        const boundedHeight = Math.min(
          height,
          baseImage.value.height - boundedY
        );

        store.setCropSelection({
          x: boundedX,
          y: boundedY,
          width: Math.max(0, boundedWidth),
          height: Math.max(0, boundedHeight),
        });
      }
    } else if (isPanning.value) {
      // Handle panning
      offset.value = {
        x: offsetStart.value.x + (x - panStart.value.x),
        y: offsetStart.value.y + (y - panStart.value.y),
      };
    }
  }

  // Handle pointer up
  function onPointerUp() {
    if (tool.value === "crop") {
      isSelectingCrop.value = false;
    } else {
      isPanning.value = false;
    }
  }

  // Handle wheel zoom
  function onWheel(e: WheelEvent) {
    if (!baseImage.value || !canvasContainer.value) return;

    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.1 : 0.9;
    const rect = canvasContainer.value.getBoundingClientRect();

    // Calculate cursor position relative to canvas center
    const cursorX = e.clientX - rect.left - rect.width / 2;
    const cursorY = e.clientY - rect.top - rect.height / 2;

    // Store current offset before zoom to calculate proper adjustment
    const currentOffsetX = offset.value.x;
    const currentOffsetY = offset.value.y;

    // Apply zoom
    scale.value = Math.min(10, Math.max(0.1, scale.value * factor));

    // Adjust offset to zoom towards cursor position
    offset.value = {
      x: currentOffsetX - cursorX * (factor - 1),
      y: currentOffsetY - cursorY * (factor - 1),
    };
  }

  // Computed cursor styles
  const cursorClass = computed(() => {
    if (!baseImage.value) return "";

    if (tool.value === "crop") return "cursor-crosshair";
    if (isPanning.value) return "cursor-grabbing";

    return "cursor-grab";
  });

  return {
    // State
    isPanning,
    isSelectingCrop,

    // Methods
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onWheel,
    screenToImageCoordinates,

    // Computed
    cursorClass,
  };
}
