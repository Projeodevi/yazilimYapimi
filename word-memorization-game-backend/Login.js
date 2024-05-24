import React from 'react';
function Login(){

    async function login(formData){
        formData.preventDefault();
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;
        
        let response = await fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username ,password})
        })
        
        
        let data = await response.json();
        
        if (response.status === 200){
            localStorage.setItem("token", data.token);
            window.location.href = "/quiz";
        } else {
            alert(data.message);
        }

    }

    return (
        <div className="form-page">

            <div className="form-container">
                <p className="form-title">Login</p>
                <div className="form-body">
                    <form id="login-form" onSubmit={login}>
                        <input className="form-input" type="text" id="login-username" placeholder="Username" required></input>
                        <input className="form-input" type="password" id="login-password" placeholder="Password" required></input>
                        <button className="form-button" type="submit">Login</button>

                        
                    </form>
                    <div>
                        <p className="form-text">Don't have an account? <a href="/register">Register</a></p>
                        <p className="form-text">Forgot your password? <a href="/forgot-password">Renew</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;