<template>
  <button :title="title" :class="classes" :disabled="disabled" @click="onClick">
    <slot />
  </button>
</template>
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  active?: boolean;
  disabled?: boolean;
  title?: string;
}>();
const emit = defineEmits<{ (e: "click", ev: MouseEvent): void }>();

const classes = computed(() => ({
  "m-1 md:min-h-12 md:min-w-12 min-h-8 min-w-8 md:rounded-xl rounded-lg grid place-items-center border shadow-sm text-muted-foreground transition-colors":
    true,
  "hover:bg-secondary/40": !props.disabled,
  "bg-sky-100 text-sky-700 border-sky-300": !!props.active,
  "opacity-50 pointer-events-none": !!props.disabled,
}));

function onClick(e: MouseEvent) {
  if (!props.disabled) emit("click", e);
}
</script>

