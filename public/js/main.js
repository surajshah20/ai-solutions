// =============================================
// AI-Solutions — Main JavaScript
// =============================================

// ---------- Mobile Nav Toggle ----------
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('open');
        }
    });
}

// ---------- Active Nav Link ----------
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
        link.style.color = 'var(--primary)';
        link.style.background = '#f0f0ff';
    }
});

// ---------- AI Chatbot ----------
const RESPONSES = {
    greetings: {
        triggers: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'howdy'],
        response: "Hello! 👋 Welcome to AI-Solutions. I'm here to help you. You can ask me about our services, how to schedule a demo, or anything else about AI-Solutions!"
    },
    services: {
        triggers: ['service', 'services', 'offer', 'product', 'products', 'solution', 'solutions', 'what do you do'],
        response: "We offer three core services:\n\n🤖 AI Virtual Assistant — 24/7 intelligent support\n⚡ Rapid AI Prototyping — concept to prototype in days\n📈 Digital Transformation — strategy and implementation\n\nWould you like more details on any of these?"
    },
    demo: {
        triggers: ['demo', 'demonstration', 'schedule', 'trial', 'try', 'test'],
        response: "Great! We'd love to show you what we can do. You can schedule a personalised demo by filling in the Contact Us form on this page. Our team will get back to you within 24 hours! 🚀"
    },
    pricing: {
        triggers: ['price', 'pricing', 'cost', 'how much', 'affordable', 'fee', 'charge'],
        response: "Our solutions are designed to be affordable for businesses of all sizes. Pricing depends on the specific service and scale of your requirements. Please contact us through the form and we'll provide a tailored quote. 💼"
    },
    contact: {
        triggers: ['contact', 'reach', 'email', 'phone', 'address', 'location', 'where'],
        response: "You can reach us at:\n📧 info@ai-solutions.co.uk\n📞 +44 191 000 0000\n📍 Sunderland, United Kingdom\n\nOr simply fill in the Contact Us form on this page!"
    },
    events: {
        triggers: ['event', 'events', 'conference', 'workshop', 'webinar', 'gallery'],
        response: "We regularly host events including our annual AI Innovation Summit, live virtual assistant demonstrations, and hands-on prototyping workshops. Check out our Events page for upcoming dates! 🎉"
    },
    assistant: {
        triggers: ['virtual assistant', 'chatbot', 'ai assistant', 'bot', 'ai chat'],
        response: "Our AI Virtual Assistant is our flagship product! It uses natural language processing to handle customer inquiries, can seamlessly hand off to human agents when needed, and supports multiple languages and channels. Want to schedule a demo?"
    },
    about: {
        triggers: ['about', 'who are you', 'company', 'ai-solutions', 'tell me about'],
        response: "AI-Solutions is a tech start-up based in Sunderland, UK. We leverage AI to help industries solve digital employee experience challenges — speeding up design, engineering, and innovation. Our mission is to make AI affordable and accessible worldwide! 🌍"
    },
    thanks: {
        triggers: ['thank', 'thanks', 'thank you', 'appreciate', 'helpful'],
        response: "You're very welcome! 😊 Is there anything else I can help you with? Feel free to ask anytime."
    },
    bye: {
        triggers: ['bye', 'goodbye', 'see you', 'farewell', 'cya'],
        response: "Goodbye! 👋 Thank you for visiting AI-Solutions. Don't hesitate to get in touch if you need anything. Have a great day!"
    }
};

const DEFAULT_RESPONSES = [
    "That's a great question! For detailed information on that topic, I'd recommend filling in our Contact Us form and one of our team members will give you a thorough answer. 😊",
    "I'm not entirely sure about that, but our team would be happy to help! Please use the Contact Us form and we'll get back to you within 24 hours.",
    "Interesting! I'd suggest reaching out to our team directly via the contact form for a personalised response to that query."
];

let responseIndex = 0;

function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase().trim();

    for (const key in RESPONSES) {
        const category = RESPONSES[key];
        if (category.triggers.some(trigger => msg.includes(trigger))) {
            return category.response;
        }
    }

    const fallback = DEFAULT_RESPONSES[responseIndex % DEFAULT_RESPONSES.length];
    responseIndex++;
    return fallback;
}

function appendMessage(text, sender) {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    const p = document.createElement('p');
    p.textContent = text;
    msgDiv.appendChild(p);
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
    const messages = document.getElementById('chatMessages');
    if (!messages) return;
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot typing';
    typing.id = 'typingIndicator';
    typing.innerHTML = '<p>AI Assistant is typing...</p>';
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

function sendChat() {
    const input = document.getElementById('chatInput');
    if (!input) return;

    const userText = input.value.trim();
    if (!userText) return;

    appendMessage(userText, 'user');
    input.value = '';

    showTyping();

    setTimeout(() => {
        removeTyping();
        const response = getBotResponse(userText);
        appendMessage(response, 'bot');
    }, 800 + Math.random() * 600);
}

// Allow Enter key in chat
const chatInput = document.getElementById('chatInput');
if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendChat();
    });
}

// ---------- Scroll Animations ----------
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .testimonial-card, .mini-card, .event-card, .industry-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});
