import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LogInfo } from "@/pages/LogInfo";
import { PatientLog } from "@/pages/PatientLog";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Router>
                <Routes>
                    <Route path="/" element={<PatientLog />} />
                    <Route path="/log-info" element={<LogInfo />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
