
const features = [
  {
    number: "01",
    title: "Understand your plate",
    description:
      "Log what you eat and build a clearer picture of your everyday nutrition.",
    icon: "◒",
  },
  {
    number: "02",
    title: "Find what's missing",
    description:
      "Discover potential nutrient gaps using food data and your eating patterns.",
    icon: "⌕",
  },
  {
    number: "03",
    title: "Make small changes",
    description:
      "Get practical food suggestions that fit your habits, culture, and budget.",
    icon: "✳",
  },
];

export default function Home() {
  return (
    <main>
      <nav className="navbar">
        <a className="brand" href="/">
          <span className="brand-icon">e.</span>
          earthy
        </a>

        <div className="nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#our-approach">Our approach</a>
        </div>

        <a className="nav-cta" href="/profile">
          Get started <span>↗</span>
        </a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            NUTRITION, WITH A LITTLE MORE NATURE
          </div>

          <h1>
            Eat well.
            <br />
            <span>Feel whole.</span>
          </h1>

          <p className="hero-description">
            Your meals tell a story. Earthy helps you understand what your
            body might be missing and discover simple ways to nourish it better.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="/profile">
              Discover your nutrition <span>→</span>
            </a>
            <a className="text-button" href="#how-it-works">
              See how it works ↓
            </a>
          </div>

          <div className="hero-note">
            <span className="note-icon">✳</span>
            Grounded in food data. Designed for real life.
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />

          <div className="sun-disc" />

          <div className="leaf leaf-one">✳</div>
          <div className="leaf leaf-two">✳</div>

          <div className="food-plate">
            <div className="plate-center">
              <div className="food food-rice" />
              <div className="food food-greens" />
              <div className="food food-dal" />
              <div className="food food-tomato" />
              <div className="food food-roti" />
              <div className="food food-herbs" />
            </div>
          </div>

          <div className="floating-card nutrient-card">
            <span className="mini-label">YOUR DAILY PLATE</span>
            <div className="nutrient-row">
              <span className="nutrient-dot dot-green" />
              <span>Plant goodness</span>
              <strong>+</strong>
            </div>
            <div className="nutrient-row">
              <span className="nutrient-dot dot-yellow" />
              <span>Everyday energy</span>
              <strong>+</strong>
            </div>
            <div className="nutrient-row">
              <span className="nutrient-dot dot-orange" />
              <span>Essential nutrients</span>
              <strong>+</strong>
            </div>
          </div>

          <div className="floating-card quote-card">
            <span className="quote-mark">“</span>
            Small steps,
            <br />
            stronger roots.
          </div>

          <span className="visual-caption">A more mindful way to eat</span>
        </div>
      </section>

      <section className="principles" id="our-approach">
        <div>
          <span className="principle-number">01 / PERSONAL</span>
          <h3>Made for your plate</h3>
          <p>Nutrition that respects your food, routines, and budget.</p>
        </div>
        <div>
          <span className="principle-number">02 / PRACTICAL</span>
          <h3>Progress, not perfection</h3>
          <p>Small, realistic changes instead of restrictive food rules.</p>
        </div>
        <div>
          <span className="principle-number">03 / EVIDENCE-LED</span>
          <h3>Beyond guesswork</h3>
          <p>Food-data-based estimates, with uncertainty kept in view.</p>
        </div>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span className="eyebrow">A HEALTHIER PERSPECTIVE</span>
          <h2>Know your food. <span>Nourish your future.</span></h2>
          <p>Three simple steps toward understanding your everyday nutrition.</p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <div className="feature-top">
                <span>{feature.number}</span>
                <span className="feature-icon">{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="feature-arrow">↗</span>
            </article>
          ))}
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
