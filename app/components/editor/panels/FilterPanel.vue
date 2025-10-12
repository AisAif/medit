<template>
  <div class="space-y-3">
    <h2 class="font-semibold">Preset Cepat</h2>
    <div class="grid grid-cols-2 gap-2">
      <AppButton variant="outline" @click="store.applyPreset('warm')"
        >Warm</AppButton
      >
      <AppButton variant="outline" @click="store.applyPreset('cold')"
        >Cold</AppButton
      >
      <AppButton variant="outline" @click="store.applyPreset('vintage')"
        >Vintage</AppButton
      >
      <AppButton variant="outline" @click="store.applyPreset('bw')"
        >B&W</AppButton
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import AppButton from "@/components/ui/AppButton";
import { useEditorStore } from "@/stores/editor";

const store = useEditorStore();
</script>
