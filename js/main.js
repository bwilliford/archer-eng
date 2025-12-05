//Initializing type text
let typeCode;
const valueProps = [
    "// more consistent",
    "// more reliable",
    "// more scalable",
    "// more compliant",
];
const delay = 100;

//Run the type text when the DOM loads
document.addEventListener("DOMContentLoaded", function () {
    typeCode = document.getElementById("typeCode");
    //typeStrings(valueProps, delay);

    setTimeout(() => {
        document.getElementById("loaderOverlay").classList.toggle("active");
    }, 1000);

    AOS.init();

    document.getElementById("current-year").textContent = new Date().getFullYear();
});

//Type text functions
function typeStrings(strings, delay) {
    let index = 0;

    function typeNext() {
        // Erase
        typeCode.textContent = "";
        if (index < strings.length) {
            const string = strings[index];
            typeString(string, 0);
            index++;
        }
        else if (index == strings.length) {
            index = 0;
            typeNext();
        }
    }

    function typeString(string, charIndex) {
        if (charIndex < string.length) {
            // Output one character of the string
            typeCode.textContent += string[charIndex];
            setTimeout(() => {
                typeString(string, charIndex + 1);
            }, delay);
        } 
        else {
            
            // Move to the next string
            setTimeout(() => {
                typeNext();
            }, delay*10);
            
        }
    }

    // Start typing the first string
    typeNext();
}

//Nav
function toggleNav() {
  document.getElementById("navWrapper").classList.toggle("active");
  document.getElementById("navTrigger").classList.toggle("active");
}

//Clipboard
function copyToClipboard() {
    document.getElementById('my-email').select();
    document.execCommand("Copy");
    alert("Copied the text: rushil@radien.app");
}

// Show the scroll-to-top button after user scrolls down 200px
window.addEventListener('scroll', function() {
    const btn = document.getElementById('scroll-to-top');
    if (window.scrollY > 200) {
        btn.style.display = 'block';
    } else {
        btn.style.display = 'none';
    }
});

//Stats
// Smooth number count-up animation for .stat elements on #about section scroll

/**
 * Animates all elements with the class 'stat' by counting up from 0 to their final value 
 * when the #about section comes into the viewport.
 * 
 * Applies only once per page load. If users scroll away and back, animation is not repeated.
 */
(function() {
    // Utility function to animate a stat number
    const animateCountUp = (el, targetVal, duration = 2000) => {
        let startTimestamp = null;
        const startVal = 0;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            el.textContent = Math.floor(progress * (targetVal - startVal) + startVal) + "+";
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = targetVal + "+"; // Ensure exact final value rendered
            }
        };
        window.requestAnimationFrame(step);
    };

    let hasAnimatedStats = false;

    // Intersection Observer for better performance & reliability
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const stats = aboutSection.querySelectorAll('.stat');
        const observerOptions = {
            root: null, // viewport
            threshold: 0.4 // 40% of #about section is visible
        };

        const handleIntersect = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedStats) {
                    stats.forEach(statEl => {
                        // Extract number ignoring any +, whitespace, etc.
                        const targetVal = parseInt(statEl.textContent.replace(/\D/g, ''), 10) || 0;
                        animateCountUp(statEl, targetVal);
                    });
                    hasAnimatedStats = true;
                    observer.disconnect();
                }
            });
        };

        const observer = new window.IntersectionObserver(handleIntersect, observerOptions);
        observer.observe(aboutSection);
    }
})();


//Scrollbar
let winTop = window.scrollY;
let docHeight = document.body.scrollHeight;
let winHeight = window.innerHeight;
let initialScroll = Math.floor((winHeight/docHeight)*100);
document.getElementById('main-progressbar').style.height = initialScroll+'%';

document.addEventListener('scroll', function(e) {
  winTop = window.scrollY;
  totalScroll = Math.floor(((winTop + winHeight)/docHeight)*100);
  document.getElementById('main-progressbar').style.height = totalScroll+'%';
});