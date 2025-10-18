<template>
  <aside
    class="lg:row-span-2 lg:pt-4 lg:px-0 md:px-4 px-2 lg:border-r bg-card flex lg:flex-col items-center md:gap-2 gap-1 overflow-x-auto"
  >
    <IconButton
      :active="tool === 'upload'"
      :disabled="false"
      title="Upload"
      @click="$emit('update:tool', 'upload')"
    >
      <Upload class="md:size-5 size-4" />
    </IconButton>

    <IconButton
      :active="tool === 'adjust'"
      :disabled="!imageLoaded"
      title="Adjust"
      @click="$emit('update:tool', 'adjust')"
    >
      <SlidersHorizontal class="md:size-5 size-4" />
    </IconButton>
    <IconButton
      :active="tool === 'filter'"
      :disabled="!imageLoaded"
      title="Filters"
      @click="$emit('update:tool', 'filter')"
    >
      <Wand2 class="md:size-5 size-4" />
    </IconButton>
    <div class="lg:h-px lg:w-8 w-px h-6 bg-border my-1"></div>
    <IconButton
      :disabled="!imageLoaded"
      title="Rotate 90°"
      @click="$emit('rotate')"
    >
      <RotateCw class="md:size-5 size-4" />
    </IconButton>
    <IconButton :disabled="!imageLoaded" title="Flip H" @click="$emit('flipH')">
      <FlipHorizontal class="md:size-5 size-4" />
    </IconButton>
    <IconButton :disabled="!imageLoaded" title="Flip V" @click="$emit('flipV')">
      <FlipVertical class="md:size-5 size-4" />
    </IconButton>
    <IconButton
      :active="tool === 'crop'"
      :disabled="!imageLoaded"
      title="Crop"
      @click="$emit('update:tool', 'crop')"
    >
      <Scissors class="md:size-5 size-4" />
    </IconButton>
    <IconButton
      :active="tool === 'resize'"
      :disabled="!imageLoaded"
      title="Resize"
      @click="$emit('update:tool', 'resize')"
    >
      <ImageUp class="md:size-5 size-4" />
    </IconButton>
    <div class="lg:h-px lg:w-8 w-px h-6 bg-border my-1"></div>
    <IconButton
      :disabled="!imageLoaded"
      title="Zoom In"
      @click="$emit('zoomIn')"
    >
      <ZoomIn class="md:size-5 size-4" />
    </IconButton>
    <IconButton
      :disabled="!imageLoaded"
      title="Zoom Out"
      @click="$emit('zoomOut')"
    >
      <ZoomOut class="md:size-5 size-4" />
    </IconButton>
  </aside>
</template>
<script setup lang="ts">
import IconButton from "@/components/ui/IconButton";
import {
  Upload,
  SlidersHorizontal,
  Wand2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Scissors,
  ZoomIn,
  ZoomOut,
  ImageUp,
} from "lucide-vue-next";

const { imageLoaded, tool } = defineProps<{
  imageLoaded: boolean;
  tool: "upload" | "adjust" | "filter" | "resize" | "crop" | "export";
}>();

const emit = defineEmits<{
  (
    e: "update:tool",
    v: "upload" | "adjust" | "filter" | "resize" | "crop" | "export"
  ): void;
  (e: "rotate"): void;
  (e: "flipH"): void;
  (e: "flipV"): void;
  (e: "zoomIn"): void;
  (e: "zoomOut"): void;
}>();
</script>

