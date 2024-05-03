import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';

const AttendanceGraph = ({ attendanceRecords, monthTitle }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (attendanceRecords && attendanceRecords.length > 0) {
        const data = attendanceRecords.map(record => {
            const totalHours = (record.workingMinutes + record.breakMinutes) / 60;
            const workingHours = record.workingMinutes / 60;
            const breakHours = record.breakMinutes / 60;
            return {
                clockOutTime: record.clockOutTime,
                clockInTime: record.clockInTime,
                // clockInTime: record.clockInTime,
                date: record.date,
                totalHours: totalHours,
                workingHours: workingHours,
                breakHours: breakHours,
                status: record.status
            };
        });
        const labels = data.map(record => moment(new Date(record.date)).format("ddd DD"));
        const config = {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Hours",
                        data: data.map(record => record.status === 'ABSENT' ? 8 : record.totalHours),
                        backgroundColor: data.map(record =>
                            record.status === 'ABSENT' ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)'
                        )
                    }
                ],
            },
            options: {
                scales: {
                    y: {
                        title: {
                            text: "Total Working Hours (Including Break Time)",
                            display: true,
                        },
                    },
                    x: {
                        title: {
                            text: monthTitle??moment().format("MMM YYYY"),
                            display: true,
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false // Hide legend
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                const record = data[context.dataIndex];
                                console.log("record", record);
                                let tooltipText = `Total Hours: ${record.totalHours} hrs\n`;
                                tooltipText += `Clock In: ${record.clockInTime}\n`;
                                tooltipText += `Clock Out: ${record.clockOutTime}\n`;
                                tooltipText += `Total worked Hours: ${record.workingHours}\n`;
                                tooltipText += `Break Hours: ${record.breakHours}\n`;
                                tooltipText += `Status: ${record.status}\n`;
                                return tooltipText;
                            }
                        }
                    }
                }
            },
        };

        const myChart = new Chart(chartRef.current, config);

        return () => {
            myChart.destroy(); // Cleanup chart instance
        };
    }
  }, [attendanceRecords]);

  return <canvas ref={chartRef}></canvas>;
};

export default AttendanceGraph;
