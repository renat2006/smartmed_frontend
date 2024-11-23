import React, { useRef, useEffect } from "react";
import * as THREE from "three";

const AdaptiveSphere = ({
                            sphereRadius = 3,
                            state = "idle", // Состояние: "idle", "processing", "listening"
                            className = "",
                        }) => {
    const mountRef = useRef(null);

    useEffect(() => {
        let audioContext;
        let analyser;
        let dataArray;

        const startAudio = async () => {
            if (state === "listening") {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(stream);

                source.connect(analyser);
                analyser.fftSize = 256;
                dataArray = new Uint8Array(analyser.frequencyBinCount);
            }
        };

        const resizeObserver = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            1, // Соотношение сторон будет обновлено позже
            0.1,
            1000
        );
        camera.position.z = sphereRadius * 2.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0); // Прозрачный фон
        mountRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(sphereRadius, 128, 128);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_amplitude: { value: 0 },
                u_color1: { value: new THREE.Color("#1e90ff") },
                u_color2: { value: new THREE.Color("#00ff88") },
            },
            vertexShader: `
                uniform float u_time;
                uniform float u_amplitude;
                varying vec2 vUv;
                varying float vWave;
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    float wave = sin(pos.x * 4.0 + u_time * 0.5) * 0.1;
                    wave += cos(pos.y * 4.0 + u_time * 0.5) * 0.1;
                    wave += sin(length(pos.xy) * 10.0 - u_time) * u_amplitude * 0.3;
                    pos += normal * wave;
                    vWave = wave;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 u_color1;
                uniform vec3 u_color2;
                varying vec2 vUv;
                varying float vWave;
                void main() {
                    vec3 gradient = mix(u_color1, u_color2, vUv.y + vWave * 0.3);
                    gl_FragColor = vec4(gradient, 1.0);
                }
            `,
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(10, 10, 10);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        const animate = () => {
            if (analyser && dataArray && state === "listening") {
                analyser.getByteFrequencyData(dataArray);
                const amplitude = Math.max(...dataArray) / 256.0;
                material.uniforms.u_amplitude.value = amplitude * 0.5;

                // Плавное изменение цвета
                const targetColor1 = new THREE.Color().setHSL(0.6 + amplitude * 0.4, 1, 0.6);
                const targetColor2 = new THREE.Color().setHSL(0.3 + amplitude * 0.4, 1, 0.5);
                material.uniforms.u_color1.value.lerp(targetColor1, 0.1);
                material.uniforms.u_color2.value.lerp(targetColor2, 0.1);
            } else if (state === "idle") {
                material.uniforms.u_amplitude.value = 0.1; // Мягкое пульсирование
                material.uniforms.u_color1.value.lerp(new THREE.Color("#AAAAFF"), 0.1);
                material.uniforms.u_color2.value.lerp(new THREE.Color("#88BBFF"), 0.1);
            } else if (state === "processing") {
                material.uniforms.u_amplitude.value = 0.6; // Активное пульсирование
                const pulse = Math.sin(material.uniforms.u_time.value * 2) * 0.2 + 0.6; // Пульсация
                material.uniforms.u_amplitude.value = pulse;
                material.uniforms.u_color1.value.lerp(new THREE.Color("#FFD700"), 0.1); // Золотой
                material.uniforms.u_color2.value.lerp(new THREE.Color("#FF4500"), 0.1); // Оранжево-красный
            }

            material.uniforms.u_time.value += 0.02;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        if (mountRef.current) {
            resizeObserver.observe(mountRef.current);
        }

        startAudio().catch(console.error);
        animate();

        return () => {
            if (mountRef.current) {
                resizeObserver.unobserve(mountRef.current);
                mountRef.current.removeChild(renderer.domElement);
            }
            if (audioContext) {
                audioContext.close();
            }
        };
    }, [sphereRadius, state]);

    return (
        <div
            ref={mountRef}
            className={className}
            style={{
                width: "100%",
                height: "100%",
                display: "inline-block",
            }}
        />
    );
};

export default AdaptiveSphere;
