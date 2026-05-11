emailjs.init('o4FxClfdcdNZ5vqK6');

// ── SIDEBAR TOGGLE (mobile) ──
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('show', isOpen);
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
}

// ── ACCORDION ──
function toggleItem(h) {
    h.closest('.t-item').classList.toggle('open');
}

// ── PROGRESS BAR ──
const prog = document.getElementById('progress');
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    prog.style.width = pct + '%';
});

// ── ACTIVE NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.sidebar-nav a');
window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    navLinks.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
});

// ── COUNTERS (FIX: GPA uses toFixed(2), apps count = 6) ──
function count(el, target, dec, dur) {
    dur = dur || 1400;
    const s = performance.now();
    (function u(now) {
        const p = Math.min((now - s) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        const v = target * e;
        el.textContent = dec ? v.toFixed(2) : Math.floor(v);
        if (p < 1) requestAnimationFrame(u);
    })(performance.now());
}

let counted = false;
new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
        counted = true;
        count(document.getElementById('c1'), 4);
        count(document.getElementById('c2'), 6);      // FIX: was 10, actual projects = 6
        count(document.getElementById('c3'), 50);
        count(document.getElementById('c4'), 3.55, true); // FIX: decimal counter works correctly
    }
}, { threshold: .3 }).observe(document.querySelector('.stats-row'));

// ── SKILL BARS ──
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-fill').forEach(bar => {
                bar.style.width = bar.dataset.w + '%';
            });
            skillObs.unobserve(e.target);
        }
    });
}, { threshold: .2 });
document.querySelectorAll('.skills-wrap').forEach(el => skillObs.observe(el));

// ── SCROLL REVEAL ──
const revObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('vis'), (i % 4) * 100);
            revObs.unobserve(e.target);
        }
    });
}, { threshold: .06, rootMargin: '0px 0px -24px 0px' });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// ── CONTACT FORM ──
function sendEmail() {
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();
    const honey   = document.getElementById('cf-website').value; // honeypot
    const btn     = document.getElementById('cf-submit');
    const status  = document.getElementById('cf-status');
    const btnText = document.getElementById('cf-btn-text');

    // Silently reject bots that fill the honeypot
    if (honey) {
        status.textContent = '✓ Message sent! I\'ll get back to you soon.';
        status.className = 'form-status success';
        return;
    }

    if (!name || !email || !subject || !message) {
        status.textContent = 'Please fill in all fields.';
        status.className = 'form-status error';
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        status.className = 'form-status error';
        return;
    }

    btn.disabled = true;
    btnText.textContent = 'Sending...';
    status.className = 'form-status';

    emailjs.send('service_tx59z6q', 'template_35lx3cv', {
        from_name: name, from_email: email, subject, message, reply_to: email
    }).then(() => {
        status.textContent = '✓ Message sent! I\'ll get back to you soon.';
        status.className = 'form-status success';
        ['cf-name', 'cf-email', 'cf-subject', 'cf-message'].forEach(id => {
            document.getElementById(id).value = '';
        });
        btnText.textContent = 'Send Message';
        btn.disabled = false;
    }).catch(() => {
        status.textContent = 'Something went wrong. Please try again or email me directly.';
        status.className = 'form-status error';
        btnText.textContent = 'Send Message';
        btn.disabled = false;
    });
}
