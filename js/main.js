const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener("DOMContentLoaded", function () {
    // Loader overlay
    setTimeout(() => {
        document.getElementById("loaderOverlay").classList.remove("active");
    }, prefersReducedMotion ? 0 : 1000);

    if (window.AOS) {
        AOS.init({ disable: prefersReducedMotion });
    }

    document.getElementById("current-year").textContent = new Date().getFullYear();

    initNav();
    initVideo();
    initScrollUi();
    initStats();
});

// Mobile nav: accessible disclosure button
function initNav() {
    const trigger = document.getElementById("navTrigger");
    const wrapper = document.getElementById("navWrapper");

    const setOpen = (open) => {
        wrapper.classList.toggle("active", open);
        trigger.classList.toggle("active", open);
        trigger.setAttribute("aria-expanded", String(open));
        trigger.setAttribute("aria-label", open ? "Close menu" : "Menu");
    };

    trigger.addEventListener("click", () => {
        const open = trigger.getAttribute("aria-expanded") !== "true";
        setOpen(open);
        if (open) {
            const firstLink = wrapper.querySelector("a");
            if (firstLink) firstLink.focus();
        }
    });

    wrapper.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
            setOpen(false);
            trigger.focus();
        }
    });
}

// Background video: don't autoplay for users who prefer reduced motion
function initVideo() {
    const video = document.getElementById("video-background");
    if (video && prefersReducedMotion) {
        video.removeAttribute("autoplay");
        video.pause();
    }
}

// Show the back-to-top link and blurred header after scrolling
function initScrollUi() {
    const btn = document.getElementById("scroll-to-top");
    const header = document.querySelector(".header");

    const onScroll = () => {
        if (btn) btn.style.display = window.scrollY > 200 ? "block" : "none";
        if (header) header.style.display = window.scrollY > 40 ? "block" : "none";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

// Count-up animation for .stat elements when #about scrolls into view.
// Final values ("20+") are in the HTML so screen readers, no-JS users and
// crawlers always get the real numbers.
function initStats() {
    const aboutSection = document.getElementById("about");
    if (!aboutSection || prefersReducedMotion || !("IntersectionObserver" in window)) return;

    const stats = aboutSection.querySelectorAll(".stat");

    const animateCountUp = (el, targetVal, duration = 2000) => {
        let startTimestamp = null;
        el.setAttribute("aria-hidden", "true");
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            el.textContent = Math.floor(progress * targetVal) + "+";
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = targetVal + "+";
                el.removeAttribute("aria-hidden");
            }
        };
        window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
            stats.forEach((statEl) => {
                const targetVal = parseInt(statEl.textContent.replace(/\D/g, ""), 10) || 0;
                animateCountUp(statEl, targetVal);
            });
            observer.disconnect();
        }
    }, { threshold: 0.4 });

    observer.observe(aboutSection);
}
