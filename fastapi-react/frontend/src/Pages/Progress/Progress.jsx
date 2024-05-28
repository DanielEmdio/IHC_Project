import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { FaClock } from "react-icons/fa6";
import { FaFire, FaHeart } from "react-icons/fa";
import { api } from '../../api';
import * as utils from '../../Utils/utils';

function Progress() {
    const chartRef = useRef(null);
    const [dates, setDates] = useState([]);
    const [weight, setWeight] = useState([]);
    let monthsOfTheYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [error, setError] = useState('');
    
    // function getDate() {
    //     const today = new Date();
    //     const month = today.getMonth() + 1;
    //     const year = today.getFullYear();
    //     const day = today.getDate();
    //     return `${year}-${month}-${day}`;
    // }

    function sendWeight() {
        const weightInput = document.getElementById("weight");
        const dateInput = document.getElementById("date");
        
        if (weightInput) {
            const weightValue = weightInput.value;
            const date = dateInput.value;
            console.log(weightValue);
            api.post(`/users/addAthleteWeightData/${weightValue}/${date}`, { token: utils.getCookie("token") }).then((r) => {
                console.log("r: ", r);
                const data = r.data;
                if (data.result !== "ok") {
                    alert("Something went wrong.");
                    return;
                }
                // Update the chart
                window.location.reload();
                // const newWeight = weight;
                // newWeight.push(parseInt(weightValue));
                // setWeight(newWeight);
                // const newMonths = months;
                // const date = dateInput.value.split("-");
                // newMonths.push(monthsOfTheYear[parseInt(date[1])]);
                // setMonths(newMonths);
                // console.log("months: ", months);
                // console.log("weight: ", weight);
            }).catch((_) => {
                console.log("Unable to send weight data.");
            });
        } else {
            console.error("Element with ID 'weight' not found.");
        }
    }

    useEffect(() => {
        api.post("/users/getAthleteWeightData", { token: utils.getCookie("token") }).then((r) => {
            // console.log("r: ", r);
            const data = r.data;
            let newDates = [];
            let newWeights = [];
            data.data.forEach(element => {
                const date = element.date.split("-");
                console.log("date: ", date);    
                if (date[1][0] === "0") {   // remove leading zero
                    date[1] = date[1][1];
                }
                console.log("date[1]: ", date[1], " monthsOfTheYear[parseInt(date[1])]: ", monthsOfTheYear[parseInt(date[1])-1]);
                const month = monthsOfTheYear[parseInt(date[1])-1];
                newDates.push(`${month} ${date[0]}`);
                newWeights.push(parseInt(element.weight));

                // newMockedData.push({
                //     id: element.id,
                //     title: element.title,
                //     thumbnail: element.thumbnail,
                //     duration: "30 min",                             // deverá ser ajustado
                //     rating: element.rating,
                //     releasedate: element.releasedate,
                //     difficulty: 4,                                  // deverá ser ajustado
                //     mainMuscles: element.mainMuscles.split(","),
                // })
            });
            setDates(newDates);
            setWeight(newWeights);

        }).catch((_) => { });
    }, []);


    function handleSubmit(event) {
        event.preventDefault();
        sendWeight();
    }

    useEffect(() => {
        if (dates.length === 0 || weight.length === 0) return; // Data not yet fetched

        const ctx = chartRef.current.getContext('2d');
        // console.log(dates)
        // console.log(weight)
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,//['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Weight Progress',
                    data: weight, //[65, 66, 64, 63, 62, 61, 60],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [dates, weight]);

    return (
        <div className="bg-gray-100">
            <header className="bg-emerald-500 text-white text-center py-4">
                <h1 className="text-2xl font-bold">MY Fitness Progress</h1>
            </header>

            <main className="container mx-auto py-8">
                <div className="flex flex-cols-1 md:flex-cols-2 gap-4">
                    <div className="bg-white shadow p-4 rounded-lg">
                        <h2 className="text-lg font-bold mb-4">Statistics</h2>
                        {/* Display various statistics here */}
                        <div className="mb-4">
                            <h3 className="font-semibold">Weight</h3>
                            <p className="text-gray-600">Current Weight: <span id="current-weight">{weight[weight.length - 1]}</span> kg</p>
                            {/* You can add more details here like trend arrows, etc. */}
                        </div>
                        {/* Add more stats for other metrics */}
                        <div class="stats">

                            <div class="stat">
                                <div class="stat-figure text-secondary">
                                    <FaClock className='text-primary' size={30} />
                                </div>
                                <div class="stat-title text-primary">Active Minutes</div>
                                <div class="stat-value">90 min</div>
                                <div class="stat-desc">Today</div>
                            </div>

                            <div class="stat">
                                <div class="stat-figure text-secondary">
                                    <FaFire className='text-warning' size={30} />
                                </div>
                                <div class="stat-title text-warning">Calories</div>
                                <div class="stat-value">300 kcal</div>
                                <div class="stat-desc">↗︎ 100 (22%)</div>
                            </div>

                            <div class="stat">
                                <div class="stat-figure text-secondary">
                                    <FaHeart className='text-error' size={30} />
                                </div>
                                <div class="stat-title text-error">Avr Heartbeat Rate</div>
                                <div class="stat-value">150 BTM</div>
                                <div class="stat-desc">↘︎ 20 (14%)</div>
                            </div>

                        </div>
                    </div>

                    <div className="bg-white shadow p-4 rounded-lg w-full">
                        <h2 className="text-lg font-bold mb-4">Log Your Weight Progress</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="weight" className="block font-semibold">Weight (kg):</label>
                                <input type="number" id="weight" name="weight" className="w-full px-4 py-2 border rounded-lg" required/>
                                <label htmlFor="date" className="block font-semibold inline-block">Date:</label>
                                <input type="date" id="date" name="date" className="w-full px-4 py-2 border rounded-lg inline-block" required/>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                </div>
                            {/* Add more input fields for other metrics like exercises, calories, etc. */}

                            <button type="submit" className="btn btn-primary text-white px-4 py-2 rounded-lg hover:bg-gray-700">Log</button>
                        </form>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white shadow p-4 rounded-lg mt-8">
                    <h2 className="text-lg font-bold mb-4">Weight Progress Chart</h2>
                    <canvas ref={chartRef}></canvas>
                </div>
            </main>
        </div>
    );
}

export default Progress;
