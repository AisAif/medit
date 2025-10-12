<template>
  <button :class="classes" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "default" | "primary" | "outline";
  size?: "sm" | "md";
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  size: "md",
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const classes = computed(() => {
  return [
    "inline-flex items-center justify-center rounded-xl text-sm transition-colors",
    props.size === "sm" ? "h-8 px-3" : "h-9 px-3",
    props.variant === "primary"
      ? "bg-primary text-primary-foreground shadow-sm"
      : "",
    props.variant === "outline" ? "border bg-card shadow-sm" : "",
    props.variant === "default" ? "border bg-card shadow-sm" : "",
    props.disabled ? "opacity-50 pointer-events-none" : "hover:bg-secondary/40",
  ];
});

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit("click", event);
  }
}
</script>

