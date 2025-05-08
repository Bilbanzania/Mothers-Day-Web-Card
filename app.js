$(document).ready(function () {
    const bgm = $('#bgm')[0];
    bgm.volume = 0.2; // Set desired initial volume

    const $tapOverlay = $('#tapOverlay');
    const $character = $('#character');
    const $message = $('#message');
    const $cloudLayer = $('#cloudLayer');
    const $petalLayer = $('#petalLayer');
    const $dustLayer = $('#dustLayer');
    const $sparkleLayer = $('#sparkleLayer');
    const $heartLayer = $('#heartLayer');

    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

    // --- Compliments Array ---
    const compliments = [
        "You're amazing!", "So loved 💗", "Strong, graceful, very demure 💌💜",
        "No one compares!", "Best mom ever!", "Kindness shines 💖"
    ];

    // --- Function to start animations and effects after user interaction/autoplay ---
    const startCardAnimations = () => {
        // Character Entrance (now using CSS class)
        $character.addClass('enter');

        // Listen for animation end on character to trigger subsequent animations
        $character.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function (e) {
            if (e.originalEvent.animationName === 'slideInCharacter') {
                // Unbind to prevent multiple firings if other animations are added later
                $character.off('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd');

                // Dust trail (short burst after character lands)
                let trailCount = 0;
                const maxTrails = 10; // Create a few dust puffs
                let trailInterval = setInterval(() => {
                    if (trailCount >= maxTrails) {
                        clearInterval(trailInterval);
                        return;
                    }
                    const offset = $character.offset();
                    const characterWidth = $character.width();
                    const trail = $('<div class="dust"></div>').css({
                        left: offset.left + (characterWidth / 2) + (Math.random() * 40 - 20) + 'px', // Centered a bit more
                        top: offset.top + $character.height() - 30 + (Math.random() * 20 - 10) + 'px' // Near bottom
                    });
                    $dustLayer.append(trail);
                    setTimeout(() => trail.remove(), 800); // Match CSS animation
                    trailCount++;
                }, 60); // Faster puffs

                $character.animate({ top: '-5px' }, 100).animate({ top: '0px' }, 150);

                // Show message
                $message.addClass('show');

                // Floating Hearts
                createFloatingHearts();
            }
        });

        // --- Parallax Clouds (Generation) ---
        const numClouds = isMobile ? 3 : 5;
        const cloudSizes = ['small', 'medium', 'large'];
        for (let i = 0; i < numClouds; i++) {
            const sizeClass = cloudSizes[Math.floor(Math.random() * cloudSizes.length)];
            const cloud = $('<div class="cloud fluffy"></div>').addClass(sizeClass).css({
                top: `${Math.random() * 40 + 5}%`, // Between 5% and 45% from top
                // 'left' will be controlled by CSS drift animation initially
                opacity: 0 // Start invisible, fade in
            });
            $cloudLayer.append(cloud);
            // Slight delay then fade in
            setTimeout(() => {
                cloud.animate({ opacity: (Math.random() * 0.3) + 0.6 }, 1500); // Fade to a random opacity (0.6-0.9)
            }, Math.random() * 500);
        }

        // --- Sakura Petals ---
        const numPetals = isMobile ? 8 : 15;
        for (let i = 0; i < numPetals; i++) {
            const petal = $('<div class="petal"></div>').css({
                left: Math.random() * window.innerWidth + 'px',
                top: `-${Math.random() * 20 + 20}px`, // Start slightly more off-screen
                animationDuration: (Math.random() * 3 + 4) + 's', // 4s to 7s
                animationDelay: (Math.random() * 2) + 's', // Stagger start times
                opacity: Math.random() * 0.4 + 0.6 // 0.6 to 1.0
            });
            $petalLayer.append(petal);
        }

        // --- Wind Gusts (Fewer on mobile for performance) ---
        const numGusts = isMobile ? 2 : 5;
        for (let i = 0; i < numGusts; i++) {
            const gust = $('<div class="wind-petal"></div>').css({
                top: `${Math.random() * 80}vh`,
                left: `${-Math.random() * 50 - 20}vw`, // Start further off screen
                animationDelay: `${Math.random() * 10}s`
            });
            $petalLayer.append(gust);
        }

        // --- Lanterns ---
        const numLanterns = isMobile ? 3 : 6;
        for (let i = 0; i < numLanterns; i++) {
            const lantern = $('<div class="lantern"></div>').css({
                left: `${Math.random() * 90 + 5}vw`, // 5vw to 95vw
                bottom: `-${Math.random() * 40 + 70}px`, // Start further below
                animationDelay: `${Math.random() * 10 + 2}s` // Staggered start
            });
            $petalLayer.append(lantern);
        }

        // --- Floating Compliments ---
        const complimentIntervalTime = isMobile ? 5000 : 4000;
        setInterval(() => {
            const msg = compliments[Math.floor(Math.random() * compliments.length)];
            const comp = $('<div class="compliment"></div>').text(msg);
            const bottomStart = isMobile ? '12vh' : '8vh'; // Adjusted based on your CSS media queries
            const floatDuration = isMobile ? (Math.random() * 3 + 10) + 's' : (Math.random() * 2 + 8) + 's'; // 10-13s or 8-10s

            comp.css({
                left: `${Math.random() * 70 + 15}vw`, // 15vw to 85vw to keep it more centered
                bottom: bottomStart,
                animationDuration: floatDuration
            });

            $petalLayer.append(comp);
            setTimeout(() => comp.remove(), parseFloat(floatDuration) * 1000 + 500); // Remove after animation + buffer
        }, complimentIntervalTime);

        // --- Throttled Mouse Sparkles + Cloud Parallax ---
        let lastMove = 0;
        const throttleTime = 16; // Roughly 60fps
        $(document).on('mousemove', function (e) {
            const now = Date.now();
            if (now - lastMove < throttleTime) return;
            lastMove = now;

            // Sparkles
            const sparkle = $('<div class="sparkle"></div>').css({ // Removed 'sparkle-animated' class
                left: e.pageX - 4 + 'px', // Center the sparkle
                top: e.pageY - 4 + 'px'
            });
            $sparkleLayer.append(sparkle);
            // Limit total sparkles for performance
            if ($sparkleLayer.children().length > (isMobile ? 30 : 60)) {
                $sparkleLayer.children().slice(0, isMobile ? 10 : 20).remove();
            }
            setTimeout(() => sparkle.remove(), 600); // Match CSS animation

            // Cloud Parallax
            const x = (e.clientX / window.innerWidth - 0.5) * (isMobile ? 15 : 30); // Reduced parallax on mobile
            const y = (e.clientY / window.innerHeight - 0.5) * (isMobile ? 5 : 10); // Reduced parallax on mobile
            $('.cloud').each(function (i) {
                const depth = Math.max(1, (i % 3) + 1); // Ensure depth is at least 1
                $(this).css('transform', `translate(${x / depth}px, ${y / depth}px)`);
            });
        });

        // --- Click Ripple ---
        $(document).on('click', function (e) {
            // Prevent ripple if the click was on an interactive element like a future button
            // if ($(e.target).is('button, a')) return;
            const ripple = $('<div class="ripple"></div>').css({
                left: e.pageX - 25 + 'px', // Center the ripple
                top: e.pageY - 25 + 'px'
            });
            $('body').append(ripple); // Append to body to be behind fixed elements if needed
            setTimeout(() => ripple.remove(), 700); // Match CSS animation
        });
    };

    const createFloatingHearts = () => {
        const numHearts = isMobile ? 5 : 10;
        let usedPositions = [];
        const pastelColors = ['#ffb6c1', '#ffc0cb', '#ff69b4', '#ff99cc', '#f8bedd', '#fcb3d1'];

        for (let i = 0; i < numHearts; i++) {
            const size = Math.random() * (isMobile ? 10 : 15) + (isMobile ? 10 : 15); // Smaller hearts on mobile
            const duration = Math.random() * 2 + (isMobile ? 3 : 2.5); // Slightly longer/slower on mobile
            const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];

            let leftPos;
            // Attempt to find a non-overlapping position
            for (let attempts = 0; attempts < 10; attempts++) {
                leftPos = Math.random() * (window.innerWidth - size - 20) + 10; // Add some padding from edges
                const isTooClose = usedPositions.some(pos => Math.abs(pos - leftPos) < size + 10);
                if (!isTooClose || attempts === 9) { // If not too close, or last attempt
                    usedPositions.push(leftPos);
                    if (usedPositions.length > 5) usedPositions.shift(); // Keep track of recent ones
                    break;
                }
            }

            const heartContainer = $('<div class="heart-container"></div>');
            const heart = $('<div class="heart"></div>').css({
                backgroundColor: color,
                width: size + 'px',
                height: size + 'px'
            });

            heartContainer.css({
                left: leftPos + 'px',
                bottom: `-${Math.random() * 20 + 10}px`, // Start slightly off-screen from bottom
                animationDuration: duration + 's',
                animationDelay: (Math.random() * 1.5) + 's' // Stagger start
            });

            heartContainer.append(heart);
            // Append to petalLayer or a dedicated heartLayer if you have one
            ($heartLayer.length ? $heartLayer : $petalLayer).append(heartContainer);
            setTimeout(() => heartContainer.remove(), duration * 1000 + 2000); // Remove after animation + delay
        }
    };


    // --- Initial Interaction Logic ---
    const initiateExperience = () => {
        // Attempt to play background music
        bgm.play().catch(err => {
            console.warn("Audio play failed after interaction or on autoplay attempt:", err);
            // If it still fails, user might have strict browser settings.
            // The overlay is already hidden at this point by the logic below.
        });

        // Fade out and remove the tap overlay
        $tapOverlay.addClass('fade-out');
        setTimeout(() => {
            $tapOverlay.remove(); // Remove from DOM after fading
        }, 550); // Match CSS transition duration + a small buffer

        // Detach the event listener to prevent multiple calls
        $tapOverlay.off('click.initiate');
        $(document).off('click.initiateMobile'); // Also clear document listener if used

        // Start all other card animations and effects
        startCardAnimations();
    };

    // Setup based on device type
    if (isMobile) {
        // On mobile, always require a tap on the overlay.
        // The overlay is visible by default due to CSS.
        $tapOverlay.one('click.initiate', initiateExperience);
    } else {
        // On desktop, try to autoplay.
        bgm.play().then(() => {
            console.log("BGM autoplay successful on desktop.");
            // If autoplay works, proceed to hide overlay and start animations.
            initiateExperience();
        }).catch(err => {
            console.warn("BGM autoplay failed on desktop. User click on overlay required.", err);
            // Autoplay failed, overlay is visible by CSS, so just wait for a click.
            $tapOverlay.one('click.initiate', initiateExperience);
        });
    }
});