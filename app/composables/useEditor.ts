import { ref, computed } from "vue";

export function useEditor() {
  // Tool
  const tool = ref<"upload" | "adjust" | "filter" | "resize" | "export">(
    "upload"
  );

  // Image
  const baseImage = ref<HTMLImageElement | null>(null);
  const imageLoaded = computed(() => !!baseImage.value);

  // View transforms
  const scale = ref(1);
  const offset = ref({ x: 0, y: 0 });
  const rotation = ref(0);
  const flip = ref({ x: 1, y: 1 });

  // Filters
  const filters = ref({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    invert: 0,
  });
  const filterString = computed(
    () =>
      `brightness(${filters.value.brightness}%) contrast(${filters.value.contrast}%) saturate(${filters.value.saturate}%) grayscale(${filters.value.grayscale}%) sepia(${filters.value.sepia}%) invert(${filters.value.invert}%) blur(${filters.value.blur}px)`
  );

  // Resize panel
  const keepAspect = ref(true);
  const resizeW = ref(0);
  const resizeH = ref(0);

  // Export
  const exportFormat = ref<"image/png" | "image/jpeg">("image/png");
  const exportQuality = ref(0.9);

  function loadFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const img = new Image();
    img.onload = () => {
      baseImage.value = img;
      scale.value = 1;
      offset.value = { x: 0, y: 0 };
      rotation.value = 0;
      flip.value = { x: 1, y: 1 };
      resizeW.value = img.width;
      resizeH.value = img.height;
      tool.value = "adjust";
    };
    img.src = URL.createObjectURL(file);
  }

  function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;
    loadFile(input.files[0]);
    input.value = "";
  }

  function onDrop(e: DragEvent) {
    const file = e.dataTransfer?.files?.[0];
    if (file) loadFile(file);
  }

  function onResizeInput(which: "w" | "h") {
    if (!baseImage.value) return;
    if (!keepAspect.value) return;
    const ratio = baseImage.value.width / baseImage.value.height;
    if (which === "w") resizeH.value = Math.round(resizeW.value / ratio);
    else resizeW.value = Math.round(resizeH.value * ratio);
  }

  function applyResize() {
    if (!baseImage.value) return;
    const w = Math.max(1, Math.round(resizeW.value));
    const h = Math.max(1, Math.round(resizeH.value));
    const out = document.createElement("canvas");
    out.width = w;
    out.height = h;
    const octx = out.getContext("2d")!;
    octx.imageSmoothingQuality = "high";
    octx.filter = filterString.value;
    octx.drawImage(baseImage.value, 0, 0, w, h);
    const newImg = new Image();
    newImg.onload = () => {
      baseImage.value = newImg;
      scale.value = 1;
      offset.value = { x: 0, y: 0 };
      resizeW.value = w;
      resizeH.value = h;
    };
    newImg.src = out.toDataURL("image/png");
  }

  function resetFilters() {
    filters.value = {
      brightness: 100,
      contrast: 100,
      saturate: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0,
    };
  }

  function applyPreset(name: "warm" | "cold" | "vintage" | "bw") {
    if (name === "warm")
      filters.value = {
        brightness: 105,
        contrast: 105,
        saturate: 120,
        blur: 0,
        grayscale: 0,
        sepia: 15,
        invert: 0,
      };
    else if (name === "cold")
      filters.value = {
        brightness: 102,
        contrast: 108,
        saturate: 110,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        invert: 0,
      };
    else if (name === "vintage")
      filters.value = {
        brightness: 100,
        contrast: 95,
        saturate: 90,
        blur: 0,
        grayscale: 0,
        sepia: 35,
        invert: 0,
      };
    else if (name === "bw")
      filters.value = {
        brightness: 100,
        contrast: 120,
        saturate: 0,
        blur: 0,
        grayscale: 100,
        sepia: 0,
        invert: 0,
      };
  }

  function onReset() {
    if (!baseImage.value) return;
    scale.value = 1;
    offset.value = { x: 0, y: 0 };
    rotation.value = 0;
    flip.value = { x: 1, y: 1 };
    resetFilters();
  }

  function download() {
    if (!baseImage.value) return;
    const img = baseImage.value;
    const out = document.createElement("canvas");
    const octx = out.getContext("2d")!;
    out.width = img.width;
    out.height = img.height;
    octx.save();
    octx.translate(out.width / 2, out.height / 2);
    octx.scale(flip.value.x, flip.value.y);
    octx.rotate((rotation.value * Math.PI) / 180);
    octx.filter = filterString.value;
    octx.drawImage(img, -img.width / 2, -img.height / 2);
    octx.restore();
    const url = out.toDataURL(
      exportFormat.value,
      exportFormat.value === "image/jpeg" ? exportQuality.value : undefined
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `media-editor.${
      exportFormat.value === "image/png" ? "png" : "jpg"
    }`;
    a.click();
  }

  return {
    // state
    tool,
    baseImage,
    imageLoaded,
    scale,
    offset,
    rotation,
    flip,
    filters,
    filterString,
    keepAspect,
    resizeW,
    resizeH,
    exportFormat,
    exportQuality,
    // actions
    loadFile,
    onFileChange,
    onDrop,
    onResizeInput,
    applyResize,
    resetFilters,
    applyPreset,
    onReset,
    download,
  };
}

