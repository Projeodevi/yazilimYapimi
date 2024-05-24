
import React from 'react';
import { Outlet } from "react-router-dom";

function Layout() {
    return (
        <>
            <header>
                <h1 className="header-title"> WORD MEMORIZATION GAME </h1>
                <div>
                    <div className="navbar">
                        <button onClick={() => {window.location.href="/quiz"}} className="navbar-button"> Quiz </button>
                        <button onClick={() => {window.location.href="/stats"}} className="navbar-button"> Stats </button>
                        <button onClick={() => {window.location.href="/create-question"}} className="navbar-button"> Add Question </button>
                    </div>
                </div>

            </header>
            
            <Outlet />
        </>
    );
}

export default Layout;
