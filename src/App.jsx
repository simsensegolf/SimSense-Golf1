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

  const [submittedForm, setSubmittedForm] = useState({
    clubSpeed: '92',
    ballSpeed: '128',
    launchAngle: '8.5',
    spinRate: '3600',
    attackAngle: '-3.0',
    carryDistance: '218'
  });

  const [equipmentForm, setEquipmentForm] = useState({
    driverBrand: 'TaylorMade',
    shaftModel: 'Fujikura Ventus Blue',
    shaftStiffness: 'Regular',
    shaftWeight: '55',
    gripSize: 'Standard'
  });

  const [submittedEquipmentForm, setSubmittedEquipmentForm] = useState({
    driverBrand: 'TaylorMade',
    shaftModel: 'Fujikura Ventus Blue',
    shaftStiffness: 'Regular',
    shaftWeight: '55',
    gripSize: 'Standard'
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
    setUploadMessage('Screenshot upload is coming soon. For now, golfers can manually enter their driver numbers and current driver setup below.');
    setTimeout(() => setUploadMessage(''), 5000);
  };

  const handleWaitlistSubmit = (event) => {
    event.preventDefault();
    if (!waitlist.name.trim() || !waitlist.email.trim()) {
      alert('Please enter your name and email.');
      return;
    }

    alert('Waitlist form demo saved. To collect real emails, connect this form to Formspree, Tally, or Google Forms.');
    setWaitlist({ name: '', email: '' });
  };

  const handleAnalyze = () => {
    setSubmittedForm({ ...form });
    setSubmittedEquipmentForm({ ...equipmentForm });
    setTimeout(() => {
      scrollToId('results-top');
    }, 50);
  };

  const analysis = useMemo(() => {
    const clubSpeed = number(submittedForm.clubSpeed);
    const ballSpeed = number(submittedForm.ballSpeed);
    const launchAngle = number(submittedForm.launchAngle);
    const spinRate = number(submittedForm.spinRate);
    const attackAngle = number(submittedForm.attackAngle);
    const carryDistance = number(submittedForm.carryDistance);
    const shaftWeight = number(submittedEquipmentForm.shaftWeight);
    const shaftStiffness = submittedEquipmentForm.shaftStiffness;
    const gripSize = submittedEquipmentForm.gripSize;
    const driverBrand = submittedEquipmentForm.driverBrand.trim();
    const shaftModel = submittedEquipmentForm.shaftModel.trim();
    const smashValue = clubSpeed > 0 ? ballSpeed / clubSpeed : 0;
    const smash = smashValue.toFixed(2);

    const getStatus = (value, low, high) => {
      if (value === 0) return 'missing';
      if (value < low) return 'low';
      if (value > high) return 'high';
      return 'good';
    };

    const metricStatuses = {
      clubSpeed: clubSpeed === 0 ? 'missing' : clubSpeed < 85 ? 'low' : clubSpeed > 105 ? 'high' : 'good',
      ballSpeed: ballSpeed === 0 ? 'missing' : ballSpeed < 125 ? 'low' : ballSpeed > 155 ? 'high' : 'good',
      launchAngle: getStatus(launchAngle, 10, 15),
      spinRate: getStatus(spinRate, 2000, 3000),
      attackAngle: getStatus(attackAngle, 0, 5),
      carryDistance: carryDistance === 0 ? 'missing' : carryDistance < 210 ? 'low' : carryDistance > 265 ? 'high' : 'good',
      smash: smashValue === 0 ? 'missing' : smashValue < 1.45 ? 'low' : smashValue > 1.50 ? 'high' : 'good'
    };

    const issues = [];
    const actionPlan = [];
    const videoLinks = [];
    const equipmentFindings = [];
    const equipmentSuggestions = [];
    let mainIssue = 'Your driver numbers look fairly balanced.';
    let whyItHappens = 'There is no single major red flag showing up from this data set.';

    if (metricStatuses.smash === 'low') {
      issues.push('You may not be striking the center of the driver face consistently.');
      actionPlan.push('Start with center-face contact drills before trying to swing harder.');
      videoLinks.push({
        title: 'Center-Face Contact Drill',
        note: 'Best first step if your ball speed is not matching your swing speed.',
        url: 'https://www.youtube.com/results?search_query=driver+center+face+contact+drill'
      });
    }

    if (metricStatuses.launchAngle === 'low') {
      issues.push('Your launch looks a little low for a driver.');
      actionPlan.push('Try slightly higher tee height and check that the ball is more forward in your stance.');
      videoLinks.push({
        title: 'Tee Height and Ball Position',
        note: 'Good for golfers who launch the driver too low.',
        url: 'https://www.youtube.com/results?search_query=driver+tee+height+ball+position'
      });
    }

    if (metricStatuses.spinRate === 'high') {
      issues.push('Your spin rate is likely too high and may be costing carry distance.');
      actionPlan.push('Work on strike location and attack angle before making major equipment changes.');
      videoLinks.push({
        title: 'Reduce Driver Spin',
        note: 'Helpful when the ball climbs too much or feels weak in the air.',
        url: 'https://www.youtube.com/results?search_query=reduce+driver+spin+golf'
      });
    }

    if (metricStatuses.attackAngle === 'low') {
      issues.push('You may be hitting down on the driver instead of catching it on the upswing.');
      actionPlan.push('Feel the club sweeping upward through impact and keep the ball forward in your setup.');
      videoLinks.push({
        title: 'Hit Up on the Driver',
        note: 'Useful if you hit low-spinny drives or struggle with carry.',
        url: 'https://www.youtube.com/results?search_query=hit+up+on+driver+golf'
      });
    }

    if (metricStatuses.carryDistance === 'low' && clubSpeed >= 90) {
      issues.push('Your carry distance looks below your speed potential.');
      actionPlan.push('Focus on cleaner strike, better launch, and lower spin before chasing more speed.');
    }

    if (metricStatuses.spinRate === 'high' && metricStatuses.attackAngle === 'low') {
      mainIssue = 'Main issue: your driver delivery is likely too steep.';
      whyItHappens = 'Hitting down on the driver often lowers launch and adds spin, which can make the ball fly weaker and shorter.';
    } else if (metricStatuses.smash === 'low') {
      mainIssue = 'Main issue: contact quality is likely hurting your distance.';
      whyItHappens = 'When ball speed does not match club speed, the strike is often off-center instead of flush.';
    } else if (metricStatuses.launchAngle === 'low') {
      mainIssue = 'Main issue: your driver launch window may be too low.';
      whyItHappens = 'A lower launch can reduce carry distance even if your swing speed is decent.';
    }

    if (shaftStiffness === 'Regular' && clubSpeed >= 100) {
      equipmentFindings.push('Your current shaft stiffness may be too soft for your swing speed.');
      equipmentSuggestions.push({
        title: 'Check stiffer shaft options',
        why: 'A regular-flex shaft can sometimes add too much dynamic loft or timing inconsistency at higher speeds.'
      });
    }

    if ((shaftStiffness === 'Stiff' || shaftStiffness === 'X-Stiff') && clubSpeed > 0 && clubSpeed < 88) {
      equipmentFindings.push('Your current shaft stiffness may be too firm for your swing speed.');
      equipmentSuggestions.push({
        title: 'Test a softer shaft profile',
        why: 'A softer profile may help launch and feel if your speed is on the lower side.'
      });
    }

    if (shaftWeight > 0 && shaftWeight < 55 && clubSpeed >= 100) {
      equipmentFindings.push('Your shaft weight may be very light for your current speed.');
      equipmentSuggestions.push({
        title: 'Try a slightly heavier shaft',
        why: 'More weight can sometimes improve control and face delivery for faster swingers.'
      });
    }

    if (shaftWeight >= 70 && clubSpeed > 0 && clubSpeed < 90) {
      equipmentFindings.push('Your shaft may be on the heavy side for your current speed.');
      equipmentSuggestions.push({
        title: 'Test a lighter shaft',
        why: 'A lighter shaft may help you create more speed and launch the ball more easily.'
      });
    }

    if (gripSize === 'Midsize' && clubSpeed < 85) {
      equipmentFindings.push('A midsize grip may feel bigger than necessary depending on your hand size and release pattern.');
      equipmentSuggestions.push({
        title: 'Review grip size fit',
        why: 'Grip size can influence comfort, release, and face control. It is worth verifying fit, not guessing.'
      });
    }

    if (metricStatuses.spinRate === 'high' && metricStatuses.attackAngle === 'low') {
      equipmentSuggestions.push({
        title: 'Lower-spin head check',
        why: 'This can help if spin stays high after improving strike and delivery.'
      });
    }

    if (driverBrand) {
      equipmentFindings.push(`Current driver brand entered: ${driverBrand}.`);
    }

    if (shaftModel) {
      equipmentFindings.push(`Current shaft entered: ${shaftModel}.`);
    }

    if (issues.length === 0) {
      issues.push('Your current driver numbers do not show one clear major problem.');
      actionPlan.push('Keep testing across multiple sessions to confirm your normal pattern.');
      videoLinks.push({
        title: 'Driver Tempo and Balance',
        note: 'Good for maintaining consistency when numbers are already fairly solid.',
        url: 'https://www.youtube.com/results?search_query=driver+tempo+balance+golf'
      });
    }

    if (equipmentSuggestions.length === 0) {
      equipmentSuggestions.push({
        title: 'Loft and settings check',
        why: 'A simple driver adjustment may better match how you deliver the club.'
      });
    }

    const uniqueVideos = [];
    const seen = new Set();
    for (const item of videoLinks) {
      if (!seen.has(item.title)) {
        uniqueVideos.push(item);
        seen.add(item.title);
      }
    }

    const metricsSummary = [
      { label: 'Club Speed', value: clubSpeed ? `${clubSpeed} mph` : '—', status: metricStatuses.clubSpeed, simple: 'How fast you swing the driver.' },
      { label: 'Ball Speed', value: ballSpeed ? `${ballSpeed} mph` : '—', status: metricStatuses.ballSpeed, simple: 'How fast the ball leaves the face.' },
      { label: 'Smash Factor', value: smashValue ? smash : '—', status: metricStatuses.smash, simple: 'How efficiently your swing speed turns into ball speed.' },
      { label: 'Launch Angle', value: launchAngle ? `${launchAngle}°` : '—', status: metricStatuses.launchAngle, simple: 'How high the ball starts.' },
      { label: 'Spin Rate', value: spinRate ? `${spinRate} rpm` : '—', status: metricStatuses.spinRate, simple: 'How much the ball spins in the air.' },
      { label: 'Attack Angle', value: attackAngle || attackAngle === 0 ? `${attackAngle}°` : '—', status: metricStatuses.attackAngle, simple: 'Whether you hit up or down with the driver.' },
      { label: 'Carry Distance', value: carryDistance ? `${carryDistance} yds` : '—', status: metricStatuses.carryDistance, simple: 'How far the ball flies before it lands.' }
    ];

    const equipmentSummary = [
      { label: 'Driver Brand', value: driverBrand || '—' },
      { label: 'Shaft Model', value: shaftModel || '—' },
      { label: 'Shaft Stiffness', value: shaftStiffness || '—' },
      { label: 'Shaft Weight', value: shaftWeight ? `${shaftWeight} g` : '—' },
      { label: 'Grip Size', value: gripSize || '—' }
    ];

    return {
      smash,
      mainIssue,
      whyItHappens,
      issues: issues.slice(0, 4),
      actionPlan: actionPlan.slice(0, 4),
      videoLinks: uniqueVideos.slice(0, 3),
      equipmentFindings: equipmentFindings.slice(0, 5),
      equipmentSuggestions: equipmentSuggestions.slice(0, 4),
      metricsSummary,
      equipmentSummary
    };
  }, [submittedForm, submittedEquipmentForm]);

  const metrics = [
    { label: 'Club Speed', key: 'clubSpeed', unit: 'mph', help: 'How fast the driver is moving at impact.' },
    { label: 'Ball Speed', key: 'ballSpeed', unit: 'mph', help: 'How fast the ball leaves the driver face.' },
    { label: 'Launch Angle', key: 'launchAngle', unit: '°', help: 'How high or low the drive starts.' },
    { label: 'Spin Rate', key: 'spinRate', unit: 'rpm', help: 'How much the drive spins after impact.' },
    { label: 'Attack Angle', key: 'attackAngle', unit: '°', help: 'Whether you are hitting up or down on the driver.' },
    { label: 'Carry Distance', key: 'carryDistance', unit: 'yds', help: 'How far the drive flies before landing.' }
  ];

  const setValue = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const setEquipmentValue = (key, value) => setEquipmentForm((prev) => ({ ...prev, [key]: value }));

  const badgeClass = (status) => {
    if (status === 'good') return 'metric-badge metric-good';
    if (status === 'low') return 'metric-badge metric-low';
    if (status === 'high') return 'metric-badge metric-high';
    return 'metric-badge metric-missing';
  };

  const statusLabel = (status) => {
    if (status === 'good') return 'Good';
    if (status === 'low') return 'Low';
    if (status === 'high') return 'High';
    return 'Missing';
  };

  return (
    <div className="page">
      <header className="site-header">
        <div className="container topbar">
          <div className="brand">
            <img className="brand-logo" src="/simsense-logo.png" alt="SimSense Golf logo" />
            <div>
              <div className="brand-name">SimSense Golf</div>
              <div className="brand-tag">Driver numbers made simple</div>
            </div>
          </div>
          <nav className="nav">
            <button className="nav-link" onClick={() => scrollToId('how-it-works')}>How it works</button>
            <button className="nav-link" onClick={() => scrollToId('mvp')}>Driver Demo</button>
            <button className="nav-link" onClick={() => scrollToId('features')}>Features</button>
            <button className="button button-green" onClick={() => scrollToId('waitlist')}>Join Waitlist</button>
          </nav>
        </div>
      </header>

      <section className="hero container">
        <div className="hero-grid">
          <div>
            <div className="pill">⛳ Driver-only MVP with swing numbers plus equipment fit context</div>
            <h1>Understand your driver numbers and how your setup may affect them.</h1>
            <p className="hero-copy">
              SimSense Golf now lets golfers enter driver data plus their current driver head, shaft, and grip setup.
              That helps the app give better feedback on whether the issue looks more swing-related, fit-related, or both.
            </p>
            <div className="button-row">
              <button className="button button-green" onClick={() => scrollToId('mvp')}>Try the Driver Analyzer</button>
              <button className="button button-light" onClick={handleUploadClick}>Upload Driver Report</button>
            </div>
            {uploadMessage ? <div className="notice">{uploadMessage}</div> : null}
            <div className="stat-grid">
              <StatCard value="Driver only" label="Focused MVP" />
              <StatCard value="Numbers + fit" label="More useful feedback" />
              <StatCard value="Next steps" label="Drills and gear ideas" />
            </div>
          </div>

          <div className="card hero-card">
            <div className="card-head">
              <div>
                <div className="muted">Live demo preview</div>
                <div className="card-title">Driver Session Summary</div>
              </div>
              <div className="status">Driver only</div>
            </div>

            <div className="panel panel-gray top-gap">
              <div className="muted">Main issue</div>
              <div className="panel-copy strong-copy">{analysis.mainIssue}</div>
            </div>

            <div className="panel panel-green-soft top-gap-sm">
              <div className="muted">Why it is happening</div>
              <div className="panel-copy">{analysis.whyItHappens}</div>
            </div>

            <div className="two-col top-gap-sm">
              <div className="panel panel-amber">
                <div className="panel-title">Smash Factor</div>
                <div className="large-number">{analysis.smash}</div>
                <div className="small-text">A quick efficiency check for your driver strike.</div>
              </div>
              <div className="panel panel-gray">
                <div className="panel-title">Setup context</div>
                <div className="small-text">{analysis.equipmentFindings[0] || 'No strong fit warning from the current setup inputs.'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container section">
        <div className="three-col">
          <InfoCard icon="1" title="Enter driver numbers" text="Use your driver data from TrackMan, GCQuad, Foresight, or another simulator." />
          <InfoCard icon="2" title="Add your current setup" text="Include driver brand, shaft model, shaft stiffness, shaft weight, and grip size." />
          <InfoCard icon="3" title="See swing and fit feedback" text="Get a simple summary of what the numbers say and whether your setup may be part of it." />
        </div>
      </section>

      <section id="mvp" className="container section">
        <div className="section-head">
          <div className="eyebrow">Driver analyzer</div>
          <h2>Working driver-only MVP with equipment context</h2>
          <p>Enter your driver numbers and current setup to get a clearer diagnosis, simpler explanations, and more useful fit suggestions.</p>
        </div>

        <div className="app-grid">
          <div className="stack">
            <div className="card">
              <div className="section-row">
                <div>
                  <h3>Enter driver numbers</h3>
                  <div className="muted">This version is built for driver only. Results update when you click Analyze Driver Numbers.</div>
                </div>
              </div>

              <div className="input-grid top-gap-sm">
                {metrics.map((metric) => (
                  <label key={metric.key} className="input-card">
                    <div className="input-label">{metric.label}</div>
                    <div className="input-help">{metric.help}</div>
                    <div className="input-row">
                      <input value={form[metric.key]} onChange={(e) => setValue(metric.key, e.target.value)} />
                      <div className="unit">{metric.unit}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Enter current driver setup</h3>
              <div className="equipment-grid top-gap-sm">
                <label className="input-card full-width">
                  <div className="input-label">Driver Brand</div>
                  <div className="input-help">Brand or model family of the head you use now.</div>
                  <div className="input-row">
                    <input value={equipmentForm.driverBrand} onChange={(e) => setEquipmentValue('driverBrand', e.target.value)} />
                  </div>
                </label>

                <label className="input-card full-width">
                  <div className="input-label">Shaft Model</div>
                  <div className="input-help">Example: Ventus Blue, HZRDUS Black, Tensei AV.</div>
                  <div className="input-row">
                    <input value={equipmentForm.shaftModel} onChange={(e) => setEquipmentValue('shaftModel', e.target.value)} />
                  </div>
                </label>

                <label className="input-card">
                  <div className="input-label">Shaft Stiffness</div>
                  <div className="input-help">General shaft flex category.</div>
                  <div className="input-row">
                    <select className="select-input" value={equipmentForm.shaftStiffness} onChange={(e) => setEquipmentValue('shaftStiffness', e.target.value)}>
                      <option>Senior</option>
                      <option>Regular</option>
                      <option>Stiff</option>
                      <option>X-Stiff</option>
                    </select>
                  </div>
                </label>

                <label className="input-card">
                  <div className="input-label">Shaft Weight</div>
                  <div className="input-help">Enter the shaft weight in grams.</div>
                  <div className="input-row">
                    <input value={equipmentForm.shaftWeight} onChange={(e) => setEquipmentValue('shaftWeight', e.target.value)} />
                    <div className="unit">g</div>
                  </div>
                </label>

                <label className="input-card full-width">
                  <div className="input-label">Grip Size</div>
                  <div className="input-help">Current grip size on your driver.</div>
                  <div className="input-row">
                    <select className="select-input" value={equipmentForm.gripSize} onChange={(e) => setEquipmentValue('gripSize', e.target.value)}>
                      <option>Undersize</option>
                      <option>Standard</option>
                      <option>Midsize</option>
                      <option>Jumbo</option>
                    </select>
                  </div>
                </label>
              </div>

              <div className="summary-banner">
                <div>
                  <div className="muted-light">Quick read</div>
                  <div className="summary-value">Driver efficiency: {analysis.smash}</div>
                </div>
                <button className="button button-light" onClick={handleAnalyze}>Analyze Driver Numbers</button>
              </div>
            </div>
          </div>

          <div className="stack" id="results-top">
            <div className="card">
              <h3>What your driver numbers are saying</h3>
              <div className="result-summary-box">
                <div className="summary-line"><span className="summary-label">Main issue:</span> {analysis.mainIssue}</div>
                <div className="summary-line"><span className="summary-label">Why:</span> {analysis.whyItHappens}</div>
              </div>
              <div className="stack-sm top-gap-sm">
                {analysis.issues.map((item, idx) => (
                  <div key={idx} className="result-card">
                    <div className="panel-title">Finding {idx + 1}</div>
                    <p className="small-text">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Driver metric breakdown</h3>
              <div className="metrics-table">
                {analysis.metricsSummary.map((metric) => (
                  <div key={metric.label} className="metric-row">
                    <div>
                      <div className="metric-name">{metric.label}</div>
                      <div className="metric-help">{metric.simple}</div>
                    </div>
                    <div className="metric-right">
                      <div className="metric-value">{metric.value}</div>
                      <div className={badgeClass(metric.status)}>{statusLabel(metric.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Current setup used in the analysis</h3>
              <div className="metrics-table">
                {analysis.equipmentSummary.map((item) => (
                  <div key={item.label} className="metric-row">
                    <div>
                      <div className="metric-name">{item.label}</div>
                    </div>
                    <div className="metric-right">
                      <div className="metric-value">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="two-col">
              <div className="card">
                <h3>What to work on first</h3>
                <div className="stack-sm">
                  {analysis.actionPlan.map((item, idx) => (
                    <div key={idx} className="tile">
                      <div className="panel-title">Step {idx + 1}</div>
                      <div className="small-text">{item}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3>Fit and equipment suggestions</h3>
                <div className="stack-sm">
                  {analysis.equipmentSuggestions.map((item, idx) => (
                    <div key={idx} className="tile">
                      <div className="panel-title">{item.title}</div>
                      <div className="small-text">{item.why}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Equipment notes</h3>
              <div className="stack-sm">
                {analysis.equipmentFindings.map((item, idx) => (
                  <div key={idx} className="tile">
                    <div className="small-text">{item}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Training video suggestions</h3>
              <div className="stack-sm">
                {analysis.videoLinks.map((video, idx) => (
                  <a key={idx} className="video-card" href={video.url} target="_blank" rel="noreferrer">
                    <div>
                      <div className="panel-title">{video.title}</div>
                      <div className="small-text">{video.note}</div>
                    </div>
                    <div className="video-link">Open search ↗</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="container section">
        <div className="card">
          <div className="app-grid">
            <div>
              <div className="eyebrow">Why this version is better</div>
              <h2>Built to test both the swing explanation and the fit-context idea.</h2>
              <p className="hero-copy">
                This version helps golfers see whether the problem looks mostly like delivery, strike, launch conditions,
                or whether their current shaft and grip setup may also be worth checking.
              </p>
              <div className="stack-sm">
                {[
                  'Driver-only logic for a cleaner MVP',
                  'Low / good / high feedback on key metrics',
                  'Current shaft and grip setup included in the analysis',
                  'Analyze button now triggers the result set'
                ].map((item) => (
                  <div key={item} className="check-row">
                    <span className="check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="two-col">
              <FeatureTile title="Next upgrade" text="Add loft, adjustable hosel setting, and driver head model." />
              <FeatureTile title="Next upgrade" text="Save sessions and compare whether setup changes helped." />
              <FeatureTile title="Later" text="Expand to irons after the driver MVP is validated." />
              <FeatureTile title="Later" text="Replace search links with your own coaching videos." />
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist" className="container section bottom-pad">
        <div className="waitlist-card">
          <div>
            <div className="eyebrow">Waitlist</div>
            <h2>Follow the build of SimSense Golf</h2>
            <p className="hero-copy compact">
              Get updates as the driver analyzer improves and new features like screenshot upload and saved sessions go live.
            </p>
          </div>

          <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
            <input type="text" placeholder="Your name" value={waitlist.name} onChange={(e) => setWaitlist((prev) => ({ ...prev, name: e.target.value }))} />
            <input type="email" placeholder="Your email" value={waitlist.email} onChange={(e) => setWaitlist((prev) => ({ ...prev, email: e.target.value }))} />
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
