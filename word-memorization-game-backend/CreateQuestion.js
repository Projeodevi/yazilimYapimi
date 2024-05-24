import React from 'react';
const CreateQuestion = () => {

    const token = localStorage.getItem('token');

    async function handleSubmit (e) {
        e.preventDefault();
        
        const englishWord = document.getElementById('english-word').value;
        const turkishTranslation = document.getElementById('turkish-translation').value;
        const sentences = document.getElementById('sentences').value.split('\n');
        const imageFile = document.getElementById('image-file').files[0];
        const audioFile = document.getElementById('audio-file').files[0];

        let imageUrl = '';
        if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch('http://localhost:8000/upload/image', {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        const data = await response.json();
        imageUrl = data.imageUrl;
        }

        let audioUrl = '';
        if (audioFile) {
        const formData = new FormData();
        formData.append('audio', audioFile);

        const response = await fetch('http://localhost:8000/upload/audio', {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        const data = await response.json();
        audioUrl = data.audioUrl;
        }

        const response = await fetch('http://localhost:8000/words', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ englishWord, turkishTranslation, sentences, imageUrl, audioUrl }),
        });
        
        const data = await response.json();
        alert(data.message);
        window.location.href = '/quiz';
    };

    return (
        <div className='form-page'>
            <div className='form-container'>
                <p className='form-title'>Create Question</p>
                <div className='form-body'>
                <form className='login-form' id="word-form" onSubmit={handleSubmit}>
                    <input className="form-input" type="text" id="english-word" placeholder="English Word" required></input>
                    <input className="form-input" type="text" id="turkish-translation" placeholder="Turkish Translation" required></input>
                    <textarea className="form-input" id="sentences" placeholder="Example Sentences" required></textarea>
                    <label className='form-text' htmlFor="image-file">Image</label>
                    <input className="form-input" type="file" id="image-file" accept="image/*"></input>
                    <label className='form-text' htmlFor="audio-file">Audio</label>
                    <input className="form-input" type="file" id="audio-file" accept="audio/*"></input>
                    <button className="form-button" type="submit">Add Word</button>
                </form>
                </div>
            </div>
            
        </div>
    );
};

export default CreateQuestion;