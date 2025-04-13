import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
// import animationData from '../assets/lottie/fight.json'; // Path to your Lottie animation JSON file

const Preloader = ({animationData={}}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleHidePreloader = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    // Simulate loading behavior or replace with actual logic
    const timeout = setTimeout(() => {
      handleHidePreloader();
    }, 3000); // Preloader will hide after 3 seconds

    return () => clearTimeout(timeout);
  }, []);

  const lottieOptions = {
    loop: true, // Loop the animation
    autoplay: true, // Autoplay the animation
    animationData: animationData, // Animation data from JSON
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div
      style={{
        display: isLoading ? 'flex' : 'none',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 9999
      }}
    >
      <Lottie options={lottieOptions} height={200} width={200} />
    </div>
  );
};

export default Preloader;
