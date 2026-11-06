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
} from "lucide-react";

function PackageDetails() {
  const { packageId } = useParams();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <main className="package-details-page">
        <div className="package-details-loading">
          <p>Loading package...</p>
        </div>
      </main>
    );
  }

  if (error || !pkg) {
    return (
      <main className="package-details-page">
        <div className="package-details-error">
          <h1>Package not found</h1>
          <p>{error}</p>

          <Link to="/packages" className="package-back-button">
            <ArrowLeft size={17} />
            Back to packages
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="package-details-page">

      {/* HERO */}
      <section className="package-details-hero">
        <img
          src={pkg.image}
          alt={`${pkg.title} travel package`}
        />

        <div className="package-details-overlay" />

        <div className="package-details-hero-content">

          <Link
            to="/packages"
            className="package-details-back"
          >
            <ArrowLeft size={17} />
            All packages
          </Link>

          {pkg.tag && (
            <span className="package-details-tag">
              {pkg.tag}
            </span>
          )}

          <p className="package-details-eyebrow">
            {pkg.destination}
          </p>

          <h1>{pkg.title}</h1>

          <p className="package-details-hero-description">
            {pkg.description}
          </p>

        </div>
      </section>


      {/* PACKAGE SUMMARY */}
      <section className="package-details-summary">
        <div className="package-details-summary-inner">

          <div className="package-summary-item">
            <MapPin size={21} />
            <div>
              <span>Destination</span>
              <strong>{pkg.destination}</strong>
            </div>
          </div>

          <div className="package-summary-item">
            <Clock size={21} />
            <div>
              <span>Duration</span>
              <strong>{pkg.duration}</strong>
            </div>
          </div>

          <div className="package-summary-item">
            <CalendarDays size={21} />
            <div>
              <span>Package type</span>
              <strong>{pkg.tag || "Travel package"}</strong>
            </div>
          </div>

          <div className="package-summary-price">
            <span>Starting from</span>
            <strong>{pkg.price}</strong>
          </div>

        </div>
      </section>


      {/* MAIN CONTENT */}
      <section className="package-details-content">

        <div className="package-details-main">

          {/* DESCRIPTION */}
          <section className="package-section">
            <span className="package-section-label">
              THE EXPERIENCE
            </span>

            <h2>
              A journey worth
              <em> remembering.</em>
            </h2>

            <p className="package-description">
              {pkg.description}
            </p>
          </section>


          {/* ITINERARY */}
          {pkg.itinerary && pkg.itinerary.length > 0 && (
            <section className="package-section">

              <span className="package-section-label">
                YOUR JOURNEY
              </span>

              <h2>
                Day by day.
              </h2>

              <div className="package-itinerary">

                {pkg.itinerary.map((day, index) => (
                  <div
                    className="itinerary-item"
                    key={index}
                  >
                    <div className="itinerary-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="itinerary-content">
                      <span>
                        DAY {index + 1}
                      </span>

                      <p>{day}</p>
                    </div>
                  </div>
                ))}

              </div>
            </section>
          )}


          {/* INCLUSIONS / EXCLUSIONS */}
          <section className="package-section">

            <span className="package-section-label">
              WHAT'S INCLUDED
            </span>

            <h2>
              Everything you need.
            </h2>

            <div className="package-inclusion-grid">

              {/* INCLUSIONS */}
              <div className="package-list-card included">

                <div className="package-list-heading">
                  <div className="package-list-icon">
                    <Check size={18} />
                  </div>

                  <h3>Inclusions</h3>
                </div>

                {pkg.inclusions && pkg.inclusions.length > 0 ? (
                  <ul>
                    {pkg.inclusions.map((item, index) => (
                      <li key={index}>
                        <Check size={15} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="package-empty-list">
                    No inclusions added yet.
                  </p>
                )}

              </div>


              {/* EXCLUSIONS */}
              <div className="package-list-card excluded">

                <div className="package-list-heading">
                  <div className="package-list-icon">
                    <X size={18} />
                  </div>

                  <h3>Exclusions</h3>
                </div>

                {pkg.exclusions && pkg.exclusions.length > 0 ? (
                  <ul>
                    {pkg.exclusions.map((item, index) => (
                      <li key={index}>
                        <X size={15} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="package-empty-list">
                    No exclusions added yet.
                  </p>
                )}

              </div>

            </div>

          </section>


          {/* CTA */}
          <section className="package-details-cta">

            <div>
              <span className="package-section-label">
                READY TO GO?
              </span>

              <h2>
                Let's plan your
                <em> journey.</em>
              </h2>

              <p>
                Tell us what you have in mind and our team
                will help you turn this package into your perfect trip.
              </p>
            </div>

            <Link
              to="/contact"
              className="package-enquire-button"
            >
              Enquire about this package
              <ArrowRight size={18} />
            </Link>

          </section>

        </div>

      </section>

    </main>
  );
}

export default PackageDetails;