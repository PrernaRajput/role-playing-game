import React, { useRef } from 'react';
import Lottie from 'lottie-react';
import animationData from '../../assets/lottie/fight.json';

export const OverlayPreloader = (props) => {
	const preloaderRef = useRef();

	return (
		<div className="overlay-preloader" ref={preloaderRef}>
			<Lottie
				loop
				autoplay
				animationData={animationData}
				height={400}
				width={300}
			/>
		</div>
	);
};

OverlayPreloader.displayName = 'OverlayPreloader';
