import { ref, computed, watch } from "vue";

export function useCanvas(
  baseImage: any,
  filterString: any,
  scale: any,
  offset: any,
  rotation: any,
  flip: any,
  cropSelection?: any
) {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const canvasContainer = ref<HTMLDivElement | null>(null);
  const ctx = computed(() => canvasRef.value?.getContext("2d") ?? null);

  function getCanvasSize() {
    const el = canvasRef.value!;
    const container = canvasContainer.value!;
    const dpr = window.devicePixelRatio || 1;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (el.width !== Math.floor(w * dpr) || el.height !== Math.floor(h * dpr)) {
      el.width = Math.floor(w * dpr);
      el.height = Math.floor(h * dpr);
      el.style.width = w + "px";
      el.style.height = h + "px";
    }
    return { w, h, dpr };
  }

  function clearCanvas() {
    const c = canvasRef.value;
    const c2 = ctx.value;
    if (!c || !c2) return;
    c2.setTransform(1, 0, 0, 1, 0, 0);
    c2.clearRect(0, 0, c.width, c.height);
  }

  function draw() {
    if (!ctx.value || !canvasRef.value) return;
    clearCanvas();
    const { w, h, dpr } = getCanvasSize();
    const c2 = ctx.value!;

    // Apply all transformations and draw both image and overlay in the same coordinate system
    c2.save();
    c2.scale(dpr, dpr);
    c2.translate(w / 2 + offset.value.x, h / 2 + offset.value.y);
    c2.scale(scale.value * flip.value.x, scale.value * flip.value.y);
    c2.rotate((rotation.value * Math.PI) / 180);

    // Draw the image
    c2.filter = filterString.value;
    const img = baseImage.value;
    if (img) {
      c2.drawImage(img, -img.width / 2, -img.height / 2);
    }

    // Draw crop selection rectangle
    if (cropSelection && cropSelection.value) {
      const sel = cropSelection.value;
      c2.save();
      c2.filter = "none"; // Remove filter for overlay
      c2.globalAlpha = 0.7;

      // Draw semi-transparent overlay over unselected areas
      c2.fillStyle = "rgba(0, 0, 0, 0.5)";
      c2.fillRect(-img.width / 2, -img.height / 2, img.width, img.height);

      // Clear the selected area
      c2.globalCompositeOperation = "destination-out";
      c2.fillStyle = "white";
      c2.fillRect(
        sel.x - img.width / 2,
        sel.y - img.height / 2,
        sel.width,
        sel.height
      );

      // Draw selection border
      c2.globalCompositeOperation = "source-over";
      c2.globalAlpha = 1;
      c2.strokeStyle = "#ffffff";
      c2.lineWidth = 2 / scale.value;
      c2.setLineDash([8 / scale.value, 4 / scale.value]);
      c2.strokeRect(
        sel.x - img.width / 2,
        sel.y - img.height / 2,
        sel.width,
        sel.height
      );

      c2.restore();
    }

    c2.restore();
  }

  watch(
    [scale, offset, rotation, flip, filterString, baseImage, cropSelection],
    () => draw(),
    { deep: true }
  );

  return { canvasRef, canvasContainer, ctx, draw, getCanvasSize };
}

