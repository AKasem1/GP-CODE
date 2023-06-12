import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

const ScrollButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add event listener to track scroll position
    window.addEventListener('scroll', handleScroll);
    return () => {
      // Clean up the event listener on component unmount
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    // Show the button if user has scrolled beyond a certain threshold
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const isVisible = scrollTop > 200;
    setIsVisible(isVisible);
  };

  const scrollToTop = () => {
    // Scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`scroll-button ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </button>
  );
};

export default ScrollButton;
