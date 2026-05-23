// hooks/useScrollDirection.ts
import { useState, useEffect } from "react";

export function useScrollDirection() {
	const [scrollDirection, setScrollDirection] = useState("up");
	const [prevScrollY, setPrevScrollY] = useState(0);
	const [isAtTop, setIsAtTop] = useState(true);
	const threshold = 50;

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			setIsAtTop(currentScrollY === 0);

			if (Math.abs(currentScrollY - prevScrollY) < threshold) {
				return;
			}

			if (currentScrollY > prevScrollY) {
				setScrollDirection("down");
			} else {
				setScrollDirection("up");
			}

			setPrevScrollY(currentScrollY);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, [prevScrollY]);

	return { scrollDirection, isAtTop };
}
