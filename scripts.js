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
                    "I'm a front-end developer specialising in React and TypeScript,",
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
                    '  · Penetration Testing Fundamentals',
                    '  · IPC Specialist Modules',
                    '  · ESD Protection Training',
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
                    const cmds = Object.entries(COMMANDS).filter(([, c]) => c.category === group && !c.hidden);
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
        // fun (hidden) ────────────────────────────────────────────────────
        whoami: {
            description: 'Print current user',
            category: 'fun',
            hidden: true,
            handler() { return 'alan'; }
        },
        motorsport: {
            description: 'Motorsport takes',
            category: 'fun',
            hidden: true,
            handler() { return 'F1 for the strategy.\nWRC for the raw driving.'; }
        },
        f1: {
            description: 'F1 preference',
            category: 'fun',
            hidden: true,
            handler() { return 'Favorite team: <PLACEHOLDER>. Favorite driver: <PLACEHOLDER>.'; }
        },
        wrc: {
            description: 'WRC take',
            category: 'fun',
            hidden: true,
            handler() { return 'Nothing beats Tarmac at night.'; }
        },
        coffee: {
            description: 'Brew a cup',
            category: 'fun',
            hidden: true,
            handler() {
                return [
                    '   ( (',
                    '  .----.',
                    '  |    |]',
                    "  `----'",
                ].join('\n');
            }
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
        if (reducedMotion) return;
        const colors = ['#ffd700', '#ff6b9d', '#58a6ff', '#4dff91', '#ff9f43'];
        for (let i = 0; i < 30; i++) {
            const dot = document.createElement('div');
            dot.className = 'konami-dot';
            dot.style.left             = (Math.random() * 100) + 'vw';
            dot.style.top              = (Math.random() * 100) + 'vh';
            dot.style.background       = colors[Math.floor(Math.random() * colors.length)];
            dot.style.animationDelay   = (Math.random() * 0.4).toFixed(2) + 's';
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

    // ── Execute a command ─────────────────────────────────────────────────
    function runCommand(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return;

        history.unshift(raw);
        if (history.length > 50) history.length = 50;
        histIdx = -1;
        saveHistory();

        appendLine('alan@portfolio:~$ ' + raw, 'term-cmd');

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

    function openTerminal() {
        if (!termModal) return;
        termModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        input.focus();
        if (termBtn && termBtn.classList.contains('pulsing')) {
            termBtn.classList.remove('pulsing');
            try { localStorage.setItem('terminal-discovered', '1'); } catch (_) {}
        }
    }

    function closeTerminal() {
        if (!termModal) return;
        termModal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    if (termBtn) {
        try {
            if (!localStorage.getItem('terminal-discovered')) termBtn.classList.add('pulsing');
        } catch (_) {}
        termBtn.addEventListener('click', openTerminal);
    }

    const termClose = document.querySelector('.term-close');
    if (termClose) termClose.addEventListener('click', closeTerminal);

    if (termModal) {
        termModal.addEventListener('click', e => {
            if (e.target === termModal) closeTerminal();
        });
    }

    // Platform hint & tooltip
    const isMac    = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    const shortcut = isMac ? '⌘K' : 'Ctrl+K';
    const termHint = document.getElementById('termHint');
    if (termHint) termHint.textContent = `Press ${shortcut} to explore as a terminal — or click the icon bottom-right.`;
    if (termBtn)  termBtn.dataset.tooltip = `Open terminal (${shortcut})`;

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
