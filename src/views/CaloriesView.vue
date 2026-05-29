<template>
  <section class="page page--narrow">
    <p class="eyebrow">Module placeholder</p>
    <h1>Calories</h1>
    <p class="lede">
      Start simple with manual entries and daily totals. We can expand into meals, macros, and
      trends later.
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
