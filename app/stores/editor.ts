import { defineStore } from "pinia";

export type Tool =
  | "upload"
  | "adjust"
  | "filter"
  | "resize"
  | "crop"
  | "export";

export const useEditorStore = defineStore("editor", {
  state: () => ({
    tool: "upload" as Tool,
    baseImage: null as HTMLImageElement | null,
    scale: 1,
    offset: { x: 0, y: 0 },
    rotation: 0,
    flip: { x: 1, y: 1 },
    filters: {
      brightness: 100,
      contrast: 100,
      saturate: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      invert: 0,
    },
    keepAspect: true,
    resizeW: 0,
    resizeH: 0,
    exportFormat: "image/png" as "image/png" | "image/jpeg",
    exportQuality: 0.9,
    // Crop state
    cropSelection: null as {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null,
    isCropping: false,
  }),
  getters: {
    imageLoaded: (s) => !!s.baseImage,
    filterString: (s) =>
      `brightness(${s.filters.brightness}%) contrast(${s.filters.contrast}%) saturate(${s.filters.saturate}%) grayscale(${s.filters.grayscale}%) sepia(${s.filters.sepia}%) invert(${s.filters.invert}%) blur(${s.filters.blur}px)`,
  },
  actions: {
    setTool(t: Tool) {
      this.tool = t;
    },
    loadFile(file: File) {
      if (!file.type.startsWith("image/")) return;
      const img = new Image();
      img.onload = () => {
        this.baseImage = img;
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.rotation = 0;
        this.flip = { x: 1, y: 1 };

        this.resizeW = img.width;
        this.resizeH = img.height;
        this.tool = "adjust";
      };
      img.src = URL.createObjectURL(file);
    },
    onFileChange(e: Event) {
      const input = e.target as HTMLInputElement;
      if (!input.files || !input.files[0]) return;
      this.loadFile(input.files[0]);
      input.value = "";
    },
    onDrop(e: DragEvent) {
      const file = e.dataTransfer?.files?.[0];
      if (file) this.loadFile(file);
    },
    onResizeInput(which: "w" | "h") {
      if (!this.baseImage) return;
      if (!this.keepAspect) return;
      const ratio = this.baseImage.width / this.baseImage.height;
      if (which === "w") this.resizeH = Math.round(this.resizeW / ratio);
      else this.resizeW = Math.round(this.resizeH * ratio);
    },
    applyResize() {
      if (!this.baseImage) return;
      const w = Math.max(1, Math.round(this.resizeW));
      const h = Math.max(1, Math.round(this.resizeH));
      const out = document.createElement("canvas");
      out.width = w;
      out.height = h;
      const octx = out.getContext("2d")!;
      octx.imageSmoothingQuality = "high";
      octx.filter = this.filterString;
      octx.drawImage(this.baseImage, 0, 0, w, h);
      const newImg = new Image();
      newImg.onload = () => {
        this.baseImage = newImg;
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.resizeW = w;
        this.resizeH = h;
      };
      newImg.src = out.toDataURL("image/png");
    },
    resetFilters() {
      this.filters = {
        brightness: 100,
        contrast: 100,
        saturate: 100,
        blur: 0,
        grayscale: 0,
        sepia: 0,
        invert: 0,
      };
    },
    applyPreset(name: "warm" | "cold" | "vintage" | "bw") {
      if (name === "warm")
        this.filters = {
          brightness: 105,
          contrast: 105,
          saturate: 120,
          blur: 0,
          grayscale: 0,
          sepia: 15,
          invert: 0,
        };
      else if (name === "cold")
        this.filters = {
          brightness: 102,
          contrast: 108,
          saturate: 110,
          blur: 0,
          grayscale: 0,
          sepia: 0,
          invert: 0,
        };
      else if (name === "vintage")
        this.filters = {
          brightness: 100,
          contrast: 95,
          saturate: 90,
          blur: 0,
          grayscale: 0,
          sepia: 35,
          invert: 0,
        };
      else if (name === "bw")
        this.filters = {
          brightness: 100,
          contrast: 120,
          saturate: 0,
          blur: 0,
          grayscale: 100,
          sepia: 0,
          invert: 0,
        };
    },
    onReset() {
      if (!this.baseImage) return;
      this.scale = 1;
      this.offset = { x: 0, y: 0 };
      this.rotation = 0;
      this.flip = { x: 1, y: 1 };
      this.resetFilters();
    },
    download() {
      if (!this.baseImage) return;
      const img = this.baseImage;
      const out = document.createElement("canvas");
      const octx = out.getContext("2d")!;
      out.width = img.width;
      out.height = img.height;
      octx.save();
      octx.translate(out.width / 2, out.height / 2);
      octx.scale(this.flip.x, this.flip.y);
      octx.rotate((this.rotation * Math.PI) / 180);
      octx.filter = this.filterString;
      octx.drawImage(img, -img.width / 2, -img.height / 2);
      octx.restore();
      const url = out.toDataURL(
        this.exportFormat,
        this.exportFormat === "image/jpeg" ? this.exportQuality : undefined
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `media-editor.${
        this.exportFormat === "image/png" ? "png" : "jpg"
      }`;
      a.click();
    },
    openExport() {
      this.tool = "export";
    },
    zoomIn() {
      this.scale = Math.min(10, this.scale * 1.2);
    },
    zoomOut() {
      this.scale = Math.max(0.1, this.scale / 1.2);
    },
    rotateBy(deg: number) {
      this.rotation = (this.rotation + deg) % 360;
    },
    flipH() {
      this.flip.x *= -1;
    },
    flipV() {
      this.flip.y *= -1;
    },
    // Crop actions
    startCrop() {
      this.tool = "crop";
      this.isCropping = true;
      this.cropSelection = null;
    },
    setCropSelection(
      selection: { x: number; y: number; width: number; height: number } | null
    ) {
      this.cropSelection = selection;
    },
    applyCrop() {
      if (!this.baseImage || !this.cropSelection) return;
      const sel = this.cropSelection;
      const img = this.baseImage;
      const w = Math.max(1, Math.round(sel.width));
      const h = Math.max(1, Math.round(sel.height));
      const out = document.createElement("canvas");
      out.width = w;
      out.height = h;
      const octx = out.getContext("2d")!;
      octx.imageSmoothingQuality = "high";
      octx.filter = this.filterString;
      octx.drawImage(img, sel.x, sel.y, sel.width, sel.height, 0, 0, w, h);
      const newImg = new Image();
      newImg.onload = () => {
        this.baseImage = newImg;
        this.scale = 1;
        this.offset = { x: 0, y: 0 };
        this.cropSelection = null;
        this.isCropping = false;
        this.tool = "adjust";
      };
      newImg.src = out.toDataURL("image/png");
    },
    cancelCrop() {
      this.cropSelection = null;
      this.isCropping = false;
      this.tool = "adjust";
    },
  },
});

