import { useEffect, useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

const fallbackData = {
  company: {
    name: 'JAIDES LLC',
    tagline: 'Real estate stewardship and angel investment with a long-view mindset.',
    summary:
      'JAIDES LLC is a family-led investment firm focused on thoughtful real estate, strategic capital partnerships, and enduring value creation.',
    mission:
      'Operate with patience, clarity, and disciplined stewardship across both property and private capital decisions.',
    email: 'jayansrini@jaides.com',
  },
  highlights: [
    {
      title: 'Real Estate',
      description:
        'Acquisition and oversight of residential and mixed-use opportunities with a focus on durable value.',
    },
    {
      title: 'Angel Investing',
      description:
        'Selective early-stage backing for founders building resilient, practical businesses.',
    },
    {
      title: 'Family Office Style',
      description:
        'A calm, disciplined approach centered on stewardship, trust, and long-term alignment.',
    },
  ],
  services: [
    {
      title: 'Property Strategy',
      description:
        'Thoughtful evaluation of opportunities, hold strategies, and portfolio fit.',
    },
    {
      title: 'Capital Partnerships',
      description:
        'Relationship-driven conversations with founders, operators, and aligned partners.',
    },
    {
      title: 'Long-Term Advisory Lens',
      description:
        'Measured judgment rooted in risk awareness, timing discipline, and trust.',
    },
  ],
  stats: [
    { label: 'Decision style', value: 'Patient + Disciplined' },
    { label: 'Primary sectors', value: 'Property + Early Stage' },
    { label: 'Operating posture', value: 'Selective + Relationship-Led' },
  ],
  timeline: [
    {
      year: 'Vision',
      title: 'Define the family office mindset',
      description:
        'Create a clear point of view around stewardship, quality opportunities, and long-range conviction.',
    },
    {
      year: 'Growth',
      title: 'Build aligned relationships',
      description:
        'Cultivate trusted conversations with operators, founders, and strategic collaborators.',
    },
    {
      year: 'Scale',
      title: 'Expand with discipline',
      description:
        'Pursue opportunities that fit the firm\'s values, pace, and appetite for durable value creation.',
    },
  ],
  appointment_options: {
    topics: ['Real Estate', 'Angel Investing', 'Partnership Inquiry', 'General Introduction'],
    times: ['9:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'],
  },
  founders: [
    {
      name: 'Srinivasan Santhanam',
      role: 'Co-Founder',
      bio: 'Srinivasan is a results-oriented executive with a track record in global business transformation and enterprise technology. His experience leading complex initiatives informs JAIDES\' disciplined approach to evaluating opportunities, building partnerships, and creating durable value.',
      focus:
        'Business transformation, investment discipline, and long-term value creation.',
      linkedin: 'https://www.linkedin.com/in/srini-santhanam-7737556/',
    },
    {
      name: 'Deepa Lakshmanan',
      role: 'Co-Founder',
      bio: 'Deepa brings more than 15 years of leadership experience across human resources, operations, contracts, finance, and organizational development. Her people-first perspective and operational insight help JAIDES assess leadership teams, strengthen partnerships, and support responsible growth.',
      focus:
        'People strategy, organizational development, and operational leadership.',
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
  const [form, setForm] = useState(initialForm)
  const [requestStatus, setRequestStatus] = useState('')

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
          setData(payload)
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

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setRequestStatus('Sending your request...')

    try {
      const response = await fetch(`${apiBaseUrl}/api/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Unable to submit request')
      }

      const payload = await response.json()
      setRequestStatus(payload.message)
      setForm({
        ...initialForm,
        interest: data.appointment_options.topics[0],
        preferred_time: data.appointment_options.times[0],
      })
    } catch (error) {
      setRequestStatus('The request form is ready, but the backend is not responding yet.')
    }
  }

  function renderHome() {
    return (
      <>
        <section className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Family-led investment company</p>
            <h1>{data.company.tagline}</h1>
            <p className="hero-text">{data.company.summary}</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => setActiveView('schedule')}>
                Schedule an appointment
              </button>
              <button className="secondary-button" onClick={() => setActiveView('founders')}>
                Meet the founders
              </button>
            </div>
          </div>

          <aside className="hero-panel">
            <p className="panel-label">Positioning</p>
            <h2>Clean, intentional, and built for trust.</h2>
            <p>{data.company.mission}</p>
            <div className="stats-grid">
              {data.stats.map((item) => (
                <article className="stat-card" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="focus-section">
          <SectionHeader
            eyebrow="At a glance"
            title="A refined digital presence for real estate, private capital, and partnership conversations."
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
          title="Disciplined capital, grounded judgment, and an operator's perspective."
          text="JAIDES evaluates each opportunity through the lens of long-term fundamentals, aligned leadership, and the potential to create meaningful, sustainable value."
        />
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
            eyebrow="Approach"
            title="A calm three-part rhythm for how the firm grows."
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
          title="Experienced leadership with a shared commitment to thoughtful growth."
          text="JAIDES combines enterprise transformation expertise with people, operations, and organizational leadership to bring a balanced perspective to every opportunity."
        />
        <div className="founder-grid founder-grid-detailed">
          {data.founders.map((founder) => (
            <article className="founder-card founder-card-detailed" key={founder.name}>
              <div className="portrait-placeholder">{founder.name.charAt(0)}</div>
              <p className="founder-role">{founder.role}</p>
              <h3>{founder.name}</h3>
              <p>{founder.bio}</p>
              <div className="focus-chip">{founder.focus}</div>
              <a
                className="profile-link"
                href={founder.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                View LinkedIn profile
              </a>
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
            title="Start a focused conversation with JAIDES."
            text="Share a few details about your opportunity or partnership idea, and our team will follow up to find the right time to connect."
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
              <h3>Example meeting windows</h3>
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
            <input name="preferred_date" type="date" value={form.preferred_date} onChange={updateForm} required />
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
          <p className="status-text">{requestStatus}</p>
        </form>
      </div>
    )
  }

  function renderContact() {
    return (
      <>
        <SectionHeader
          eyebrow="Contact"
          title="Let's explore what we can build for the long term."
          text="We welcome thoughtful introductions from property owners, founders, operators, and partners whose values align with ours."
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
            <p>Real estate, early-stage ventures, strategic introductions, and aligned capital partnerships.</p>
          </article>
          <article className="mini-card">
            <p className="contact-label">Prefer a meeting?</p>
            <h3>Schedule a conversation</h3>
            <p>Tell us what you would like to discuss and suggest a time that works for you.</p>
            <button className="text-button" onClick={() => setActiveView('schedule')}>
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
        <nav className="topbar">
          <button className="brand-mark brand-button" onClick={() => setActiveView('home')}>
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
                className={activeView === view.id ? 'nav-tab nav-tab-active' : 'nav-tab'}
                onClick={() => setActiveView(view.id)}
              >
                {view.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main>{viewContent[activeView]}</main>
    </div>
  )
}
