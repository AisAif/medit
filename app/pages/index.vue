<template>
  <div class="min-h-dvh grid grid-cols-[72px_1fr_320px] grid-rows-[auto_1fr]">
    <!-- Top Bar -->
    <header
      class="col-span-3 flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-sky-50 via-fuchsia-50 to-pink-50"
    >
      <div class="flex items-center gap-3">
        <div
          class="size-8 rounded-xl bg-sky-500/90 shadow-md grid place-items-center text-white font-bold"
        >
          ME
        </div>
        <div>
          <h1 class="text-base font-semibold leading-tight">Media Editor</h1>
          <p class="text-xs text-muted-foreground">
            Playful & Modern Minimalist
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <AppButton
          variant="outline"
          @click="store.onReset"
          :disabled="!imageLoaded"
          >Reset</AppButton
        >
        <AppButton
          variant="primary"
          @click="store.openExport"
          :disabled="!imageLoaded"
          >Export</AppButton
        >
      </div>
    </header>

    <!-- Left Toolbar -->
    <EditorToolbar
      :tool="tool"
      :imageLoaded="imageLoaded"
      @update:tool="(t: 'upload' | 'adjust' | 'filter' | 'resize' | 'crop' | 'export') => store.setTool(t)"
      @rotate="() => store.rotateBy(90)"
      @flipH="store.flipH"
      @flipV="store.flipV"
      @zoomIn="store.zoomIn"
      @zoomOut="store.zoomOut"
    />

    <!-- Canvas Area -->
    <main class="relative bg-muted grid place-items-center overflow-hidden">
      <div class="w-full h-full flex items-center justify-center p-4">
        <div
          class="relative w-full h-full rounded-xl border bg-card shadow-sm overflow-hidden"
        >
          <!-- Canvas Wrapper for panning -->
          <div
            class="absolute inset-0"
            ref="canvasContainer"
            @dragover.prevent
            @drop.prevent="store.onDrop"
            @mousedown="onPointerDown"
            @mousemove="onPointerMove"
            @mouseup="onPointerUp"
            @mouseleave="onPointerUp"
            @wheel.prevent="onWheel"
            :class="{
              'cursor-grab': imageLoaded && !isPanning && tool !== 'crop',
              'cursor-grabbing': isPanning,
              'cursor-crosshair': imageLoaded && tool === 'crop',
            }"
          >
            <canvas
              ref="canvasRef"
              class="block w-full h-full bg-checker"
            ></canvas>
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
                @change="store.onFileChange"
              />
              <div
                class="mx-auto size-12 rounded-xl bg-sky-500/90 grid place-items-center text-white shadow-md mb-3"
              >
                <Upload class="size-6" />
              </div>
              <p class="font-medium">
                Drag & drop image here or click to upload
              </p>
              <p class="text-xs text-muted-foreground mt-1">
                JPG, PNG, WEBP • Up to 10MB
              </p>
            </label>
          </div>
        </div>
      </div>
    </main>

    <!-- Right Panel -->
    <RightPanel :tool="tool" :imageLoaded="imageLoaded">
      <template #upload>
        <UploadPanel />
      </template>

      <template #resize>
        <ResizePanel />
      </template>
      <template #adjust>
        <AdjustPanel />
      </template>
      <template #crop>
        <CropPanel
          :cropSelection="store.cropSelection"
          @apply="store.applyCrop"
          @cancel="store.cancelCrop"
        />
      </template>
      <template #filter>
        <FilterPanel />
      </template>
      <template #export>
        <ExportPanel />
      </template>
    </RightPanel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from "vue";
import EditorToolbar from "@/components/editor/EditorToolbar.vue";
import RightPanel from "@/components/editor/RightPanel.vue";
import ResizePanel from "@/components/editor/panels/ResizePanel.vue";
import AdjustPanel from "@/components/editor/panels/AdjustPanel.vue";
import ExportPanel from "@/components/editor/panels/ExportPanel.vue";
import FilterPanel from "@/components/editor/panels/FilterPanel.vue";
import UploadPanel from "@/components/editor/panels/UploadPanel.vue";
import CropPanel from "@/components/editor/panels/CropPanel.vue";

import AppButton from "@/components/ui/AppButton/AppButton.vue";
import { useEditorStore } from "@/stores/editor";
import { useCanvas } from "@/composables/useCanvas";
import { storeToRefs } from "pinia";
import { Upload } from "lucide-vue-next";

const store = useEditorStore();
const { tool, baseImage, imageLoaded, scale, offset, rotation, flip } =
  storeToRefs(store);
const filterString = computed(() => store.filterString);

const { canvasRef, canvasContainer, ctx, draw, getCanvasSize } = useCanvas(
  baseImage,
  filterString,
  scale,
  offset,
  rotation,
  flip,
  computed(() => store.cropSelection)
);

// toolbar now uses EditorToolbar component

// Panning and cropping
const isPanning = ref(false);
let panStart = { x: 0, y: 0 };
let offsetStart = { x: 0, y: 0 };
let moveStart = { x: 0, y: 0 };
let rectStart = { startX: 0, startY: 0, endX: 0, endY: 0 };
let isSelectingCrop = ref(false);

function onPointerDown(e: MouseEvent) {
  if (!imageLoaded.value) return;
  const rect = canvasContainer.value!.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (tool.value === "crop") {
    // Start crop selection
    isSelectingCrop.value = true;
    const imageCoords = screenToImageCoordinates(e.clientX, e.clientY);
    if (imageCoords) {
      rectStart.startX = imageCoords.x;
      rectStart.startY = imageCoords.y;
      rectStart.endX = imageCoords.x;
      rectStart.endY = imageCoords.y;
      store.setCropSelection(null);
    }
  } else {
    // Handle panning
    isPanning.value = true;
    panStart = { x, y };
    offsetStart = { ...offset.value };
  }
}

function onPointerMove(e: MouseEvent) {
  if (!imageLoaded.value) return;
  const rect = canvasContainer.value!.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (tool.value === "crop" && isSelectingCrop.value) {
    // Update crop selection rectangle
    const imageCoords = screenToImageCoordinates(e.clientX, e.clientY);
    if (imageCoords && baseImage.value) {
      rectStart.endX = imageCoords.x;
      rectStart.endY = imageCoords.y;

      const x = Math.min(rectStart.startX, rectStart.endX);
      const y = Math.min(rectStart.startY, rectStart.endY);
      const width = Math.abs(rectStart.endX - rectStart.startX);
      const height = Math.abs(rectStart.endY - rectStart.startY);

      // Ensure selection is within image bounds
      const boundedX = Math.max(0, Math.min(x, baseImage.value.width - width));
      const boundedY = Math.max(
        0,
        Math.min(y, baseImage.value.height - height)
      );
      const boundedWidth = Math.min(width, baseImage.value.width - boundedX);
      const boundedHeight = Math.min(height, baseImage.value.height - boundedY);

      store.setCropSelection({
        x: boundedX,
        y: boundedY,
        width: Math.max(0, boundedWidth),
        height: Math.max(0, boundedHeight),
      });
    }
  } else if (isPanning.value) {
    offset.value = {
      x: offsetStart.x + (x - panStart.x),
      y: offsetStart.y + (y - panStart.y),
    };
  }
}

function onPointerUp() {
  if (tool.value === "crop") {
    isSelectingCrop.value = false;
  } else {
    isPanning.value = false;
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

function onWheel(e: WheelEvent) {
  if (!imageLoaded.value) return;
  const delta = -e.deltaY;
  const factor = delta > 0 ? 1.1 : 0.9;
  const rect = canvasContainer.value!.getBoundingClientRect();
  const cx = e.clientX - rect.left - rect.width / 2 - offset.value.x;
  const cy = e.clientY - rect.top - rect.height / 2 - offset.value.y;
  // zoom towards cursor
  offset.value = {
    x: offset.value.x - cx * (factor - 1),
    y: offset.value.y - cy * (factor - 1),
  };
  scale.value = Math.min(10, Math.max(0.1, scale.value * factor));
}

// Keyboard shortcuts
function onKeyDown(e: KeyboardEvent) {
  // Keyboard shortcuts can be added here for other tools
}

// Initialize component
onMounted(() => {
  const resizeObserver = new ResizeObserver(() => draw());
  if (canvasContainer.value) resizeObserver.observe(canvasContainer.value);

  // Add keyboard event listener
  window.addEventListener("keydown", onKeyDown);
});

// Cleanup component
onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
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

