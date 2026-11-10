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
import DestinationDetails from "./DestinationDetails";
import PackageDetails from "./PackageDetails";
import AdminEnquiries from "./admin/AdminEnquiries";

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
  return (
    <div className="service-grid">

      <div className="services-intro">
        <span>TRAVEL SERVICES</span>

        <h2>
          Everything for the <em>journey.</em>
        </h2>

        <p>
          From seamless bookings to personalized travel support,
          we take care of the details that make every journey effortless.
        </p>
      </div>

      {services.map((service, index) => (
        <article className="service-card" key={service.title}>

          <div className="service-number">
            0{index + 1}
          </div>

          <ArrowRight className="service-icon" size={24} />

          <h3>{service.title}</h3>

          <p>{service.description}</p>

          <Link to="/contact" className="service-link">
            Explore
            <ArrowRight size={15} />
          </Link>

        </article>
      ))}

    </div>
  )
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

function Home() {
  return (
    <main>

      <section className="hero">
  <div className="hero-overlay" />

  <div className="container hero-content">
    <span className="eyebrow">
      Explore the world with Freefly
    </span>

    <h1>
      Your Journey
      <br />
      <em>Begins Here</em>
    </h1>

    <p>
      Discover beautiful destinations, curated travel packages
      and unforgettable experiences with Freefly Tourism & Travels.
    </p>

    <Button to="/destinations">
      Explore More
    </Button>
  </div>

  <div className="hero-scroll">
    <span>Scroll to discover</span>
    <span className="scroll-line" />
  </div>
</section>

      <section className="why-section">
        <div className="container why-layout">

          <div>
            <SectionHeading
              eyebrow="Why Freefly"
              title="More than a ticket to somewhere."
              copy="We believe the best trips feel personal before they even begin."
              light
            />

            <Button to="/about">
              Our approach
            </Button>
          </div>

          <div className="benefits">

  {[
    {
      title: "Reliable Service",
      text: "We're with you from planning to boarding.",
      icon: ShieldCheck
    },
    {
      title: "Value Packages",
      text: "Carefully curated itineraries for all interests.",
      icon: BriefcaseBusiness
    },
    {
      title: "Personalized Trips",
      text: "Journeys tailored to your style.",
      icon: MapPin
    },
    {
      title: "Expert Assistance",
      text: "Support that's just a call away.",
      icon: Headphones
    },
    {
      title: "Travel Support",
      text: "Help at every step of your journey.",
      icon: Plane
    }
  ].map(({ title, text, icon: Icon }) => (

    <div className="benefit" key={title}>

      <Icon className="benefit-icon" size={30} />

      <strong>{title}</strong>

      <p>{text}</p>

    </div>

  ))}

</div>

        </div>
      </section>

      <section className="section review-section">
        <div className="container">

          <SectionHeading
            eyebrow="Traveller stories"
            title="Stories from the road"
          />

          <div className="reviews">

  {[
    [
      'Maya Thompson',
      'New York',
      'Freefly made our honeymoon feel effortless. Every detail was considered, but it still felt completely ours.'
    ],
    [
      'Arjun Mehta',
      'London',
      'The kind of support you hope for when you are far from home. Calm, quick, and genuinely human.'
    ],
    [
      'Sofia Martinez',
      'Barcelona',
      'Our family trip had something for everyone. We came home with stories instead of a checklist.'
    ]
  ].map(([name, location, review]) => (

    <article className="review-card" key={name}>

      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            fill="currentColor"
          />
        ))}
      </div>

      <p>“{review}”</p>

      <div className="review-person">
        <div className="review-avatar">
          {name.charAt(0)}
        </div>

        <div>
          <strong>{name}</strong>
          <span>{location}</span>
        </div>
      </div>

    </article>

  ))}

</div>

        </div>
      </section>

      <section className="section gallery-section">
  <div className="container">

    <div className="heading-row">

      <SectionHeading
        eyebrow="Travel Moments"
        title="Postcards from elsewhere"
        copy="A few places that stayed with us long after the journey ended."
      />

      <Button to="/about" secondary>
        View travel moments
      </Button>

    </div>

    <GalleryGrid linkTo="/about" />

  </div>
</section>

      <CTA />

    </main>
  )
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
  )
}

function About() {
  return (
    <main className="about-page">

      {/* HERO */}

      <PageHero
        eyebrow="Our story"
        title="Travel with a little more wonder."
        copy="Freefly exists for the in-between moments: the first step off the plane, the table you find by accident, and the view you never forget."
        image={aboutHero}
      />


      {/* ABOUT INTRO */}

      <section className="section about-intro">
        <div className="container split">

          <img
            src={destinations[3].image}
            alt="Beautiful travel destination"
          />

          <div>

            <SectionHeading
              eyebrow="About Freefly"
              title="A travel studio for open-minded people."
              copy="We bring together the practical and the poetic parts of travel. From a simple city break to a once-in-a-lifetime escape, we make the details feel easy so you can stay present."
            />

            <div className="about-points">

              <div>
                <strong>01</strong>
                <span>We Listen</span>
              </div>

              <div>
                <strong>02</strong>
                <span>We Plan</span>
              </div>

              <div>
                <strong>03</strong>
                <span>You Explore</span>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* STATS */}

      <section className="stats-section">
        <div className="container stats">

          <div>
            <strong>42</strong>
            <span>Countries explored</span>
          </div>

          <div>
            <strong>8k+</strong>
            <span>Happy travellers</span>
          </div>

          <div>
            <strong>12</strong>
            <span>Years of know-how</span>
          </div>

          <div>
            <strong>4.9</strong>
            <span>Average guest rating</span>
          </div>

        </div>
      </section>


      {/* MISSION + VISION */}

      <section className="section mission-vision-section">
        <div className="container mission-vision-grid">

          <div className="mission-vision-content">

            <div className="mission-block">

              <span className="eyebrow">
                Our Mission
              </span>

              <h2>
                Make the world
                <br />
                feel closer.
              </h2>

              <p>
                We design journeys that are better for your time,
                your budget, and your curiosity. That means honest
                recommendations, warm support, and itineraries with
                a point of view.
              </p>

            </div>


            <div className="mission-block">

              <span className="eyebrow">
                Our Vision
              </span>

              <h2>
                A more thoughtful
                <br />
                way to roam.
              </h2>

              <p>
                More connection. Less rushing. Travel that leaves
                you with a fuller sense of the place and the people
                who make it special.
              </p>

            </div>

          </div>


          <img
            src={destinations[4].image}
            alt="Travel destination"
            className="mission-image"
          />

        </div>
      </section>


      {/* TRAVEL MOMENTS - GALLERY MOVED HERE */}

      <section className="journey-section">
  <div className="container journey-container">

    {/* TOP CONTENT */}

    <div className="journey-header">

      <div className="journey-title">

        <span className="eyebrow">
          HOW WE WORK
        </span>

        <h2>
          Every great journey
          <br />
          starts with a
          <br />

          <span>conversation.</span>
        </h2>

        <p>
          From your first idea to the moment you return home,
          we make travel planning simple, personal, and memorable.
        </p>

      </div>


      {/* DECORATIVE RIGHT SIDE */}

      <div className="journey-decoration">

        <div className="flight-path"></div>

        <Plane className="flight-plane" />

        <div className="mountains">
          <div className="mountain mountain-one"></div>
          <div className="mountain mountain-two"></div>
          <div className="mountain mountain-three"></div>
        </div>

        <div className="location-glow">
          <MapPin />
        </div>

      </div>

    </div>


    {/* JOURNEY CARDS */}

    <div className="journey-steps">

      {/* STEP 1 */}

      <article className="journey-card">

        <span className="step-number">
          01
        </span>

        <div className="journey-icon">
          <MessageCircle />
        </div>

        <h3>
          Tell Us Your Dream
        </h3>

        <p>
          Tell us where you want to go, what you love,
          and the kind of experience you are looking for.
        </p>

        <span className="card-line"></span>

      </article>


      <div className="step-arrow">
        <ChevronRight />
      </div>


      {/* STEP 2 */}

      <article className="journey-card">

        <span className="step-number">
          02
        </span>

        <div className="journey-icon">
          <Map />
        </div>

        <h3>
          We Shape the Journey
        </h3>

        <p>
          We carefully create a travel plan around
          your interests, time, and budget.
        </p>

        <span className="card-line"></span>

      </article>


      <div className="step-arrow">
        <ChevronRight />
      </div>


      {/* STEP 3 */}

      <article className="journey-card">

        <span className="step-number">
          03
        </span>

        <div className="journey-icon">
          <Luggage />
        </div>

        <h3>
          We Take Care of Details
        </h3>

        <p>
          From stays and transport to experiences,
          we help make every detail feel easier.
        </p>

        <span className="card-line"></span>

      </article>


      <div className="step-arrow">
        <ChevronRight />
      </div>


      {/* STEP 4 */}

      <article className="journey-card">

        <span className="step-number">
          04
        </span>

        <div className="journey-icon">
          <Plane />
        </div>

        <h3>
          You Explore Freely
        </h3>

        <p>
          All that's left is to enjoy the journey,
          discover new places, and make memories.
        </p>

        <span className="card-line"></span>

      </article>

    </div>

  </div>
</section>


      {/* CTA */}

      <CTA />

    </main>
  )
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
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/packages')
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
      .catch(() => {
        setError('We could not load packages right now. Please try again shortly.')
        setLoading(false)
      })
  }, [])

  return (
    <main>

      <PageHero
        eyebrow="Travel, considered"
        title="Packages with room to breathe."
        copy="A strong starting point for your next escape, with the flexibility to make it your own."
        image={packagesHero}
      />

      <section className="section">
        <div className="container">

          {loading && <p>Loading packages…</p>}

          {error && <p className="form-error">{error}</p>}

          {!loading && !error && items.length === 0 && (
            <p>No packages available yet.</p>
          )}

          {!loading && !error && items.length > 0 && (
            <PackageCards items={items} />
          )}

        </div>
      </section>

    </main>
  )
}
function Services() {
  return (
    <main>

      <PageHero
        eyebrow="Make it easy"
        title="The practical magic of travel."
        copy="From the first search to the last sunset, we are here for the details that keep your trip moving."
        image={servicesHero}
      />

      <section className="simple-section">
        <div className="container">
          <ServiceCards />
        </div>
      </section>

    </main>
  )
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