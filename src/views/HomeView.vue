<script setup lang="ts">
  import {computed} from 'vue';
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
  import {
    faDrumstickBite,
    faDroplet,
    faNoteSticky,
    faSeedling,
    faThumbtack,
    faUtensils,
    faWater,
    faWaveSquare,
  } from '@fortawesome/free-solid-svg-icons';

  import DashboardModuleCard from '../components/dashboard/DashboardModuleCard.vue';
  import {useCalories} from '../composables/useCalories';
  import {useNotes} from '../composables/useNotes';
  import {useWater} from '../composables/useWater';
  import {useAuth} from '../lib/auth';
  import {hasSupabaseCredentials} from '../lib/supabase';

  function formatClock(timestamp: string) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(timestamp));
  }

  function formatCalendar(timestamp: string) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(timestamp));
  }

  function formatRelativeTime(timestamp: string) {
    const diffMs = new Date(timestamp).getTime() - Date.now();
    const minuteMs = 60_000;
    const hourMs = 60 * minuteMs;
    const dayMs = 24 * hourMs;
    const rtf = new Intl.RelativeTimeFormat('en', {numeric: 'auto'});

    if (Math.abs(diffMs) < hourMs) {
      return rtf.format(Math.round(diffMs / minuteMs), 'minute');
    }

    if (Math.abs(diffMs) < dayMs) {
      return rtf.format(Math.round(diffMs / hourMs), 'hour');
    }

    return rtf.format(Math.round(diffMs / dayMs), 'day');
  }

  function truncate(value: string, maxLength: number) {
    if (value.length <= maxLength) {
      return value;
    }

    return `${value.slice(0, maxLength - 1)}…`;
  }

  const {isAnonymous, isAuthenticated, user} = useAuth();

  const {
    isLoading: isLoadingNotes,
    notes,
    notesCount,
    pinnedNotes,
    queryError: notesError,
  } = useNotes();

  const {
    currentStreak,
    glassesToday,
    goalMl,
    goalProgress,
    isLoading: isLoadingWater,
    logs,
    queryError: waterError,
    remainingToGoal,
    todayTotal,
  } = useWater();

  const {
    entries,
    foods,
    isLoadingEntries,
    isLoadingFoods,
    queryError: caloriesError,
    todayCalories,
    todayCarbs,
    todayEntries,
    todayFats,
    todayProtein,
  } = useCalories();

  const todayLabel = computed(() =>
    new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date()),
  );

  const authStatusText = computed(() => {
    if (!hasSupabaseCredentials) {
      return 'Awaiting env setup';
    }

    return isAuthenticated.value
      ? 'Private data is live'
      : 'Preparing Orbit session';
  });

  const authStatusBody = computed(() => {
    if (!hasSupabaseCredentials) {
      return 'Add your Supabase URL and publishable key to turn the dashboard on.';
    }

    if (!isAuthenticated.value) {
      return 'Orbit is still spinning up the guest session in the background.';
    }

    return isAnonymous.value
      ? 'A guest session is active, so you can keep building and testing real modules right away.'
      : `Signed in as ${user.value?.email ?? 'your account'}, with personal data ready to flow through the app.`;
  });

  const recentNotes = computed(() => {
    return [...notes.value]
      .sort(
        (left, right) =>
          Date.parse(right.updated_at) - Date.parse(left.updated_at),
      )
      .slice(0, 3);
  });

  const latestWaterLog = computed(() => {
    return [...logs.value].sort(
      (left, right) => Date.parse(right.logged_at) - Date.parse(left.logged_at),
    )[0];
  });

  const latestMealEntry = computed(() => {
    return [...entries.value].sort(
      (left, right) => Date.parse(right.logged_at) - Date.parse(left.logged_at),
    )[0];
  });

  const waterProgressPercent = computed(() =>
    Math.round(goalProgress.value * 100),
  );
  const averageCaloriesPerMeal = computed(() =>
    todayEntries.value.length > 0
      ? Math.round(todayCalories.value / todayEntries.value.length)
      : 0,
  );

  const notesHeadline = computed(() => {
    if (notesCount.value === 0) {
      return 'Start with a pinned idea or a quick scratch note.';
    }

    if (pinnedNotes.value.length > 0) {
      return `${pinnedNotes.value.length} pinned note${pinnedNotes.value.length === 1 ? '' : 's'} keeping key things visible.`;
    }

    return 'Your note space is warming up nicely.';
  });

  const waterHeadline = computed(() => {
    if (todayTotal.value === 0) {
      return 'Nothing poured yet today.';
    }

    if (remainingToGoal.value === 0) {
      return 'Hydration goal reached for today.';
    }

    return `${remainingToGoal.value} ml left to hit your daily goal.`;
  });

  const caloriesHeadline = computed(() => {
    if (todayEntries.value.length === 0) {
      return 'No meals logged yet today.';
    }

    return `${todayEntries.value.length} meal${todayEntries.value.length === 1 ? '' : 's'} logged today, averaging ${averageCaloriesPerMeal.value} kcal each.`;
  });

  const activityItems = computed(() => {
    return [
      latestMealEntry.value
        ? {
            id: 'meal',
            label: 'Latest meal',
            title: latestMealEntry.value.food?.name ?? 'Food entry',
            meta: `${formatClock(latestMealEntry.value.logged_at)} · ${latestMealEntry.value.meal_type}`,
          }
        : {
            id: 'meal-empty',
            label: 'Latest meal',
            title: 'No calorie entries yet',
            meta: 'Add the first meal from Calories.',
          },
      latestWaterLog.value
        ? {
            id: 'water',
            label: 'Latest pour',
            title: `${latestWaterLog.value.amount_ml} ml added`,
            meta: `${formatClock(latestWaterLog.value.logged_at)} · ${formatCalendar(latestWaterLog.value.logged_at)}`,
          }
        : {
            id: 'water-empty',
            label: 'Latest pour',
            title: 'No water logged yet',
            meta: 'A quick 250 ml pour would start the day.',
          },
      recentNotes.value[0]
        ? {
            id: 'note',
            label: 'Latest note',
            title: recentNotes.value[0].title || 'Untitled note',
            meta: `${formatRelativeTime(recentNotes.value[0].updated_at)} · ${truncate(recentNotes.value[0].content || 'Freshly created note.', 48)}`,
          }
        : {
            id: 'note-empty',
            label: 'Latest note',
            title: 'No notes yet',
            meta: 'Capture an idea to start building your orbit.',
          },
    ];
  });
</script>

<template>
  <section class="dashboard">
    <header class="dashboard__hero">
      <div class="dashboard__hero-copy">
        <p class="dashboard__eyebrow">Daily overview</p>
        <h1 class="dashboard__title">Keep the day in orbit.</h1>
        <p class="dashboard__lede">
          One calm screen for your notes, hydration, and food tracking, with
          today’s pulse surfaced first.
        </p>

        <div class="dashboard__hero-chips">
          <span class="dashboard__hero-chip">{{ todayLabel }}</span>
          <span class="dashboard__hero-chip">{{ notesCount }} notes saved</span>
          <span class="dashboard__hero-chip"
            >{{ foods.length }} foods in library</span
          >
        </div>
      </div>

      <article class="dashboard__status-card">
        <p class="dashboard__eyebrow">Orbit pulse</p>
        <strong class="dashboard__status-title">{{ authStatusText }}</strong>
        <p class="dashboard__status-text">{{ authStatusBody }}</p>

        <div class="dashboard__status-metrics">
          <div class="dashboard__status-metric">
            <span class="dashboard__status-label">Water today</span>
            <strong class="dashboard__status-value">{{ todayTotal }} ml</strong>
          </div>
          <div class="dashboard__status-metric">
            <span class="dashboard__status-label">Calories today</span>
            <strong class="dashboard__status-value"
              >{{ todayCalories }} kcal</strong
            >
          </div>
          <div class="dashboard__status-metric">
            <span class="dashboard__status-label">Meals logged</span>
            <strong class="dashboard__status-value">{{
              todayEntries.length
            }}</strong>
          </div>
        </div>
      </article>
    </header>

    <section class="dashboard__module-grid">
      <DashboardModuleCard
        eyebrow="Notes"
        title="Thoughts and capture"
        description="Keep important ideas within reach, then jump back into editing when something needs attention."
        to="/notes"
        action-label="Open notes"
        :action-icon="faNoteSticky"
        :loading="isLoadingNotes"
        loading-text="Loading notes…"
        :error-text="notesError"
      >
        <div class="dashboard__metric-strip">
          <div class="dashboard__metric-pill">
            <FontAwesomeIcon
              class="dashboard__metric-icon"
              :icon="faNoteSticky"
            />
            <div class="dashboard__metric-label-value-container">
              <span class="dashboard__metric-label">Saved</span>
              <strong class="dashboard__metric-value">{{ notesCount }}</strong>
            </div>
          </div>
          <div class="dashboard__metric-pill">
            <FontAwesomeIcon
              class="dashboard__metric-icon"
              :icon="faThumbtack"
            />
            <div class="dashboard__metric-label-value-container">
              <span class="dashboard__metric-label">Pinned</span>
              <strong class="dashboard__metric-value">{{
                pinnedNotes.length
              }}</strong>
            </div>
          </div>
        </div>

        <p class="dashboard__card-copy">{{ notesHeadline }}</p>

        <ul v-if="recentNotes.length > 0" class="dashboard__mini-list">
          <li
            v-for="note in recentNotes"
            :key="note.id"
            class="dashboard__mini-item"
          >
            <strong class="dashboard__mini-title">
              {{ note.title || 'Untitled note' }}
            </strong>
            <span class="dashboard__mini-meta">{{
              formatRelativeTime(note.updated_at)
            }}</span>
          </li>
        </ul>
      </DashboardModuleCard>

      <DashboardModuleCard
        eyebrow="Water"
        title="Hydration rhythm"
        description="See how close you are to the goal, how often you poured, and whether the streak still feels alive."
        to="/water"
        action-label="Open water"
        :action-icon="faDroplet"
        :loading="isLoadingWater"
        loading-text="Loading water…"
        :error-text="waterError"
      >
        <div class="dashboard__metric-strip">
          <div class="dashboard__metric-pill dashboard__metric-pill--wide">
            <FontAwesomeIcon class="dashboard__metric-icon" :icon="faDroplet" />
            <div class="dashboard__metric-label-value-container">
              <span class="dashboard__metric-label">Progress</span>
              <strong class="dashboard__metric-value"
                >{{ todayTotal }} / {{ goalMl }} ml</strong
              >
            </div>
          </div>
          <div class="dashboard__metric-pill dashboard__metric-pill--wide">
            <FontAwesomeIcon
              class="dashboard__metric-icon"
              :icon="faWaveSquare"
            />
            <div class="dashboard__metric-label-value-container">
              <span class="dashboard__metric-label">Streak</span>
              <strong class="dashboard__metric-value"
                >{{ currentStreak }} days</strong
              >
            </div>
          </div>
        </div>

        <div class="dashboard__progress">
          <div class="dashboard__progress-track">
            <span
              class="dashboard__progress-fill"
              :style="{width: `${waterProgressPercent}%`}"
            ></span>
          </div>
          <span class="dashboard__progress-text"
            >{{ waterProgressPercent }}%</span
          >
        </div>

        <p class="dashboard__card-copy">{{ waterHeadline }}</p>

        <div class="dashboard__tag-row">
          <span class="dashboard__tag">{{ glassesToday }} pours today</span>
          <span class="dashboard__tag">{{ remainingToGoal }} ml remaining</span>
        </div>
      </DashboardModuleCard>

      <DashboardModuleCard
        eyebrow="Calories"
        title="Fuel tracking"
        description="Keep the day’s intake readable at a glance, then dive into meals, foods, and macros when you need detail."
        to="/calories"
        action-label="Open calories"
        class="dashboard__module-card--calories"
        :action-icon="faUtensils"
        :loading="isLoadingFoods || isLoadingEntries"
        loading-text="Loading calories…"
        :error-text="caloriesError"
      >
        <div class="dashboard__calorie-hero">
          <div>
            <span class="dashboard__metric-label">Today total</span>
            <strong class="dashboard__calorie-total"
              >{{ todayCalories }} kcal</strong
            >
          </div>
          <div class="dashboard__tag-row">
            <span class="dashboard__tag">{{ todayEntries.length }} meals</span>
            <span class="dashboard__tag">{{ foods.length }} saved foods</span>
          </div>
        </div>

        <div class="dashboard__macro-grid">
          <div class="dashboard__macro-card">
            <FontAwesomeIcon
              class="dashboard__metric-icon"
              :icon="faDrumstickBite"
            />
            <span class="dashboard__metric-label">Protein</span>
            <strong class="dashboard__macro-value"
              >{{ todayProtein.toFixed(1) }} g</strong
            >
          </div>
          <div class="dashboard__macro-card">
            <FontAwesomeIcon
              class="dashboard__metric-icon"
              :icon="faSeedling"
            />
            <span class="dashboard__metric-label">Carbs</span>
            <strong class="dashboard__macro-value"
              >{{ todayCarbs.toFixed(1) }} g</strong
            >
          </div>
          <div class="dashboard__macro-card">
            <FontAwesomeIcon class="dashboard__metric-icon" :icon="faWater" />
            <span class="dashboard__metric-label">Fats</span>
            <strong class="dashboard__macro-value"
              >{{ todayFats.toFixed(1) }} g</strong
            >
          </div>
        </div>

        <p class="dashboard__card-copy">{{ caloriesHeadline }}</p>
      </DashboardModuleCard>
    </section>

    <section class="dashboard__lower-grid">
      <article class="dashboard__panel">
        <div class="dashboard__panel-header">
          <div>
            <p class="dashboard__eyebrow">Recently touched</p>
            <h2 class="dashboard__panel-title">What moved most recently</h2>
          </div>
          <RouterLink class="dashboard__panel-link" to="/notes">
            <FontAwesomeIcon
              class="dashboard__panel-link-icon"
              :icon="faNoteSticky"
            />
            <span>View notes</span>
          </RouterLink>
        </div>

        <ul class="dashboard__activity-list">
          <li
            v-for="item in activityItems"
            :key="item.id"
            class="dashboard__activity-item"
          >
            <span class="dashboard__activity-label">{{ item.label }}</span>
            <strong class="dashboard__activity-title">{{ item.title }}</strong>
            <span class="dashboard__activity-meta">{{ item.meta }}</span>
          </li>
        </ul>
      </article>

      <article class="dashboard__panel">
        <div class="dashboard__panel-header">
          <div>
            <p class="dashboard__eyebrow">Today at a glance</p>
            <h2 class="dashboard__panel-title">The shape of the day</h2>
          </div>
        </div>

        <div class="dashboard__glance-grid">
          <div class="dashboard__glance-card">
            <span class="dashboard__glance-label">Hydration</span>
            <strong class="dashboard__glance-value">{{ todayTotal }} ml</strong>
            <span class="dashboard__glance-meta"
              >{{ waterProgressPercent }}% of goal</span
            >
          </div>
          <div class="dashboard__glance-card">
            <span class="dashboard__glance-label">Meals</span>
            <strong class="dashboard__glance-value">{{
              todayEntries.length
            }}</strong>
            <span class="dashboard__glance-meta"
              >{{ todayCalories }} kcal tracked</span
            >
          </div>
          <div class="dashboard__glance-card">
            <span class="dashboard__glance-label">Capture</span>
            <strong class="dashboard__glance-value">{{
              recentNotes.length
            }}</strong>
            <span class="dashboard__glance-meta">recent notes in motion</span>
          </div>
          <div class="dashboard__glance-card">
            <span class="dashboard__glance-label">Orbit mood</span>
            <strong class="dashboard__glance-value">
              {{
                todayEntries.length > 0 || todayTotal > 0 || notesCount > 0
                  ? 'Active'
                  : 'Quiet'
              }}
            </strong>
            <span class="dashboard__glance-meta"
              >steady, modular, and ready</span
            >
          </div>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped lang="scss">
  .dashboard {
    @include subtle-scrollbar;
    height: 100%;
    min-height: 0;
    overflow: auto;
    display: grid;
    gap: 24px;

    @include down('lg') {
      height: auto;
      overflow: visible;
    }
  }

  .dashboard__hero,
  .dashboard__status-card,
  .dashboard__panel {
    border: 1px solid $color-line;
    border-radius: $radius-md;
    background: $color-panel-strong;
  }

  .dashboard__hero {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.95fr);
    gap: 22px;
    padding: 28px;

    @include down('lg') {
      grid-template-columns: 1fr;
    }
  }

  .dashboard__hero-copy {
    display: grid;
    gap: 14px;
  }

  .dashboard__eyebrow {
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 0.78rem;
    color: $color-accent;
  }

  .dashboard__title {
    margin: 0;
    font-family: $font-heading;
    font-size: clamp(2.7rem, 5vw, 5rem);
    line-height: 0.94;
    letter-spacing: -0.04em;
  }

  .dashboard__lede,
  .dashboard__status-text,
  .dashboard__card-copy,
  .dashboard__activity-meta,
  .dashboard__glance-meta {
    color: $color-muted;
  }

  .dashboard__lede {
    max-width: 56ch;
    font-size: 1.04rem;
  }

  .dashboard__hero-chips,
  .dashboard__tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: baseline;
    height: fit-content;
  }

  .dashboard__hero-chip,
  .dashboard__tag {
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(195, 123, 48, 0.12);
    color: #8a5621;
  }

  .dashboard__status-card {
    display: grid;
    gap: 16px;
    padding: 22px;
  }

  .dashboard__status-title {
    font-family: $font-heading;
    font-size: 1.8rem;
    letter-spacing: -0.03em;
  }

  .dashboard__status-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    @include down('sm') {
      grid-template-columns: 1fr;
    }
  }

  .dashboard__status-metric,
  .dashboard__metric-pill,
  .dashboard__macro-card,
  .dashboard__glance-card,
  .dashboard__activity-item {
    border: 1px solid $color-line;
    border-radius: $radius-sm;
    background: rgba(255, 255, 255, 0.56);
  }

  .dashboard__status-metric,
  .dashboard__glance-card {
    display: grid;
    gap: 6px;
    padding: 14px;
  }

  .dashboard__status-label,
  .dashboard__metric-label,
  .dashboard__glance-label,
  .dashboard__activity-label {
    font-size: 0.9rem;
    color: $color-muted;
  }

  .dashboard__status-value,
  .dashboard__glance-value {
    font-family: $font-heading;
    font-size: 1.55rem;
    letter-spacing: -0.03em;
  }

  .dashboard__module-grid,
  .dashboard__lower-grid {
    display: grid;
    gap: 18px;
  }

  .dashboard__module-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    @media (max-width: 1300px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @include down('lg') {
      grid-template-columns: 1fr;
    }
  }

  .dashboard__module-card--calories {
    @media (max-width: 1300px) {
      grid-column: 1 / -1;
    }

    @include down('lg') {
      grid-column: auto;
    }
  }

  .dashboard__lower-grid {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.95fr);

    @include down('lg') {
      grid-template-columns: 1fr;
    }
  }

  .dashboard__metric-strip {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .dashboard__metric-pill {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
  }

  .dashboard__metric-label-value-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .dashboard__metric-pill--wide {
    grid-column: span 2;
  }

  .dashboard__metric-icon {
    color: #8a5621;
  }

  .dashboard__metric-value,
  .dashboard__calorie-total,
  .dashboard__macro-value,
  .dashboard__activity-title {
    font-family: $font-heading;
    letter-spacing: -0.03em;
  }

  .dashboard__metric-value {
    /* margin-left: 120px; */
  }

  .dashboard__metric-value,
  .dashboard__activity-title {
    font-size: 1.2rem;
  }

  .dashboard__progress {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .dashboard__progress-track {
    flex: 1 1 auto;
    height: 10px;
    border-radius: 999px;
    background: rgba(52, 37, 21, 0.08);
    overflow: hidden;
  }

  .dashboard__progress-fill {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(
      135deg,
      rgba(13, 122, 102, 0.86) 0%,
      rgba(72, 176, 161, 0.9) 100%
    );
  }

  .dashboard__progress-text {
    min-width: 46px;
    text-align: right;
    color: $color-muted;
  }

  .dashboard__calorie-hero {
    display: grid;
    gap: 12px;
  }

  .dashboard__calorie-total {
    display: block;
    font-size: 2.3rem;
  }

  .dashboard__macro-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;

    @include down('sm') {
      grid-template-columns: 1fr;
    }
  }

  .dashboard__macro-card {
    display: grid;
    gap: 8px;
    padding: 14px;
  }

  .dashboard__macro-value {
    font-size: 1.2rem;
  }

  .dashboard__mini-list,
  .dashboard__activity-list {
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .dashboard__mini-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(89, 58, 28, 0.08);

    &:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }
  }

  .dashboard__mini-title {
    font-weight: 600;
  }

  .dashboard__mini-meta {
    color: $color-muted;
    white-space: nowrap;
  }

  .dashboard__panel {
    display: grid;
    gap: 18px;
    padding: 24px;
  }

  .dashboard__panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;

    @include down('sm') {
      flex-direction: column;
    }
  }

  .dashboard__panel-title {
    margin: 10px 0 0;
    font-family: $font-heading;
    font-size: 1.8rem;
    letter-spacing: -0.03em;
  }

  .dashboard__panel-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 999px;
    background: rgba(13, 122, 102, 0.1);
    color: $color-accent;
    text-decoration: none;
    white-space: nowrap;
  }

  .dashboard__panel-link-icon {
    font-size: 0.92rem;
  }

  .dashboard__activity-item {
    display: grid;
    gap: 6px;
    padding: 14px;
  }

  .dashboard__glance-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;

    @include down('sm') {
      grid-template-columns: 1fr;
    }
  }

  @include down('sm') {
    .dashboard__metric-strip {
      grid-template-columns: 1fr;
    }

    .dashboard__metric-pill--wide {
      grid-column: span 1;
    }
  }
</style>
