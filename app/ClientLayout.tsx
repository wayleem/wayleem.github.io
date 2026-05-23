// app/ClientLayout.tsx
"use client";
import Navbar from "./components/Navbar";
import { useRef } from "react";
import Home from "./page";
import About from "./about/page";
import Skills from "./skills/page";
import Projects from "./projects/page";
import Articles from "./articles/page";
import Contact from "./contact/page";
import { useScrollToSection } from "./hooks/useScrollToSection";
export default function ClientLayout({ children }: { children: React.ReactNode }) {
	useScrollToSection();
	return (
		<body className="font-body w-full min-h-screen">
			<Navbar />
			<main className="relative">
				<section id="home" className="min-h-screen w-full bg-white">
					<Home />
				</section>
				<section id="about" className="min-h-screen w-full bg-[#D1EAFF]">
					<About />
				</section>
				<section id="skills" className="min-h-screen w-full bg-[#FFFFD1]">
					<Skills />
				</section>
				<section id="projects" className="min-h-screen w-full bg-[#ffd4a6]">
					<Projects />
				</section>
				<section id="articles" className="min-h-screen w-full bg-[#ff99a6]">
					<Articles />
				</section>
				<section id="contact" className="min-h-screen w-full bg-[#EACFFF]">
					<Contact />
				</section>
			</main>
		</body>
	);
}
