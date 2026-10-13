
"use client";

import { useEffect, useState } from "react";
import foodsData from "../../data/foods.json";

type Profile = {
  age: string;
  sex: string;
  weight: string;
  height: string;
  activity: string;
  diet: string;
  budget: string;
};

type NutrientKey =
  | "energy_kcal"
  | "protein_g"
  | "iron_mg"
  | "calcium_mg"
  | "fibre_g";

type MealNutrition = {
  totals: Record<NutrientKey, number | null>;
  canCalculate: boolean;
  unavailableFoods?: string[];
};

type Meal = {
  id: string;
  mealType: string;
  food: string;
  portion: string;
  preparation: string;
  notes?: string;
  date: string;
  nutrition?: MealNutrition | null;
};

type FoodRecord = {
  id: string;
  name: string;
  nutrients: Record<NutrientKey, number | null>;
  verified: boolean;
};

const availableFoods = foodsData as FoodRecord[];

// Illustrative general references, not personalized prescriptions.
// Actual requirements vary with age, sex, life stage, and other factors.
const referenceTargets: Record<NutrientKey, number> = {
  energy_kcal: 2000,
  protein_g: 50,
  iron_mg: 18,
  calcium_mg: 1000,
  fibre_g: 28,
};

const nutrientCards: {
  key: NutrientKey;
  name: string;
  unit: string;
  note: string;
  color: string;
}[] = [
  {
    key: "energy_kcal",
    name: "Calories",
    unit: "kcal",
    note: "Estimated energy intake",
    color: "#D8B96C",
  },
  {
    key: "protein_g",
    name: "Protein",
    unit: "g",
    note: "Supports muscle and tissue",
    color: "#8BA17A",
  },
  {
    key: "iron_mg",
    name: "Iron",
    unit: "mg",
    note: "Helps carry oxygen",
    color: "#C98767",
  },
  {
    key: "calcium_mg",
    name: "Calcium",
    unit: "mg",
    note: "Supports bones and teeth",
    color: "#D8B96C",
  },
  {
    key: "fibre_g",
    name: "Dietary fibre",
    unit: "g",
    note: "Supports digestive health",
    color: "#8E9C79",
  },
];

function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();

  return (
    !Number.isNaN(date.getTime()) &&
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

// A meal contributes to totals only when all five nutrient values
// are present and valid.
function hasCompleteNutrition(meal: Meal): boolean {
  const nutrition = meal.nutrition;

  if (!nutrition || nutrition.canCalculate !== true) {
    return false;
  }

  return nutrientCards.every(({ key }) => {
    const value = nutrition.totals?.[key];

    return typeof value === "number" && Number.isFinite(value);
  });
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);

  
  useEffect(() => {
    const loadEarthyData = () => {
      try {
        const savedProfile = localStorage.getItem("earthy-profile");

        if (savedProfile) {
          setProfile(JSON.parse(savedProfile) as Profile);
        }

        const savedMeals = localStorage.getItem("earthy-meals");

        if (savedMeals) {
          const parsedMeals: unknown = JSON.parse(savedMeals);

          if (Array.isArray(parsedMeals)) {
            setMeals(parsedMeals as Meal[]);
          }
        }
      } catch (error) {
        console.error("Could not load Earthy data:", error);
      }
    };

    loadEarthyData();
    window.addEventListener("focus", loadEarthyData);

    return () => {
      window.removeEventListener("focus", loadEarthyData);
    };
  }, []);


  const todayMeals = meals.filter((meal) => isToday(meal.date));

  // Include only meals that have complete nutrition records.
  const calculableMeals = todayMeals.filter(hasCompleteNutrition);

  // Meals excluded because their nutrition data is missing or incomplete.
  const missingNutritionCount =
    todayMeals.length - calculableMeals.length;

  const recentMeals = [...meals].reverse().slice(0, 5);

  // Calculate partial totals when at least one meal is calculable.
  // Missing meals are never silently treated as zero.
  const dailyTotals = Object.fromEntries(
    nutrientCards.map(({ key }) => [
      key,
      calculableMeals.length > 0
        ? calculableMeals.reduce(
            (sum, meal) => sum + meal.nutrition!.totals[key]!,
            0
          )
        : null,
    ])
  ) as Record<NutrientKey, number | null>;

  const hasPartialTotals =
    calculableMeals.length > 0 && missingNutritionCount > 0;

  // Calculate progress against illustrative reference values.
  // The bar stops at 100%, while the actual intake remains uncapped.
  const nutrientProgress = Object.fromEntries(
    nutrientCards.map(({ key }) => {
      const amount = dailyTotals[key];
      const target = referenceTargets[key];

      return [
        key,
        amount === null
          ? null
          : Math.min((amount / target) * 100, 100),
      ];
    })
  ) as Record<NutrientKey, number | null>;

    // Analyse the last 7 calendar days.
  // Only use days where every logged meal has complete nutrition data.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 6);

  const getDayKey = (dateString: string) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "";

    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const recentWeekMeals = meals.filter((meal) => {
    const date = new Date(meal.date);

    if (Number.isNaN(date.getTime())) return false;

    date.setHours(0, 0, 0, 0);

    return date >= sevenDaysAgo && date <= today;
  });

  const loggedDayKeys = [
    ...new Set(recentWeekMeals.map((meal) => getDayKey(meal.date))),
  ].filter(Boolean);

  const completeDayKeys = loggedDayKeys.filter((dayKey) => {
    const dayMeals = recentWeekMeals.filter(
      (meal) => getDayKey(meal.date) === dayKey
    );

    return dayMeals.length > 0 && dayMeals.every(hasCompleteNutrition);
  });

  const completeWeekMeals = recentWeekMeals.filter(
    (meal) =>
      completeDayKeys.includes(getDayKey(meal.date)) &&
      hasCompleteNutrition(meal)
  );

  const weeklyAverage = Object.fromEntries(
    nutrientCards.map(({ key }) => [
      key,
      completeDayKeys.length > 0
        ? completeWeekMeals.reduce(
            (sum, meal) => sum + meal.nutrition!.totals[key]!,
            0
          ) / completeDayKeys.length
        : null,
    ])
  ) as Record<NutrientKey, number | null>;

  // Do not produce gap flags or a score until at least 3 complete
  // days of logged data are available.
  const canAnalyseWeek = completeDayKeys.length >= 3;

  const possibleGaps = nutrientCards.filter(({ key }) => {
    const average = weeklyAverage[key];

    return (
      key !== "energy_kcal" &&
      canAnalyseWeek &&
      average !== null &&
      average < referenceTargets[key] * 0.8
    );
  });

  // A simple prototype score: average coverage of four nutrients.
  // This is a heuristic, not a clinical nutrition score.
  const balanceNutrients: NutrientKey[] = [
    "protein_g",
    "iron_mg",
    "calcium_mg",
    "fibre_g",
  ];

  const balanceScore = canAnalyseWeek
    ? Math.round(
        balanceNutrients.reduce((sum, key) => {
          const average = weeklyAverage[key];

          if (average === null) return sum;

          return (
            sum +
            Math.min(
              (average / referenceTargets[key]) * 100,
              100
            )
          );
        }, 0) / balanceNutrients.length
      )
    : null;

  // Filter suggestions using the dietary preference in the profile.
  // The available dataset currently contains only eight foods.
  const getCompatibleFoods = (diet: string | undefined) => {
    return availableFoods.filter((food) => {
      if (!food.verified) return false;

      const name = food.name.toLowerCase();

      const isEgg = name.includes("egg");
      const isDairy =
        name.includes("milk") || name.includes("curd");

      if (diet === "vegan" && (isEgg || isDairy)) return false;

      if (diet === "vegetarian" && isEgg) return false;

      return true;
    });
  };

  const compatibleFoods = getCompatibleFoods(profile?.diet);

  const getFoodSuggestions = (key: NutrientKey) => {
    return [...compatibleFoods]
      .filter((food) => {
        const amount = food.nutrients[key];

        return typeof amount === "number" && amount > 0;
      })
      .sort(
        (a, b) =>
          (b.nutrients[key] ?? 0) - (a.nutrients[key] ?? 0)
      )
      .slice(0, 2);
  };

  const dietLabels: Record<string, string> = {
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    eggetarian: "Vegetarian + eggs",
    "non-vegetarian": "Includes meat or fish",
  };

  return (
    <main className="dashboard-page">
      <nav className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">e.</span>
          earthy
        </a>

        <div className="dashboard-nav-links">
          <a href="/dashboard" className="active-nav-link">
            Overview
          </a>
          <a href="/log-meal">Log a meal</a>
          <a href="/history">Food history</a>
        </div>

        <a className="nav-cta" href="/profile">
          My profile ↗
        </a>
      </nav>

      <section className="dashboard-container">
        <div className="dashboard-welcome">
          <div>
            <div className="eyebrow">
              <span className="status-dot" />
              YOUR EARTHY SPACE
            </div>

            <h1>
              A little better, <span>every day.</span>
            </h1>

            <p>
              Your nutrition journey starts with understanding what you eat.
            </p>
          </div>

          <div className="welcome-illustration" aria-hidden="true">
            ✳
          </div>
        </div>

        {profile && (
          <div className="profile-summary">
            <span className="profile-avatar">e.</span>

            <div>
              <strong>Your personal space</strong>
              <p>
                {profile.age} years · {profile.weight} kg ·{" "}
                {profile.height} cm ·{" "}
                {dietLabels[profile.diet] ?? profile.diet}
              </p>
            </div>

            <a href="/profile">Edit details ↗</a>
          </div>
        )}

        <div className="dashboard-section-heading">
          <div>
            <span className="principle-number">
              YOUR DAY AT A GLANCE
            </span>
            <h2>Today, so far</h2>
          </div>

          <span className="date-chip">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="dashboard-stat-grid">
          <article className="dashboard-stat-card">
            <span className="stat-icon">◒</span>
            <span className="stat-label">Meals logged today</span>

            <strong>
              {todayMeals.length}{" "}
              {todayMeals.length === 1 ? "meal" : "meals"}
            </strong>

            <p>
              {todayMeals.length === 0
                ? "Your first meal is a great place to start."
                : "Every meal adds to your food journal."}
            </p>
          </article>

          <article className="dashboard-stat-card">
            <span className="stat-icon">✳</span>
            <span className="stat-label">
              Estimated calories today
            </span>

            <strong>
              {dailyTotals.energy_kcal === null
                ? "—"
                : `${Math.round(dailyTotals.energy_kcal)} kcal`}
            </strong>

            <p>
              {calculableMeals.length === 0
                ? "Log a meal with available nutrition data to calculate calories."
                : hasPartialTotals
                  ? `Calculated from ${calculableMeals.length} of ${todayMeals.length} meals.`
                  : "Calculated from all of today's logged meals."}
            </p>
          </article>

          <article className="dashboard-stat-card">
            <span className="stat-icon">↗</span>
            <span className="stat-label">Your next step</span>
            <strong>Keep recording</strong>
            <p>Include meals and snacks throughout your day.</p>
          </article>
        </div>

        <div className="dashboard-content-grid">
          <section className="nutrition-panel">
            <div className="panel-heading">
              <div>
                <span className="principle-number">
                  FOOD-DATA BASED ESTIMATES
                </span>
                <h2>Today's nutrition totals</h2>
              </div>

              <span className="panel-sparkle">✳</span>
            </div>

            <p className="panel-description">
              These estimates add up the nutrients in your logged meals.
              Their accuracy depends on the food records, preparation,
              and portions entered.
            </p>

            <div className="nutrient-list">
              {nutrientCards.map((nutrient) => {
                const amount = dailyTotals[nutrient.key];
                const progress = nutrientProgress[nutrient.key];
                const target = referenceTargets[nutrient.key];

                return (
                  <div
                    className="dashboard-nutrient"
                    key={nutrient.key}
                  >
                    <span
                      className="dashboard-nutrient-dot"
                      style={{ backgroundColor: nutrient.color }}
                    />

                    <div className="dashboard-nutrient-info">
                      <strong>{nutrient.name}</strong>
                      <span>{nutrient.note}</span>

                      {amount !== null && progress !== null && (
                        <>
                          <div
                            style={{
                              height: "6px",
                              background: "#EAE8DF",
                              borderRadius: "999px",
                              overflow: "hidden",
                              marginTop: "10px",
                              width: "100%",
                            }}
                            role="progressbar"
                            aria-label={`${nutrient.name} compared with illustrative daily reference`}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(progress)}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${progress}%`,
                                backgroundColor: nutrient.color,
                                borderRadius: "999px",
                                transition: "width 250ms ease",
                              }}
                            />
                          </div>

                          <span
                            style={{
                              display: "block",
                              fontSize: "12px",
                              marginTop: "5px",
                            }}
                          >
                            {Math.round(progress)}% of illustrative reference
                            {" · "}
                            Reference: {target} {nutrient.unit}
                          </span>
                        </>
                      )}
                    </div>

                    <span className="nutrient-amount">
                      {amount === null
                        ? "—"
                        : `${Number(amount.toFixed(2))} ${nutrient.unit}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="data-disclaimer">
              <span>✳</span>

              {todayMeals.length === 0
                ? "Log a meal to start building today's nutrition summary."
                : calculableMeals.length === 0
                  ? "Nutrition data is missing or incomplete for today's meals. Log a meal with available nutrition data to see estimates."
                  : hasPartialTotals
                    ? `${missingNutritionCount} ${
                        missingNutritionCount === 1 ? "meal is" : "meals are"
                      } excluded because nutrition data is missing or incomplete. Totals above are partial and do not include those meals.`
                    : "All of today's logged meals have nutrition data. Estimates only, not a medical assessment or diagnosis."}
            </div>

            <p
              style={{
                fontSize: "12px",
                lineHeight: 1.6,
                color: "#777568",
                marginTop: "12px",
              }}
            >
              Reference values are illustrative general comparisons, not
              personalized nutrition goals. Actual requirements vary by age,
              sex, life stage, health, and activity. Percentages are not a
              diagnosis of nutrient deficiency.
            </p>
          </section>

          <aside className="log-panel">
            <div className="log-panel-icon">＋</div>
            <span className="principle-number">YOUR FOOD JOURNAL</span>

            <h2>
              {todayMeals.length > 0
                ? "Had something else?"
                : "What have you eaten today?"}
            </h2>

            <p>
              Record your next meal to build a more complete picture
              of your everyday eating habits.
            </p>

            <a
              className="primary-button dashboard-button"
              href="/log-meal"
            >
              Log a meal <span>→</span>
            </a>

            <div className="log-panel-footnote">
              <span>✳</span> Everyday food. Real-life routines.
            </div>
          </aside>
        </div>

                <section className="nutrition-panel" style={{ marginTop: "28px" }}>
          <div className="panel-heading">
            <div>
              <span className="principle-number">
                YOUR PERSONALIZED INSIGHTS
              </span>
              <h2>Your nutrition patterns</h2>
            </div>

            <span className="panel-sparkle">✳</span>
          </div>

          <p className="panel-description">
            Earthy looks at your recent logged meals to identify nutrients
            that may deserve more attention and foods worth exploring.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              padding: "20px",
              background: "#F1F2E9",
              borderRadius: "16px",
              marginBottom: "24px",
            }}
          >
            <div>
              <span className="principle-number">
                YOUR DIETARY BALANCE SCORE
              </span>

              <p style={{ margin: "6px 0 0", fontSize: "13px" }}>
                Based on protein, iron, calcium and fibre estimates.
              </p>
            </div>

            <strong style={{ fontSize: "30px", color: "#687B59" }}>
              {balanceScore === null ? "—" : `${balanceScore}/100`}
            </strong>
          </div>

          {canAnalyseWeek ? (
            <>
              <p className="panel-description">
                Analysis uses {completeDayKeys.length} fully calculable
                logged days in the last 7 days. Days with incomplete meal
                data are excluded.
              </p>

              <h3 style={{ marginBottom: "14px" }}>
                Nutrients to pay attention to
              </h3>

              {possibleGaps.length === 0 ? (
                <div className="data-disclaimer">
                  <span>✳</span>
                  No potential gaps were flagged by this prototype's
                  simple thresholds. This does not establish that your
                  diet meets all your nutritional needs.
                </div>
              ) : (
                <div className="nutrient-list">
                  {possibleGaps.map((nutrient) => {
                    const average = weeklyAverage[nutrient.key];

                    return (
                      <article
                        key={nutrient.key}
                        style={{
                          padding: "18px 0",
                          borderBottom: "1px solid #EAE8DF",
                        }}
                      >
                        <strong>{nutrient.name}</strong>

                        <p
                          style={{
                            fontSize: "13px",
                            lineHeight: 1.6,
                            color: "#777568",
                            margin: "6px 0 12px",
                          }}
                        >
                          Your logged average is{" "}
                          {Number(average!.toFixed(2))} {nutrient.unit}
                          {" per logged day"}, below 80% of the
                          illustrative reference of{" "}
                          {referenceTargets[nutrient.key]} {nutrient.unit}.
                        </p>
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="data-disclaimer">
              <span>✳</span>
              Log meals with complete nutrition data on at least 3 days
              to unlock your initial nutrition-pattern analysis.
            </div>
          )}

          <div style={{ marginTop: "28px" }}>
            <span className="principle-number">
              EVERYDAY FOOD IDEAS
            </span>

            <h3 style={{ marginTop: "8px" }}>
              Foods to add to your plate
            </h3>

            <p className="panel-description">
              Explore foods that provide useful nutrients, based on your
              dietary preference and Earth's current food dataset.
            </p>

            <div className="nutrient-list">
              {(
                [
                  "protein_g",
                  "iron_mg",
                  "calcium_mg",
                  "fibre_g",
                ] as NutrientKey[]
              ).map((key) => {
                const nutrient = nutrientCards.find(
                  (item) => item.key === key
                )!;

                const suggestions = getFoodSuggestions(key);

                return (
                  <div
                    key={key}
                    className="dashboard-nutrient"
                  >
                    <div className="dashboard-nutrient-info">
                      <strong>{nutrient.name}</strong>
                      <span>Food sources per 100 g</span>

                      <div style={{ marginTop: "8px" }}>
                        {suggestions.length > 0 ? (
                          suggestions.map((food) => (
                            <span
                              key={food.id}
                              style={{
                                display: "inline-block",
                                background: "#F1F2E9",
                                padding: "6px 10px",
                                borderRadius: "999px",
                                margin: "4px 6px 4px 0",
                                fontSize: "13px",
                              }}
                            >
                              {food.name}
                            </span>
                          ))
                        ) : (
                          <span>No matching foods available yet.</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
```
          <p
            style={{
              fontSize: "12px",
              lineHeight: 1.6,
              color: "#777568",
              marginTop: "16px",
            }}
          >
            Prototype estimate only. These thresholds are illustrative,
            and suggestions are limited to foods in Earthy's current
            dataset. A low logged intake is not proof of a deficiency.
            The current dataset does not include food prices, so
            suggestions are not yet ranked by budget.
          </p>
        </section>

        <section className="recent-meals-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="principle-number">YOUR FOOD JOURNAL</span>
              <h2>Recent meals</h2>
            </div>

            <a className="text-button" href="/log-meal">
              + Add meal
            </a>
          </div>

          {recentMeals.length === 0 ? (
            <div className="empty-meals">
              <span className="empty-meals-icon">◒</span>
              <h3>Your food story starts here.</h3>

              <p>
                Your saved meals will appear here. Log what you eat,
                from a simple breakfast to your evening snack.
              </p>

              <a
                className="primary-button dashboard-button"
                href="/log-meal"
              >
                Log your first meal <span>→</span>
              </a>
            </div>
          ) : (
            <div className="recent-meals-list">
              {recentMeals.map((meal) => (
                <article className="recent-meal-card" key={meal.id}>
                  <div className="recent-meal-icon">✳</div>

                  <div className="recent-meal-details">
                    <div className="recent-meal-meta">
                      <span className="meal-type-chip">
                        {meal.mealType}
                      </span>

                      <span className="meal-date">
                        {new Date(meal.date).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <h3>{meal.food}</h3>

                    <p>
                      Portion: {meal.portion} · {meal.preparation}
                    </p>

                    {meal.notes && (
                      <p className="recent-meal-notes">
                        Note: {meal.notes}
                      </p>
                    )}

                    {!hasCompleteNutrition(meal) && (
                      <p className="recent-meal-notes">
                        Nutrition data unavailable for this meal.
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {meals.length > 5 && (
            <p className="recent-meals-footnote">
              Showing your 5 most recently logged meals.
            </p>
          )}
        </section>

        <section className="dashboard-bottom-note">
          <span className="bottom-note-icon">✳</span>

          <div>
            <strong>Nutrition is a pattern, not a single meal.</strong>
            <p>
              Earthy uses your food logs to build a more useful picture
              over time. These initial nutrient estimates are approximate,
              not clinically validated.
            </p>
          </div>
        </section>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="/">
          <span className="brand-icon">e.</span>
          earthy
        </a>

        <p>Rooted in better everyday choices.</p>
        <span>Nutrition insights, not medical diagnoses.</span>
      </footer>
    </main>
  );
}
