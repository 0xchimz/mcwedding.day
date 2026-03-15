'use client';

import { useEffect } from 'react';

export default function WeddingEcard() {
  useEffect(() => {
    const els = document.querySelectorAll('.r');
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((x) => {
          if (x.isIntersecting) {
            x.target.classList.add('v');
            io.unobserve(x.target);
          }
        }),
      { threshold: 0.06 }
    );
    els.forEach((el) => io.observe(el));

    const handleScroll = () => {
      const sh = document.getElementById('sh');
      if (sh) sh.classList.add('gone');
    };
    window.addEventListener('scroll', handleScroll, { once: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="page-wrap">

        {/* ══ COVER ══ */}
        <div className="sec" id="cover">
          <div className="xs r">OUR HEARTS ARE FULL OF JOY</div>
          <div className="div r d2"></div>
          <div className="gv ds r d2">
            Saturday 19<sup style={{ fontSize: '.38em', verticalAlign: 'super' }}>th</sup>
          </div>
          <div className="cinzel r d3" style={{ fontSize: '14px', letterSpacing: '.55em', color: 'var(--muted)' }}>
            DECEMBER
          </div>
          <div className="xs r d3" style={{ marginTop: '-5px' }}>2 0 2 6</div>
          <div className="div-lg r d3"></div>
          <div className="cinzel r d4" style={{ fontSize: '9px', letterSpacing: '.35em', color: 'var(--muted)', lineHeight: '2.4' }}>
            YOU ARE INVITED TO THE WEDDING OF
          </div>
          <div className="r d4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo" src="/images/logo.png" alt="Wedding Logo" />
          </div>
          <div className="div-lg r d5"></div>
          <div className="xs r d5" style={{ letterSpacing: '.36em' }}>AT KACHONG HILLS TENTED RESORT TRANG</div>
          <div className="xs r d6" style={{ letterSpacing: '.2em', marginTop: '-4px' }}>1 2 : 5 9 &nbsp;&nbsp; P M</div>
        </div>
        <div className="sep"></div>

        {/* ══ NAMES ══ */}
        <div className="sec">
          <div className="thai sm r" style={{ lineHeight: '2.2' }}>
            นายเจริญ กิจศิริพิพัฒน์ &amp; นางสุมิตรา กิจศิริพิพัฒน์<br />
            <span style={{ fontSize: '11px' }}>และ</span><br />
            นายวิชิต ซุ่นอื้อ &amp; นางพรทิพย์ ซุ่นอื้อ
          </div>
          <div className="div-lg r d2"></div>
          <div className="thai sm r d2">มีความยินดีขอเรียนเชิญเพื่อมาเป็นเกียรติ<br />เนื่องในพิธีมงคลสมรส ระหว่าง</div>
          <div className="div r d2"></div>
          <div className="name-en r d3">NITCHAWEE</div>
          <div className="thai name-th r d3">ณิชชาวีณ์ ศรีวัชรชัยฤกษ์</div>
          <div className="amp r d4">&amp;</div>
          <div className="name-en r d4">CHINNABHORN</div>
          <div className="thai name-th r d4" style={{ marginBottom: '4px' }}>ชินนพร ซุ่นอื้อ</div>
          <div className="div r d5"></div>
          <div className="r d5" style={{ display: 'flex', alignItems: 'center', gap: '17px', justifyContent: 'center' }}>
            <div className="cor" style={{ fontSize: '60px', fontWeight: '300', color: 'var(--muted)', lineHeight: '1' }}>19</div>
            <div style={{ textAlign: 'left', borderLeft: '1px solid rgba(45,95,138,.2)', paddingLeft: '14px' }}>
              <div className="thai" style={{ fontSize: '14px', color: 'var(--text)' }}>ธันวาคม ๒๕๖๙</div>
              <div style={{ fontSize: '11px', letterSpacing: '.08em', color: 'var(--muted)' }}>December 2026</div>
            </div>
          </div>
          <div className="xs r d5" style={{ marginTop: '4px' }}>KACHONG HILLS TENTED RESORT TRANG</div>
          <div className="thai r d6" style={{ fontSize: '12px', color: 'var(--muted)' }}>กะช่องฮิลส์ เต็นท์ รีสอร์ท จ.ตรัง</div>
        </div>
        <div className="sep"></div>

        {/* ══ TIMELINE ══ */}
        <div className="sec">
          <div className="xs r">WEDDING SCHEDULE · กำหนดการวันงาน</div>
          <div className="div-lg r d2"></div>
          <div className="tl-wrap r d3">
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
          <div className="div-lg r d4"></div>
          <div className="xs r d4">WEDDING THEME</div>
          <div className="th-row r d5">
            <div className="th-dot" style={{ background: '#ffe995' }}></div>
            <div className="th-dot" style={{ background: '#bdccb9' }}></div>
            <div className="th-dot" style={{ background: '#f4c0d9' }}></div>
            <div className="th-dot" style={{ background: '#b2b5db' }}></div>
            <div className="th-dot" style={{ background: '#6fb3d3' }}></div>
          </div>
          <div className="r d6"><span className="hashtag">#ItWasMeantToBeChin</span></div>
        </div>
        <div className="sep"></div>

        {/* ══ MAGAZINE PHOTOS ══ */}
        <div className="sec" style={{ gap: '12px' }}>
          <div className="xs r">OUR JOURNEY TOGETHER</div>
          <div className="div r d2"></div>
          <div className="mag r d2">
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
          <div className="r d3">
            <span className="cap-s">Every Moment, Every Journey</span>
            <span className="cap-th">ทุกเส้นทางที่เดินไปด้วยกัน<br />คือความทรงจำที่จะอยู่ในใจตลอดไป</span>
          </div>
          <div className="pnum r d4">01 · 02 · 03 · 04 · 05 · 06 · 07</div>
        </div>
        <div className="sep"></div>

        {/* ══ CLOSING ══ */}
        <div className="sec" style={{ paddingBottom: '95px' }}>
          <div className="gv r" style={{ fontSize: '41px' }}>We&apos;re Getting Married!</div>
          <div className="c-grid r d2">
            {/* eslint-disable @next/next/no-img-element */}
            <div className="c-img"><img src="/images/closing-left.jpg" alt="Closing Photo" /></div>
            <div className="c-img"><img src="/images/closing-right.jpg" alt="Closing Photo" /></div>
            {/* eslint-enable @next/next/no-img-element */}
          </div>
          <div className="r d3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-closing.png" alt="Logo" style={{ width: '178px', height: '178px', objectFit: 'contain' }} />
          </div>
          <div className="cinzel r d3" style={{ fontSize: '16px', fontWeight: '600', color: 'var(--blue)', letterSpacing: '.12em' }}>
            NITCHAWEE &amp; CHINNABHORN
          </div>
          <div className="xs r d4" style={{ letterSpacing: '.25em' }}>19 · DECEMBER · 2026</div>
          <div className="r d4" style={{ fontSize: '18px', letterSpacing: '.15em' }}>🤍 🌸 🤍</div>
          <div className="div-lg r d4"></div>
          <div className="thai r d5" style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: '2.1' }}>
            Kachong Hills Tented Resort Trang<br />
            กะช่องฮิลส์ เต็นท์ รีสอร์ท จ.ตรัง<br />
            Saturday 19 December 2026 · 12:59 PM
          </div>
          <div className="r d6"><span className="hashtag" style={{ fontSize: '12px' }}>#ItWasMeantToBeChin</span></div>
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
