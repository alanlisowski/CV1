// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

applyTheme(document.documentElement.getAttribute('data-theme') || 'dark');

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
});

// Google Translate Initialization
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,pl,de',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}
// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll-reveal: single IntersectionObserver for all .reveal and .reveal-stagger elements
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
    revealObserver.observe(el);
});

// About tabs toggle
const aboutTabs = document.querySelectorAll('[data-about-tab]');
const aboutPanels = document.querySelectorAll('[data-about-panel]');

aboutTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-about-tab');

        aboutTabs.forEach(t => {
            const active = t === tab;
            t.classList.toggle('active', active);
            t.setAttribute('aria-selected', String(active));
        });
        aboutPanels.forEach(panel => {
            const active = panel.getAttribute('data-about-panel') === target;
            panel.classList.toggle('active', active);
            panel.setAttribute('aria-hidden', String(!active));
        });
    });
});

// Timeline "see more" toggle
const collapseToggles = document.querySelectorAll('[data-collapse-toggle]');

collapseToggles.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-collapse-toggle');
        const content = document.querySelector(`[data-collapse-content="${target}"]`);
        if (!content) return;

        const expanded = content.classList.toggle('expanded');
        btn.textContent = expanded ? 'Read less' : 'Read more';
        btn.setAttribute('aria-expanded', String(expanded));
    });
});

// Additional translation fix for dynamic content
function restorePageStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .translated-ltr body { top: 0 !important; }
        .translated-ltr header { margin-top: 0 !important; }
    `;
    document.head.appendChild(style);
}

// Run after translation
setTimeout(restorePageStyles, 1000);

// ── Terminal Playground ───────────────────────────────────────────────────
(function () {
    const output = document.getElementById('termOutput');
    const input  = document.getElementById('termInput');
    if (!output || !input) return;

    const history = [];
    let histIdx = -1;

    // ── Command registry ──────────────────────────────────────────────────
    const COMMANDS = {
        help: {
            description: 'List available commands',
            handler() {
                return [
                    'Available commands:\n',
                    '  Navigation',
                    '    about        — short bio',
                    '    projects     — projects with links',
                    '    skills       — categorized skill list',
                    '    education    — education & gap year',
                    '    certs        — certifications  (alias: certifications)',
                    '    contact      — contact details (alias: social)',
                    '    resume       — open résumé PDF (alias: cv)',
                    '',
                    '  Terminal',
                    '    theme        — toggle dark / light mode',
                    '    clear        — clear this terminal',
                    '    help         — show this list',
                ].join('\n');
            }
        },
        about: {
            description: 'Short bio',
            handler() {
                return [
                    "I'm a front-end developer specialising in React and TypeScript,",
                    "with a programming-technician background and hands-on experience",
                    "from an internship at Intelly and freelance client work.",
                    '',
                    'Based in Olsztyn, Poland.',
                    'Open to remote, hybrid, or relocation.',
                ].join('\n');
            }
        },
        projects: {
            description: 'List projects with links',
            handler() {
                const el = document.createElement('span');
                el.className = 'term-output-block';
                el.innerHTML =
                    '<strong style="color:#c9d1d9">Projects:</strong>\n\n' +
                    '  E-commerce Website  (React · Node.js · PostgreSQL)\n' +
                    '  → <a href="https://github.com/alanlisowski/exodus-store" target="_blank" rel="noopener">github.com/alanlisowski/exodus-store</a>\n\n' +
                    '  Task Management App  (React · Tailwind · Vite)\n' +
                    '  → <a href="https://github.com/alanlisowski/Task-manager" target="_blank" rel="noopener">github.com/alanlisowski/Task-manager</a>\n\n' +
                    '  Weather Dashboard  (JS · CSS · OpenWeatherMap API)\n' +
                    '  → <a href="https://github.com/alanlisowski/Weather-app" target="_blank" rel="noopener">github.com/alanlisowski/Weather-app</a>\n\n' +
                    '  More → <a href="https://github.com/alanlisowski" target="_blank" rel="noopener">github.com/alanlisowski</a>';
                return el;
            }
        },
        skills: {
            description: 'Categorized skill list',
            handler() {
                return [
                    'Languages   JavaScript · TypeScript · Python · HTML · CSS',
                    'Frameworks  React · Next.js · Tailwind CSS · Node.js',
                    'Tools       Git · Vite · PostgreSQL · REST APIs',
                    'Learning    Docker · Testing (Jest/Vitest)',
                ].join('\n');
            }
        },
        education: {
            description: 'Education & gap year summary',
            handler() {
                return [
                    '2024–2025  Gap year',
                    '           Travelling and working across different fields —',
                    '           broadened perspective, returned ready to build.',
                    '',
                    '2018–2024  Zespół Szkół Elektronicznych i Telekomunikacyjnych, Olsztyn',
                    '           Programming Technician. Courses: Data Structures,',
                    '           Algorithms, Web Dev, Databases, Pen-testing, IPC, ESD.',
                ].join('\n');
            }
        },
        certs: {
            description: 'List certifications',
            aliases: ['certifications'],
            handler() {
                return [
                    'Certifications:',
                    '  · Penetration Testing Fundamentals',
                    '  · IPC Specialist Modules',
                    '  · ESD Protection Training',
                ].join('\n');
            }
        },
        contact: {
            description: 'Contact details',
            aliases: ['social'],
            handler() {
                const el = document.createElement('span');
                el.className = 'term-output-block';
                el.innerHTML =
                    '<strong style="color:#c9d1d9">Contact:</strong>\n\n' +
                    '  Email     <a href="mailto:pro4gramista@gmail.com">pro4gramista@gmail.com</a>\n' +
                    '  LinkedIn  <a href="https://www.linkedin.com/in/alan-lisowski-3395b739a/" target="_blank" rel="noopener">linkedin.com/in/alan-lisowski-3395b739a</a>\n' +
                    '  GitHub    <a href="https://github.com/alanlisowski" target="_blank" rel="noopener">github.com/alanlisowski</a>\n' +
                    '  WhatsApp  <a href="https://wa.me/message/LHPBYF2HQW4XP1" target="_blank" rel="noopener">Start chat</a>';
                return el;
            }
        },
        resume: {
            description: 'Open résumé PDF in new tab',
            aliases: ['cv'],
            handler() {
                window.open('resume.pdf', '_blank', 'noopener,noreferrer');
                return 'Opening résumé...';
            }
        },
        theme: {
            description: 'Toggle dark / light mode',
            handler() {
                const btn = document.getElementById('themeToggle');
                if (btn) btn.click();
                const now = document.documentElement.getAttribute('data-theme');
                return `Switched to ${now} mode.`;
            }
        },
        clear: {
            description: 'Clear the terminal',
            handler: null
        }
    };

    // ── Alias lookup map ──────────────────────────────────────────────────
    const lookup = {};
    Object.keys(COMMANDS).forEach(name => {
        lookup[name] = name;
        (COMMANDS[name].aliases || []).forEach(a => { lookup[a] = name; });
    });

    // ── Output helpers ────────────────────────────────────────────────────
    function appendLine(text, cls) {
        const line = document.createElement('span');
        line.className = 'term-line' + (cls ? ' ' + cls : '');
        line.textContent = text;
        output.appendChild(line);
        output.appendChild(document.createElement('br'));
    }

    function appendEl(el) {
        output.appendChild(el);
        output.appendChild(document.createElement('br'));
    }

    function scrollBottom() {
        output.scrollTop = output.scrollHeight;
    }

    // ── Welcome message ───────────────────────────────────────────────────
    appendLine("Welcome to Alan's portfolio.");
    appendLine("Type `help` to see what's available.");
    appendLine('');
    scrollBottom();

    // ── Execute a command ─────────────────────────────────────────────────
    function runCommand(raw) {
        const cmd = raw.trim().toLowerCase();
        if (!cmd) return;

        history.unshift(raw);
        histIdx = -1;

        appendLine('alan@portfolio:~$ ' + raw, 'term-cmd');

        if (cmd === 'clear') {
            output.innerHTML = '';
            return;
        }

        const key = lookup[cmd];
        if (!key) {
            appendLine('command not found: ' + cmd + '. Try `help`.', 'term-error');
            scrollBottom();
            return;
        }

        const result = COMMANDS[key].handler();
        if (result instanceof HTMLElement) {
            appendEl(result);
        } else if (typeof result === 'string') {
            result.split('\n').forEach(l => appendLine(l));
        }

        appendLine('');
        scrollBottom();
    }

    // ── Keyboard handling ─────────────────────────────────────────────────
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const val = input.value;
            input.value = '';
            runCommand(val);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!history.length) return;
            histIdx = Math.min(histIdx + 1, history.length - 1);
            input.value = history[histIdx];
            requestAnimationFrame(() => {
                input.setSelectionRange(input.value.length, input.value.length);
            });
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (histIdx <= 0) { histIdx = -1; input.value = ''; return; }
            histIdx--;
            input.value = history[histIdx];
        }
    });

    // ── Click inside terminal → focus input ───────────────────────────────
    document.querySelector('.terminal-panel').addEventListener('click', () => {
        input.focus();
    });

    // ── Click outside terminal → release focus ────────────────────────────
    document.addEventListener('click', e => {
        const panel = document.querySelector('.terminal-panel');
        if (panel && !panel.contains(e.target)) input.blur();
    });

    // ── Auto-focus on desktop (pointer device, wide screen) ───────────────
    if (window.matchMedia('(min-width: 1024px) and (hover: hover)').matches) {
        input.focus();
    }
})();
