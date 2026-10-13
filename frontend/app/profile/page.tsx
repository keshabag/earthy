
"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [form, setForm] = useState({
    age: "",
    sex: "",
    weight: "",
    height: "",
    activity: "moderate",
    diet: "vegetarian",
    budget: "medium",
  });

  function updateField(field: string, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("earthy-profile", JSON.stringify(form));
    window.location.href = "/dashboard";
  }

  return (
    <main className="profile-page">
      <nav className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">e.</span>
          earthy
        </a>
        <a className="text-button" href="/">← Back home</a>
      </nav>

      <section className="profile-container">
        <div className="eyebrow">
          <span className="status-dot" />
          YOUR PERSONAL NUTRITION JOURNEY
        </div>

        <h1>First, let&apos;s get to <span>know you.</span></h1>
        <p className="profile-intro">
          A few details help us make your nutrition insights more relevant
          to your everyday life. Your food journey starts here.
        </p>

        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-section-title">
            <span>01</span>
            <h2>A little about you</h2>
          </div>

          <div className="form-grid">
            <label className="form-field">
              Age
              <input
                type="number"
                min="18"
                max="120"
                required
                value={form.age}
                onChange={(e) => updateField("age", e.target.value)}
                placeholder="Your age"
              />
            </label>

            <label className="form-field">
              Sex used for nutrition estimates
              <select
                required
                value={form.sex}
                onChange={(e) => updateField("sex", e.target.value)}
              >
                <option value="">Choose an option</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other / prefer not to specify</option>
              </select>
            </label>

            <label className="form-field">
              Weight (kg)
              <input
                type="number"
                min="1"
                max="500"
                step="0.1"
                required
                value={form.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                placeholder="e.g. 60"
              />
            </label>

            <label className="form-field">
              Height (cm)
              <input
                type="number"
                min="50"
                max="270"
                required
                value={form.height}
                onChange={(e) => updateField("height", e.target.value)}
                placeholder="e.g. 170"
              />
            </label>
          </div>

          <div className="form-section-title">
            <span>02</span>
            <h2>Your everyday routine</h2>
          </div>

          <label className="form-field full-field">
            How active are you on a typical day?
            <select
              value={form.activity}
              onChange={(e) => updateField("activity", e.target.value)}
            >
              <option value="low">Mostly sitting, little exercise</option>
              <option value="light">Light activity or occasional walks</option>
              <option value="moderate">Moderately active, regular exercise</option>
              <option value="high">Very active or physically demanding routine</option>
            </select>
          </label>

          <div className="form-section-title">
            <span>03</span>
            <h2>Food that fits your life</h2>
          </div>

          <label className="form-field full-field">
            Your usual dietary pattern
            <select
              value={form.diet}
              onChange={(e) => updateField("diet", e.target.value)}
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="eggetarian">Vegetarian + eggs</option>
              <option value="non-vegetarian">Includes meat or fish</option>
            </select>
          </label>

          <label className="form-field full-field">
            Your approximate daily food budget
            <select
              value={form.budget}
              onChange={(e) => updateField("budget", e.target.value)}
            >
              <option value="low">Budget-friendly</option>
              <option value="medium">Moderate</option>
              <option value="high">Flexible</option>
            </select>
          </label>

          <div className="privacy-note">
            <span>✳</span>
            For this prototype, your profile is saved in this browser only.
          </div>

          <button className="primary-button submit-button" type="submit">
            Continue to Earthy <span>→</span>
          </button>
        </form>
      </section>
    </main>
  );
}
