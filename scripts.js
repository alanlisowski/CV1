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

// ── Easter eggs ───────────────────────────────────────────────────────────

// 1. Console hello
(function () {
    const c = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#4d7cff';
    console.log(
        '%c👋 Hey there. Try ⌘K (or Ctrl+K) to open the terminal.\n   Then type `play` for a quick trivia about me.',
        `color: ${c}; font-weight: bold; font-size: 14px;`
    );
})();

// 2. Hash-route banners (#f1, #wrc)
function showHashBanner(text, bgColor) {
    const old = document.querySelector('.hash-banner');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className    = 'hash-banner';
    el.textContent  = text;
    el.style.background = bgColor;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3100);
}

function handleHash() {
    const hash = location.hash;
    if (hash === '#f1') {
        const c = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#4d7cff';
        showHashBanner('🏎️ Williams forever.', c);
        history.replaceState(null, '', location.pathname + location.search);
    } else if (hash === '#wrc') {
        showHashBanner('🌲 Rally Poland 2024.', '#2d5016');
        history.replaceState(null, '', location.pathname + location.search);
    }
}

window.addEventListener('hashchange', handleHash);
handleHash();

// 3. Portrait click reveal
(function () {
    const portrait = document.querySelector('.about-image img');
    if (!portrait) return;
    // TODO: drop Aipfp-candid.webp at the project root for the click-5 reveal
    const originalSrc = portrait.getAttribute('src');
    const candidSrc   = 'bambus.jpg';
    let portraitClicks  = 0;
    let isRevealed      = false;
    let inactivityTimer = null;
    let displayTimer    = null;

    function crossFade(newSrc) {
        portrait.style.transition = 'opacity 300ms ease';
        portrait.style.opacity    = '0';
        setTimeout(() => {
            portrait.src           = newSrc;
            portrait.style.opacity = '1';
        }, 300);
    }

    portrait.addEventListener('click', () => {
        if (isRevealed) return;
        portraitClicks++;
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => { portraitClicks = 0; }, 10000);
        if (portraitClicks === 5) {
            isRevealed = true;
            clearTimeout(inactivityTimer);
            crossFade(candidSrc);
            displayTimer = setTimeout(() => {
                crossFade(originalSrc);
                portraitClicks = 0;
                isRevealed     = false;
            }, 5000);
        }
    });
})();

// ── Terminal Playground ───────────────────────────────────────────────────
(function () {
    const output   = document.getElementById('termOutput');
    const input    = document.getElementById('termInput');
    if (!output || !input) return;

    const inputRow      = document.querySelector('.terminal-input-row');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── History (seeded from localStorage) ───────────────────────────────
    const history = [];
    try {
        const saved = JSON.parse(localStorage.getItem('cli-history') || '[]');
        if (Array.isArray(saved)) history.push(...saved.slice(0, 50));
    } catch (_) {}
    let histIdx   = -1;
    let streaming = false;
    let skipStream = false;

    function saveHistory() {
        try {
            localStorage.setItem('cli-history', JSON.stringify(history.slice(0, 50)));
        } catch (_) {}
    }

    // ── Command registry ──────────────────────────────────────────────────
    const COMMANDS = {
        // info ────────────────────────────────────────────────────────────
        about: {
            description: 'Short bio',
            category: 'info',
            handler() {
                return [
                    "I work across the full stack — React, Node.js, and PostgreSQL —",
                    "with a programming-technician background and hands-on experience",
                    "from an internship at Intelly and freelance client work.",
                    '',
                    'Based in Olsztyn, Poland.',
                    'Open to remote, hybrid, or relocation.',
                ].join('\n');
            }
        },
        skills: {
            description: 'Categorized skill list',
            category: 'info',
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
            category: 'info',
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
            category: 'info',
            aliases: ['certifications'],
            handler() {
                return [
                    'Certifications:',
                    '  · IPC SPACE — Electronics Assembly & Repair  (2022)',
                    '  · Penetration Testing Fundamentals  (2022)',
                    '  · ESD Protection — Static Electricity in Computer Repair  (2022)',
                    '  · BGA Diagnostics & Repair  (2023)',
                    '',
                    '  All certs: ZSEiT Olsztyn × MCDZ Włocławek · EU-funded vocational training programme',
                ].join('\n');
            }
        },
        // navigation ──────────────────────────────────────────────────────
        projects: {
            description: 'List projects with links',
            category: 'navigation',
            handler() {
                const el = document.createElement('span');
                el.className = 'term-output-block';
                el.innerHTML =
                    '<strong style="color:#c9d1d9">Projects:</strong>\n\n' +
                    '  PitWall — F1 Race Strategy Simulator  (Python · FastAPI · React · TypeScript · Vite · SQLite)\n' +
                    '  → <a href="https://github.com/alanlisowski/pitwall" target="_blank" rel="noopener">github.com/alanlisowski/pitwall</a>  |  <a href="https://pitwall-mu-five.vercel.app/" target="_blank" rel="noopener">Live demo</a>\n\n' +
                    '  Wardrobe AI  (React Native · TypeScript · Hono · Python · Claude API)\n' +
                    '  → <a href="https://github.com/alanlisowski/wardrobe-app" target="_blank" rel="noopener">github.com/alanlisowski/wardrobe-app</a>\n\n' +
                    '  E-commerce Website  (React · Node.js · PostgreSQL)\n' +
                    '  → <a href="https://github.com/alanlisowski/exodus-store" target="_blank" rel="noopener">github.com/alanlisowski/exodus-store</a>\n\n' +
                    '  More → <a href="https://github.com/alanlisowski" target="_blank" rel="noopener">github.com/alanlisowski</a>';
                return el;
            }
        },
        contact: {
            description: 'Contact details',
            category: 'navigation',
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
            category: 'navigation',
            aliases: ['cv'],
            handler() {
                window.open('resume.pdf', '_blank', 'noopener,noreferrer');
                return 'Opening résumé...';
            }
        },
        theme: {
            description: 'Toggle dark / light mode',
            category: 'navigation',
            handler() {
                const btn = document.getElementById('themeToggle');
                if (btn) btn.click();
                const now = document.documentElement.getAttribute('data-theme');
                return `Switched to ${now} mode.`;
            }
        },
        clear: {
            description: 'Clear the terminal',
            category: 'navigation',
            handler: null
        },
        help: {
            description: 'List available commands',
            category: 'navigation',
            handler(args) {
                const showAll = args && args.includes('--all');
                const groups  = showAll ? ['info', 'navigation', 'fun'] : ['info', 'navigation'];
                const lines   = ['Available commands:', ''];
                for (const group of groups) {
                    const cmds = Object.entries(COMMANDS).filter(([, c]) => c.category === group && (!c.hidden || showAll));
                    if (!cmds.length) continue;
                    lines.push('  ' + group[0].toUpperCase() + group.slice(1));
                    for (const [name, cmd] of cmds) {
                        const note = cmd.aliases ? '  (alias: ' + cmd.aliases.join(', ') + ')' : '';
                        lines.push('    ' + name.padEnd(12) + '— ' + cmd.description + note);
                    }
                    lines.push('');
                }
                if (!showAll) lines.push('(There may be hidden commands. Try things.)');
                return lines.join('\n');
            }
        },
        play: {
            description: 'Trivia quiz about me',
            category: 'navigation',
            aliases: ['trivia', 'quiz'],
            handler(args) {
                if (args && args.includes('--reset')) {
                    try {
                        localStorage.removeItem('trivia-stage');
                        localStorage.removeItem('trivia-complete');
                    } catch (_) {}
                    triviaStage         = 0;
                    triviaWrongAttempts = 0;
                    triviaResumePending = false;
                    triviaActive        = true;
                    appendLine('Trivia time. Type your answer, `skip` to skip, `quit` to exit.');
                    triviaShowQuestion();
                    return;
                }
                let savedStage = 0;
                try { savedStage = parseInt(localStorage.getItem('trivia-stage') || '0', 10); } catch (_) {}
                if (savedStage > 0 && savedStage <= TRIVIA_STAGES.length) {
                    triviaStage         = savedStage - 1;
                    triviaWrongAttempts = 0;
                    triviaResumePending = true;
                    triviaActive        = true;
                    appendLine('You were on question ' + savedStage + '. Resume? [y/n]');
                    scrollBottom();
                    return;
                }
                triviaStage         = 0;
                triviaWrongAttempts = 0;
                triviaResumePending = false;
                triviaActive        = true;
                appendLine('Trivia time. Type your answer, `skip` to skip, `quit` to exit.');
                triviaShowQuestion();
            }
        },
        // fun (hidden) ────────────────────────────────────────────────────
        whoami: {
            description: 'Print current user',
            category: 'fun',
            hidden: true,
            handler() { return 'alan @ olsztyn.pl'; }
        },
        pwd: {
            description: 'Print working directory',
            category: 'fun',
            hidden: true,
            handler() { return '/home/alan/portfolio'; }
        },
        ls: {
            description: 'List commands',
            category: 'fun',
            hidden: true,
            handler(args) { return COMMANDS.help.handler(args); }
        },
        vim: {
            description: 'Open text editor',
            category: 'fun',
            hidden: true,
            handler() { return "the answer is :wq, but you'll be stuck for 10 minutes first."; }
        },
        motorsport: {
            description: 'Motorsport takes',
            category: 'fun',
            hidden: true,
            handler() { return 'F1 for the strategy.\nWRC for the raw driving.'; }
        },
        joke: {
            description: 'Random programming joke',
            category: 'fun',
            hidden: true,
            handler() {
                const jokes = [
                    'Why do programmers prefer dark mode? Because light attracts bugs.',
                    "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
                    "There are 10 types of people: those who understand binary, and those who don't.",
                    "Why do Java developers wear glasses? Because they don't C#.",
                    "I would tell you a UDP joke, but you might not get it.",
                ];
                return jokes[Math.floor(Math.random() * jokes.length)];
            }
        },
        ascii: {
            description: 'Big ASCII name',
            category: 'fun',
            hidden: true,
            handler() {
                return [
                    ' █████  ██       █████  ███    ██',
                    '██   ██ ██      ██   ██ ████   ██',
                    '███████ ██      ███████ ██ ██  ██',
                    '██   ██ ██      ██   ██ ██  ██ ██',
                    '██   ██ ███████ ██   ██ ██   ████',
                ].join('\n');
            }
        },
        sudo: {
            description: 'Elevate privileges',
            category: 'fun',
            hidden: true,
            handler() { return 'nice try.'; }
        },
        rm: {
            description: 'Remove files',
            category: 'fun',
            hidden: true,
            handler() { return 'lol no.'; }
        },
        exit: {
            description: 'Exit the terminal',
            category: 'fun',
            hidden: true,
            aliases: ['quit'],
            handler() { return 'nowhere to go. you\'re already here.'; }
        },
        secret: {
            description: 'Secret',
            category: 'fun',
            hidden: true,
            handler() { return 'try `konami`...'; }
        },
        konami: {
            description: 'Unlock sparkle mode',
            category: 'fun',
            hidden: true,
            handler() {
                triggerKonami();
                return reducedMotion ? '✨ unlocked' : '✨';
            }
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

    // ── Konami sparkle ────────────────────────────────────────────────────
    function triggerKonami() {
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#4d7cff';
        if (reducedMotion) {
            showHashBanner('✨ Konami unlocked', primaryColor);
            return;
        }
        for (let i = 0; i < 30; i++) {
            const dot = document.createElement('div');
            dot.className = 'konami-dot';
            dot.style.left           = (Math.random() * 100) + 'vw';
            dot.style.top            = (Math.random() * 100) + 'vh';
            dot.style.background     = primaryColor;
            dot.style.animationDelay = (Math.random() * 0.4).toFixed(2) + 's';
            document.body.appendChild(dot);
            setTimeout(() => dot.remove(), 2600);
        }
    }

    // ── Typewriter streaming ──────────────────────────────────────────────
    function streamOutput(text, onDone) {
        if (reducedMotion) {
            text.split('\n').forEach(l => appendLine(l));
            appendLine('');
            scrollBottom();
            onDone();
            return;
        }

        streaming  = true;
        skipStream = false;
        if (inputRow) inputRow.style.visibility = 'hidden';

        const span = document.createElement('span');
        span.className = 'term-line';
        span.style.whiteSpace = 'pre-wrap';
        output.appendChild(span);

        const chars = Array.from(text);
        let i = 0;

        function tick() {
            if (skipStream) { span.textContent = text; finalize(); return; }
            if (i >= chars.length)              { finalize(); return; }
            span.textContent += chars[i++];
            scrollBottom();
            setTimeout(tick, 10);
        }

        function finalize() {
            output.appendChild(document.createElement('br'));
            appendLine('');
            scrollBottom();
            streaming  = false;
            skipStream = false;
            if (inputRow) inputRow.style.visibility = '';
            input.focus();
            onDone();
        }

        tick();
    }

    // ── Tab completion ────────────────────────────────────────────────────
    function doTabComplete() {
        const val = input.value;
        if (!val) return;
        const matches = Object.keys(lookup).filter(n => n.startsWith(val));
        if (matches.length === 0) {
            return;
        } else if (matches.length === 1) {
            input.value = matches[0];
        } else {
            appendLine(matches.join('  '));
            scrollBottom();
        }
    }

    // ── Welcome message ───────────────────────────────────────────────────
    appendLine("Welcome to Alan's portfolio.");
    appendLine("Type `help` to see what's available.");
    appendLine('');
    scrollBottom();

    // ── Trivia state machine ──────────────────────────────────────────────────
    const TRIVIA_STAGES = [
        {
            question: "What's my favorite F1 team?",
            accepted: ['williams'],
            hintOnWrong: 'Their logo is blue. They were dominant in the 90s — Mansell, Hill, Villeneuve.',
            reward: 'Williams. The grit gets me, even on bad weekends.'
        },
        {
            question: "Now — who's my favorite driver?",
            accepted: ['max verstappen', 'max', 'verstappen'],
            hintOnWrong: 'Youngest F1 race winner ever. Drives in orange.',
            reward: "Max Verstappen. Different team than my favorite. Yes I know. Don't @ me."
        },
        {
            question: 'What year was Rally Poland last a WRC round?',
            accepted: ['2024'],
            hintOnWrong: 'Same year as the last US presidential election. After a 7-year gap.',
            reward: "2024. Watched every stage. The return I'd been waiting for."
        },
        {
            question: 'How do I take my coffee?',
            accepted: ['double espresso', 'espresso', 'double'],
            hintOnWrong: 'Same shot, twice over. No milk, no sugar.',
            reward: 'Double espresso. Twice a day, minimum.'
        },
        {
            question: 'What plays in my headphones while I code?',
            accepted: ['house'],
            hintOnWrong: 'Born in Chicago in the 80s. Four-on-the-floor.',
            reward: 'House. Steady BPM, no distractions.'
        },
        {
            question: 'What language got me started?',
            accepted: ['html'],
            hintOnWrong: "Three letters. Technically not a programming language. It's where I drew my first <div>.",
            reward: 'HTML. The first <div> I ever wrote felt like magic.'
        },
        {
            question: "Last one — what's the football team of Olsztyn called?",
            accepted: ['stomil', 'stomil olsztyn'],
            hintOnWrong: 'Starts with S. Named after a Polish rubber and tire factory.',
            reward: 'Stomil Olsztyn. The hometown side.'
        }
    ];

    const TROPHY = [
        '       ___________',
        "      '._==_==_=_.'",
        '      .-\\:      /-.',
        '     | (|:.     |) |',
        "      '-|:.     |-'",
        '        \\::.    /',
        "         '::. .'",
        '           ) (',
        "         _.' '._",
        '        `"""""""`'
    ].join('\n');

    let triviaActive        = false;
    let triviaStage         = 0;
    let triviaWrongAttempts = 0;
    let triviaResumePending = false;

    function triviaShowQuestion() {
        const stage = TRIVIA_STAGES[triviaStage];
        appendLine('');
        appendLine('[' + (triviaStage + 1) + '/' + TRIVIA_STAGES.length + '] ' + stage.question);
        scrollBottom();
    }

    function triviaAdvance() {
        triviaStage++;
        triviaWrongAttempts = 0;
        if (triviaStage >= TRIVIA_STAGES.length) {
            triviaActive = false;
            try {
                localStorage.setItem('trivia-complete', '1');
                localStorage.removeItem('trivia-stage');
            } catch (_) {}
            streamOutput(TROPHY, () => {
                appendLine('When life gets tough remember u da goat :)');
                appendLine('');
                appendLine('Trivia complete. Type `play --reset` to play again.');
                scrollBottom();
            });
            return;
        }
        try { localStorage.setItem('trivia-stage', String(triviaStage + 1)); } catch (_) {}
        triviaShowQuestion();
    }

    function triviaHandleInput(raw) {
        const val = raw.trim().toLowerCase();

        if (triviaResumePending) {
            triviaResumePending = false;
            if (val === 'y') {
                triviaShowQuestion();
            } else {
                try { localStorage.removeItem('trivia-stage'); } catch (_) {}
                triviaStage         = 0;
                triviaWrongAttempts = 0;
                appendLine('Trivia time. Type your answer, `skip` to skip, `quit` to exit.');
                triviaShowQuestion();
            }
            return;
        }

        if (val === 'quit') {
            triviaActive = false;
            appendLine('Trivia closed. Type `play` to resume.');
            scrollBottom();
            return;
        }

        const stage = TRIVIA_STAGES[triviaStage];

        if (val === 'skip') {
            appendLine('(skipped) Answer was: ' + stage.accepted[0]);
            appendLine('');
            triviaAdvance();
            return;
        }

        const match = stage.accepted.some(a => a === val);

        if (match) {
            triviaWrongAttempts = 0;
            streamOutput('✓ ' + stage.reward, () => {
                appendLine('');
                triviaAdvance();
            });
        } else {
            triviaWrongAttempts++;
            if (triviaWrongAttempts === 1) {
                appendLine('✗ ' + stage.hintOnWrong);
            } else if (triviaWrongAttempts >= 3) {
                appendLine('✗ Type `skip` to move on.');
            } else {
                appendLine('✗ Try again.');
            }
            scrollBottom();
        }
    }

    // ── Execute a command ─────────────────────────────────────────────────
    function runCommand(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return;

        history.unshift(raw);
        if (history.length > 50) history.length = 50;
        histIdx = -1;
        saveHistory();

        appendLine('alan@portfolio:~$ ' + raw, 'term-cmd');

        if (triviaActive) {
            triviaHandleInput(trimmed);
            return;
        }

        const parts   = trimmed.toLowerCase().split(/\s+/);
        const cmdName = parts[0];
        const args    = parts.slice(1);

        if (cmdName === 'clear') {
            output.innerHTML = '';
            return;
        }

        const key = lookup[cmdName];
        if (!key) {
            appendLine('command not found: ' + cmdName + '. Try `help`.', 'term-error');
            scrollBottom();
            return;
        }

        const result = COMMANDS[key].handler(args);
        if (result instanceof HTMLElement) {
            appendEl(result);
            appendLine('');
            scrollBottom();
        } else if (typeof result === 'string') {
            streamOutput(result, () => {});
        }
    }

    // ── Keyboard handling ─────────────────────────────────────────────────
    input.addEventListener('keydown', e => {
        if (streaming) {
            skipStream = true;
            e.preventDefault();
            return;
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            doTabComplete();
        } else if (e.key === 'Enter') {
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

    // ── Konami sequence (global) ──────────────────────────────────────────
    const KONAMI_SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let konamiIdx = 0;
    document.addEventListener('keydown', e => {
        if (e.key === KONAMI_SEQ[konamiIdx]) {
            konamiIdx++;
            if (konamiIdx === KONAMI_SEQ.length) {
                konamiIdx = 0;
                triggerKonami();
            }
        } else {
            konamiIdx = e.key === KONAMI_SEQ[0] ? 1 : 0;
        }
    });

    // ── Click inside terminal → focus input ───────────────────────────────
    document.querySelector('.terminal-panel').addEventListener('click', () => {
        input.focus();
    });

    // ── Terminal modal controls ───────────────────────────────────────────
    const termModal = document.getElementById('termModal');
    const termBtn   = document.getElementById('termBtn');

    const isMac    = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    const shortcut = isMac ? '⌘K' : 'Ctrl+K';

    function discoverTerminal() {
        if (!termBtn) return;
        let alreadyKnown = false;
        try { alreadyKnown = !!localStorage.getItem('terminal-discovered'); } catch (_) {}
        if (alreadyKnown) return;
        try { localStorage.setItem('terminal-discovered', '1'); } catch (_) {}
        termBtn.classList.remove('is-pill');
        termBtn.classList.add('is-collapsed');
        termBtn.dataset.tooltip = `Open terminal (${shortcut})`;
    }

    function openTerminal() {
        if (!termModal) return;
        termModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        input.focus();
        discoverTerminal();
    }

    function closeTerminal() {
        if (!termModal) return;
        termModal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // Initialize FAB state
    if (termBtn) {
        let discovered = false;
        try { discovered = !!localStorage.getItem('terminal-discovered'); } catch (_) {}

        if (discovered) {
            termBtn.classList.add('is-collapsed');
            termBtn.dataset.tooltip = `Open terminal (${shortcut})`;
        } else {
            const fabText = termBtn.querySelector('.fab-text');
            if (fabText) fabText.textContent = `Press ${shortcut} to explore`;
            setTimeout(() => termBtn.classList.add('is-pill'), 1500);
        }

        termBtn.addEventListener('click', openTerminal);
    }

    const termClose = document.querySelector('.term-close');
    if (termClose) termClose.addEventListener('click', closeTerminal);

    if (termModal) {
        termModal.addEventListener('click', e => {
            if (e.target === termModal) closeTerminal();
        });
    }

    // Hero hint
    const termHint = document.getElementById('termHint');
    if (termHint) termHint.textContent = `Press ${shortcut} to explore as a terminal — or click the icon bottom-right.`;

    // Keyboard: Cmd/Ctrl+K toggles, Esc closes
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            termModal && termModal.classList.contains('is-open') ? closeTerminal() : openTerminal();
        } else if (e.key === 'Escape' && termModal && termModal.classList.contains('is-open')) {
            e.preventDefault();
            closeTerminal();
        }
    });
})();
