// components/Navbar.tsx
"use client";

import Link from "next/link";
import { RefObject, useEffect, useState } from "react";
import { ColorKey } from "../static/colors";
import { usePageContext } from "../contexts/PageContext";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { motion, useAnimation } from "framer-motion";

const colorClasses: Record<ColorKey, { bg: string; fill: string }> = {
	home: { bg: "bg-green-primary", fill: "fill-green-secondary" },
	about: { bg: "bg-blue-primary", fill: "fill-blue-secondary" },
	skills: { bg: "bg-yellow-primary", fill: "fill-yellow-secondary" },
	projects: { bg: "bg-orange-primary", fill: "fill-orange-secondary" },
	articles: { bg: "bg-pink-primary", fill: "fill-pink-secondary" },
	contact: { bg: "bg-purple-primary", fill: "fill-purple-secondary" },
};

interface NavButtonProps {
	href: string;
	label: string;
	colorKey: ColorKey;
	onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ href, label, colorKey, onClick }) => {
	const [isHovered, setIsHovered] = useState(false);
	const { bg } = colorClasses[colorKey];

	return (
		<Link href={href} passHref>
			<button
				className={`relative py-6 px-10 nav-link transition-all duration-200 ease-in-out text-black border-2
          ${isHovered ? `${bg} -translate-x-2 translate-y-1.5 border-black` : "bg-white border-transparent"}`}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onClick={(e) => {
					e.preventDefault();
					onClick();
				}}
			>
				{label}
				<span
					className={`absolute top-4 right-4 transform translate-x-1/5 -translate-y-1/3 transition-all duration-150 ease-in-out
            ${isHovered ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-180"}`}
				>
					<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M8.87386 0.461548C8.94694 1.56756 9.02001 2.68223 9.33356 3.75354C9.6471 4.82485 10.2176 5.8593 11.137 6.57278C11.8473 7.08815 12.6637 7.46582 13.5369 7.6831C14.7342 8.00638 15.9576 8.24067 17.1957 8.38363C15.1164 8.81736 15.5195 8.70674 14.5883 8.96698C13.4662 9.27926 12.2733 9.66526 11.3256 10.3506C10.2129 11.1551 9.77673 12.2807 9.36653 13.4821C9.07185 14.3496 8.99644 14.4536 8.75127 16.1539C8.66404 14.6597 8.50135 14.0481 8.07229 13.057C7.72339 12.2546 7.36504 11.4306 6.70731 10.806C6.21496 10.3719 5.65082 10.0125 5.03591 9.7412C3.7001 9.0578 2.25267 8.57808 0.75 8.32073C2.01596 8.18193 3.29137 8.02793 4.49132 7.63974C5.69127 7.25155 6.83228 6.59879 7.55602 5.63591C8.62395 4.22846 8.66876 2.39164 8.87386 0.461548Z"
							className="fill-white"
							stroke="black"
							strokeWidth="1.5"
							strokeLinecap="square"
							strokeLinejoin="bevel"
						/>
					</svg>
				</span>
			</button>
		</Link>
	);
};

interface NavbarProps {
	scrollRef: RefObject<HTMLElement>;
}

const Navbar: React.FC = () => {
	const { setCurrentPage } = usePageContext();
	const { scrollDirection, isAtTop } = useScrollDirection();
	const controls = useAnimation();

	useEffect(() => {
		if (isAtTop || scrollDirection === "up") {
			controls.start({ y: 0 });
		} else {
			controls.start({ y: "-200%" });
		}
	}, [scrollDirection, isAtTop, controls]);

	return (
		<motion.nav
			className="fixed top-4 right-12 2xl:top-8 2xl:right-24 z-50 bg-black text-black hidden lg:block"
			initial={{ y: 0 }}
			animate={controls}
			transition={{ duration: 0.3, ease: "easeInOut" }}
		>
			<div className="flex border-2 border-black">
				{Object.entries(colorClasses).map(([key, _]) => (
					<NavButton
						key={key}
						href={`/${key === "home" ? "" : key}`}
						label={key.charAt(0).toUpperCase() + key.slice(1)}
						colorKey={key as ColorKey}
						onClick={() => setCurrentPage(key as ColorKey)}
					/>
				))}
			</div>
		</motion.nav>
	);
};

export default Navbar;
