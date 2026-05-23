import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import React, { useRef, useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";

interface CubeProps {
	position: THREE.Vector3;
	groupRef: React.RefObject<THREE.Group>;
}

interface CubeRef {
	position: THREE.Vector3;
	groupRef: React.RefObject<THREE.Group>;
}

// RubiksCube component
const RubiksCube: React.FC = () => {
	const groupRef = useRef<THREE.Group>(null);
	const [cubes, setCubes] = useState<CubeRef[]>([]);
	const selectedCubeRef = useRef<CubeRef | null>(null);

	const scale = 20;

	useFrame(() => {
		TWEEN.update();
	});

	// Cube component
	const Cube: React.FC<CubeProps> = ({ position, groupRef }) => {
		const meshRef = useRef<THREE.Mesh>(null);
		const lineRef = useRef<THREE.LineSegments>(null);

		return (
			<group ref={groupRef} position={position}>
				<mesh ref={meshRef}>
					<boxGeometry args={[1, 1, 1]} />
					<shaderMaterial
						transparent
						uniforms={{
							opacity: { value: 1.0 },
						}}
						vertexShader={`
              varying vec3 pos;
              void main() {
                pos = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
						fragmentShader={`
              uniform float opacity;
              varying vec3 pos;
              void main() {
                vec4 red = vec4(1.0, 0.0, 0.0, opacity);
                vec4 white = vec4(1.0, 1.0, 1.0, opacity);
                vec4 blue = vec4(0.0, 0.0, 1.0, opacity);
                vec4 yellow = vec4(1.0, 1.0, 0.0, opacity);
                vec4 green = vec4(0.0, 1.0, 0.0, opacity);
                vec4 orange = vec4(1.0, 0.65, 0.0, opacity);
                vec4 black = vec4(0.0, 0.0, 0.0, opacity);
                float scale = 0.499;
                bool front = pos.z > scale;
                bool back = pos.z < -1.0 * scale;
                bool top = pos.y > scale;
                bool bottom = pos.y < -1.0 * scale;
                bool right = pos.x > scale;
                bool left = pos.x < -1.0 * scale;
                if (front) {
                  gl_FragColor = red;
                } else if (back) {
                  gl_FragColor = orange;
                } else if (top) {
                  gl_FragColor = white;
                } else if (bottom) {
                  gl_FragColor = yellow;
                } else if (right) {
                  gl_FragColor = blue;
                } else if (left) {
                  gl_FragColor = green;
                } else {
                  gl_FragColor = black;
                }
              }
            `}
					/>
				</mesh>
				<lineSegments ref={lineRef}>
					<edgesGeometry args={[new THREE.BoxGeometry(1, 1, 1)]} />
					<lineBasicMaterial color="#000000" linewidth={2} />
				</lineSegments>
			</group>
		);
	};

	// Initialize cubes
	useEffect(() => {
		const positions = [
			[-1, 1, 1],
			[0, 1, 1],
			[1, 1, 1],
			[-1, 0, 1],
			[0, 0, 1],
			[1, 0, 1],
			[-1, -1, 1],
			[0, -1, 1],
			[1, -1, 1],
			[-1, 1, 0],
			[0, 1, 0],
			[1, 1, 0],
			[-1, 0, 0],
			[0, 0, 0],
			[1, 0, 0],
			[-1, -1, 0],
			[0, -1, 0],
			[1, -1, 0],
			[-1, 1, -1],
			[0, 1, -1],
			[1, 1, -1],
			[-1, 0, -1],
			[0, 0, -1],
			[1, 0, -1],
			[-1, -1, -1],
			[0, -1, -1],
			[1, -1, -1],
		];

		const newCubes = positions.map((pos) => ({
			position: new THREE.Vector3(...pos),
			groupRef: React.createRef<THREE.Group>(),
		}));
		setCubes(newCubes);
		selectedCubeRef.current = newCubes[0];
	}, []);

	// Rotation function
	const rotateAroundWorldAxis = (cubeRef: CubeRef, axis: THREE.Vector3) => {
		if (!cubeRef.groupRef.current) return;

		const cubeGroup = cubeRef.groupRef.current;
		const start = { rotation: 0 };
		const end = { rotation: Math.PI / 2 };

		new TWEEN.Tween(start)
			.to(end, 500)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(({ rotation }) => {
				cubeGroup.position.applyAxisAngle(axis, rotation - start.rotation);
				cubeGroup.rotateOnWorldAxis(axis, rotation - start.rotation);
				start.rotation = rotation;
			})
			.onComplete(() => {
				cubeGroup.position.round();
				setCubes((prevCubes) =>
					prevCubes.map((cube) =>
						cube === cubeRef ? { ...cube, position: cubeGroup.position.clone() } : cube,
					),
				);
			})
			.start();
	};

	// Key handler
	const handleKeyDown = (event: KeyboardEvent) => {
		const key = event.key.toLowerCase();
		let axis: THREE.Vector3;

		switch (key) {
			case "w":
				axis = new THREE.Vector3(-1, 0, 0);
				break;
			case "s":
				axis = new THREE.Vector3(1, 0, 0);
				break;
			case "a":
				axis = new THREE.Vector3(0, -1, 0);
				break;
			case "d":
				axis = new THREE.Vector3(0, 1, 0);
				break;
			case "q":
				axis = new THREE.Vector3(0, 0, 1);
				break;
			case "e":
				axis = new THREE.Vector3(0, 0, -1);
				break;
			default:
				return;
		}

		cubes.forEach((cube) => {
			if (
				selectedCubeRef.current &&
				cube.position[axis.x ? "x" : axis.y ? "y" : "z"] ===
					selectedCubeRef.current.position[axis.x ? "x" : axis.y ? "y" : "z"]
			) {
				rotateAroundWorldAxis(cube, axis);
			}
		});
	};

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [cubes]);

	return (
		<group ref={groupRef} scale={[scale, scale, scale]} rotation={[Math.PI / 7, -Math.PI / 4, 0]}>
			{cubes.map((cube, index) => (
				<Cube key={index} position={cube.position} groupRef={cube.groupRef} />
			))}
		</group>
	);
};

const Scene = () => (
	<Canvas camera={{ position: [0, 0, 300], fov: 50 }}>
		<ambientLight intensity={0.5} />
		<pointLight position={[10, 10, 10]} />
		<RubiksCube />
		<OrbitControls />
	</Canvas>
);

export default Scene;
