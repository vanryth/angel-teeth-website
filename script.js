const menuButton = document.getElementById("menu-button");
const mainNav = document.querySelector(".main-nav");

// Hamburger menu button

menuButton.addEventListener("click", function () {
    mainNav.classList.toggle("show");

    const isOpen = mainNav.classList.contains("show");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
});

window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) {
        mainNav.classList.remove("show");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation menu");
    }
});

// Accessibility panel

const accessibilityButton = document.getElementById("accessibility-button");
const accessibilityPanel = document.getElementById("accessibility-panel");

accessibilityButton.addEventListener("click", function () {
    accessibilityPanel.classList.toggle("show");

    const isOpen = accessibilityPanel.classList.contains("show");

    accessibilityButton.setAttribute("aria-expanded", isOpen);
    accessibilityPanel.setAttribute("aria-hidden", !isOpen);
});

// Light and dark theme controls

const lightTheme = document.getElementById("light-theme");
const darkTheme = document.getElementById("dark-theme");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.documentElement.classList.add("dark-mode");

    darkTheme.setAttribute("aria-pressed", "true");
    lightTheme.setAttribute("aria-pressed", "false");
}

lightTheme.addEventListener("click", function () {
    document.documentElement.classList.remove("dark-mode");

    localStorage.setItem("theme", "light");

    lightTheme.setAttribute("aria-pressed", "true");
    darkTheme.setAttribute("aria-pressed", "false");
});

darkTheme.addEventListener("click", function () {
    document.documentElement.classList.add("dark-mode");

    localStorage.setItem("theme", "dark");

    darkTheme.setAttribute("aria-pressed", "true");
    lightTheme.setAttribute("aria-pressed", "false");
});

// Accessibility text size controls

const textDecrease = document.getElementById("text-decrease");
const textReset = document.getElementById("text-reset");
const textIncrease = document.getElementById("text-increase");

let textSize = 100;

textIncrease.addEventListener("click", function () {
    if (textSize < 130) {
        textSize += 10;
        document.documentElement.style.fontSize = textSize + "%";
    }
});

textDecrease.addEventListener("click", function () {
    if (textSize > 80) {
        textSize -= 10;
        document.documentElement.style.fontSize = textSize + "%";
    }
});

textReset.addEventListener("click", function () {
    textSize = 100;
    document.documentElement.style.fontSize = textSize + "%";
});

// Accessibility read aloud controls

const readStart = document.getElementById("read-start");
const readStop = document.getElementById("read-stop");
const voiceSelect = document.getElementById("voice-select");

function loadVoices() {
    const voices = window.speechSynthesis.getVoices();

    voiceSelect.innerHTML = '<option value="">DEFAULT VOICE</option>';

    voices.forEach(function (voice, index) {
        const option = document.createElement("option");

        option.value = index;
        option.textContent = voice.name + " (" + voice.lang + ")";

        voiceSelect.appendChild(option);
    });
}

loadVoices();

window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

readStart.addEventListener("click", function () {
    const pageContent = document.querySelector("main");
    const pageText = pageContent.innerText;

    const speech = new SpeechSynthesisUtterance(pageText);

    const voices = window.speechSynthesis.getVoices();

    if (voiceSelect.value !== "") {
    speech.voice = voices[voiceSelect.value];
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
});

readStop.addEventListener("click", function () {
    window.speechSynthesis.cancel();
});

window.addEventListener("beforeunload", function () {
    window.speechSynthesis.cancel();
});

// Accessibility voice control

const voiceStart = document.getElementById("voice-start");
const voiceStatus = document.getElementById("voice-status");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    recognition.lang = "en-NZ";
    recognition.interimResults = false;

    voiceStart.addEventListener("click", function () {
        recognition.start();
    });

    recognition.addEventListener("start", function () {
        voiceStatus.textContent = "Listening...";
    });

    recognition.addEventListener("result", function (event) {
        const transcript = event.results[0][0].transcript;

        voiceStatus.textContent = 'Heard: "' + transcript + '"';

        const command = transcript.toLowerCase();

        if (command.includes("home")) {
            window.location.href = "index.html";
        } else if (command.includes("portfolio")) {
            window.location.href = "portfolio.html";
        } else if (command.includes("about me")) {
            window.location.href = "about-me.html";
        } else if (command.includes("services")) {
            window.location.href = "services.html";
        } else if (command.includes("contact")) {
            window.location.href = "contact.html";
        }
    });

    recognition.addEventListener("end", function () {
        if (voiceStatus.textContent === "Listening...") {
        voiceStatus.textContent = "Voice control ready.";
        }
    });

} else {
    voiceStart.disabled = true;
    voiceStatus.textContent =
        "Voice control is not supported by this browser.";
}

// Back to top button

const backToTop = document.getElementById("back-to-top");

window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", function () {
    const reducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
    });
});

// Expandable image lightbox

const imageExpandButtons =
    document.querySelectorAll(".image-expand-button");
const lightbox = 
    document.getElementById("lightbox");
const lightboxImage = 
    document.getElementById("lightbox-image");
const lightboxClose = 
    document.getElementById("lightbox-close");
if (lightbox && lightboxImage && lightboxClose) {

let lastFocusedImage = null;
function closeLightbox() {
    lightbox.classList.remove("active");

    if (lastFocusedImage) {
        lastFocusedImage.focus();
    }
}
imageExpandButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const image = button.querySelector(".expandable-image");
        lastFocusedImage = button;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightbox.classList.add("active");

        lightboxClose.focus();
    });
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener("keydown", function (event) {
    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        closeLightbox();
    }

    if (event.key === "Tab") {
        event.preventDefault();
        lightboxClose.focus();
    }
});
}