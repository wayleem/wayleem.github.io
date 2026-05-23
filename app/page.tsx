"use client";
import { Canvas } from "@react-three/fiber";
import SlidingBanner from "./components/SlidingBanner";
import { Suspense } from "react";
import Scene from "./home/Scene";
import { Header } from "./home/Hero";
import skills from "./static/skills";
import Button from "./components/Button";
import Portrait from "./home/Portrait";
import MatrixRain from "./home/Canvas";
import RubiksCube from "./home/Scene";

export default function Home() {
	const handleDownload = () => {
		// Add logic to download resume
	};
	const handleContact = () => {
		// Add logic for contact action
	};

	return (
		<div className="flex flex-col w-full transition-all duration-300">
			{/* Home Section */}
			<div className="relative h-screen overflow-hidden">
				<div className="flex flex-col lg:flex-row h-full">
					{/* Header Content */}
					<div className="w-full items-center md:items-start min-h-2/3 lg:h-full md:w-2/3 lg:w-2/3 2xl:w-3/5 3xl:w-3/5 4xl:w-1/2 relative z-20 flex flex-col px-8 md:px-12 lg:px-16 4xl:px-32 py-16 lg:py-48 4xl:py-64 transition-all duration-300">
						<Header />

						<div className="flex mt-8 lg:mt-16 4xl:mt-32 space-x-12 text-center transition-all duration-300">
							<Button onClick={handleDownload} label="Download CSV" color="bg-orange-primary" />
							<Button onClick={handleContact} label="Contact Me" color="bg-purple-primary" />
						</div>
					</div>

					{/* Canvas/Scene */}
					<div className="w-full h-full lg:w-1/3 2xl:w-2/5 3xl:w-2/5 4xl:w-[900px] flex items-center justify-center border-y-2 lg:border-x-2 border-black bg-green-secondary lg:transition-all lg:duration-300">
						<Scene />
					</div>
				</div>

				{/* Portrait */}

				<div className="hidden md:block absolute left-1/2 md:top-1/3 md:left-3/4 lg:top-1/2 lg:left-2/3 2xl:left-[60%] 4xl:left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-all duration-300">
					<div className="relative w-[240px] h-[300px] lg:w-[320px] lg:h-[400px] 4xl:w-[400px] 4xl:h-[500px] transition-all duration-300">
						<Portrait />
					</div>
				</div>
			</div>

			{/* Banner */}
			<SlidingBanner
				text={skills.join(" • ")}
				className="w-full border-y-2 lg:border-y-4 border-black bg-black text-white nav-link text-sm lg:text-lg py-4 lg:py-6 z-20 transition-all duration-300"
				duration={50}
				separator="•"
			/>
		</div>
	);
}
