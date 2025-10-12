<template>
  <div class="space-y-3">
    <h2 class="font-semibold">Adjustments</h2>
    <AppRange
      label="Brightness"
      v-model="store.filters.brightness"
      :min="0"
      :max="200"
      :step="1"
    />
    <AppRange
      label="Contrast"
      v-model="store.filters.contrast"
      :min="0"
      :max="200"
      :step="1"
    />
    <AppRange
      label="Saturation"
      v-model="store.filters.saturate"
      :min="0"
      :max="200"
      :step="1"
    />
    <AppRange
      label="Blur"
      v-model="store.filters.blur"
      :min="0"
      :max="20"
      :step="0.5"
    />
    <AppRange
      label="Grayscale"
      v-model="store.filters.grayscale"
      :min="0"
      :max="100"
      :step="1"
    />
    <AppRange
      label="Sepia"
      v-model="store.filters.sepia"
      :min="0"
      :max="100"
      :step="1"
    />
    <AppRange
      label="Invert"
      v-model="store.filters.invert"
      :min="0"
      :max="100"
      :step="1"
    />
    <div class="flex gap-2 pt-2">
      <AppButton variant="outline" @click="store.resetFilters">Reset</AppButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import AppButton from "@/components/ui/AppButton";
import AppRange from "@/components/ui/AppRange";
import { useEditorStore } from "@/stores/editor";

const store = useEditorStore();
</script>

