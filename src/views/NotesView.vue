<template>
  <section class="page page--narrow">
    <p class="eyebrow">Module placeholder</p>
    <h1>Notes</h1>
    <p class="lede">
      This route is ready for your first real feature. We can turn it into a full notes CRUD flow
      with Supabase whenever you want.
    </p>
  </section>
</template>

<style scoped lang="scss">
.page {
  display: grid;
  gap: 16px;
}

.page--narrow {
  max-width: 760px;
}

h1 {
  margin: 0;
  font-family: $font-heading;
  font-size: clamp(2.2rem, 4vw, 3.8rem);
  letter-spacing: -0.03em;
}
</style>
