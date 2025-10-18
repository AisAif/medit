<template>
  <div
    class="relative w-full h-full md:rounded-xl border bg-card shadow-sm overflow-hidden"
  >
    <!-- Canvas Wrapper for interactions -->
    <div
      class="absolute inset-0"
      ref="canvasContainer"
      @dragover.prevent
      @drop.prevent="onDrop"
      @mousedown="pointerInteractions.onPointerDown"
      @mousemove="pointerInteractions.onPointerMove"
      @mouseup="pointerInteractions.onPointerUp"
      @mouseleave="pointerInteractions.onPointerUp"
      @wheel.prevent="pointerInteractions.onWheel"
      @touchstart="touchCanvas.handleTouchStart"
      @touchmove="touchCanvas.handleTouchMove"
      @touchend="touchCanvas.handleTouchEnd"
      :class="{
        'cursor-grab':
          imageLoaded &&
          !pointerInteractions.isPanning &&
          tool !== 'crop' &&
          !touchCanvas.isTouchDevice,
        'cursor-grabbing':
          pointerInteractions.isPanning && !touchCanvas.isTouchDevice,
        'cursor-crosshair':
          imageLoaded && tool === 'crop' && !touchCanvas.isTouchDevice,
        'touch-none': touchCanvas.isTouchDevice,
      }"
    >
      <canvas ref="canvasRef" class="block w-full h-full bg-checker"></canvas>
    </div>

    <!-- Empty state -->
    <div
      v-if="!imageLoaded"
      class="absolute inset-0 grid place-items-center p-8"
    >
      <label
        class="border-2 border-dashed border-sky-300/80 rounded-2xl p-8 text-center bg-white/70 hover:bg-white transition-colors cursor-pointer"
      >
        <input
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        />
        <div
          class="mx-auto size-12 rounded-xl bg-sky-500/90 grid place-items-center text-white shadow-md mb-3"
        >
          <Upload class="size-6" />
        </div>
        <p class="font-medium">Drag & drop image here or click to upload</p>
        <p class="text-xs text-muted-foreground mt-1">
          JPG, PNG, WEBP • Up to 10MB
        </p>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, toRefs } from "vue";
import { Upload } from "lucide-vue-next";
import { useCanvas } from "@/composables/useCanvas";
import { useTouchCanvas } from "@/composables/useTouchCanvas";
import { usePointerInteractions } from "@/composables/usePointerInteractions";
import { useEditorStore } from "@/stores/editor";
import { storeToRefs } from "pinia";

// Props
interface Props {
  store: ReturnType<typeof useEditorStore>;
}

const props = defineProps<Props>();

// Get store instance and extract refs
const store = props.store;
const {
  baseImage,
  imageLoaded,
  scale,
  offset,
  rotation,
  flip,
  tool,
  filterString,
  cropSelection,
} = storeToRefs(store);

// Emits
const emit = defineEmits<{
  "file-change": [event: Event];
  drop: [event: DragEvent];
  "crop-selection": [
    selection: { x: number; y: number; width: number; height: number }
  ];
  "crop-clear": [];
}>();

// Canvas composable
const { canvasRef, canvasContainer, ctx, draw, getCanvasSize } =
  useCanvas(store);

// Pointer interactions composable
const pointerInteractions = usePointerInteractions(canvasContainer, store);

// Touch support composable
const touchCanvas = useTouchCanvas(
  pointerInteractions.onPointerDown,
  pointerInteractions.onPointerMove,
  pointerInteractions.onPointerUp,
  pointerInteractions.onWheel
);

// Event handlers
function onFileChange(e: Event) {
  store.onFileChange(e);
}

function onDrop(e: DragEvent) {
  store.onDrop(e);
}

// Lifecycle
onMounted(() => {
  const resizeObserver = new ResizeObserver(() => draw());
  if (canvasContainer.value) resizeObserver.observe(canvasContainer.value);
});

onUnmounted(() => {
  // Cleanup if needed
});
</script>

<style scoped>
.bg-checker {
  background-image: linear-gradient(45deg, #f3f4f6 25%, transparent 25%),
    linear-gradient(-45deg, #f3f4f6 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f3f4f6 75%),
    linear-gradient(-45deg, transparent 75%, #f3f4f6 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
</style>
