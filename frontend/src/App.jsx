import { useEffect, useRef, useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

function getLocalToday() {
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
  return today.toISOString().slice(0, 10)
}

const fallbackData = {
  company: {
    name: 'JAIDES LLC',
    tagline: 'We invest in property and promising technology companies.',
    summary:
      'JAIDES LLC is a family-run investment company. We look for solid real estate and early-stage software and AI businesses solving real problems.',
    mission:
      'We invest patiently and work directly with founders when our experience can help.',
    email: 'jayansrini@jaides.com',
  },
  highlights: [
    {
      title: 'Real Estate',
      description:
        'Residential and mixed-use properties with sound fundamentals and a clear plan for long-term ownership.',
    },
    {
      title: 'Technology Companies',
      description:
        'Early-stage software and technology companies with a useful product, capable founders, and a realistic path to customers.',
    },
    {
      title: 'Practical AI',
      description:
        'AI companies that make work easier, improve decisions, or solve a specific business problem.',
    },
  ],
  services: [
    {
      title: 'Early-Stage Capital',
      description:
        'We invest selectively and prefer companies with a clear product, a real customer need, and founders who know their market.',
    },
    {
      title: 'Founder Guidance',
      description:
        'We can help think through enterprise sales, partnerships, operations, hiring, and the practical work of growing a company.',
    },
    {
      title: 'Real Estate',
      description:
        'We also consider property opportunities where patient ownership and careful management can make a difference.',
    },
  ],
  stats: [
    { label: 'Investment style', value: 'Long-term' },
    { label: 'Company focus', value: 'Technology + AI' },
    { label: 'How we help', value: 'Capital + guidance' },
  ],
  timeline: [
    {
      year: 'Learn',
      title: 'Understand the product',
      description:
        'We start with the problem, the customer, and why the team is well suited to solve it.',
    },
    {
      year: 'Invest',
      title: 'Back a clear plan',
      description:
        'We look for a sensible use of capital and a path to building a durable business.',
    },
    {
      year: 'Help',
      title: 'Stay useful after the check',
      description:
        'When useful, we offer practical guidance, introductions, and an experienced outside perspective.',
    },
  ],
  appointment_options: {
    topics: ['Real Estate', 'Technology / AI', 'Partnership Inquiry', 'General Introduction'],
    times: ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'],
  },
  founders: [
    {
      name: 'Srinivasan Santhanam',
      role: 'Co-Founder',
      bio: 'Srinivasan has led global business transformation and enterprise technology work. At JAIDES, he helps evaluate products, enterprise sales opportunities, and what it will take for a company to scale.',
      focus:
        'Enterprise technology, business transformation, and growth strategy.',
      linkedin: 'https://www.linkedin.com/in/srini-santhanam-7737556/',
    },
    {
      name: 'Deepa Lakshmanan',
      role: 'Co-Founder',
      bio: 'Deepa brings more than 15 years of experience across human resources, operations, contracts, and finance. She helps founders think through hiring, leadership, team structure, and day-to-day operations.',
      focus:
        'People, hiring, operations, and organizational development.',
      linkedin: 'https://www.linkedin.com/in/deepa-lakshmanan-10071243/',
    },
  ],
}

const views = [
  { id: 'home', label: 'Home' },
  { id: 'focus', label: 'Focus Areas' },
  { id: 'founders', label: 'Founders' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'contact', label: 'Contact' },
]

const initialForm = {
  name: '',
  email: '',
  interest: 'Real Estate',
  preferred_date: '',
  preferred_time: '9:00 AM',
  notes: '',
}

function SectionHeader({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <p className="section-copy">{text}</p> : null}
    </div>
  )
}

export default function App() {
  const [data, setData] = useState(fallbackData)
  const [activeView, setActiveView] = useState('home')
  const [transitionView, setTransitionView] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [requestStatus, setRequestStatus] = useState('')
  const transitionTimers = useRef([])

  useEffect(() => {
    let active = true

    fetch(`${apiBaseUrl}/api/profile`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load profile')
        }
        return response.json()
      })
      .then((payload) => {
        if (active) {
          setData({
            ...fallbackData,
            ...payload,
            company: { ...fallbackData.company, ...payload.company },
            appointment_options: {
              ...fallbackData.appointment_options,
              ...payload.appointment_options,
            },
            founders: payload.founders ?? fallbackData.founders,
          })
          setForm((current) => ({
            ...current,
            interest: payload.appointment_options?.topics?.[0] ?? current.interest,
            preferred_time: payload.appointment_options?.times?.[0] ?? current.preferred_time,
          }))
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    return () => {
      transitionTimers.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  function navigateTo(nextView) {
    if (nextView === activeView || transitionView) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveView(nextView)
      window.scrollTo({ top: 0, behavior: 'auto' })
      return
    }

    setTransitionView(nextView)
    transitionTimers.current = [
      window.setTimeout(() => {
        setActiveView(nextView)
        window.scrollTo({ top: 0, behavior: 'auto' })
      }, 460),
      window.setTimeout(() => {
        setTransitionView(null)
        transitionTimers.current = []
      }, 950),
    ]
  }

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const subject = encodeURIComponent(`JAIDES appointment request: ${form.interest}`)
    const body = encodeURIComponent([
      'Hello JAIDES,',
      '',
      `My name is ${form.name}. I would like to discuss ${form.interest}.`,
      `Preferred date: ${form.preferred_date}`,
      `Preferred time: ${form.preferred_time}`,
      `Reply email: ${form.email}`,
      '',
      'Additional context:',
      form.notes,
    ].join('\n'))

    window.location.href = `mailto:${data.company.email}?subject=${subject}&body=${body}`
    setRequestStatus('Your email app should open with the appointment details ready to send.')
  }

  function renderHome() {
    return (
      <>
        <section className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Real estate + early-stage technology</p>
            <h1>{data.company.tagline}</h1>
            <p className="hero-text">{data.company.summary}</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => navigateTo('schedule')}>
                Schedule an appointment
              </button>
              <button className="secondary-button" onClick={() => navigateTo('founders')}>
                Meet the founders
              </button>
            </div>
          </div>

          <figure className="hero-visual">
            <img
              src="/images/jaides-hero-tech.jpg"
              alt="A modern workspace with natural materials and jade accents"
              fetchPriority="high"
            />
            <figcaption>{data.company.mission}</figcaption>
          </figure>
        </section>

        <section className="focus-section">
          <SectionHeader
            eyebrow="What we invest in"
            title="Property, technology, and useful AI."
            text="We prefer understandable businesses, practical products, and teams that care about execution."
          />
          <div className="card-grid">
            {data.highlights.map((item, index) => (
              <article className="info-card" key={item.title}>
                <span className="card-index">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </>
    )
  }

  function renderFocus() {
    return (
      <>
        <SectionHeader
          eyebrow="Focus Areas"
          title="We like technology that solves a real problem."
          text="JAIDES looks at early-stage software and AI companies. We are most interested when the product has a clear use and the founders understand their customers."
        />
        <section className="guidance-feature">
          <img
            src="/images/jaides-ai-guidance.jpg"
            alt="A product team reviewing an AI product plan around a table"
            loading="lazy"
          />
          <div className="guidance-copy">
            <p className="eyebrow">How we work with founders</p>
            <h2>Capital, plus practical help.</h2>
            <p>
              When founders want it, we can share experience from enterprise technology,
              operations, and people leadership.
            </p>
            <ul>
              <li><strong>Customers:</strong> enterprise sales, partnerships, and market fit.</li>
              <li><strong>Company building:</strong> hiring, team structure, and operations.</li>
              <li><strong>Growth:</strong> priorities, introductions, and an outside perspective.</li>
            </ul>
          </div>
        </section>
        <div className="card-grid">
          {data.services.map((item, index) => (
            <article className="info-card" key={item.title}>
              <span className="card-index">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
        <section className="timeline-section">
          <SectionHeader
            eyebrow="Our process"
            title="Learn, invest, and stay useful."
          />
          <div className="timeline-grid">
            {data.timeline.map((item) => (
              <article className="timeline-card" key={item.year}>
                <span className="timeline-year">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </>
    )
  }

  function renderFounders() {
    return (
      <>
        <SectionHeader
          eyebrow="Leadership"
          title="Experience in technology, operations, and people."
          text="The founders bring different perspectives to the same question: what does this company need to grow well?"
        />
        <div className="founder-grid founder-grid-detailed">
          {data.founders.map((founder) => (
            <article className="founder-card founder-card-detailed" key={founder.name}>
              <div className="portrait-placeholder">{founder.name.charAt(0)}</div>
              <p className="founder-role">{founder.role}</p>
              <h3>{founder.name}</h3>
              <p>{founder.bio}</p>
              <div className="focus-chip">{founder.focus}</div>
              {founder.linkedin ? (
                <a
                  className="profile-link"
                  href={founder.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  View LinkedIn profile
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </>
    )
  }

  function renderSchedule() {
    return (
      <div className="schedule-layout">
        <section className="schedule-panel">
          <SectionHeader
            eyebrow="Appointments"
            title="Tell us what you are building."
            text="Share a few details about your company, property, or partnership idea. We will follow up by email."
          />
          <div className="appointment-options">
            <article className="mini-card">
              <h3>Available topics</h3>
              <ul>
                {data.appointment_options.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </article>
            <article className="mini-card">
              <h3>Preferred meeting windows</h3>
              <ul>
                {data.appointment_options.times.map((time) => (
                  <li key={time}>{time}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <form className="appointment-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" value={form.name} onChange={updateForm} placeholder="Your name" required />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateForm}
              placeholder="name@email.com"
              required
            />
          </label>
          <label>
            Topic
            <select name="interest" value={form.interest} onChange={updateForm}>
              {data.appointment_options.topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </label>
          <label>
            Preferred date
            <input
              name="preferred_date"
              type="date"
              min={getLocalToday()}
              value={form.preferred_date}
              onChange={updateForm}
              required
            />
          </label>
          <label>
            Preferred time
            <select name="preferred_time" value={form.preferred_time} onChange={updateForm}>
              {data.appointment_options.times.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>
          <label>
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={updateForm}
              rows="5"
              placeholder="Tell JAIDES a little about what you'd like to discuss."
              required
            />
          </label>
          <button className="primary-button submit-button" type="submit">
            Request appointment
          </button>
          <p className="appointment-note">
            Selecting Request appointment opens your email app with these details filled in.
            Appointments are confirmed by follow-up email.
          </p>
          <p className="status-text" role="status" aria-live="polite">{requestStatus}</p>
        </form>
      </div>
    )
  }

  function renderContact() {
    return (
      <>
        <SectionHeader
          eyebrow="Contact"
          title="Get in touch with JAIDES."
          text="We welcome introductions from technology founders, property owners, operators, and potential partners."
        />
        <div className="contact-grid">
          <article className="mini-card">
            <p className="contact-label">Direct inquiries</p>
            <h3>Email JAIDES</h3>
            <a className="contact-email" href={`mailto:${data.company.email}`}>
              {data.company.email}
            </a>
          </article>
          <article className="mini-card">
            <p className="contact-label">What we discuss</p>
            <h3>Investment opportunities</h3>
            <p>Real estate, software and AI companies, founder guidance, and partnerships.</p>
          </article>
          <article className="mini-card">
            <p className="contact-label">Prefer a meeting?</p>
            <h3>Schedule a conversation</h3>
            <p>Tell us what you would like to discuss and suggest a time that works for you.</p>
            <button className="text-button" onClick={() => navigateTo('schedule')}>
              Request an appointment
            </button>
          </article>
        </div>
      </>
    )
  }

  const viewContent = {
    home: renderHome(),
    focus: renderFocus(),
    founders: renderFounders(),
    schedule: renderSchedule(),
    contact: renderContact(),
  }

  return (
    <div className="page-shell">
      <header className="hero-section">
        <nav className="topbar" aria-label="Primary navigation">
          <button
            className="brand-mark brand-button"
            type="button"
            onClick={() => navigateTo('home')}
            aria-label="JAIDES LLC home"
          >
            <span className="brand-monogram">J</span>
            <span className="brand-text">
              <strong>JAIDES LLC</strong>
              <span>Real Estate + Angel Investment</span>
            </span>
          </button>
          <div className="nav-tabs">
            {views.map((view) => (
              <button
                key={view.id}
                type="button"
                className={activeView === view.id ? 'nav-tab nav-tab-active' : 'nav-tab'}
                onClick={() => navigateTo(view.id)}
                aria-current={activeView === view.id ? 'page' : undefined}
              >
                {view.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="page-content" key={activeView}>{viewContent[activeView]}</main>

      {transitionView ? (
        <div className="section-transition" aria-hidden="true">
          {[0, 1, 2, 3].map((index) => (
            <span
              className="transition-slat"
              key={index}
              style={{ '--slat-index': index }}
            />
          ))}
          <div className="transition-title">
            <span>
              JAIDES / {String(views.findIndex((view) => view.id === transitionView) + 1).padStart(2, '0')}
            </span>
            <strong>{views.find((view) => view.id === transitionView)?.label}</strong>
          </div>
        </div>
      ) : null}

      <footer className="site-footer">
        <div>
          <strong>JAIDES LLC</strong>
          <p>Investing in real estate and early-stage technology.</p>
        </div>
        <div className="footer-actions">
          <a href={`mailto:${data.company.email}`}>{data.company.email}</a>
          <button type="button" onClick={() => navigateTo('contact')}>Contact</button>
        </div>
        <p className="footer-disclaimer">
          Information on this site is for general informational purposes only and does not
          constitute an offer, solicitation, or investment advice.
        </p>
      </footer>
    </div>
  )
}
