import React, { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import './index.css';
import { AuthContextProvider } from "./contexts/authContext";

const root = createRoot(document.getElementById('root'));

root.render(
    <StrictMode>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </StrictMode>
);