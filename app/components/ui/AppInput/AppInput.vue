<template>
  <input
    :value="modelValue as any"
    @input="onInput"
    v-bind="$attrs"
    :class="classes"
  />
</template>
<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ size?: "sm" | "md"; modelValue?: string | number }>(),
  { size: "md" }
);
const emit = defineEmits<{
  (e: "update:modelValue", v: string | number): void;
}>();

const classes = computed(() => [
  "rounded-xl border bg-card text-sm",
  props.size === "sm" ? "h-8 px-3" : "h-9 px-3",
  "w-full",
]);

function onInput(e: Event) {
  const el = e.target as HTMLInputElement;
  const isNumber = el.type === "number";
  emit("update:modelValue", isNumber ? Number(el.value) : el.value);
}
</script>

