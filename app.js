document.addEventListener('DOMContentLoaded', function() {
            const calculateBtn = document.getElementById('calculate-btn');
            const resultContainer = document.getElementById('result-container');
            const bmiValue = document.getElementById('bmi-value');
            const bmiCategory = document.getElementById('bmi-category');
            const healthTips = document.getElementById('health-tips');
            const visualizationContent = document.getElementById('visualization-content');
            
            let bmiChart = null;
            
            calculateBtn.addEventListener('click', calculateBMI);
            
            function calculateBMI() {
                const height = parseFloat(document.getElementById('height').value) / 100; // Convert cm to m
                const weight = parseFloat(document.getElementById('weight').value);
                const age = parseInt(document.getElementById('age').value);
                const gender = document.getElementById('gender').value;
                
                const bmi = weight / (height * height);
                const roundedBMI = Math.round(bmi * 10) / 10;
                
                bmiValue.textContent = roundedBMI;
                
                // Determine BMI category
                let category, categoryClass, tips;
                
                if (bmi < 18.5) {
                    category = "Underweight";
                    categoryClass = "underweight";
                    tips = [
                        "Gradually increase calorie intake with nutrient-dense foods",
                        "Focus on strength training to build muscle mass",
                        "Consult a dietitian for personalized nutrition plan",
                        "Monitor weight gain progress weekly"
                    ];
                } else if (bmi >= 18.5 && bmi < 25) {
                    category = "Normal weight";
                    categoryClass = "normal";
                    tips = [
                        "Maintain your current weight with balanced diet",
                        "Engage in regular physical activity (150 mins/week)",
                        "Get adequate sleep (7-9 hours per night)",
                        "Schedule annual health check-ups"
                    ];
                } else if (bmi >= 25 && bmi < 30) {
                    category = "Overweight";
                    categoryClass = "overweight";
                    tips = [
                        "Aim for gradual weight loss (0.5-1kg per week)",
                        "Increase vegetable intake and reduce processed foods",
                        "Combine cardio and strength training exercises",
                        "Monitor portion sizes and meal frequency"
                    ];
                } else {
                    category = "Obese";
                    categoryClass = "obese";
                    tips = [
                        "Consult healthcare provider for weight management plan",
                        "Start with low-impact exercises (walking, swimming)",
                        "Keep a food diary to track eating habits",
                        "Set realistic short-term and long-term goals"
                    ];
                }
                
                // Update BMI category
                bmiCategory.textContent = category;
                bmiCategory.className = `bmi-category ${categoryClass}`;
                
                // Update health tips
                const tipsList = tips.map(tip => `<li>${tip}</li>`).join('');
                healthTips.innerHTML = `
                    <h3>Health Recommendations</h3>
                    <ul>${tipsList}</ul>
                `;
                
                // Update visualization
                updateVisualization(roundedBMI, category, categoryClass, age, gender);
                
                // Show results
                resultContainer.style.display = 'block';
            }
            
            function updateVisualization(bmi, category, categoryClass, age, gender) {
                // Update chart
                const ctx = document.getElementById('bmi-chart').getContext('2d');
                
                if (bmiChart) {
                    bmiChart.destroy();
                }
                
                const bmiRanges = [
                    { min: 0, max: 18.5, label: "Underweight", color: '#FFEB3B' },
                    { min: 18.5, max: 25, label: "Normal", color: '#4CAF50' },
                    { min: 25, max: 30, label: "Overweight", color: '#FF9800' },
                    { min: 30, max: 50, label: "Obese", color: '#F44336' }
                ];
                
                // Find current range
                const currentRange = bmiRanges.find(range => bmi >= range.min && bmi < range.max);
                const currentRangeIndex = bmiRanges.findIndex(range => bmi >= range.min && bmi < range.max);
                
                // Prepare data for chart
                const backgroundColors = bmiRanges.map((range, index) => 
                    index === currentRangeIndex ? range.color : `${range.color}40`
                );
                
                bmiChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: bmiRanges.map(range => range.label),
                        datasets: [{
                            data: bmiRanges.map(range => range.max),
                            backgroundColor: backgroundColors,
                            borderColor: bmiRanges.map(range => range.color),
                            borderWidth: 1,
                            barPercentage: 0.6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 40,
                                title: {
                                    display: true,
                                    text: 'BMI Value'
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `Range: ${bmiRanges[context.dataIndex].min} - ${bmiRanges[context.dataIndex].max}`;
                                    }
                                }
                            },
                            annotation: {
                                annotations: {
                                    line1: {
                                        type: 'line',
                                        yMin: bmi,
                                        yMax: bmi,
                                        borderColor: 'rgb(0, 0, 0)',
                                        borderWidth: 2,
                                        borderDash: [6, 6],
                                        label: {
                                            content: `Your BMI: ${bmi}`,
                                            enabled: true,
                                            position: 'left'
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                
                // Update visualization content
                const genderText = gender === 'male' ? 'man' : 'woman';
                visualizationContent.innerHTML = `
                    <h3>Your BMI Analysis</h3>
                    <p>As a ${age}-year-old ${genderText}, your BMI of <strong>${bmi}</strong> 
                    falls in the <strong><span class="${categoryClass}">${category}</span></strong> category.</p>
                    
                    <div class="chart-container">
                        <canvas id="main-chart"></canvas>
                    </div>
                    
                    <div class="info-box">
                        <p><strong>Did you know?</strong> BMI is a screening tool but doesn't directly measure body fat. 
                        Athletes may have a high BMI due to muscle mass. For more comprehensive assessment, 
                        consider body fat percentage measurements.</p>
                    </div>
                `;
                
                // Create main chart
                const mainCtx = document.getElementById('main-chart').getContext('2d');
                new Chart(mainCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Healthy Range', 'Your Value'],
                        datasets: [{
                            data: [currentRange.max - currentRange.min, bmi - currentRange.min],
                            backgroundColor: [
                                `${currentRange.color}80`,
                                currentRange.color
                            ],
                            borderColor: [
                                `${currentRange.color}`,
                                currentRange.color
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        cutout: '70%',
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        if (context.label === 'Your Value') {
                                            return `Your BMI: ${bmi}`;
                                        } else {
                                            return `Healthy range: ${currentRange.min} - ${currentRange.max}`;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        });
