<template>
  <div class="space-y-3">
    <h2 class="font-semibold">Export</h2>
    <div>
      <label class="text-xs text-muted-foreground">Format</label>
      <AppSelect v-model="store.exportFormat">
        <option value="image/png">PNG</option>
        <option value="image/jpeg">JPG</option>
      </AppSelect>
    </div>
    <div>
      <label class="text-xs text-muted-foreground">Quality</label>
      <input
        type="range"
        min="0.1"
        max="1"
        step="0.1"
        v-model.number="store.exportQuality"
        class="w-full"
      />
      <div class="text-xs text-muted-foreground">
        {{ Math.round(store.exportQuality * 100) }}%
      </div>
    </div>
    <AppButton variant="outline" @click="store.download">Download</AppButton>
  </div>
</template>
<script setup lang="ts">
import AppSelect from "@/components/ui/AppSelect";
import AppButton from "@/components/ui/AppButton";
import { useEditorStore } from "@/stores/editor";

const store = useEditorStore();
</script>

