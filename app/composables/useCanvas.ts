import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import type { useEditorStore } from "@/stores/editor";

export function useCanvas(store: ReturnType<typeof useEditorStore>) {
  // Extract reactive state from store
  const {
    baseImage,
    filterString,
    scale,
    offset,
    rotation,
    flip,
    cropSelection,
  } = storeToRefs(store);
  // Refs
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const canvasContainer = ref<HTMLDivElement | null>(null);

  // Computed
  const ctx = computed(() => canvasRef.value?.getContext("2d") ?? null);

  /**
   * Get canvas size and handle high DPI displays
   */
  function getCanvasSize() {
    const canvas = canvasRef.value!;
    const container = canvasContainer.value!;
    const dpr = window.devicePixelRatio || 1;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Set canvas size accounting for device pixel ratio
    if (
      canvas.width !== Math.floor(width * dpr) ||
      canvas.height !== Math.floor(height * dpr)
    ) {
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    }

    return { width, height, dpr };
  }

  /**
   * Clear the entire canvas
   */
  function clearCanvas() {
    const canvas = canvasRef.value;
    const context = ctx.value;
    if (!canvas || !context) return;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Draw the image with all transformations and overlays
   */
  function draw() {
    if (!ctx.value || !canvasRef.value) return;

    clearCanvas();
    const { width, height, dpr } = getCanvasSize();
    const context = ctx.value!;

    // Apply all transformations and draw both image and overlay in the same coordinate system
    context.save();
    context.scale(dpr, dpr);
    context.translate(width / 2 + offset.value.x, height / 2 + offset.value.y);
    context.scale(scale.value * flip.value.x, scale.value * flip.value.y);
    context.rotate((rotation.value * Math.PI) / 180);

    // Draw the image with filters
    context.filter = filterString.value;
    const img = baseImage.value;
    if (img) {
      context.drawImage(img, -img.width / 2, -img.height / 2);
    }

    // Draw crop selection overlay if active
    if (cropSelection && cropSelection.value) {
      drawCropOverlay(context, img, cropSelection.value);
    }

    context.restore();
  }

  /**
   * Draw crop selection overlay with semi-transparent areas and selection border
   */
  function drawCropOverlay(
    context: CanvasRenderingContext2D,
    img: HTMLImageElement | null,
    selection: { x: number; y: number; width: number; height: number }
  ) {
    if (!img) return;

    const sel = selection;
    context.save();
    context.filter = "none"; // Remove filter for overlay
    context.globalAlpha = 0.7;

    // Draw semi-transparent overlay over unselected areas
    context.fillStyle = "rgba(0, 0, 0, 0.5)";
    context.fillRect(-img.width / 2, -img.height / 2, img.width, img.height);

    // Clear the selected area
    context.globalCompositeOperation = "destination-out";
    context.fillStyle = "white";
    context.fillRect(
      sel.x - img.width / 2,
      sel.y - img.height / 2,
      sel.width,
      sel.height
    );

    // Draw selection border
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 1;
    context.strokeStyle = "#ffffff";
    context.lineWidth = 2 / scale.value;
    context.setLineDash([8 / scale.value, 4 / scale.value]);
    context.strokeRect(
      sel.x - img.width / 2,
      sel.y - img.height / 2,
      sel.width,
      sel.height
    );

    context.restore();
  }

  // Watch for changes and redraw canvas
  watch(
    [scale, offset, rotation, flip, filterString, baseImage, cropSelection],
    () => draw(),
    { deep: true }
  );

  return {
    // Refs
    canvasRef,
    canvasContainer,

    // Computed
    ctx,

    // Methods
    draw,
    getCanvasSize,
  };
}

