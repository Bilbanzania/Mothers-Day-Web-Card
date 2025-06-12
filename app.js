document.addEventListener('DOMContentLoaded', () => {

    // Cache elements and initial setup ⚙️
    const bgm = document.querySelector('#bgm');
    bgm.volume = 0.2;
    const tapOverlay = document.querySelector('#tapOverlay');
    const character = document.querySelector('#character');
    const message = document.querySelector('#message');
    const cloudLayer = document.querySelector('#cloudLayer');
    const petalLayer = document.querySelector('#petalLayer');
    const dustLayer = document.querySelector('#dustLayer');
    const sparkleLayer = document.querySelector('#sparkleLayer');
    const heartLayer = document.querySelector('#heartLayer');
    const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);

    // Compliments for Mom 💌
    const compliments = [
        "You're amazing!", "So loved 💗", "Strong, graceful, very demure 💌💜",
        "No one compares!", "Best mom ever!", "Kindness shines 💖"
    ];

    // ❤️ Creates floating hearts from the bottom ❤️
    const createFloatingHearts = () => {
        const numHearts = isMobile ? 5 : 10;
        const pastelColors = ['#ffb6c1', '#ffc0cb', '#ff69b4', '#ff99cc', '#f8bedd', '#fcb3d1'];

        for (let i = 0; i < numHearts; i++) {
            const heartContainer = document.createElement('div');
            heartContainer.className = 'heart-container';
            const heart = document.createElement('div');
            heart.className = 'heart';

            const size = Math.random() * (isMobile ? 10 : 15) + (isMobile ? 10 : 15);
            const duration = Math.random() * 2 + (isMobile ? 3 : 2.5);
            const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
            const leftPos = Math.random() * (window.innerWidth - size - 20) + 10;

            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            heart.style.backgroundColor = color;

            heartContainer.style.left = `${leftPos}px`;
            heartContainer.style.bottom = `-${Math.random() * 20 + 10}px`;
            heartContainer.style.animationDuration = `${duration}s`;
            heartContainer.style.animationDelay = `${Math.random() * 1.5}s`;

            heartContainer.append(heart);
            (heartLayer || petalLayer).append(heartContainer);
            setTimeout(() => heartContainer.remove(), duration * 1000 + 2000);
        }
    };

    // Kicks off all the main card animations 🎉
    const startCardAnimations = () => {
        character.classList.add('enter');

        // Listen for the main character entrance animation to finish
        character.addEventListener('animationend', (e) => {
            if (e.animationName === 'slideInCharacter') {
                // Create a dust puff effect
                let trailCount = 0;
                const trailInterval = setInterval(() => {
                    if (trailCount++ >= 10) {
                        clearInterval(trailInterval);
                        return;
                    }
                    const trail = document.createElement('div');
                    trail.className = 'dust';
                    const offset = character.getBoundingClientRect();
                    trail.style.left = `${offset.left + (character.offsetWidth / 2) + (Math.random() * 40 - 20)}px`;
                    trail.style.top = `${offset.top + character.offsetHeight - 30 + (Math.random() * 20 - 10)}px`;
                    dustLayer.append(trail);
                    setTimeout(() => trail.remove(), 800);
                }, 60);

                // Add the bounce animation via CSS
                character.style.animation += ', bounce 0.25s ease-in-out';
                
                message.classList.add('show');
                createFloatingHearts();
            }
        }, { once: true }); // This event should only fire once

        // Generate parallax clouds
        const numClouds = isMobile ? 3 : 5;
        for (let i = 0; i < numClouds; i++) {
            const cloud = document.createElement('div');
            cloud.classList.add('cloud', 'fluffy', ['small', 'medium', 'large'][Math.floor(Math.random() * 3)]);
            cloud.style.top = `${Math.random() * 40 + 5}%`;
            cloud.style.opacity = '0';
            cloud.style.transition = 'opacity 1.5s';
            cloudLayer.append(cloud);
            setTimeout(() => {
                cloud.style.opacity = (Math.random() * 0.3) + 0.6;
            }, Math.random() * 500);
        }

        // Generate falling sakura petals
        const numPetals = isMobile ? 8 : 15;
        for (let i = 0; i < numPetals; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.left = `${Math.random() * window.innerWidth}px`;
            petal.style.top = `-${Math.random() * 20 + 20}px`;
            petal.style.animationDuration = `${Math.random() * 3 + 4}s`;
            petal.style.animationDelay = `${Math.random() * 2}s`;
            petal.style.opacity = Math.random() * 0.4 + 0.6;
            petalLayer.append(petal);
        }
        
        // Generate floating compliments
        setInterval(() => {
            const msg = compliments[Math.floor(Math.random() * compliments.length)];
            const comp = document.createElement('div');
            comp.className = 'compliment';
            comp.innerHTML = msg; // Use innerHTML to render emojis correctly
            const floatDuration = isMobile ? (Math.random() * 3 + 10) + 's' : (Math.random() * 2 + 8) + 's';
            comp.style.left = `${Math.random() * 70 + 15}vw`;
            comp.style.bottom = isMobile ? '12vh' : '8vh';
            comp.style.animationDuration = floatDuration;
            petalLayer.append(comp);
            setTimeout(() => comp.remove(), parseFloat(floatDuration) * 1000 + 500);
        }, isMobile ? 5000 : 4000);

        // Add sparkle and ripple effects for mouse/touch
        document.addEventListener('mousemove', (e) => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${e.pageX - 4}px`;
            sparkle.style.top = `${e.pageY - 4}px`;
            sparkleLayer.append(sparkle);
            setTimeout(() => sparkle.remove(), 600);
        });

        document.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.left = `${e.pageX - 25}px`;
            ripple.style.top = `${e.pageY - 25}px`;
            document.body.append(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    };

    // 🎬 Handles the very first interaction from the user 🎬
    const initiateExperience = () => {
        bgm.play().catch(err => console.warn("Audio play failed, user interaction needed.", err));
        tapOverlay.classList.add('fade-out');
        tapOverlay.addEventListener('transitionend', () => tapOverlay.remove());
        startCardAnimations();
    };

    // Check if on mobile to require a tap, or try to autoplay on desktop
    if (isMobile) {
        tapOverlay.addEventListener('click', initiateExperience, { once: true });
    } else {
        bgm.play().then(initiateExperience).catch(() => {
            tapOverlay.addEventListener('click', initiateExperience, { once: true });
        });
    }
});