<template>
  <section class="page page--narrow">
    <p class="eyebrow">Module placeholder</p>
    <h1>Water Intake</h1>
    <p class="lede">
      A good first version here is fast logging, today’s total, and a lightweight history view.
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
