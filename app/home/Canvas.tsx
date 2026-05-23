// components/MatrixRain.tsx
import React, { useEffect, useRef } from "react";

const MatrixRain: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			if (canvas) {
				canvas.width = canvas.offsetWidth;
				canvas.height = canvas.offsetHeight;
			}
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		const columns = Math.floor(canvas.width / 20);
		const drops: number[] = new Array(columns).fill(1);

		function draw() {
			if (!canvas || !ctx) return;

			ctx.fillStyle = "rgba(209, 255, 217, 0.05)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle = "#000000";
			ctx.font = "15px monospace";

			for (let i = 0; i < drops.length; i++) {
				const text = String.fromCharCode(Math.floor(Math.random() * 128));
				ctx.fillText(text, i * 20, drops[i] * 20);

				if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
					drops[i] = 0;
				}
				drops[i]++;
			}
		}
		const interval = setInterval(draw, 33);

		return () => {
			clearInterval(interval);
			window.removeEventListener("resize", resizeCanvas);
		};
	}, []);

	return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default MatrixRain;
