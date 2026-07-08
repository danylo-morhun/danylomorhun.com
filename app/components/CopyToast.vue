<script setup lang="ts">
defineProps<{ show: boolean, message: string }>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="show"
        role="status"
        class="fixed inset-x-0 bottom-6 z-50 flex justify-center px-6"
      >
        <span class="rounded-lg border border-line bg-surface px-4 py-2 text-sm text-ink shadow-lg">
          {{ message }}
        </span>
      </div>
    </Transition>
  </Teleport>
</template>
