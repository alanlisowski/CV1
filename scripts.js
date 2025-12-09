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
    navLinks.classList.toggle('active');
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

// Animate skill bars when they come into view
const skillBars = document.querySelectorAll('.skill-progress');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if (rect.top <= window.innerHeight - 100) {
            bar.style.width = bar.parentElement.previousElementSibling.lastElementChild.textContent;
        }
    });
}

// Run once on page load
animateSkillBars();

// Run on scroll
window.addEventListener('scroll', animateSkillBars);

// Animation for timeline items
const timelineItems = document.querySelectorAll('.timeline-content');

function animateTimelineItems() {
    timelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top <= window.innerHeight - 100) {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
}

// Initialize timeline items with hidden state
timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.5s ease';
});

// Run once on page load
animateTimelineItems();

// Run on scroll
window.addEventListener('scroll', animateTimelineItems);

// About tabs toggle
const aboutTabs = document.querySelectorAll('[data-about-tab]');
const aboutPanels = document.querySelectorAll('[data-about-panel]');

aboutTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-about-tab');

        aboutTabs.forEach(t => t.classList.remove('active'));
        aboutPanels.forEach(panel => {
            panel.classList.toggle('active', panel.getAttribute('data-about-panel') === target);
        });

        tab.classList.add('active');
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
        btn.textContent = expanded ? 'Zobacz mniej' : 'Zobacz więcej';
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
