import React from 'react';
function Register(){
    
    async function register(formData){
        formData.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
    
        const response = await fetch('http://localhost:8000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        if (response.ok) {
          
          localStorage.removeItem("token");
          window.location.href = '/login';
          alert(data.message);
        } else {
          alert(data.message);
        }
    }
    
    return (
        <div className="form-page">

            <div className="form-container">
            <p className="form-title">Register</p>
                <div className="form-body">        
                    <form id="register-form" onSubmit={register}>
                        <input className="form-input" type="text" id="register-username" placeholder="Username" required></input>
                        <input className="form-input" type="password" id="register-password" placeholder="Password" required></input>
                        <button className="form-button" type="submit">Register</button>
                    </form>
                    <p className="form-text">Already have an account? <a href="/login">Login</a></p>
                </div>
            </div>
        </div>
    )
}

export default Register;