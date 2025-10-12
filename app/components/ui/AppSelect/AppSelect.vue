<template>
  <select
    :value="modelValue as any"
    @change="onChange"
    v-bind="$attrs"
    :class="classes"
  >
    <slot />
  </select>
</template>
<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ size?: "sm" | "md"; modelValue?: string }>(),
  { size: "md" }
);
const emit = defineEmits<{ (e: "update:modelValue", v: string): void }>();

const classes = computed(() => [
  "rounded-xl border bg-card text-sm",
  props.size === "sm" ? "h-8 px-3" : "h-9 px-3",
  "w-full",
]);

function onChange(e: Event) {
  const el = e.target as HTMLSelectElement;
  emit("update:modelValue", el.value);
}
</script>

