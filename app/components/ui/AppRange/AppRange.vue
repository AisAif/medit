<template>
  <div class="space-y-1">
    <div class="flex justify-between text-xs"><span class="text-muted-foreground">{{ label }}</span><span>{{ displayValue }}</span></div>
    <input type="range" :min="min" :max="max" :step="step" :value="modelValue" class="w-full" @input="onInput" />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ label?: string; modelValue: number; min?: number; max?: number; step?: number; suffix?: string }>(), { min:0, max:100, step:1, label:'', suffix:'' })
const emit = defineEmits<{ (e:'update:modelValue', v:number): void }>()

const displayValue = computed(() => props.suffix ? `${Math.round(props.modelValue)}${props.suffix}` : Math.round(props.modelValue))
function onInput(e: Event){ emit('update:modelValue', Number((e.target as HTMLInputElement).value)) }
</script>
