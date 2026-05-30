<script setup lang="ts">
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {
    faBolt,
    faDrumstickBite,
    faSeedling,
    faWater,
  } from '@fortawesome/free-solid-svg-icons';

  const props = defineProps<{
    foodsCount: number;
    mealsTodayCount: number;
    todayCalories: number;
    todayProtein: number;
    todayCarbs: number;
    todayFats: number;
  }>();
</script>

<template>
  <header class="calories-hero">
    <div class="calories-hero__copy">
      <p class="calories-hero__eyebrow">Fuel tracking</p>
      <h1 class="calories-hero__title">Calories</h1>
      <p class="calories-hero__lede">
        Build your own food library, select what you ate, and see calories plus
        macros in one calm place.
      </p>

      <div class="calories-hero__chips">
        <span class="calories-hero__chip"
          >{{ props.foodsCount }} saved foods</span
        >
        <span class="calories-hero__chip"
          >{{ props.mealsTodayCount }} meals today</span
        >
        <span class="calories-hero__chip"
          >{{ props.todayCalories }} kcal today</span
        >
      </div>
    </div>

    <div class="calories-summary">
      <div class="calories-summary__primary">
        <p class="calories-summary__eyebrow">
          <FontAwesomeIcon class="calories-summary__icon" :icon="faBolt" />
          Today total
        </p>
        <div class="calories-summary__figure">
          <strong class="calories-summary__calories">{{
            props.todayCalories
          }}</strong>
          <span class="calories-summary__unit">kcal</span>
        </div>
      </div>

      <div class="calories-summary__macro-grid">
        <div class="calories-summary__macro-card">
          <span class="calories-summary__macro-label">
            <FontAwesomeIcon
              class="calories-summary__icon"
              :icon="faDrumstickBite"
            />
            Protein
          </span>
          <div class="calories-summary__macro-figure">
            <strong class="calories-summary__macro-value">{{
              props.todayProtein
            }}</strong>
            <span class="calories-summary__macro-unit">g</span>
          </div>
        </div>

        <div class="calories-summary__macro-card">
          <span class="calories-summary__macro-label">
            <FontAwesomeIcon
              class="calories-summary__icon"
              :icon="faSeedling"
            />
            Carbs
          </span>
          <div class="calories-summary__macro-figure">
            <strong class="calories-summary__macro-value">{{
              props.todayCarbs
            }}</strong>
            <span class="calories-summary__macro-unit">g</span>
          </div>
        </div>

        <div class="calories-summary__macro-card">
          <span class="calories-summary__macro-label">
            <FontAwesomeIcon class="calories-summary__icon" :icon="faWater" />
            Fats
          </span>
          <div class="calories-summary__macro-figure">
            <strong class="calories-summary__macro-value">{{
              props.todayFats
            }}</strong>
            <span class="calories-summary__macro-unit">g</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
  .calories-hero,
  .calories-summary__macro-card {
    border: 1px solid $color-line;
    border-radius: $radius-md;
    background: $color-panel-strong;
  }

  .calories-hero {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(300px, 0.95fr);
    gap: 30px;
    padding: 28px;

    @include down('lg') {
      grid-template-columns: 1fr;
    }
  }

  .calories-hero__eyebrow,
  .calories-summary__eyebrow {
    margin: 0 0 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.78rem;
    color: $color-accent;
  }

  .calories-hero__title {
    margin: 0;
    font-family: $font-heading;
    letter-spacing: -0.03em;
    font-size: clamp(2.4rem, 5vw, 4.6rem);
    line-height: 0.95;
  }

  .calories-hero__lede {
    color: $color-muted;
  }

  .calories-hero__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 40px;
  }

  .calories-hero__chip {
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(195, 123, 48, 0.12);
    color: #8a5621;
  }

  .calories-summary {
    display: grid;
    gap: 18px;
    align-content: center;
  }

  .calories-summary__primary {
    display: grid;
    gap: 4px;
  }

  .calories-summary__eyebrow,
  .calories-summary__macro-label {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .calories-summary__icon {
    color: #8a5621;
    font-size: 0.9rem;
  }

  .calories-summary__figure,
  .calories-summary__macro-figure {
    display: inline-flex;
    align-items: baseline;
  }

  .calories-summary__calories {
    font-family: $font-heading;
    font-size: clamp(2.4rem, 5vw, 4rem);
    line-height: 0.9;
  }

  .calories-summary__unit {
    color: $color-muted;
    margin-left: 8px;
  }

  .calories-summary__macro-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    @include down('sm') {
      grid-template-columns: 1fr;
    }
  }

  .calories-summary__macro-card {
    padding: 14px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 12px;
    min-height: 115px;
  }

  .calories-summary__macro-label {
    color: $color-muted;
    align-items: flex-start;
    gap: 6px;
    flex-direction: column;
  }

  @include down('lg') {
    .calories-summary__macro-label {
      align-items: center;
      gap: 8px;
      flex-direction: row;
    }
  }

  .calories-summary__macro-value {
    font-family: $font-heading;
    font-size: 1.35rem;
  }

  .calories-summary__macro-unit {
    margin-left: 7px;
    color: $color-muted;
  }

  .calories-summary__macro-figure {
    margin-top: auto;
  }

  @include down('sm') {
    .calories-summary__macro-card {
      min-height: auto;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .calories-summary__macro-label {
      flex: 1 1 auto;
      align-items: center;
      gap: 8px;
      flex-direction: row;
    }

    .calories-summary__macro-figure {
      margin-top: 0;
      margin-left: auto;
    }
  }
</style>
