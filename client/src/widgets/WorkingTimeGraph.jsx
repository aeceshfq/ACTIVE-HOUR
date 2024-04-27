import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import { FormatDate } from '../functions/dates';
import { useFetch } from '../providers/AppProvider';
import server_route_names from '../routes/server_route_names';
import LegacyCard from '../subcomponents/LegacyCard';

function WorkingTimeGraph({ refresh }) {
    const today = FormatDate(new Date());
    const { data: attendance, loading, reFetch } = useFetch(`${server_route_names.attendance}?date=${today}`);
    const [workingTime, setWorkingTime] = useState([]);
    const [breakTime, setBreakTime] = useState([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
           reFetch();
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const calculateWorkingTime = () => {
            if (!attendance) return;

            const currentWorkingTime = new Array(24).fill(0);
            const currentBreakTime = new Array(24).fill(0);

            // Get clock in time
            const clockInTime = new Date(attendance.clockInTime);

            // Calculate total break time
            if (attendance.breaks) {
                attendance.breaks.forEach(breakItem => {
                    const breakStartTime = new Date(breakItem.clockInTime);
                    const breakEndTime = new Date(breakItem.clockOutTime);
                    
                    // Get the hour of break start and end time
                    const breakStartHour = breakStartTime.getHours();
                    const breakEndHour = breakEndTime.getHours();

                    // Calculate break time for each hour
                    for (let hour = breakStartHour; hour <= breakEndHour; hour++) {
                        let breakDuration = 0;

                        // Check if the break spans multiple hours
                        if (breakStartHour === hour && breakEndHour === hour) {
                            // Break within the same hour
                            breakDuration = (breakEndTime - breakStartTime) / (60*1000);
                        } else if (breakStartHour === hour) {
                            // Break starts in this hour
                            const endOfHour = new Date(breakStartTime);
                            endOfHour.setMinutes(59);
                            endOfHour.setSeconds(59);
                            endOfHour.setMilliseconds(999);
                            breakDuration = (endOfHour - breakStartTime) / (60*1000);
                        } else if (breakEndHour === hour) {
                            // Break ends in this hour
                            const startOfHour = new Date(breakEndTime);
                            startOfHour.setMinutes(0);
                            startOfHour.setSeconds(0);
                            startOfHour.setMilliseconds(0);
                            breakDuration = (breakEndTime - startOfHour) / (60*1000);
                        } else {
                            // Full hour break
                            breakDuration = 3600000 / (60*1000); // 1 hour in milliseconds
                        }

                        // Add break duration to current hour's break time
                        currentBreakTime[hour] += Math.floor(breakDuration);
                    }
                });
            }

            // Calculate working time until now
            const now = attendance.clockOutTime? new Date(attendance.clockOutTime): new Date();
            const startHour = clockInTime.getHours();
            const endHour = now.getHours();
            for (let hour = startHour; hour <= endHour; hour++) {
                let workingTime = 0;
                if (hour === startHour) {
                    // Working time from clock in time to the end of the hour
                    const endOfHour = new Date(clockInTime);
                    endOfHour.setMinutes(59);
                    endOfHour.setSeconds(59);
                    endOfHour.setMilliseconds(999);
                    workingTime = (endOfHour - clockInTime) / (1000 * 60); // Convert milliseconds to minutes
                } else if (hour === endHour) {
                    // Working time from the start of the hour to now
                    const startOfHour = new Date(now);
                    startOfHour.setMinutes(0);
                    startOfHour.setSeconds(0);
                    startOfHour.setMilliseconds(0);
                    workingTime = (now - startOfHour) / (1000 * 60); // Convert milliseconds to minutes
                } else {
                    // Full hour working time
                    workingTime = 60; // 60 minutes in an hour
                }
                // Exclude break time from working time
                currentWorkingTime[hour] = Math.floor(Math.max(0, workingTime - currentBreakTime[hour]));
            }

            setWorkingTime(currentWorkingTime);
            setBreakTime(currentBreakTime);
        };

        calculateWorkingTime();
    }, [attendance]);

    useEffect(() => {
        const ctx = document.getElementById('workingTimeGraph');
        if (ctx && !loading) {
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
                    datasets: [
                        {
                            label: 'Working Time (minutes)',
                            data: workingTime.map(ms => ms),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Break Time (minutes)',
                            data: breakTime.map(ms => ms),
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Minutes'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Hour of the Day'
                            }
                        }
                    },
                    tooltips: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
                                const value = tooltipItem.yLabel;
                                return datasetLabel + ': ' + Math.floor(value / 60) + 'h ' + (value % 60) + 'm';
                            }
                        }
                    }
                }
            });
            return () => {
                myChart.destroy();
            };
        }
    }, [workingTime, breakTime, loading]);

    return (
        <LegacyCard sectioned title="Working Time">
            <canvas id="workingTimeGraph" width="400" height="200"></canvas>
        </LegacyCard>
    );
};

export default WorkingTimeGraph;
