<template>
  <section class="p-4 border-l bg-card">
    <slot name="upload" v-if="tool === 'upload'"></slot>

    <slot name="resize" v-else-if="tool === 'resize' && imageLoaded"></slot>

    <slot name="adjust" v-else-if="tool === 'adjust' && imageLoaded"></slot>
    <slot name="filter" v-else-if="tool === 'filter' && imageLoaded"></slot>
    <slot name="export" v-else-if="tool === 'export' && imageLoaded"></slot>
    <div v-else class="text-sm text-muted-foreground">
      Pilih alat di toolbar.
    </div>
  </section>
</template>
<script setup lang="ts">
const props = defineProps<{
  imageLoaded: boolean;
  tool: "upload" | "adjust" | "filter" | "resize" | "export";
}>();
</script>

