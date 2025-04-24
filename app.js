$(document).ready(function () {
    const bgm = $('#bgm')[0];
    bgm.volume = 0.2;

    // Show overlay only on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        $('body').addClass('touch');
    } else {
        $('#tapOverlay').hide(); // Hide overlay for desktop users
    }

    // Start background music on first interaction
    const startMusic = () => {
        bgm.play().catch(err => console.warn("Autoplay blocked:", err));
        $('#tapOverlay').addClass('fade-out');
        setTimeout(() => $('#tapOverlay').remove(), 1000); // remove from DOM after fade
        document.removeEventListener('click', startMusic);
        document.removeEventListener('keydown', startMusic);
        document.removeEventListener('mousemove', startMusic);
    };
    document.addEventListener('click', startMusic);
    document.addEventListener('keydown', startMusic);
    document.addEventListener('mousemove', startMusic);

    // Parallax clouds with size variations and fade-in
    const cloudSizes = ['small', 'medium', 'large'];
    for (let i = 0; i < 5; i++) {
        const sizeClass = cloudSizes[Math.floor(Math.random() * cloudSizes.length)];
        const cloud = $('<div class="cloud"></div>').addClass(sizeClass).css({
            top: `${Math.random() * 40 + 5}%`,
            left: '-300px',
            opacity: 0
        });
        $('body').append(cloud);
        cloud.animate({ opacity: 0.7 }, 2000);
    }

    // Cherry blossom petals
    for (let i = 0; i < 15; i++) {
        const petal = $('<div class="petal"></div>').css({
            left: Math.random() * window.innerWidth + 'px',
            top: '-20px',
            animationDuration: (Math.random() * 3 + 4) + 's',
            opacity: Math.random() * 0.5 + 0.5
        });
        $('body').append(petal);
    }

    // Slide in character
    $('#character').animate({ left: '0%' }, 1000, 'swing', function () {
        // Dust trail
        let trailInterval = setInterval(() => {
            const offset = $('#character').offset();
            const trail = $('<div class="dust"></div>').css({
                left: offset.left + Math.random() * 30 - 15 + 'px',
                top: offset.top + $('#character').height() - 40 + Math.random() * 20 + 'px'
            });
            $('body').append(trail);
            setTimeout(() => trail.remove(), 1000);
        }, 80);

        setTimeout(() => clearInterval(trailInterval), 1000);

        // Bounce
        $('#character').animate({ top: '-10px' }, 150)
            .animate({ top: '0px' }, 200);

        // Reveal message with class
        $('#message').addClass('show');

        // Floating hearts
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
            $('body').append(heartContainer);
            setTimeout(() => heartContainer.remove(), duration * 1000);
        }
    });
});