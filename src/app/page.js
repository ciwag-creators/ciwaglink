import Link from "next/link";


export default function HomePage() {
  return (
    <div className="home-page">
      {/* HEADER */}
      <header className="navbar">
        <div className="logo">
          <div className="logo-circle">C</div>
          <h2>CIWAGLINK</h2>
        </div>

        <nav>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-buttons">
          <Link href="/login" className="login-btn">
            Login
          </Link>

          <Link href="/signup" className="signup-btn">
            Create Account
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-left">
          <span className="welcome-badge">
            Welcome to CIWAGLINK
          </span>

          <h1>
            Fast, Reliable & Secure
            <span> VTU Services</span>
          </h1>

          <p>
            Buy airtime, data, electricity tokens,
            cable TV subscriptions and exam pins
            instantly from anywhere in Nigeria.
          </p>

          <div className="hero-buttons">
            <Link href="/signup" className="primary-btn">
              Create Account
            </Link>

            <Link href="/login" className="secondary-btn">
              Login to Dashboard
            </Link>
          </div>

          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <div>
                <h4>Instant Delivery</h4>
                <p>Fast service activation</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <div>
                <h4>Secure Payments</h4>
                <p>Your funds are protected</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <div>
                <h4>24/7 Support</h4>
                <p>Always available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="phone-card">
            <div className="phone-top">
              <p>Wallet Balance</p>
              <h2>₦12,450</h2>
            </div>

            <div className="phone-services">
              <div>Airtime</div>
              <div>Data</div>
              <div>Electricity</div>
              <div>Exam Pin</div>
              <div>Cable TV</div>
              <div>History</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services-section" id="services">
        <div className="section-title">
          <span>WHAT WE OFFER</span>
          <h2>Our Services</h2>
          <p>Everything you need in one place</p>
        </div>

        <div className="services-grid">
          <div className="service-box">
            <div className="service-icon green">📞</div>
            <h3>Airtime</h3>
            <p>
              Instant airtime recharge for all
              Nigerian networks.
            </p>
          </div>

          <div className="service-box">
            <div className="service-icon blue">📶</div>
            <h3>Data</h3>
            <p>
              Cheap SME and gifting data plans.
            </p>
          </div>

          <div className="service-box">
            <div className="service-icon yellow">⚡</div>
            <h3>Electricity</h3>
            <p>
              Buy prepaid electricity tokens easily.
            </p>
          </div>

          <div className="service-box">
            <div className="service-icon purple">📺</div>
            <h3>Cable TV</h3>
            <p>
              Subscribe your DSTV, GOTV and Startimes.
            </p>
          </div>

          <div className="service-box">
            <div className="service-icon pink">🎓</div>
            <h3>Exam Pins</h3>
            <p>
              WAEC, NECO and NABTEB exam pins.
            </p>
          </div>

          <div className="service-box">
            <div className="service-icon sky">📄</div>
            <h3>Transactions</h3>
            <p>
              Monitor all your transaction history.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="stat-box">
          <h2>10,000+</h2>
          <p>Happy Customers</p>
        </div>

        <div className="stat-box">
          <h2>100%</h2>
          <p>Secure Transactions</p>
        </div>

        <div className="stat-box">
          <h2>Instant</h2>
          <p>Service Delivery</p>
        </div>

        <div className="stat-box">
          <h2>24/7</h2>
          <p>Customer Support</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contact">
        <h2>CIWAGLINK</h2>

        <p>
          Reliable VTU & Digital Services Platform.
        </p>

        <div className="footer-links">
          <Link href="/signup">Create Account</Link>
          <Link href="/login">Login</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>

        <small>
          © 2026 CIWAGLINK. All rights reserved.
        </small>
      </footer>
    </div>
  );
}
