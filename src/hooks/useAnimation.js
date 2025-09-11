// useAnimation.js
import { useEffect, useRef, useState, useCallback } from 'react';

const useAnimation = (options = {}) => {
  const {
    duration = 1000,
    delay = 0,
    easing = 'ease-out',
    threshold = 0.1
  } = options;
  
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // Intersection Observer for triggering animations on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      { threshold }
    );
    
    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }
    
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, hasAnimated]);
  
  // Animation styles
  const animationStyles = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `all ${duration}ms ${easing} ${delay}ms`
  };
  
  // Stagger animation for lists
  const getStaggerDelay = useCallback((index, staggerDelay = 100) => {
    return delay + (index * staggerDelay);
  }, [delay]);
  
  // Fade in animation
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: duration / 1000, delay: delay / 1000 }
  };
  
  // Slide up animation
  const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration / 1000, delay: delay / 1000 }
  };
  
  // Scale animation
  const scale = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: duration / 1000, delay: delay / 1000 }
  };
  
  // Pulse animation
  const pulse = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'loop'
    }
  };
  
  // Reset animation
  const resetAnimation = useCallback(() => {
    setIsVisible(false);
    setHasAnimated(false);
  }, []);
  
  return {
    ref: elementRef,
    isVisible,
    animationStyles,
    getStaggerDelay,
    animations: {
      fadeIn,
      slideUp,
      scale,
      pulse
    },
    resetAnimation
  };
};

export default useAnimation;