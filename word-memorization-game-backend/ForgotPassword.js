import React from 'react';
function ForgotPassword(){

    async function forgotPassword(formData){
        formData.preventDefault();
        const username = document.getElementById('forgotten-username').value;
        const password = document.getElementById('new-password').value;
    
        const response = await fetch('http://localhost:8000/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (response.ok) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          alert(data.message);
        } else {
          alert(data.message);
        }
    }

    return (
        <div className="form-page">
        <div className="form-container">
            <p className="form-title">Forgot Password</p>
            <div className="form-body">

                <form id="login-form" onSubmit={forgotPassword}>
                    <input className="form-input" type="text" autoComplete="username" id="forgotten-username" placeholder="Username" required></input>
                    <input className="form-input" autoComplete="current-password" type="password" id="new-password" placeholder="Password" required></input>
                    <button className="form-button" type="submit">Renew</button>
                </form>
                <p className="form-text">Back to login. <a href="/login">Login</a></p>
            </div>
        </div>
    </div>
    )
}

export default ForgotPassword;