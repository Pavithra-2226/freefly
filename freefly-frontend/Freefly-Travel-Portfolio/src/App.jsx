import { useState,useEffect,useRef } from 'react'

import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'
import aboutHero from './assets/about-hero.png'
import heroMountain from './assets/hero-mountain.png';
import packagesHero from "./assets/packages-hero.png";
import servicesHero from "./assets/services-hero.png";
import ctaBg from "./assets/cta-lake.jpg";
import contactHero from "./assets/contact-hero.png";
import freeflyLogo from './assets/freefly-logo.png';
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";
import AdminDestinations from "./admin/AdminDestinations";
import AdminPackages from "./admin/AdminPackages";
import AdminServices from "./admin/AdminServices";
import DestinationDetails from "./DestinationDetails";
import PackageDetails from "./PackageDetails";
import AdminEnquiries from "./admin/AdminEnquiries";
import AdminHomePage from "./admin/AdminHomePage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Compass, Sparkles } from "lucide-react";
gsap.registerPlugin(ScrollTrigger);
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import {
  ShieldCheck,
  BriefcaseBusiness,
  MapPin,
  Headphones,
  Plane,
  Star,
  ArrowRight,
  Check,
  ChevronRight,
  Mail,
  Menu,
  Phone,
  Play,
  MessageCircle,
  Map,
  Luggage,
  X
} from "lucide-react";
import { destinations, gallery, packages, services } from './data'
import './App.css'

const navItems = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/destinations', 'Destinations'],
  ['/packages', 'Packages'],
  ['/services', 'Services'],
  ['/contact', 'Contact']
]

/* =====================================================
   SCROLL REVEAL ANIMATION (added)
   ===================================================== */
function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Styles are injected here so only App.jsx changes
    const style = document.createElement('style')
    style.setAttribute('data-scroll-reveal', '')
    style.textContent = `
      .reveal { opacity: 0; translate: 0 45px; }
      .reveal.reveal-left { translate: -50px 0; }
      .reveal.reveal-right { translate: 50px 0; }
      .reveal.reveal-in {
        animation: revealIn 0.85s cubic-bezier(.22,.61,.36,1) both;
        animation-delay: var(--reveal-delay, 0s);
      }
      @keyframes revealIn {
        from { opacity: 0; }
        to   { opacity: 1; translate: 0 0; }
      }
    `
    document.head.appendChild(style)

    const selectors = [
      '.section-heading', '.heading-row .button', '.why-layout > div',
      '.benefit', '.destination-card', '.package-card',
      '.gallery-grid a', '.gallery-grid button',
      '.filter-row', '.search-row',
      '.about-points > div', '.stats > div', '.mission-block',
      '.mission-image', '.split img', '.split > div',
      '.services-world-intro', '.services-showcase-heading',
      '.services-showcase-card', '.services-benefits-title',
      '.services-benefit', '.services-process-heading',
      '.services-process-card',
      '.contact-details p', '.contact-section form',
      '.footer-grid > div', '.footer-bottom'
    ].join(',')

    const seen = new WeakSet()

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )

    const scan = () => {
      document.querySelectorAll(selectors).forEach((el) => {
        if (seen.has(el) || el.closest('.hero, .page-hero, .cta-section')) return
        seen.add(el)

        const siblings = el.parentElement ? [...el.parentElement.children] : []
        const index = Math.max(siblings.indexOf(el), 0)
        el.style.setProperty('--reveal-delay', `${(index % 4) * 0.1}s`)

        // Split layouts slide in from the sides
        if (el.matches('.split > img, .mission-image')) el.classList.add('reveal-left')
        if (el.matches('.split > div:last-child')) el.classList.add('reveal-right')

        el.classList.add('reveal')
        io.observe(el)
      })
    }

    scan()
    // Re-scan when routes change or API data (destinations/packages) loads
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      io.disconnect()
      style.remove()
    }
  }, [])
}

const Button = ({ children, to = '#', secondary = false }) => (
  <Link
    className={`button ${secondary ? 'button-secondary' : ''}`}
    to={to}
  >
    {children}
    <ArrowRight size={16} />
  </Link>
)

const SectionHeading = ({ eyebrow, title, copy, light = false }) => (
  <div className={`section-heading ${light ? 'light' : ''}`}>
    <span className="eyebrow">{eyebrow}</span>
    <h2>{title}</h2>
    {copy && <p>{copy}</p>}
  </div>
)

function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <header
      className="navbar"
    >
     <Link className="brand" to="/">
  <img
    src={freeflyLogo}
    alt="Freefly Tourism & Travels"
    className="brand-logo"
  />
</Link>

      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>

      <nav className={open ? 'nav-open' : ''}>
        {navItems.map(([path, label]) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setOpen(false)}
          >
            {label}
          </NavLink>
        ))}

        <a
          className="whatsapp"
          href="https://wa.me/8825668075"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp <ArrowRight size={15} />
        </a>
      </nav>
    </header>
  )
}


function Home() {
  const [homepage, setHomepage] = useState({
    banners: [],
    postcards: []
  });

  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const heroContentRef = useRef(null);
  const galleryRef = useRef(null);

  // Load homepage content from CMS
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/homepage")
      .then(response => {
        if (!response.ok) {
          throw new Error("Unable to load homepage.");
        }
        return response.json();
      })
      .then(data => {
        setHomepage({
          banners: data.banners || [],
          postcards: data.postcards || []
        });
      })
      .catch(error => {
        console.error("Homepage loading error:", error);
      });
  }, []);

  const activeBanner = homepage.banners[0];

  // Hero and promotional card animations
  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    const image = heroImageRef.current;
    const content = heroContentRef.current;
    const gallery = galleryRef.current;

    const mediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const reducedMotion = mediaQuery.matches;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;

      // HERO IMAGE 3D ENTRANCE
      if (image) {
        gsap.fromTo(
          image,
          {
            opacity: 0,
            scale: 1.08,
            rotationY: -7,
            rotationX: 3,
            z: -100
          },
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            z: 0,
            duration: 2,
            ease: "power3.out"
          }
        );
      }

      // HERO TEXT ANIMATION
      if (content) {
        gsap.fromTo(
          content.children,
          {
            opacity: 0,
            y: 45
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.18,
            delay: 0.4,
            ease: "power3.out"
          }
        );
      }

      // GALLERY CARD SCROLL REVEAL
      if (gallery) {
        const cards = gallery.querySelectorAll(
          ".ff-home-gallery-item"
        );

        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 65,
            rotationX: 9,
            scale: 0.96
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gallery,
              start: "top 80%",
              once: true
            }
          }
        );
      }
    }, hero);

    // MOUSE RESPONSIVE 3D HERO
    const handleMouseMove = event => {
      if (
        reducedMotion ||
        !image ||
        window.innerWidth < 768
      ) {
        return;
      }

      const bounds = hero.getBoundingClientRect();

      const x =
        (event.clientX - bounds.left) / bounds.width - 0.5;

      const y =
        (event.clientY - bounds.top) / bounds.height - 0.5;

      gsap.to(image, {
        rotationY: x * 6,
        rotationX: y * -5,
        x: x * -15,
        y: y * -12,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto"
      });
    };

    const handleMouseLeave = () => {
      if (!image || reducedMotion) return;

      gsap.to(image, {
        rotationY: 0,
        rotationX: 0,
        x: 0,
        y: 0,
        duration: 1,
        ease: "power3.out"
      });
    };

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("mouseleave", handleMouseLeave);

    // CLEANUP
    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("mouseleave", handleMouseLeave);

      ctx.revert();
    };
  }, [homepage]);

  // Promotional card 3D hover animation
  useEffect(() => {
    const gallery = galleryRef.current;

    if (!gallery || window.innerWidth < 768) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const cards = gallery.querySelectorAll(
      ".ff-home-gallery-item"
    );

    const cleanups = [];

    cards.forEach(card => {
      const handleMove = event => {
        const bounds = card.getBoundingClientRect();

        const x =
          (event.clientX - bounds.left) / bounds.width - 0.5;

        const y =
          (event.clientY - bounds.top) / bounds.height - 0.5;

        gsap.to(card, {
          rotationY: x * 7,
          rotationX: y * -7,
          y: -7,
          duration: 0.45,
          ease: "power2.out"
        });
      };

      const handleLeave = () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          y: 0,
          duration: 0.7,
          ease: "power3.out"
        });
      };

      card.addEventListener("mousemove", handleMove);
      card.addEventListener("mouseleave", handleLeave);

      cleanups.push(() => {
        card.removeEventListener("mousemove", handleMove);
        card.removeEventListener("mouseleave", handleLeave);
      });
    });

    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [homepage.postcards]);

  return (
    <main>

      {/* CINEMATIC 3D HERO BANNER */}

      <section
        className="hero ff-cinematic-hero"
        ref={heroRef}
      >
        <div
          className="ff-hero-image-layer"
          ref={heroImageRef}
          style={{
            backgroundImage: activeBanner?.image
              ? `url("${activeBanner.image}")`
              : "none"
          }}
        />

        <div className="ff-hero-shade" />

        <div
          className="container hero-content ff-hero-content"
          ref={heroContentRef}
        >
          <span className="eyebrow">
            {activeBanner?.subtitle ||
              "Explore the world with Freefly"}
          </span>

          <h1>
            {activeBanner?.title || (
              <>
                Your Journey
                <br />
                <em>Begins Here</em>
              </>
            )}
          </h1>

          <p>
            {activeBanner?.description ||
              "Discover beautiful destinations, curated travel packages and unforgettable experiences with Freefly Tourism & Travels."}
          </p>

          <Button
            to={activeBanner?.button_link || "/destinations"}
          >
            {activeBanner?.button_text || "Explore More"}
          </Button>
        </div>

        <div className="hero-scroll">
          <span>Scroll to discover</span>
          <span className="scroll-line" />
        </div>
      </section>

      {/* DYNAMIC PROMOTIONAL GALLERY */}

      
{/* CONTINUOUS HORIZONTAL GALLERY */}

{homepage.postcards.length > 0 && (
  <section
    className="ff-home-gallery"
    ref={galleryRef}
  >
    <div className="ff-home-gallery-heading">
      <span>EXPLORE THE WORLD</span>
      <h2>Visit Our Gallery</h2>
      <p>
        Discover beautiful destinations and unforgettable moments.
      </p>
    </div>

    <div className="ff-home-gallery-marquee">
      <div className="ff-home-gallery-track">

        {/* First set of images */}
        {[0, 1].map((group) => (
          <div
            className="ff-home-gallery-group"
            key={group}
            aria-hidden={group === 1}
          >
            {homepage.postcards.map((item, index) => (
              <div
                className="ff-home-gallery-item"
                key={`${group}-${item.id || index}`}
              >
                <img
                  src={item.image}
                  alt={item.title || "Freefly destination"}
                  loading="lazy"
                />

                <div className="ff-gallery-card-caption">
                  {item.title && <h3>{item.title}</h3>}
                  {item.subtitle && <p>{item.subtitle}</p>}
                </div>
              </div>
            ))}
          </div>
        ))}

      </div>
    </div>
  </section>
)}


      {/* YOUR OTHER HOMEPAGE SECTIONS CAN BE ADDED HERE */}

    </main>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-grid">

        <div>
          <Link className="brand" to="/">
            <span className="brand-mark">F</span>

            <span>
              <strong>freefly</strong>
              <small>Tourism & Travels</small>
            </span>
          </Link>

          <p className="footer-copy">
            Travel thoughtfully. See the world with people who care about
            how the journey feels.
          </p>

          <div className="socials">

            <a
              href="https://www.instagram.com/freefly_tourism/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a href="#facebook" aria-label="Facebook">
              <FaFacebookF />
            </a>

            <a href="#twitter" aria-label="Twitter">
              <FaTwitter />
            </a>

          </div>
        </div>

        <div>
          <h4>Explore</h4>
          <Link to="/about">Our story</Link>
          <Link to="/destinations">Destinations</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/gallery">Travel gallery</Link>
        </div>

        <div>
          <h4>Services</h4>

          {services.slice(0, 4).map((service) => (
            <Link
              key={service.title}
              to="/services"
            >
              {service.title}
            </Link>
          ))}
        </div>

        <div>
          <h4>Get in touch</h4>

          <p className="contact-line">
            <Phone size={15} /> +91 8015613840
          </p>

          <p className="contact-line">
            <Mail size={15} /> freeflytourismandtravels@gmail.com
          </p>

          <p className="contact-line">
            <MapPin size={15} /> Chennai & Coimbatore
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <span>© 2024 Freefly Tourism & Travels</span>
        <span>Made for curious travellers.</span>
      </div>
    </footer>
  )
}

function ServiceCards() {
  const [serviceItems, setServiceItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/services",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const activeServices = (Array.isArray(data) ? data : [])
          .filter((service) => service.status === "active")
          .sort(
            (a, b) =>
              (a.sort_order ?? 0) - (b.sort_order ?? 0)
          );

        setServiceItems(activeServices);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Services loading error:", err);
        setError("Unable to load services. Please try again later.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchServices();

    return () => controller.abort();
  }, []);

  return (
    <div className="services-showcase">
      <div className="services-showcase-heading">
        <div>
          <span className="services-label">EXPLORE OUR SERVICES</span>
          <h2>
            Everything Travel, <em>In One Place.</em>
          </h2>
        </div>

        <p>
          Explore our range of travel services, designed to
          make planning your next journey easier.
        </p>
      </div>

      {loading && <p>Loading services...</p>}

      {error && <p className="form-error">{error}</p>}

      {!loading && !error && serviceItems.length === 0 && (
        <p>No services available at the moment.</p>
      )}

      {!loading && !error && serviceItems.length > 0 && (
        <div className="services-showcase-grid">
          {serviceItems.map((service, index) => (
            <article
              className="services-showcase-card"
              key={service.id || service._id || `${service.title}-${index}`}
            >
              <div className="services-showcase-image">
                <img
                  src={service.image || servicesHero}
                  alt={service.title || "Freefly travel service"}
                  loading="lazy"
                />

                <span className="services-showcase-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="services-showcase-content">
                {service.tag && (
                  <span className="services-showcase-category">
                    {service.tag}
                  </span>
                )}

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <Link
                  to={service.button_link || "/contact"}
                  className="services-showcase-link"
                >
                  {service.button_text || "Enquire Now"}
                  <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function DestinationCards({ items = destinations }) {
  return (
    <div className="destination-grid">
      {items.map((destination) => (
        <article
          className="destination-card"
          key={destination.name}
        >
          <img
            src={destination.image}
            alt={`${destination.name}, ${destination.country}`}
          />

          <div className="destination-body">
            <span className="card-kicker">
              <MapPin size={13} />
              {destination.country}
            </span>

            <h3>{destination.name}</h3>

            <p>{destination.description}</p>

           <Link to={`/destinations/${destination.id}`}>
                Explore Destination
              <ArrowRight size={15} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}

function PackageCards({ items = [] }) {
  return (
    <div className="package-grid">
      {items.map((item) => (
        <article
          className="package-card"
          key={item.id || item.title}
        >
          <div className="package-image">
            <img
              src={item.image}
              alt={`${item.title} travel package`}
            />

            <span>{item.tag}</span>
          </div>

          <div className="package-body">
            <div className="package-meta">
              <span>{item.destination}</span>
              <span>{item.duration}</span>
            </div>

            <h3>{item.title}</h3>

            <p>{item.description}</p>

            <div className="package-footer">
              <strong>{item.price}</strong>
            <Button to={`/packages/${item.id}`}>View details</Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function GalleryGrid({ linkTo = '/about' }) {
  return (
    <div className="gallery-grid">
      {gallery.map((item, index) => (
        <Link
          to={linkTo}
          className={item.className || ''}
          key={index}
        >
          <img
            src={item.image}
            alt={item.alt}
          />
        </Link>
      ))}
    </div>
  )
}

function CTA() {
  const ctaRef = useRef(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setCtaVisible(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <center>
      <section
        ref={ctaRef}
        className={`cta-section ${ctaVisible ? "cta-visible" : ""}`}
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0, 0, 0, 0.55),
              rgba(0, 0, 0, 0.75)
            ),
            url(${ctaBg})
          `
        }}
      >
        <div>
          <span className="eyebrow">Ready when you are</span>

          <h2>
            Let's plan your
            <br />
            <em>next journey.</em>
          </h2>

          <p>
            Tell us where you want to go and we'll help you create
            a memorable travel experience.
          </p>

          <Button to="/contact">
            Plan my trip
          </Button>

          <Button to="/packages" secondary>
            Explore packages
          </Button>
        </div>
      </section>
    </center>
  );
}






function PageHero({ eyebrow, title, copy, image }) {
  return (
    <section className="page-hero">
      {image && (
        <img
          className="page-hero-image"
          src={image}
          alt=""
        />
      )}

      <div className="page-hero-overlay"></div>

      <div className="container page-hero-content">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {copy && <p>{copy}</p>}
      </div>
    </section>
  );
}


function About() {
  const services = [
    "Domestic Tour Packages",
    "Weekend Getaways",
    "Group Tours & Adventures",
    "Family Holiday Packages",
    "Sightseeing & Local Tours",
    "Transportation Arrangements",
    "Accommodation & Travel Planning",
    "Customised Tour Packages",
  ];

  return (
    <main className="about-page">

      {/* EXISTING HERO - KEEP UNCHANGED */}

      <PageHero
        eyebrow="Our story"
        title="Travel with a little more wonder."
        copy="Freefly exists for the in-between moments: the first step off the plane, the table you find by accident, and the view you never forget."
        image={aboutHero}
      />

      {/* ABOUT FREEFLY */}

      <section className="section about-intro">
        <div className="container split">

          <div className="about-image-grid">
            <img
              src={destinations[3].image}
              alt="Beautiful travel destination"
              className="about-image-main"
            />

            <img
              src={destinations[4].image}
              alt="Scenic travel destination"
              className="about-image-secondary"
            />
          </div>

          <div className="about-content">
            <SectionHeading
              eyebrow="About Us"
              title="FreeFly Tourism & Travels"
              copy="FreeFly Tourism & Travels is a travel and tourism company dedicated to creating memorable travel experiences through well-planned trips, exciting destinations and comfortable travel arrangements."
            />

            <p>
              We believe travelling is more than just visiting
              places — it is about discovering new experiences,
              connecting with people and creating memories that
              last a lifetime.
            </p>

            <p>
              From refreshing weekend getaways and group trips
              to family vacations and customised travel packages,
              we aim to make every journey enjoyable, convenient
              and hassle-free.
            </p>

            <p>
              With a focus on customer satisfaction, reliable
              travel arrangements and carefully planned
              itineraries, FreeFly Tourism & Travels brings
              people closer to the destinations they dream
              of exploring.
            </p>
          </div>

        </div>
      </section>

      {/* BUSINESS DESCRIPTION & SERVICES */}

      <section className="section about-services-section">
        <div className="container">

          <div className="about-services-heading">
            <SectionHeading
              eyebrow="Our Business"
              title="Travel experiences made simple."
              copy="FreeFly Tourism & Travels offers travel planning and tourism services designed for individuals, families, friends and groups. We organise domestic tour packages, weekend trips, sightseeing tours, group adventures and customised holiday experiences."
            />
          </div>

          <div className="about-services-grid">
            {services.map((service, index) => (
              <div className="about-service-card" key={service}>
                <span className="service-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{service}</h3>

                <span className="service-arrow">↗</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* BRAND TAGLINE */}

      <section className="about-brand-message">
        <div className="container">
          <span className="eyebrow">Your Journey Starts Here</span>

          <h2>
            Explore More.
            <br />
            Travel Freely.
            <br />
            Create Memories.
          </h2>
        </div>
      </section>

      {/* EXISTING CTA */}

      <CTA />

    </main>
  );
}
 



function Destinations() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const categories = [
    'All',
    'International',
    'India',
    'Beach',
    'Adventure',
    'Honeymoon'
  ]

  // Debounce the search box slightly so we don't fire a request on every
  // keystroke, then fetch from the API whenever category or the debounced
  // search term changes.
  useEffect(() => {
    const controller = new AbortController()

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams()
      if (category && category !== 'All') params.set('category', category)
      if (query.trim()) params.set('search', query.trim())

      setLoading(true)
      setError(null)

      fetch(`/api/destinations?${params.toString()}`, {
        signal: controller.signal
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
          }
          return response.json()
        })
        .then((data) => {
          setItems(data)
          setLoading(false)
        })
        .catch((err) => {
          if (err.name === 'AbortError') return
          setError('We could not load destinations right now. Please try again shortly.')
          setLoading(false)
        })
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      controller.abort()
    }
  }, [category, query])

  return (
    <main>

      <PageHero
        eyebrow="Where next?"
        title="Find your kind of somewhere."
        copy="Browse a few of our favourite places, then let us make the itinerary yours."
        image="/images/destinations-hero.png"
      />

      <section className="section">
        <div className="container">

          <div className="filter-row">
            {categories.map((item) => (
              <button
                className={
                  category === item
                    ? 'filter-active'
                    : ''
                }
                key={item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="search-row">
            <span>
              {loading
                ? 'Loading destinations…'
                : `Showing ${items.length} destinations`}
            </span>

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search destinations"
              aria-label="Search destinations"
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          {!error && !loading && items.length === 0 && (
            <p>No destinations match your search yet. Try a different category or keyword.</p>
          )}

          {!error && items.length > 0 && <DestinationCards items={items} />}

        </div>
      </section>

    </main>
  )
}
function Packages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/packages")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setError(
          "We could not load packages right now. Please try again shortly."
        );
        setLoading(false);
      });
  }, []);

  return (
    <main className="premium-packages-page">

      {/* CINEMATIC HERO */}
      <section className="premium-packages-hero">

        <div className="premium-packages-hero-image">
          <img src={packagesHero} alt="Explore beautiful destinations" />
        </div>

        <div className="premium-packages-hero-overlay" />

        <div className="packages-hero-decoration">
          <span className="hero-orbit orbit-one" />
          <span className="hero-orbit orbit-two" />
        </div>

        <div className="premium-packages-hero-content">

          <div className="packages-hero-eyebrow">
            <Sparkles size={14} />
            <span>TRAVEL BEYOND THE ORDINARY</span>
          </div>

          <h1>
            The world is
            <br />
            <span>waiting for you.</span>
          </h1>

          <p>
            Extraordinary places. Unforgettable experiences.
            Your next great journey begins here.
          </p>

          <div className="packages-hero-actions">
            <a href="#explore-packages" className="packages-explore-btn">
              Explore journeys
              <ArrowDown size={17} />
            </a>

            <span className="packages-hero-caption">
              DISCOVER YOUR NEXT DESTINATION
            </span>
          </div>

        </div>

        <div className="packages-hero-bottom">
          <span>FREEFLY TOURISM & TRAVELS</span>
          <span>EXPLORE WITHOUT LIMITS</span>
        </div>

      </section>

      {/* PACKAGE SHOWCASE */}
      <section
        className="premium-packages-showcase"
        id="explore-packages"
      >

        <div className="packages-showcase-heading">

          <div>
            <span className="packages-section-eyebrow">
              <Compass size={14} />
              CURATED EXPERIENCES
            </span>

            <h2>
              Find your next
              <span> escape.</span>
            </h2>

            <p>
              Handpicked journeys designed to make every moment memorable.
            </p>
          </div>

          {!loading && !error && (
            <div className="packages-count">
              <strong>{String(items.length).padStart(2, "0")}</strong>
              <span>JOURNEYS TO EXPLORE</span>
            </div>
          )}

        </div>

        {loading && (
          <div className="packages-state">
            <div className="packages-loader" />
            <p>Discovering your next destination...</p>
          </div>
        )}

        {error && (
          <div className="packages-state packages-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="packages-state">
            <p>No packages available yet.</p>
          </div>
        )}

       {!loading && !error && items.length > 0 && (
  <div className="packages-card-stage">

    {items.map((pkg, index) => (
      <article
        className="destination-card"
        key={pkg._id || pkg.id || index}
        style={{ backgroundImage: `url(${pkg.image})` }}
      >
        <div className="destination-card-overlay" />

        <div className="destination-card-orbit">
          <span className="orbit-dot orbit-dot-one" />
          <span className="orbit-dot orbit-dot-two" />
          <span className="orbit-dot orbit-dot-three" />
        </div>

        <div className="destination-card-content">

          <span className="destination-card-number">
            {index + 1}/{items.length}
          </span>

          <span className="destination-card-location">
            {pkg.destination}
          </span>

          <h3>{pkg.title}</h3>

          <p>{pkg.description}</p>

          <Link
            to={`/packages/${pkg._id || pkg.id}`}
            className="destination-discover-btn"
          >
            DISCOVER MORE
          </Link>

        </div>
      </article>
    ))}

  </div>
)}
        

      </section>

    </main>
  );
}


function Services() {
  return (
    <main className="services-page">

      <PageHero
        eyebrow="Make it easy"
        title="The practical magic of travel."
        copy="From the first search to the last sunset, we are here for the details that keep your trip moving."
        image={servicesHero}
      />

      <section className="services-main-section">
        <div className="container">
          <div className="services-world-intro">
            <span>THE WORLD OF FREEFLY</span>
            <h2>
              One Travel Partner. <em>Endless Possibilities.</em>
            </h2>
            <p>
              Whether you are planning a family holiday, an international
              adventure, a business trip or a relaxing weekend escape,
              Freefly helps bring your travel plans together.
            </p>
          </div>

          <ServiceCards />
        </div>
      </section>

      <section className="services-benefits">
        <div className="container services-benefits-inner">
          <div className="services-benefits-title">
            <span>WHY TRAVEL WITH US</span>
            <h2>
              More Than Bookings.
              <em> We Create Experiences.</em>
            </h2>
          </div>

          <div className="services-benefit">
            <span>01</span>
            <h3>Personalised Planning</h3>
            <p>Travel arrangements designed around your preferences and budget.</p>
          </div>

          <div className="services-benefit">
            <span>02</span>
            <h3>Multiple Travel Options</h3>
            <p>Tour packages, reservations and travel assistance in one place.</p>
          </div>

          <div className="services-benefit">
            <span>03</span>
            <h3>Dedicated Assistance</h3>
            <p>Guidance to help you plan and organise your travel.</p>
          </div>

          <div className="services-benefit">
            <span>04</span>
            <h3>Memorable Experiences</h3>
            <p>Thoughtfully planned journeys to make every trip special.</p>
          </div>
        </div>
      </section>

      <section className="services-process">
        <div className="container">

          <div className="services-process-heading">
            <div>
              <span>SIMPLE & CONVENIENT</span>
              <h2>Your Journey, Made Simple.</h2>
            </div>

            <p>
              From your first enquiry to your final destination,
              we make travel planning easy.
            </p>
          </div>

          <div className="services-process-grid">
            <div className="services-process-card">
              <span>01</span>
              <h3>Share Your Plan</h3>
              <p>Tell us about your destination, dates and travel preferences.</p>
            </div>

            <div className="services-process-card">
              <span>02</span>
              <h3>Get Your Itinerary</h3>
              <p>Receive a travel plan designed around your requirements.</p>
            </div>

            <div className="services-process-card">
              <span>03</span>
              <h3>Confirm Your Booking</h3>
              <p>Finalise your travel arrangements and reservations.</p>
            </div>

            <div className="services-process-card">
              <span>04</span>
              <h3>Enjoy Your Journey</h3>
              <p>Get ready to explore and create unforgettable memories.</p>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}


function Gallery() {
  const [selected, setSelected] = useState(null)

  return (
    <main>

      <PageHero
        eyebrow="A visual journal"
        title="Go somewhere in your mind."
        copy="A few frames from places that have stayed with us."
        image={galleryHero}
      />

      <section className="section">
        <div className="container">

          <div className="gallery-grid gallery-page-grid">

            {gallery
              .concat(gallery.slice(1, 4))
              .map((item, index) => (
                <button
                  className={item.className || ''}
                  key={`${item.alt}-${index}`}
                  onClick={() => setSelected(item)}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                  />
                </button>
              ))}

          </div>

        </div>
      </section>

      {selected && (
        <div
          className="lightbox"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            aria-label="Close image"
          >
            <X />
          </button>

          <img
            src={selected.image}
            alt={selected.alt}
          />
        </div>
      )}

    </main>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    setLoading(true)
    setSent(false)
    setError('')

    const formData = new FormData(event.target)

    const enquiryData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      destination: formData.get('destination'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enquiryData),
      })

      if (!response.ok) {
        throw new Error('Failed to send enquiry')
      }

      await response.json()

      setSent(true)

      // Clear the form after successful submission
      event.target.reset()
    } catch (err) {
      setError('We could not send your enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>

      <PageHero
        eyebrow="Let's talk travel"
        title={
          <>
            Your next chapter
            <br />
            starts with{' '}
            <span style={{ color: '#00dff5' }}>
              hello.
            </span>
          </>
        }
        copy="Share a little about where you are dreaming of going. We will take it from there."
        image={contactHero}
      />

      <section className="section contact-section">
        <div className="container contact-layout">

          <div>

            <SectionHeading
              eyebrow="Plan your next journey with Freefly"
              title={
                <>
                  We are good{' '}
                  <span style={{ color: '#00dff5' }}>
                    listeners.
                  </span>
                </>
              }
              copy="No pressure, no generic itineraries. Just a useful conversation about what would make this trip feel right."
            />

            <div className="contact-details">

              <p>
                <Phone />
                <span>
                  <small>Call us</small>
                  +91 8015613840
                </span>
              </p>

              <p>
                <Mail />
                <span>
                  <small>Email us</small>
                  freeflytourismandtravels@gmail.com
                </span>
              </p>

              <p>
                <MapPin />
                <span>
                  <small>Visit us</small>
                  Chennai & Coimbatore
                </span>
              </p>

            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-row">

              <label>
                Name
                <input
                  name="name"
                  required
                  placeholder="Your name"
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="you@example.com"
                />
              </label>

            </div>

            <div className="form-row">

              <label>
                Phone
                <input
                  name="phone"
                  placeholder="Your number"
                />
              </label>

              <label>
                Destination
                <input
                  name="destination"
                  placeholder="Where would you like to go?"
                />
              </label>

            </div>

            <label>
              Message
              <textarea
                name="message"
                required
                rows="5"
                placeholder="Tell us about your dream trip..."
              />
            </label>

            <button
              className="button"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Enquiry'}
              {!loading && <ArrowRight size={16} />}
            </button>

            {sent && (
              <p className="success-message">
                Thanks, your enquiry has been sent successfully.
                We will be in touch soon.
              </p>
            )}

            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

          </form>

        </div>
      </section>

    </main>
  )
}
function AppContent() {
  useScrollReveal();

  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:destinationId"element={<DestinationDetails />}/>
        <Route path="/packages" element={<Packages />} />
        <Route
  path="/packages/:packageId"
  element={<PackageDetails />}
/>
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
            <ProtectedAdminRoute>
            <AdminDashboard />
            </ProtectedAdminRoute>
        }  />
       <Route path="/admin/destinations" element={
           <ProtectedAdminRoute>
              <AdminDestinations />
           </ProtectedAdminRoute>
        }/>
        <Route
  path="/admin/enquiries"
  element={
    <ProtectedAdminRoute>
      <AdminEnquiries />
    </ProtectedAdminRoute>
  }
/>
       <Route path="/admin/packages" element={
           <ProtectedAdminRoute>
                <AdminPackages />
             </ProtectedAdminRoute>
} />

       <Route
  path="/admin/homepage"
  element={
    <ProtectedAdminRoute>
      <AdminHomePage />
    </ProtectedAdminRoute>
  }
/>

<Route path="/admin/services" element={
    <ProtectedAdminRoute>
        <AdminServices />
    </ProtectedAdminRoute>
} />

        {/* Wildcard must be last */}
        <Route path="*" element={<Home />} />
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}



export default App
