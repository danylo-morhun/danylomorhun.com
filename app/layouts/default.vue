<template>
  <div id="top" class="min-h-dvh bg-bg text-ink">
    <AppLoader />
    <NavBar />
    <main>
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
