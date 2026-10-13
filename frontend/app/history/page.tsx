
"use client";

import { useEffect, useState } from "react";

type Meal = {
  id: string;
  mealType: string;
  food: string;
  portion: string;
  preparation: string;
  notes?: string;
  date: string;
  nutrition?: {
    totals: {
      energy_kcal: number | null;
      protein_g: number | null;
      iron_mg: number | null;
      calcium_mg: number | null;
      fibre_g: number | null;
    };
    canCalculate: boolean;
  } | null;
};

export default function HistoryPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("earthy-meals");

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setMeals(parsed as Meal[]);
        }
      }
    } catch (error) {
      console.error("Could not load meal history:", error);
    }
  }, []);

  const filteredMeals = meals
    .filter((meal) => filter === "All" || meal.mealType === filter)
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  return (
    <main className="dashboard-page">
      <nav className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">e.</span>
          earthy
        </a>

        <div className="dashboard-nav-links">
          <a href="/dashboard">Overview</a>
          <a href="/log-meal">Log a meal</a>
          <a href="/history" className="active-nav-link">
            Food history
          </a>
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
              YOUR FOOD JOURNAL
            </div>

            <h1>
              Your food, <span>your story.</span>
            </h1>

            <p>
              Look back at your meals and build a clearer picture of
              your everyday eating habits.
            </p>
          </div>

          <div className="welcome-illustration" aria-hidden="true">
            ✳
          </div>
        </div>

        <div className="dashboard-section-heading">
          <div>
            <span className="principle-number">
              YOUR JOURNEY SO FAR
            </span>
            <h2>Logged meals</h2>
          </div>

          <span className="date-chip">
            {meals.length} {meals.length === 1 ? "meal" : "meals"}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          {["All", "Breakfast", "Lunch", "Dinner", "Snack"].map(
            (type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: "9px 16px",
                  borderRadius: "999px",
                  border: "1px solid #DADCCF",
                  background: filter === type ? "#687B59" : "#FFFFFF",
                  color: filter === type ? "#FFFFFF" : "#514F43",
                  cursor: "pointer",
                }}
              >
                {type}
              </button>
            )
          )}
        </div>

        {filteredMeals.length === 0 ? (
          <div className="empty-meals">
            <span className="empty-meals-icon">◒</span>

            <h3>
              {meals.length === 0
                ? "Your food story starts here."
                : "No meals in this category yet."}
            </h3>

            <p>
              {meals.length === 0
                ? "Your saved meals will appear here when you start logging what you eat."
                : "Try another filter to see your other logged meals."}
            </p>

            {meals.length === 0 && (
              <a
                className="primary-button dashboard-button"
                href="/log-meal"
              >
                Log your first meal <span>→</span>
              </a>
            )}
          </div>
        ) : (
          <div className="recent-meals-list">
            {filteredMeals.map((meal) => (
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
                        year: "numeric",
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

                  {meal.nutrition?.canCalculate ? (
                    <p className="recent-meal-notes">
                      Estimated energy:{" "}
                      {meal.nutrition.totals.energy_kcal ?? "—"} kcal
                      {" · "}Protein:{" "}
                      {meal.nutrition.totals.protein_g ?? "—"} g
                    </p>
                  ) : (
                    <p className="recent-meal-notes">
                      Nutrition estimate unavailable for this entry.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div style={{ marginTop: "28px" }}>
          <a className="text-button" href="/dashboard">
            ← Back to overview
          </a>
        </div>
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
