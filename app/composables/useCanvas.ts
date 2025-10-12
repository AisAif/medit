import { ref, computed, watch } from "vue";

export function useCanvas(
  baseImage: any,
  filterString: any,
  scale: any,
  offset: any,
  rotation: any,
  flip: any
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

    c2.restore();
  }

  watch(
    [scale, offset, rotation, flip, filterString, baseImage],
    () => draw(),
    { deep: true }
  );

  return { canvasRef, canvasContainer, ctx, draw, getCanvasSize };
}

