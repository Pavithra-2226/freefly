import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  CalendarDays,
  Map,
  Compass,
  Images,
} from "lucide-react";

function DestinationDetails() {
  const { destinationId } = useParams();

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://127.0.0.1:8000/api/destinations/${destinationId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Destination not found");
        }

        setDestination(data);
      } catch (error) {
        console.error("Destination details error:", error);
        setError("We could not load this destination.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [destinationId]);

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <main className="section">
        <div className="container destination-loading">
          <p>Loading destination...</p>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */

  if (error || !destination) {
    return (
      <main className="section">
        <div className="container destination-error">
          <h2>Destination not found</h2>

          <Link to="/destinations" className="destination-back-link">
            <ArrowLeft size={16} />
            Back to destinations
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     DESTINATION DATA
     ========================================================= */

  const places = destination.places || [];
  const thingsToDo = destination.things_to_do || [];
  const gallery = destination.gallery || [];

  return (
    <main className="destination-details-page">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="destination-detail-hero">

        <img
          src={destination.image}
          alt={destination.name}
        />

        <div className="destination-detail-overlay"></div>

        <div className="destination-detail-content">

          <span className="eyebrow">
            {destination.category}
          </span>

          <h1>{destination.name}</h1>

          <p className="destination-location">
            <MapPin size={18} />
            {destination.country}
          </p>

        </div>

      </section>


      {/* =====================================================
          DESTINATION INTRODUCTION
      ====================================================== */}

      <section className="section destination-intro-section">

        <div className="container">

          <div className="destination-detail-grid">

            {/* LEFT SIDE */}

            <div className="destination-intro-content">

              <span className="eyebrow">
                Discover {destination.name}
              </span>

              <h2>
                Experience the best of{" "}
                {destination.name}.
              </h2>

              <p className="destination-description">
                {destination.description}
              </p>

            </div>


            {/* RIGHT SIDE */}

            <div className="destination-info-wrapper">

              <div className="destination-info-card">

                <CalendarDays size={25} />

                <div>

                  <span className="destination-info-label">
                    Best Time to Visit
                  </span>

                  <h3>
                    {destination.best_time_to_visit ||
                      "Available throughout the year"}
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PLACES TO VISIT
      ====================================================== */}

      {places.length > 0 && (

        <section className="section destination-content-section">

          <div className="container">

            <div className="section-heading destination-section-heading">

              <div className="destination-heading-icon">
                <Map size={22} />
              </div>

              <div>

                <span className="eyebrow">
                  Explore
                </span>

                <h2>
                  Places to Visit in {destination.name}
                </h2>

                <p>
                  Discover the must-visit places and
                  attractions in {destination.name}.
                </p>

              </div>

            </div>


            {/* HORIZONTAL CARDS */}

            <div className="places-grid horizontal-scroll">

              {places.map((place, index) => (

                <article
                  className="place-card"
                  key={index}
                >

                  {/* IMAGE */}

                  <div className="place-card-image">

                    {place.image ? (

                      <img
                        src={place.image}
                        alt={place.name}
                      />

                    ) : (

                      <div className="place-image-placeholder">
                        <Map size={32} />
                      </div>

                    )}

                  </div>


                  {/* CONTENT */}

                  <div className="place-card-content">

                    <span className="place-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>
                      {place.name}
                    </h3>

                    {place.description && (

                      <p>
                        {place.description}
                      </p>

                    )}

                  </div>

                </article>

              ))}

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          THINGS TO DO
      ====================================================== */}

      {thingsToDo.length > 0 && (

        <section className="section destination-content-section">

          <div className="container">

            <div className="section-heading destination-section-heading">

              <div className="destination-heading-icon">
                <Compass size={22} />
              </div>

              <div>

                <span className="eyebrow">
                  Experiences
                </span>

                <h2>
                  Things to Do in {destination.name}
                </h2>

                <p>
                  Make your trip memorable with these
                  experiences and activities.
                </p>

              </div>

            </div>


            {/* HORIZONTAL CARDS */}

            <div className="places-grid horizontal-scroll">

              {thingsToDo.map((activity, index) => (

                <article
                  className="place-card activity-card"
                  key={index}
                >

                  {/* IMAGE */}

                  <div className="place-card-image">

                    {activity.image ? (

                      <img
                        src={activity.image}
                        alt={activity.name}
                      />

                    ) : (

                      <div className="place-image-placeholder">
                        <Compass size={32} />
                      </div>

                    )}

                  </div>


                  {/* CONTENT */}

                  <div className="place-card-content">

                    <span className="place-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>
                      {activity.name}
                    </h3>

                    {activity.description && (

                      <p>
                        {activity.description}
                      </p>

                    )}

                  </div>

                </article>

              ))}

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          GALLERY
      ====================================================== */}

      {gallery.length > 0 && (

        <section className="section destination-gallery-section">

          <div className="container">

            <div className="section-heading destination-section-heading">

              <div className="destination-heading-icon">
                <Images size={22} />
              </div>

              <div>

                <span className="eyebrow">
                  Gallery
                </span>

                <h2>
                  {destination.name} Gallery
                </h2>

                <p>
                  Take a look at some highlights from
                  this destination.
                </p>

              </div>

            </div>


            {/* HORIZONTAL GALLERY */}

            <div className="destination-gallery horizontal-scroll">

              {gallery.map((image, index) => (

                <div
                  className="destination-gallery-item"
                  key={index}
                >

                  <img
                    src={image}
                    alt={`${destination.name} ${index + 1}`}
                  />

                </div>

              ))}

            </div>

          </div>

        </section>

      )}


      {/* =====================================================
          PACKAGES CTA
      ====================================================== */}

      <section className="section destination-package-cta">

        <div className="container">

          <div className="destination-cta-inner">

            <span className="eyebrow">
              Plan Your Journey
            </span>

            <h2>
              Planning a trip to {destination.name}?
            </h2>

            <p>
              Explore our travel packages and find an
              itinerary that suits your time and budget.
            </p>

            <Link
              to="/packages"
              className="button destination-cta-button"
            >
              Explore Packages
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          BACK TO DESTINATIONS
      ====================================================== */}

      <section className="section destination-back-section">

        <div className="container">

          <Link
            to="/destinations"
            className="destination-back-link"
          >
            <ArrowLeft size={16} />
            Back to all destinations
          </Link>

        </div>

      </section>

    </main>
  );
}

export default DestinationDetails;