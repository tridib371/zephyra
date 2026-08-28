import { useEffect, useRef } from 'react';

/**
 * AutoPauseVideo component
 * Guaranteed automatic pause when the video scrolls out of view (scrolling up or scrolling down).
 * Combines IntersectionObserver + passive scroll/resize listeners for instantaneous response.
 */
const AutoPauseVideo = ({
    src,
    className = 'w-full max-h-96 object-contain rounded-2xl bg-black',
    controls = true,
    playsInline = true,
    poster,
    ...props
}) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Function to check exact element visibility in the viewport
        const checkVisibilityAndPause = () => {
            if (!video || video.paused) return;

            const rect = video.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;

            // Compute visible vertical portion
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(windowHeight, rect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            const totalHeight = rect.height || 1;

            const visibleRatio = visibleHeight / totalHeight;

            // Pause if less than 30% of video is visible OR if it has scrolled past top/bottom bounds
            if (
                visibleRatio < 0.3 ||
                rect.bottom <= 80 || // Scrolled above top navbar
                rect.top >= windowHeight - 80 || // Scrolled below bottom of screen
                rect.right <= 0 ||
                rect.left >= windowWidth
            ) {
                video.pause();
            }
        };

        // 1. IntersectionObserver for modern high-performance viewport detection
        let observer = null;
        if (typeof IntersectionObserver !== 'undefined') {
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) {
                            if (video && !video.paused) {
                                video.pause();
                            }
                        }
                    });
                },
                {
                    threshold: [0, 0.1, 0.25, 0.35, 0.5, 0.75, 1.0],
                    rootMargin: '-50px 0px -50px 0px',
                }
            );
            observer.observe(video);
        }

        // 2. Active scroll & wheel event listener for instantaneous reaction while scrolling
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    checkVisibilityAndPause();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // 3. Tab visibility change (pause if user switches browser tabs)
        const handleVisibilityChange = () => {
            if (document.hidden && video && !video.paused) {
                video.pause();
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('wheel', handleScroll, { passive: true });
        window.addEventListener('touchmove', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll, { passive: true });
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (observer) {
                observer.disconnect();
            }
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('touchmove', handleScroll);
            window.removeEventListener('resize', handleScroll);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <video
            ref={videoRef}
            src={src}
            controls={controls}
            playsInline={playsInline}
            poster={poster}
            className={className}
            {...props}
        />
    );
};

export default AutoPauseVideo;
