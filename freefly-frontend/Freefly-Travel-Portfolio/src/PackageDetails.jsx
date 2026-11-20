
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  CalendarDays,
  MapPin,
  Clock,
  ChevronDown,
  Compass,
  Sparkles,
} from "lucide-react";

function PackageDetails() {
  const { packageId } = useParams();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://127.0.0.1:8000/api/packages/${packageId}`
        );

        if (!response.ok) {
          throw new Error("Package not found");
        }

        const data = await response.json();
        setPkg(data);
        setActiveDay(0);
      } catch (err) {
        console.error(err);
        setError("We could not load this package right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

  if (loading) {
    return (
      <main className="pd-state">
        <div className="pd-state-content">
          <Compass size={35} />
          <p>Preparing your journey...</p>
        </div>
      </main>
    );
  }

  if (error || !pkg) {
    return (
      <main className="pd-state">
        <div className="pd-state-content">
          <h1>Package not found</h1>
          <p>{error}</p>
          <Link to="/packages" className="pd-back-button">
            <ArrowLeft size={17} />
            Back to packages
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pd-page">

      {/* HERO */}
      <section className="pd-hero">
        <img
          className="pd-hero-image"
          src={pkg.image}
          alt={`${pkg.title} travel package`}
        />

        <div className="pd-hero-overlay" />

        <div className="pd-hero-content">
          <Link to="/packages" className="pd-back-link">
            <ArrowLeft size={17} />
            <span>BACK TO PACKAGES</span>
          </Link>

          <div className="pd-hero-bottom">
            <div className="pd-hero-copy">
              {pkg.tag && (
                <span className="pd-tag">
                  <Sparkles size={13} />
                  {pkg.tag}
                </span>
              )}

              <p className="pd-eyebrow">
                DISCOVER {pkg.destination}
              </p>

              <h1>{pkg.title}</h1>

              <p className="pd-hero-description">
                {pkg.description}
              </p>
            </div>

            <div className="pd-hero-number">
              <span>YOUR NEXT</span>
              <strong>ADVENTURE</strong>
              <span>STARTS HERE</span>
            </div>
          </div>
        </div>

        <div className="pd-hero-bottom-line">
          <span>CURATED EXPERIENCES</span>
          <span>UNFORGETTABLE MEMORIES</span>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="pd-summary">
        <div className="pd-summary-inner">

          <div className="pd-summary-item">
            <div className="pd-summary-icon">
              <MapPin />
            </div>
            <div>
              <span>DESTINATION</span>
              <strong>{pkg.destination}</strong>
            </div>
          </div>

          <div className="pd-summary-item">
            <div className="pd-summary-icon">
              <Clock />
            </div>
            <div>
              <span>DURATION</span>
              <strong>{pkg.duration}</strong>
            </div>
          </div>

          <div className="pd-summary-item">
            <div className="pd-summary-icon">
              <CalendarDays />
            </div>
            <div>
              <span>PACKAGE TYPE</span>
              <strong>{pkg.tag || "Travel package"}</strong>
            </div>
          </div>

          <div className="pd-summary-price">
            <span>STARTING FROM</span>
            <strong>{pkg.price}</strong>
          </div>

        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="pd-overview">
        <div className="pd-section-heading">
          <div>
            <span className="pd-section-label">01 / THE EXPERIENCE</span>
            <h2>
              More than a trip.
              <em> A story to live.</em>
            </h2>
          </div>

          <span className="pd-heading-decoration">EXPLORE</span>
        </div>

        <div className="pd-overview-content">
          <div className="pd-overview-image">
            <img src={pkg.image} alt={pkg.destination} />
            <span className="pd-image-caption">
              YOUR DESTINATION AWAITS
            </span>
          </div>

          <div className="pd-overview-text">
            <span className="pd-small-label">THE JOURNEY BEGINS</span>
            <h3>Discover every moment.</h3>
            <p>{pkg.description}</p>

            <div className="pd-overview-decoration">
              <Compass size={22} />
              <span>Made for curious travellers</span>
            </div>
          </div>
        </div>
      </section>

     
{/* ITINERARY */}

{pkg.itinerary && pkg.itinerary.length > 0 && (
  <section className="package-section pd-itinerary-section">
    <div className="pd-itinerary-heading">
      <span>YOUR JOURNEY</span>
      <h2>Day-by-Day Itinerary</h2>
      <p>
        Explore every moment of your travel experience.
      </p>
    </div>

    <div className="pd-itinerary-list">
      {pkg.itinerary.map((day, index) => {
        const isLegacy = typeof day === "string";

        const dayTitle = isLegacy
          ? `Day ${index + 1}`
          : day.title || `Day ${index + 1}`;

        const dayDescription = isLegacy
          ? day
          : day.description || "";

        const dayImage = isLegacy ? "" : day.image || "";

        return (
          <div
            className={`pd-itinerary-row ${
              index % 2 !== 0 ? "reverse" : ""
            }`}
            key={index}
          >
            {dayImage && (
              <div className="pd-itinerary-image">
                <img
                  src={dayImage}
                  alt={dayTitle}
                  loading="lazy"
                />
              </div>
            )}

            <div
              className={`pd-itinerary-content ${
                !dayImage ? "full-width" : ""
              }`}
            >
              <span className="pd-itinerary-day">
                DAY {String(index + 1).padStart(2, "0")}
              </span>

              <h3>{dayTitle}</h3>

              <p>{dayDescription}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
)}


    
{/* PACKAGE INCLUSIONS */}
{pkg.inclusions?.length > 0 && (
  <section className="pd-feature-section pd-inclusion-section">
    <div className="pd-feature-inner">
      <div className="pd-feature-images">
        {pkg.inclusion_images?.slice(0, 2).map((image, index) => (
          <div className="pd-feature-image" key={index}>
            <img
              src={image}
              alt={`Package inclusion ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="pd-feature-content">
        <span className="pd-feature-label">YOUR EXPERIENCE</span>
        <h2>What's Included</h2>
        <p className="pd-feature-description">
          Everything we've included to make your journey comfortable
          and memorable.
        </p>

        <ul>
          {pkg.inclusions.map((item, index) => (
            <li key={index}>
              <span className="pd-feature-icon">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
)}

{/* PACKAGE EXCLUSIONS */}
{pkg.exclusions?.length > 0 && (
  <section className="pd-feature-section pd-exclusion-section">
    <div className="pd-feature-inner">
      <div className="pd-feature-images">
        {pkg.exclusion_images?.slice(0, 2).map((image, index) => (
          <div className="pd-feature-image" key={index}>
            <img
              src={image}
              alt={`Package exclusion ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="pd-feature-content">
        <span className="pd-feature-label">PLEASE NOTE</span>
        <h2>What's Excluded</h2>
        <p className="pd-feature-description">
          A few things to keep in mind while planning your journey.
        </p>

        <ul>
          {pkg.exclusions.map((item, index) => (
            <li key={index}>
              <span className="pd-feature-icon">×</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
)}


      {/* CTA */}
      <section className="pd-cta">
        <div className="pd-cta-decoration">LET'S TRAVEL</div>

        <div className="pd-cta-content">
          <span className="pd-section-label">YOUR NEXT CHAPTER</span>
          <h2>
            The world is waiting.
            <em> Are you ready?</em>
          </h2>
          <p>
            Let our team help you plan an unforgettable experience
            with this package.
          </p>

          <Link to="/contact" className="pd-enquire-button">
            Enquire about this package
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </main>
  );
}

export default PackageDetails;
