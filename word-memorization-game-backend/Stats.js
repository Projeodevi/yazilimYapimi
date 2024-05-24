
import React from 'react';
import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';

function Stats(){

    const token = localStorage.getItem('token');
    const [stats, setStats] = useState({});
    const [dayByDay, setDayByDay] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {

        async function fetchData(){
            const response = await fetch('http://localhost:8000/quiz/analyze',{
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`,
                }
            });
            const data = await response.json();
            setDayByDay(data.dayByDay);
            let accuracy = data.accuracy
            let correct = data.correct
            let total = data.total
            let totalQuizFinished = data.totalQuizFinished
            setStats({accuracy, correct, total, totalQuizFinished});
            
        }
        fetchData();

    }, [token]);

    useEffect(() => {
        const labels = dayByDay.map(stat => stat._id);
        const values = dayByDay.map(stat => stat.correct);
        setData({
            labels,
            datasets: [
                {
                    label: 'Quiz Results',
                    data: values,
                    fill: false,
                    tension: 0.4
                }
            ]
        });
    }, [dayByDay]);

    const options = {
        maintainAspectRatio: true,
        aspectRatio: 2.8
    }


    return (
        <div className='stats-page'>
            <div className='stat-item-container'>

                <div className='stat-item'>
                    <label htmlFor='accuracy'> Accuracy </label>
                    <span name="accuracy">{stats.accuracy}</span>
                </div>

                <div className='stat-item'>
                    <label htmlFor='correct-count'> Correct Count </label>
                    <span name="correct-count">{stats.correct}</span>
                </div>

                <div className='stat-item'>
                    <label htmlFor='learned-words'> Learned Words </label>
                    <span name="learned-words">{stats.total}</span>
                </div>

                <div className='stat-item'>
                    <label htmlFor='quizzes-finished'> Quizzes Finished </label>
                    <span name="quizzes-finished">{stats.totalQuizFinished}</span>
                </div>
            </div>
            <div className='stats-chart'>

                <div id="chart">
                    <Chart width='70vw' type="line" data={data} options={options} />
                </div>
            </div>
        </div>
    );
}

export default Stats;