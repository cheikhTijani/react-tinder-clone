import React from "react";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

import Header from "./components/Header";
import DatingCards from "./components/DatingCards";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Messages from "./components/Messages";
import Profile from "./components/Profile";

const people = [
    {
        name: 'John',
        imgUrl: 'people/john.jpg'
    },
    {
        name: 'Alex',
        imgUrl: 'people/alex.jpg'
    },
    {
        name: 'Emma',
        imgUrl: './people/emma.jpg'
    }
];

function App() {
    const { user } = useAuthContext();
    return (
        <div className="app">
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route
                        path="/"
                        element={user ? <DatingCards people={people} /> : <Navigate to='/login' />}
                    />
                    <Route
                        path="/messages"
                        element={user ? <Messages /> : <Navigate to='/login' />}
                    />
                    <Route
                        path="/profile"
                        element={user ? <Profile /> : <Navigate to='/login' />}
                    />
                    <Route
                        path="/login"
                        element={!user ? <Login /> : <Navigate to="/" />}
                    />
                    <Route
                        path="/signup"
                        element={!user ? <SignUp /> : <Navigate to="/" />}
                    />
                </Routes>

            </BrowserRouter>

        </div>
    );
}

export default App;