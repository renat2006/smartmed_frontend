import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";
import { ModeToggle } from "@/components/mode-toggle/mode-toggle.tsx";
import React, { useState, useEffect, useRef } from "react";
import { AppSidebar } from "@/components/app-sidebar/app-sidebar.tsx";
import AdaptiveSphere from "@/components/AudioVisualizer/AudioVisualizer.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { useSocket } from "@/hooks/useSocket";
import { toast, Toaster } from "sonner";
import { Toggle } from "@/components/ui/toggle"; // Используем Toggle из shadcn/ui
import { Mic, MicOff } from "lucide-react"; // Иконки для начала и остановки записи

export const LogInfo = () => {
    const [visibleDialogues, setVisibleDialogues] = useState<{ text: string }[]>([]);
    const [sphereState, setSphereState] = useState<"idle" | "listening" | "processing">("idle");
    const cardContentRef = useRef<HTMLDivElement>(null);

    const socket = useSocket("http://127.0.0.1:5000");
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    const handleToggleRecording = async () => {
        if (isRecording) {
            handleStopRecording();
        } else {
            await handleStartRecording();
        }
        setIsRecording(!isRecording);
    };

    const handleStartRecording = async () => {
        try {
            setSphereState("listening");
            toast("Началась запись", { description: "Микрофон включен, началась запись аудио." });

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        socket.current?.emit("audio_chunk", {
                            user_id: "1",
                            audio: btoa(
                                String.fromCharCode.apply(
                                    null,
                                    new Uint8Array(reader.result as ArrayBuffer)
                                )
                            ),
                        });
                    };
                    reader.readAsArrayBuffer(event.data);
                }
            };

            recorder.onstop = () => {
                console.log("Recording stopped");
                stream.getTracks().forEach((track) => track.stop());
                setSphereState("processing");
                toast("Обработка началась", { description: "Идет обработка аудио..." });
                socket.current?.emit("stop_audio", { user_id: "1" });
            };

            recorder.start(1000);
            setMediaRecorder(recorder);
            socket.current?.emit("start_audio", { user_id: "1" });
        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast("Ошибка", { description: "Не удалось получить доступ к микрофону." });
            setSphereState("idle");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setMediaRecorder(null);
        } else {
            console.warn("[WARNING] MediaRecorder не был запущен");
            toast("Предупреждение", { description: "Запись уже остановлена." });
        }
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("recognition_result", (data: { dialog: string[] }) => {
                const newDialogues = [...visibleDialogues, ...data.dialog.map((line) => ({ text: line }))];
                const maxDialogues = 4;
                const trimmedDialogues = newDialogues.slice(-maxDialogues);
                setVisibleDialogues(trimmedDialogues);

                toast("Распознавание завершено", {
                    description: "Текст успешно получен и отображен.",
                });

                setSphereState("idle");
            });

            socket.current.on("recognition_error", (data: { error: string }) => {
                console.error(`[ERROR] Распознавание завершилось с ошибкой: ${data.error}`);
                toast("Ошибка распознавания", { description: data.error });
                setSphereState("idle");
            });
        }

        return () => {
            socket.current?.off("recognition_result");
            socket.current?.off("recognition_error");
        };
    }, [visibleDialogues]);

    return (
        <SidebarProvider>
            <AppSidebar />
            <Toaster />
            <SidebarInset>
                {/* Header */}
                <header className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4">
                    <div className="flex h-16 shrink-0 items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/">Главная</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Распознавание</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                    </div>
                    <ModeToggle />
                </header>

                {/* Main Content */}
                <div className="flex flex items-center justify-center gap-8 p-10 relative">
                    {/* Sphere */}
                    <div className="relative w-[500px] h-[500px]">
                        <AdaptiveSphere state={sphereState} className="sphere" />

                        {/* Toggle Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Toggle
                                pressed={isRecording}
                                onPressedChange={handleToggleRecording}
                                className="p-6 border-4 rounded-full shadow-2xl bg-background hover:bg-primary transition-all duration-300"
                            >
                                {isRecording ? (
                                    <MicOff className="text-red-500 w-8 h-8" />
                                ) : (
                                    <Mic className="text-green-500 w-8 h-8" />
                                )}
                            </Toggle>
                        </div>
                    </div>

                    {/* Card with dialogue */}
                    <div className="Cards w-full max-w-3xl">
                        <Card className="w-full bg-accent/70 backdrop-blur-lg shadow-lg p-4 rounded-lg">
                            <CardHeader>
                                <CardTitle>Скрипт</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4" ref={cardContentRef}>
                                {visibleDialogues.map((dialogue, index) => (
                                    <div
                                        key={index}
                                        className={`text-lg font-mono ${
                                            index % 2 === 0 ? "text-left" : "text-right"
                                        }`}
                                    >
                                        {index % 2 === 0 ? "— " : ""}
                                        {dialogue.text}
                                        {index % 2 !== 0 ? " —" : ""}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};
