import React, { useMemo, useState } from 'react';

export default function App() {
  const [form, setForm] = useState({
    clubSpeed: '92',
    ballSpeed: '128',
    launchAngle: '8.5',
    spinRate: '3600',
    attackAngle: '-3.0',
    carryDistance: '218'
  });

  const [waitlist, setWaitlist] = useState({
    name: '',
    email: ''
  });

  const [uploadMessage, setUploadMessage] = useState('');

  const number = (value) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const scrollToId = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUploadClick = () => {
    setUploadMessage('Screenshot upload is coming soon. For now, golfers can manually enter their simulator numbers below.');
    setTimeout(() => setUploadMessage(''), 5000);
  };

  const handleWaitlistSubmit = (event) => {
    event.preventDefault();
    if (!waitlist.name.trim() || !waitlist.email.trim()) {
      alert('Please enter your name and email.');
      return;
    }

    alert(
      'Waitlist form demo saved. To collect real emails, connect this form to Formspree, Tally, or Google Forms.'
    );

    setWaitlist({ name: '', email: '' });
  };

  const analysis = useMemo(() => {
    const clubSpeed = number(form.clubSpeed);
    const ballSpeed = number(form.ballSpeed);
    const launchAngle = number(form.launchAngle);
    const spinRate = number(form.spinRate);
    const attackAngle = number(form.attackAngle);
    const carryDistance = number(form.carryDistance);
    const smashValue = clubSpeed > 0 ? ballSpeed / clubSpeed : 0;
    const smash = smashValue.toFixed(2);

    const findings = [];
    const drills = [];
    const gear = [];

    if (smashValue > 0 && smashValue < 1.42) {
      findings.push({
        title: 'Contact may be inconsistent',
        simple: 'You may not be hitting the center of the face often, which can cost speed and distance.',
        action: 'Use face spray or impact tape and practice center-face contact.'
      });
      drills.push({ title: 'Center-Face Contact Drill', focus: 'Improve strike quality' });
    }

    if (launchAngle > 0 && launchAngle < 10) {
      findings.push({
        title: 'Launch is a little low',
        simple: 'The ball may be starting too low, which can reduce carry distance.',
        action: 'Try teeing the ball slightly higher and encourage a more upward strike.'
      });
      drills.push({ title: 'Tee Height and Ball Position', focus: 'Raise launch' });
    }

    if (spinRate > 3200) {
      findings.push({
        title: 'Spin looks high',
        simple: 'Too much spin can make the ball climb too much and lose distance.',
        action: 'Work on strike location and delivery first, then test a lower-spin setup if needed.'
      });
      drills.push({ title: 'Reduce Driver Spin', focus: 'Better launch and flight' });
      gear.push({ title: 'Lower-spin driver head', why: 'Could help if spin stays high after swing changes.' });
      gear.push({ title: 'Shaft fit review', why: 'A different shaft profile may help control launch and spin.' });
    }

    if (attackAngle < -1) {
      findings.push({
        title: 'You may be hitting down on the driver',
        simple: 'With the driver, hitting down too much often creates lower launch and more spin.',
        action: 'Move the ball a little more forward and feel the club sweeping upward through impact.'
      });
      drills.push({ title: 'Hit Up on the Driver', focus: 'Improve attack angle' });
    }

    if (carryDistance > 0 && carryDistance < 230 && clubSpeed >= 90) {
      findings.push({
        title: 'Distance may be below your speed potential',
        simple: 'Your swing speed suggests you may have more distance available with cleaner contact and better launch conditions.',
        action: 'Focus on strike, launch, and spin before swinging harder.'
      });
    }

    if (findings.length === 0) {
      findings.push({
        title: 'Numbers look fairly balanced',
        simple: 'Your data does not show one major red flag right away.',
        action: 'Keep tracking your numbers and look for repeatable patterns over multiple sessions.'
      });
    }

    if (drills.length === 0) {
      drills.push({ title: 'Baseline Driver Check', focus: 'Build consistency' });
      drills.push({ title: 'Tempo and Balance Drill', focus: 'Improve repeatability' });
    }

    if (gear.length === 0) {
      gear.push({ title: 'Loft and head setting check', why: 'A simple adjustment may help match your delivery pattern.' });
      gear.push({ title: 'Basic fitting review', why: 'Helpful if your ball flight still feels off after swing work.' });
    }

    return {
      smash,
      findings: findings.slice(0, 4),
      drills: drills.slice(0, 3),
      gear: gear.slice(0, 3)
    };
  }, [form]);

  const metrics = [
    { label: 'Club Speed', key: 'clubSpeed', unit: 'mph', help: 'How fast the club is moving at impact.' },
    { label: 'Ball Speed', key: 'ballSpeed', unit: 'mph', help: 'How fast the ball leaves the clubface.' },
    { label: 'Launch Angle', key: 'launchAngle', unit: '°', help: 'How high or low the ball starts.' },
    { label: 'Spin Rate', key: 'spinRate', unit: 'rpm', help: 'How much the ball spins after impact.' },
    { label: 'Attack Angle', key: 'attackAngle', unit: '°', help: 'Whether the club is moving up or down at impact.' },
    { label: 'Carry Distance', key: 'carryDistance', unit: 'yds', help: 'How far the ball flies before landing.' }
  ];

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="page">
      <header className="site-header">
        <div className="container topbar">
          <div className="brand">
            <img className="brand-logo" src="/simsense-logo.png" alt="SimSense Golf logo" />
            <div>
              <div className="brand-name">SimSense Golf</div>
              <div className="brand-tag">Make sense of your golf numbers</div>
            </div>
          </div>
          <nav className="nav">
            <button className="nav-link" onClick={() => scrollToId('how-it-works')}>How it works</button>
            <button className="nav-link" onClick={() => scrollToId('mvp')}>MVP Demo</button>
            <button className="nav-link" onClick={() => scrollToId('features')}>Features</button>
            <button className="button button-green" onClick={() => scrollToId('waitlist')}>Join Waitlist</button>
          </nav>
        </div>
      </header>

      <section className="hero container">
        <div className="hero-grid">
          <div>
            <div className="pill">⛳ For golfers who want simple answers, not confusing data</div>
            <h1>Turn simulator numbers into clear golf advice.</h1>
            <p className="hero-copy">
              SimSense Golf helps everyday golfers understand launch monitor numbers in plain English,
              spot likely swing problems, get video training recommendations, and see when equipment
              changes might actually help.
            </p>
            <div className="button-row">
              <button className="button button-green" onClick={() => scrollToId('mvp')}>Try the MVP Demo</button>
              <button className="button button-light" onClick={handleUploadClick}>Upload Simulator Numbers</button>
            </div>
            {uploadMessage ? <div className="notice">{uploadMessage}</div> : null}
            <div className="stat-grid">
              <StatCard value="Plain English" label="Explain every metric" />
              <StatCard value="Drills & videos" label="Recommended next steps" />
              <StatCard value="Smarter gear" label="Equipment guidance" />
            </div>
          </div>

          <div className="card hero-card">
            <div className="card-head">
              <div>
                <div className="muted">Sample session</div>
                <div className="card-title">Driver Overview</div>
              </div>
              <div className="status">Needs optimization</div>
            </div>

            <div className="mini-grid">
              <MiniMetric label="Club Speed" value={form.clubSpeed + ' mph'} />
              <MiniMetric label="Ball Speed" value={form.ballSpeed + ' mph'} />
              <MiniMetric label="Launch" value={form.launchAngle + '°'} />
              <MiniMetric label="Spin" value={form.spinRate + ' rpm'} />
            </div>

            <div className="panel panel-gray">
              <div className="muted">What this means</div>
              <div className="panel-copy">
                Your numbers suggest you may be launching the ball a bit low and creating too much spin.
                That usually means lost carry distance and a weaker flight than your swing speed can produce.
              </div>
            </div>

            <div className="two-col">
              <div className="panel panel-amber">
                <div className="panel-title">Likely swing issue</div>
                <div className="small-text">Hitting down on the driver and missing center-face contact.</div>
              </div>
              <div className="panel panel-green-soft">
                <div className="panel-title">Recommended next step</div>
                <div className="small-text">Watch the “Hit Up on the Driver” and “Center-Face Contact” training videos.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container section">
        <div className="three-col">
          <InfoCard icon="1" title="Enter your numbers" text="Type in your simulator stats now, with screenshot upload possible in a later version." />
          <InfoCard icon="2" title="Get simple explanations" text="See what each number means in normal language, without all the technical golf jargon." />
          <InfoCard icon="3" title="Know what to do next" text="Get drills, video ideas, and careful equipment suggestions based on your number patterns." />
        </div>
      </section>

      <section id="mvp" className="container section">
        <div className="section-head">
          <div className="eyebrow">MVP demo</div>
          <h2>First working app screen</h2>
          <p>Enter numbers on the left, then get simple feedback, drills, and equipment guidance on the right.</p>
        </div>

        <div className="app-grid">
          <div className="card">
            <h3>Enter simulator numbers</h3>
            <div className="input-grid">
              {metrics.map((metric) => (
                <label key={metric.key} className="input-card">
                  <div className="input-label">{metric.label}</div>
                  <div className="input-help">{metric.help}</div>
                  <div className="input-row">
                    <input
                      value={form[metric.key]}
                      onChange={(e) => setValue(metric.key, e.target.value)}
                    />
                    <div className="unit">{metric.unit}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="summary-banner">
              <div>
                <div className="muted-light">Quick indicator</div>
                <div className="summary-value">Smash Factor: {analysis.smash}</div>
              </div>
              <button className="button button-light" onClick={() => scrollToId('results-top')}>Analyze My Numbers</button>
            </div>
          </div>

          <div className="stack" id="results-top">
            <div className="card">
              <h3>What your numbers are saying</h3>
              <div className="stack-sm">
                {analysis.findings.map((item, idx) => (
                  <div key={idx} className="result-card">
                    <div className="panel-title">{item.title}</div>
                    <p className="small-text">{item.simple}</p>
                    <div className="result-action">{item.action}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="two-col">
              <div className="card">
                <h3>Training videos</h3>
                <div className="stack-sm">
                  {analysis.drills.map((video, idx) => (
                    <div key={idx} className="tile">
                      <div className="panel-title">{video.title}</div>
                      <div className="small-text">{video.focus}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Equipment ideas</h3>
                <div className="stack-sm">
                  {analysis.gear.map((item, idx) => (
                    <div key={idx} className="tile">
                      <div className="panel-title">{item.title}</div>
                      <div className="small-text">{item.why}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container section">
        <div className="card">
          <div className="app-grid">
            <div>
              <div className="eyebrow">Why this works</div>
              <h2>Built for golfers who want real help after the bay session.</h2>
              <p className="hero-copy">
                Most simulator tools show data. SimSense Golf explains what that data likely means,
                what problem it points to, and what the golfer should do next.
              </p>
              <div className="stack-sm">
                {[
                  'Translate confusing launch monitor numbers into plain English',
                  'Recommend video drills based on actual number patterns',
                  'Suggest equipment only when it makes sense',
                  'Bridge simulator data and real improvement'
                ].map((item) => (
                  <div key={item} className="check-row">
                    <span className="check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="two-col">
              <FeatureTile title="Future upload tool" text="Read numbers from simulator screenshots later." />
              <FeatureTile title="Saved sessions" text="Let golfers track patterns and progress over time." />
              <FeatureTile title="Coach library" text="Use your own in-house videos and training content." />
              <FeatureTile title="Fitter mode" text="Give smart club suggestions without overselling gear." />
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist" className="container section bottom-pad">
        <div className="waitlist-card">
          <div>
            <div className="eyebrow">Waitlist</div>
            <h2>Stay updated on SimSense Golf</h2>
            <p className="hero-copy compact">
              Get updates as new features go live, including screenshot upload, saved sessions, and smarter video recommendations.
            </p>
          </div>

          <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
            <input
              type="text"
              placeholder="Your name"
              value={waitlist.name}
              onChange={(e) => setWaitlist((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="email"
              placeholder="Your email"
              value={waitlist.email}
              onChange={(e) => setWaitlist((prev) => ({ ...prev, email: e.target.value }))}
            />
            <button className="button button-green" type="submit">Join the Waitlist</button>
          </form>

          <div className="waitlist-note">
            Current version: demo form only. Next step is connecting this to Formspree, Tally, or Google Forms for real email collection.
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="muted">{label}</div>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="mini-card">
      <div className="muted">{label}</div>
      <div className="mini-value">{value}</div>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="card">
      <div className="icon-badge">{icon}</div>
      <div className="card-title mt">{title}</div>
      <div className="hero-copy compact">{text}</div>
    </div>
  );
}

function FeatureTile({ title, text }) {
  return (
    <div className="tile">
      <div className="panel-title">{title}</div>
      <div className="small-text">{text}</div>
    </div>
  );
}
