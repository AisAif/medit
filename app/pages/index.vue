<template>
  <div
    class="min-h-dvh max-h-dvh grid lg:grid-cols-[72px_1fr_320px] lg:grid-rows-[auto_1fr] md:grid-rows-[auto_80px_1fr_200px] grid-rows-[auto_48px_1fr_200px]"
  >
    <!-- Top Bar -->
    <header
      class="lg:col-span-3 flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-sky-50 via-fuchsia-50 to-pink-50"
    >
      <div class="flex items-center gap-3">
        <img
          src="/logo.png"
          class="md:size-8 size-6 rounded-xl shadow-md grid place-items-center text-white font-bold"
        />
        <div>
          <h1 class="md:text-base text-xs font-semibold leading-tight">
            Media Editor
          </h1>
          <p class="hidden md:block text-xs text-muted-foreground">
            Your creative playground, powered by MEDIT.
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
      @update:tool="(t: Tool) => store.setTool(t)"
      @rotate="() => store.rotateBy(90)"
      @flipH="store.flipH"
      @flipV="store.flipV"
      @zoomIn="store.zoomIn"
      @zoomOut="store.zoomOut"
    />

    <!-- Canvas Area -->
    <main class="relative bg-muted grid place-items-center overflow-hidden">
      <div class="w-full h-full flex items-center justify-center md:p-4">
        <CanvasEditor :store="store" />
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
import { onMounted, onUnmounted } from "vue";
import EditorToolbar from "@/components/editor/EditorToolbar.vue";
import RightPanel from "@/components/editor/RightPanel.vue";
import ResizePanel from "@/components/editor/panels/ResizePanel.vue";
import AdjustPanel from "@/components/editor/panels/AdjustPanel.vue";
import ExportPanel from "@/components/editor/panels/ExportPanel.vue";
import FilterPanel from "@/components/editor/panels/FilterPanel.vue";
import UploadPanel from "@/components/editor/panels/UploadPanel.vue";
import CropPanel from "@/components/editor/panels/CropPanel.vue";
import CanvasEditor from "@/components/editor/CanvasEditor.vue";

import AppButton from "@/components/ui/AppButton/AppButton.vue";
import { useEditorStore, type Tool } from "@/stores/editor";
import { storeToRefs } from "pinia";

// Store
const store = useEditorStore();
const { tool, imageLoaded } = storeToRefs(store);

// Keyboard shortcuts
function onKeyDown(e: KeyboardEvent) {
  // Keyboard shortcuts can be added here for other tools
}

// Lifecycle
onMounted(() => {
  // Add keyboard event listener
  window.addEventListener("keydown", onKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
});
</script>

