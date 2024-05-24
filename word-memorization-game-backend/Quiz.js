import React from 'react';
import { useEffect, useState } from "react";


function Quiz(){

    const token = localStorage.getItem('token');
    const [localWordCount, setWordCount] = useState(5);
    const [quizList, setQuizList] = useState([]);

    async function postWordCount(wordCount){
        if (wordCount === "") return;

        let response = await fetch("http://localhost:8000/quiz/word-count", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({wordCount})
        })
        const data = await response.json();

        if (response.status === 200) {
            window.location.reload();
        } else {
            alert(data.message);
        }
    }

    useEffect   (() => {
        async function fetchData(){
            const response = await fetch('http://localhost:8000/quiz/start',{
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            setQuizList(data);
        }

        async function fetchWordCount(){
            const response = await fetch('http://localhost:8000/quiz/word-count', {
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`,
                },
            });
            
            const data = await response.json();
            setWordCount(data.wordCount);
        }

        fetchData();
        fetchWordCount();
    }, [token]);

    async function handleSubmit(e){
        e.preventDefault();
        
        const answer = e.target.querySelector('input').value;
        const quizId = e.target.querySelector('input').id;

        const response = await fetch('http://localhost:8000/quiz/answer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ quizId, answer }),
          });
      
        const result = await response.json();

        alert(result.message);
        window.location.reload();
        
    }

    return (
        <>
            <div className="quiz-container">
                <div className="quiz-item">
                    <div>
                        <select
                            value={localWordCount}
                            className="quiz-input"
                            onChange={(e) => {
                                setWordCount(e.target.value);
                                postWordCount(e.target.value);
                            }}
                        >
                            <option value="">Select Quiz Question Count</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                        </select>
                    </div>
                    <button className="form-button" onClick={() => {window.location.href = "/create-question"}} >Add Word</button>
                </div>
                {
                    quizList.map(quiz => (
                        
                        <div className="quiz-item" key={quiz._id} >
                            <h3 className="quiz-title">{quiz.word.englishWord}</h3>
                            <div className="quiz-body">
                                {quiz.word.imageUrl && <img className="quiz-image" src={"http://localhost:8000/" + quiz.word.imageUrl} alt={quiz.word.englishWord}></img>}
                                {quiz.word.audioUrl && <audio className="quiz-audio" controls src={"http://localhost:8000/" + quiz.word.audioUrl}></audio>}
                                <form onSubmit={handleSubmit} >
                                    <input className="quiz-input" id={quiz._id} type="text" placeholder="Your Answer"></input>
                                    <button className="quiz-button">Submit</button>
                                </form>
                            </div>
                        </div>    

                    ))
                }
            </div>
        </>
    );


}

export default Quiz;