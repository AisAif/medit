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
    "inline-flex items-center justify-center md:rounded-xl rounded-lg md:text-sm text-[10px] transition-colors",
    props.size === "sm" ? "md:h-8 h-6 md:px-3 px-2" : "md:h-9 h-7 md:px-3 px-2",
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

