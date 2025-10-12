<template>
  <div class="space-y-3">
    <h2 class="font-semibold">Resize</h2>
    <div class="grid grid-cols-2 gap-2">
      <div>
        <label class="text-xs text-muted-foreground">Width</label>
        <AppInput
          type="number"
          v-model.number="store.resizeW"
          @input="store.onResizeInput('w')"
        />
      </div>
      <div>
        <label class="text-xs text-muted-foreground">Height</label>
        <AppInput
          type="number"
          v-model.number="store.resizeH"
          @input="store.onResizeInput('h')"
        />
      </div>
    </div>
    <label class="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="store.keepAspect" /> Keep ratio
    </label>
    <AppButton variant="outline" @click="store.applyResize">Apply</AppButton>
  </div>
</template>
<script setup lang="ts">
import AppInput from "@/components/ui/AppInput";
import AppButton from "@/components/ui/AppButton";
import { useEditorStore } from "@/stores/editor";

const store = useEditorStore();
</script>

