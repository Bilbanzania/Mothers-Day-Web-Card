// --- Audio Setup ---
$(document).ready(function () {
    const bgm = $('#bgm')[0];
    bgm.volume = 0.2;

    // --- Compliments Array ---
    const compliments = [
        "You're amazing!",
        "So loved 💗",
        "Strong, graceful, very demure 💌💜",
        "No one compares!",
        "Best mom ever!",
        "Kindness shines 💖"
    ];

    // --- Cached Layers ---
    const $sparkleLayer = $('#sparkleLayer');
    const $petalLayer = $('#petalLayer');
    const $character = $('#character');
    const $dustLayer = $('#dustLayer');

    // --- Throttled Mouse Sparkles + Parallax ---
    let lastMove = 0;
    $(document).on('mousemove', function (e) {
        const now = Date.now();
        if (now - lastMove < 16) return; // ~60fps
        lastMove = now;

        const sparkle = $('<div class="sparkle sparkle-animated"></div>').css({
            left: e.pageX - 5 + 'px',
            top: e.pageY - 5 + 'px'
        });
        $sparkleLayer.append(sparkle);
        if ($sparkleLayer.children().length > 100) {
            $sparkleLayer.children().slice(0, 20).remove();
        }
        setTimeout(() => sparkle.remove(), 600);

        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        $('.cloud').each(function (i) {
            const depth = (i % 3) + 1;
            $(this).css('transform', `translate(${x / depth}px, ${y / depth}px)`);
        });
    });

    // --- Click Ripple ---
    $(document).on('click', function (e) {
        const ripple = $('<div class="ripple"></div>').css({
            left: e.pageX - 25 + 'px',
            top: e.pageY - 25 + 'px'
        });
        $('body').append(ripple);
        setTimeout(() => ripple.remove(), 1000);
    });

    // --- Music Autoplay Handling ---
    const startMusic = () => {
        bgm.play().catch(err => console.warn("Autoplay blocked:", err));
        document.removeEventListener('click', startMusic);
        $('#tapOverlay').addClass('fade-out');
        setTimeout(() => $('#tapOverlay').hide(), 500);
    };

    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        document.addEventListener('click', startMusic, { once: true });
    } else {
        startMusic();
    }

    // --- Parallax Clouds ---
    const cloudSizes = ['small', 'medium', 'large'];
    for (let i = 0; i < 5; i++) {
        const sizeClass = cloudSizes[Math.floor(Math.random() * cloudSizes.length)];
        const cloud = $('<div class="cloud fluffy"></div>').addClass(sizeClass).css({
            top: `${Math.random() * 40 + 5}%`,
            left: '-300px',
            opacity: 0
        });
        $('#cloudLayer').append(cloud);
        cloud.animate({ opacity: 0.7 }, 2000);
    }

    // --- Sakura Petals ---
    for (let i = 0; i < 15; i++) {
        const petal = $('<div class="petal"></div>').css({
            left: Math.random() * window.innerWidth + 'px',
            top: '-20px',
            animationDuration: (Math.random() * 3 + 4) + 's',
            opacity: Math.random() * 0.5 + 0.5
        });
        $petalLayer.append(petal);
    }

    // --- Wind Gusts ---
    for (let i = 0; i < 5; i++) {
        const gust = $('<div class="wind-petal"></div>').css({
            top: `${Math.random() * 80}vh`,
            left: `${-Math.random() * 100}vw`,
            animationDelay: `${Math.random() * 10}s`
        });
        $petalLayer.append(gust);
    }

    // --- Lanterns ---
    for (let i = 0; i < 6; i++) {
        const lantern = $('<div class="lantern"></div>').css({
            left: `${Math.random() * 100}vw`,
            bottom: '-60px',
            animationDelay: `${Math.random() * 10}s`
        });
        $petalLayer.append(lantern);
    }

    // --- Floating Compliments ---
    setInterval(() => {
        const msg = compliments[Math.floor(Math.random() * compliments.length)];
        const comp = $('<div class="compliment"></div>').text(msg);

        const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
        const bottomStart = isMobile ? '10vh' : '5vh';
        const floatDuration = isMobile ? '12s' : '10s';

        comp.css({
            left: `${Math.random() * 80 + 10}vw`,
            bottom: bottomStart,
            animationDuration: floatDuration
        });

        $petalLayer.append(comp);
        setTimeout(() => comp.remove(), parseFloat(floatDuration) * 1000);
    }, 4000);

    // --- Character Animation + Hearts & Dust Trail ---
    $character.animate({ left: '0%' }, 1000, 'swing', function () {
        // Dust trail
        let trailInterval = setInterval(() => {
            const offset = $character.offset();
            const trail = $('<div class="dust"></div>').css({
                left: offset.left + Math.random() * 30 - 15 + 'px',
                top: offset.top + $character.height() - 40 + Math.random() * 20 + 'px'
            });
            $dustLayer.append(trail);
            setTimeout(() => trail.remove(), 1000);
        }, 80);

        setTimeout(() => clearInterval(trailInterval), 1000);

        // Bounce
        $character.animate({ top: '-10px' }, 150)
            .animate({ top: '0px' }, 200);

        // Show message
        $('#message').addClass('show');

        // Floating Hearts
        let usedPositions = [];
        const pastelColors = ['#ffb6c1', '#ffc0cb', '#ff69b4', '#ff99cc', '#f8bedd', '#fcb3d1'];

        for (let i = 0; i < 10; i++) {
            const size = Math.random() * 20 + 15;
            const duration = Math.random() * 2 + 2;
            const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];

            let leftPos;
            for (let attempts = 0; attempts < 10; attempts++) {
                leftPos = Math.random() * (window.innerWidth - size);
                const isTooClose = usedPositions.some(pos => Math.abs(pos - leftPos) < size + 10);
                if (!isTooClose) break;
            }
            usedPositions.push(leftPos);

            const heartContainer = $('<div class="heart-container"></div>');
            const heart = $('<div class="heart"></div>').css({
                backgroundColor: color,
                width: size + 'px',
                height: size + 'px'
            });

            heartContainer.css({
                left: leftPos + 'px',
                bottom: '0px',
                animationDuration: duration + 's'
            });

            heartContainer.append(heart);
            $petalLayer.append(heartContainer);
            setTimeout(() => heartContainer.remove(), duration * 1000);
        }
    });
});