import { useEffect, useRef } from 'react';

/**
 * AutoPauseVideo component
 * Automatically pauses the video when it scrolls out of the viewport (up or down).
 */
const AutoPauseVideo = ({ src, className, controls = true, playsInline = true, poster, ...props }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the video leaves the viewport (scrolling up or down), pause it immediately
                if (!entry.isIntersecting || entry.intersectionRatio < 0.2) {
                    if (!video.paused) {
                        video.pause();
                    }
                }
            },
            {
                threshold: [0, 0.2],
                rootMargin: '0px',
            }
        );

        observer.observe(video);

        return () => {
            observer.disconnect();
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
