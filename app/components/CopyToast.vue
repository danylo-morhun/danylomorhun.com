<script setup lang="ts">
defineProps<{ show: boolean, message: string }>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-[opacity,translate,scale] spring-snappy"
      enter-from-class="opacity-0 motion-safe:translate-y-2 motion-safe:scale-[0.97]"
      leave-active-class="transition-[opacity,translate,scale] duration-150 ease-out-strong"
      leave-to-class="opacity-0 motion-safe:translate-y-2 motion-safe:scale-[0.97]"
    >
      <div
        v-if="show"
        role="status"
        class="fixed inset-x-0 bottom-6 z-50 flex origin-bottom justify-center px-6"
      >
        <span class="rounded-lg border border-line bg-surface px-4 py-2 text-sm text-ink shadow-lg">
          {{ message }}
        </span>
      </div>
    </Transition>
  </Teleport>
</template>
