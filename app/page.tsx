'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

/** Fade-up animation variant for each child element */
function R({ children, delay = 0, className = '' }: { children?: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal${className ? ` ${className}` : ''}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

const SECTIONS = [
  { id: 'cover',   label: 'Cover'    },
  { id: 'names',   label: 'Names'    },
  { id: 'timeline',label: 'Schedule' },
  { id: 'photos',  label: 'Photos'   },
  { id: 'closing', label: 'Closing'  },
];

export default function WeddingEcard() {
  const [activeSection, setActiveSection] = useState('cover');
  const activeSectionRef = useRef('cover');
  const isSnapping = useRef(false);
  const rafRef = useRef<number | null>(null);
  const wheelAccum = useRef(0);
  const touchStartY = useRef(0);

  // Keep ref in sync with state so event handlers can read latest value
  useEffect(() => { activeSectionRef.current = activeSection; }, [activeSection]);

  // easeOutExpo – fast start, smooth gentle deceleration at the end
  const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

  // Animate scroll to an exact Y coordinate
  const smoothScrollTo = (targetY: number, onDone?: () => void) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) { isSnapping.current = false; onDone?.(); return; }
    const duration = Math.min(700, Math.max(350, Math.abs(distance) * 0.5));
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const t = Math.min((ts - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeOutExpo(t));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        isSnapping.current = false;
        onDone?.();
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  // Navigate to a specific section by id
  const goToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    isSnapping.current = true;
    wheelAccum.current = 0; // discard any leftover inertia delta
    setActiveSection(id);
    activeSectionRef.current = id;
    const targetY = el.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(targetY, () => { isSnapping.current = false; });
  };

  // Step one section forward (+1) or backward (-1) from current
  const stepSection = (dir: 1 | -1) => {
    if (isSnapping.current) return;
    const idx = SECTIONS.findIndex(s => s.id === activeSectionRef.current);
    const next = SECTIONS[idx + dir];
    if (!next) return;
    goToSection(next.id);
  };

  useEffect(() => {
    // Hide scroll hint on first interaction
    const handleScrollHint = () => {
      const sh = document.getElementById('sh');
      if (sh) sh.classList.add('gone');
    };
    window.addEventListener('scroll', handleScrollHint, { once: true });

    // Wheel: fire once per gesture, then hard-lock input for LOCK_MS.
    // This is the only reliable solution for Mac trackpad inertia —
    // we don't try to detect when inertia ends, we just freeze input.
    const WHEEL_THRESHOLD = 30;
    const LOCK_MS = 950; // longer than max animation (700ms) + inertia buffer
    let locked = false;
    let lockTimer: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (locked || isSnapping.current) return;

      wheelAccum.current += e.deltaY;
      if (Math.abs(wheelAccum.current) >= WHEEL_THRESHOLD) {
        const dir = wheelAccum.current > 0 ? 1 : -1;
        wheelAccum.current = 0;
        locked = true;
        if (lockTimer) clearTimeout(lockTimer);
        lockTimer = setTimeout(() => {
          locked = false;
          wheelAccum.current = 0;
        }, LOCK_MS);
        stepSection(dir as 1 | -1);
      }
    };

    // Touch: detect swipe direction on touchend
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isSnapping.current) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 30) stepSection(dy > 0 ? 1 : -1);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollHint);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update active dot via IntersectionObserver (fallback / initial)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setActiveSection(id); activeSectionRef.current = id; } },
        { threshold: 0.5 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => goToSection(id);

  return (
    <>
      {/* ══ NAV DOTS ══ */}
      <nav className="nav-dots" aria-label="Section navigation">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            className={`nav-dot${activeSection === id ? ' active' : ''}`}
            onClick={() => scrollTo(id)}
            aria-label={label}
            title={label}
          />
        ))}
      </nav>

      <div className="page-wrap">

        {/* ══ COVER ══ */}
        <div className="sec" id="cover">
          <R className="xs">OUR HEARTS ARE FULL OF JOY</R>
          <R className="div" delay={0.1} />
          <R className="gv ds" delay={0.1}>
            Saturday 19<sup style={{ fontSize: '.38em', verticalAlign: 'super' }}>th</sup>
          </R>
          <R className="cinzel" delay={0.2} >
            <div style={{ fontSize: '14px', letterSpacing: '.55em', color: 'var(--muted)' }}>DECEMBER</div>
          </R>
          <R className="xs" delay={0.2}>
            <div style={{ marginTop: '-5px' }}>2 0 2 6</div>
          </R>
          <R className="div-lg" delay={0.2} />
          <R className="cinzel" delay={0.3}>
            <div style={{ fontSize: '9px', letterSpacing: '.35em', color: 'var(--muted)', lineHeight: '2.4' }}>
              YOU ARE INVITED TO THE WEDDING OF
            </div>
          </R>
          <R delay={0.3}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo" src="/images/logo.png" alt="Wedding Logo" />
          </R>
          <R className="div-lg" delay={0.4} />
          <R className="xs" delay={0.4}>
            <div style={{ letterSpacing: '.36em' }}>AT KACHONG HILLS TENTED RESORT TRANG</div>
          </R>
          <R className="xs" delay={0.5}>
            <div style={{ letterSpacing: '.2em', marginTop: '-4px' }}>1 2 : 5 9 &nbsp;&nbsp; P M</div>
          </R>
        </div>
        <div className="sep"></div>

        {/* ══ NAMES ══ */}
        <div className="sec" id="names">
          <R className="thai sm" >
            <div style={{ lineHeight: '2.2' }}>
              นายเจริญ กิจศิริพิพัฒน์ &amp; นางสุมิตรา กิจศิริพิพัฒน์<br />
              <span style={{ fontSize: '11px' }}>และ</span><br />
              นายวิชิต ซุ่นอื้อ &amp; นางพรทิพย์ ซุ่นอื้อ
            </div>
          </R>
          <R className="div-lg" delay={0.1} />
          <R className="thai sm" delay={0.1}>
            <div>มีความยินดีขอเรียนเชิญเพื่อมาเป็นเกียรติ<br />เนื่องในพิธีมงคลสมรส ระหว่าง</div>
          </R>
          <R className="div" delay={0.1} />
          <R className="name-en" delay={0.2}>NITCHAWEE</R>
          <R className="thai name-th" delay={0.2}>ณิชชาวีณ์ ศรีวัชรชัยฤกษ์</R>
          <R className="amp" delay={0.3}>&amp;</R>
          <R className="name-en" delay={0.3}>CHINNABHORN</R>
          <R className="thai name-th" delay={0.3}>
            <div style={{ marginBottom: '4px' }}>ชินนพร ซุ่นอื้อ</div>
          </R>
          <R className="div" delay={0.4} />
          <R delay={0.4}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '17px', justifyContent: 'center' }}>
              <div className="cor" style={{ fontSize: '60px', fontWeight: '300', color: 'var(--muted)', lineHeight: '1' }}>19</div>
              <div style={{ textAlign: 'left', borderLeft: '1px solid rgba(45,95,138,.2)', paddingLeft: '14px' }}>
                <div className="thai" style={{ fontSize: '14px', color: 'var(--text)' }}>ธันวาคม ๒๕๖๙</div>
                <div style={{ fontSize: '11px', letterSpacing: '.08em', color: 'var(--muted)' }}>December 2026</div>
              </div>
            </div>
          </R>
          <R className="xs" delay={0.4}>
            <div style={{ marginTop: '4px' }}>KACHONG HILLS TENTED RESORT TRANG</div>
          </R>
          <R className="thai" delay={0.5}>
            <div style={{ fontSize: '12px' }}>
              <a href="https://maps.app.goo.gl/Lv1XmGrwo2rdrdw57" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#e07b8a', textDecoration: 'none', fontWeight: 600 }}>
                <MapPin size={14} strokeWidth={2.2} />
                กะช่องฮิลส์ เต็นท์ รีสอร์ท จ.ตรัง
              </a>
            </div>
          </R>
        </div>
        <div className="sep"></div>

        {/* ══ TIMELINE ══ */}
        <div className="sec" id="timeline">
          <R className="xs">WEDDING SCHEDULE · กำหนดการวันงาน</R>
          <R className="div-lg" delay={0.1} />
          <R delay={0.2}>
            <div className="tl-wrap">
              <div className="tl-item">
                <div className="tl-icon">🏺</div>
                <div className="tl-time">12:59</div>
                <div className="tl-lbl">พิธีแห่<br />ขันหมาก</div>
              </div>
              <div className="tl-item">
                <div className="tl-icon">💍</div>
                <div className="tl-time">13:59</div>
                <div className="tl-lbl">พิธี<br />หมั้น</div>
              </div>
              <div className="tl-item">
                <div className="tl-icon">🐚</div>
                <div className="tl-time">14:29</div>
                <div className="tl-lbl">พิธีรด<br />น้ำสังข์</div>
              </div>
              <div className="tl-item">
                <div className="tl-icon">🎂</div>
                <div className="tl-time">17:28</div>
                <div className="tl-lbl">ฉลอง<br />มงคลสมรส</div>
              </div>
            </div>
          </R>
          <R className="div-lg" delay={0.3} />
          <R className="xs" delay={0.3}>WEDDING THEME</R>
          <R delay={0.4}>
            <div className="th-row">
              <div className="th-dot" style={{ background: '#ffe995' }}></div>
              <div className="th-dot" style={{ background: '#bdccb9' }}></div>
              <div className="th-dot" style={{ background: '#f4c0d9' }}></div>
              <div className="th-dot" style={{ background: '#b2b5db' }}></div>
              <div className="th-dot" style={{ background: '#6fb3d3' }}></div>
            </div>
          </R>
          <R delay={0.5}><span className="hashtag">#ItWasMeantToBeChin</span></R>
        </div>
        <div className="sep"></div>

        {/* ══ MAGAZINE PHOTOS ══ */}
        <div className="sec" id="photos" style={{ gap: '12px' }}>
          <R className="xs">OUR JOURNEY TOGETHER</R>
          <R className="div" delay={0.1} />
          <R delay={0.1}>
            <div className="mag">
              {/* eslint-disable @next/next/no-img-element */}
              <div className="pf m1"><img src="/images/photo-m1.jpg" alt="Photo 1" /></div>
              <div className="pf m2"><img src="/images/photo-m2.jpg" alt="Photo 2" /></div>
              <div className="pf m3"><img src="/images/photo-m3.jpg" alt="Photo 3" /></div>
              <div className="pf m4"><img src="/images/photo-m4.jpg" alt="Photo 4" /></div>
              <div className="pf m5"><img src="/images/photo-m5.jpg" alt="Photo 5" /></div>
              <div className="pf m6"><img src="/images/photo-m6.jpg" alt="Photo 6" /></div>
              <div className="pf m7"><img src="/images/photo-m7.jpg" alt="Photo 7" /></div>
              {/* eslint-enable @next/next/no-img-element */}
            </div>
          </R>
          <R delay={0.2}>
            <span className="cap-s">Every Moment, Every Journey</span>
            <span className="cap-th">ทุกเส้นทางที่เดินไปด้วยกัน<br />คือความทรงจำที่จะอยู่ในใจตลอดไป</span>
          </R>
          <R className="pnum" delay={0.3}>01 · 02 · 03 · 04 · 05 · 06 · 07</R>
        </div>
        <div className="sep"></div>

        {/* ══ CLOSING ══ */}
        <div className="sec" id="closing" style={{ paddingBottom: '95px' }}>
          <R className="gv" >
            <div style={{ fontSize: '41px' }}>We&apos;re Getting Married!</div>
          </R>
          <R delay={0.1}>
            <div className="c-grid">
              {/* eslint-disable @next/next/no-img-element */}
              <div className="c-img"><img src="/images/closing-left.jpg" alt="Closing Photo" /></div>
              <div className="c-img"><img src="/images/closing-right.jpg" alt="Closing Photo" /></div>
              {/* eslint-enable @next/next/no-img-element */}
            </div>
          </R>
          <R delay={0.2}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-closing.png" alt="Logo" style={{ width: '178px', height: '178px', objectFit: 'contain' }} />
          </R>
          <R className="cinzel" delay={0.2}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--blue)', letterSpacing: '.12em' }}>
              NITCHAWEE &amp; CHINNABHORN
            </div>
          </R>
          <R className="xs" delay={0.3}>
            <div style={{ letterSpacing: '.25em' }}>19 · DECEMBER · 2026</div>
          </R>
          <R delay={0.3}>
            <div style={{ fontSize: '18px', letterSpacing: '.15em' }}>🤍 🌸 🤍</div>
          </R>
          <R className="div-lg" delay={0.3} />
          <R className="thai" delay={0.4}>
            <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '2.1' }}>
              Kachong Hills Tented Resort Trang<br />
              <a href="https://maps.app.goo.gl/Lv1XmGrwo2rdrdw57" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#e07b8a', textDecoration: 'none', fontWeight: 600 }}>
                <MapPin size={15} strokeWidth={2.2} />
                กะช่องฮิลส์ เต็นท์ รีสอร์ท จ.ตรัง
              </a><br />
              Saturday 19 December 2026 · 12:59 PM
            </div>
          </R>
          <R delay={0.5}><span className="hashtag" style={{ fontSize: '12px' }}>#ItWasMeantToBeChin</span></R>
        </div>

      </div>

      {/* ══ SCROLL HINT ══ */}
      <div className="sh" id="sh">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d5f8a" strokeWidth="2" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: '7px', letterSpacing: '.4em', color: 'var(--blue)', textTransform: 'uppercase' }}>
          scroll
        </span>
      </div>
    </>
  );
}
