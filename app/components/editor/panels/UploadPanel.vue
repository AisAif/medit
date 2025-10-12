<template>
  <div class="space-y-3">
    <h2 class="font-semibold mb-3">Upload Gambar</h2>
    <input
      type="file"
      accept="image/*"
      @change="store.onFileChange"
      class="block w-full text-sm"
    />
  </div>
</template>
<script setup lang="ts">
import { useEditorStore } from "@/stores/editor";

const store = useEditorStore();
</script>
