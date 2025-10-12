<template>
  <aside class="row-span-2 pt-4 border-r bg-card">
    <div class="flex flex-col items-center gap-2">
      <IconButton
        :active="tool === 'upload'"
        :disabled="false"
        title="Upload"
        @click="$emit('update:tool', 'upload')"
      >
        <Upload class="size-5" />
      </IconButton>

      <IconButton
        :active="tool === 'adjust'"
        :disabled="!imageLoaded"
        title="Adjust"
        @click="$emit('update:tool', 'adjust')"
      >
        <SlidersHorizontal class="size-5" />
      </IconButton>
      <IconButton
        :active="tool === 'filter'"
        :disabled="!imageLoaded"
        title="Filters"
        @click="$emit('update:tool', 'filter')"
      >
        <Wand2 class="size-5" />
      </IconButton>
      <div class="h-px w-8 bg-border my-1"></div>
      <IconButton
        :disabled="!imageLoaded"
        title="Rotate 90°"
        @click="$emit('rotate')"
      >
        <RotateCw class="size-5" />
      </IconButton>
      <IconButton
        :disabled="!imageLoaded"
        title="Flip H"
        @click="$emit('flipH')"
      >
        <FlipHorizontal class="size-5" />
      </IconButton>
      <IconButton
        :disabled="!imageLoaded"
        title="Flip V"
        @click="$emit('flipV')"
      >
        <FlipVertical class="size-5" />
      </IconButton>
      <IconButton
        :active="tool === 'crop'"
        :disabled="!imageLoaded"
        title="Crop"
        @click="$emit('update:tool', 'crop')"
      >
        <Scissors class="size-5" />
      </IconButton>
      <IconButton
        :active="tool === 'resize'"
        :disabled="!imageLoaded"
        title="Resize"
        @click="$emit('update:tool', 'resize')"
      >
        <ImageUp class="size-5" />
      </IconButton>
      <div class="h-px w-8 bg-border my-1"></div>
      <IconButton
        :disabled="!imageLoaded"
        title="Zoom In"
        @click="$emit('zoomIn')"
      >
        <ZoomIn class="size-5" />
      </IconButton>
      <IconButton
        :disabled="!imageLoaded"
        title="Zoom Out"
        @click="$emit('zoomOut')"
      >
        <ZoomOut class="size-5" />
      </IconButton>
    </div>
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
import { useEditorStore } from "@/stores/editor";

const store = useEditorStore();
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

