<template>
  <div class="space-y-4">
    <div>
      <h3 class="text-sm font-medium mb-2">Crop Tool</h3>
      <p class="text-xs text-muted-foreground">
        Drag to select the area you want to crop. Click "Apply" to crop the
        image.
      </p>
    </div>

    <div v-if="cropSelection" class="space-y-2">
      <div class="grid grid-cols-2 gap-2">
        <div class="text-xs">
          <div class="text-muted-foreground">Width</div>
          <div class="font-mono">{{ cropSelection.width }}px</div>
        </div>
        <div class="text-xs">
          <div class="text-muted-foreground">Height</div>
          <div class="font-mono">{{ cropSelection.height }}px</div>
        </div>
      </div>

      <div class="flex gap-2">
        <AppButton
          variant="primary"
          size="sm"
          @click="$emit('apply')"
          :disabled="
            !cropSelection ||
            cropSelection.width === 0 ||
            cropSelection.height === 0
          "
        >
          Apply Crop
        </AppButton>
        <AppButton variant="outline" size="sm" @click="$emit('cancel')">
          Cancel
        </AppButton>
      </div>
    </div>
    <div v-else class="text-xs text-muted-foreground">
      Click and drag on the image to create a crop selection.
    </div>
  </div>
</template>

<script setup lang="ts">
import AppButton from "@/components/ui/AppButton/AppButton.vue";

interface Props {
  cropSelection: { x: number; y: number; width: number; height: number } | null;
}

defineProps<Props>();

const emit = defineEmits<{
  apply: [];
  cancel: [];
}>();
</script>
