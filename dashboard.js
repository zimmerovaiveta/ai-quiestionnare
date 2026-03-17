// Dashboard Logic

document.addEventListener('DOMContentLoaded', async function() {
    const loadingMessage = document.getElementById('loadingMessage');
    const dashboardContent = document.getElementById('dashboardContent');

    try {
        // Fetch all responses from Firestore
        const snapshot = await db.collection('responses').orderBy('timestamp', 'desc').get();
        const responses = snapshot.docs.map(doc => doc.data());

        if (responses.length === 0) {
            loadingMessage.textContent = 'No responses yet. Be the first to fill out the survey!';
            return;
        }

        // Hide loading, show dashboard
        loadingMessage.style.display = 'none';
        dashboardContent.style.display = 'block';

        // Update last updated time
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();

        // Render metrics and charts
        renderMetrics(responses);
        renderCharts(responses);
        renderDataTable(responses);

    } catch (error) {
        console.error('Error loading dashboard:', error);
        loadingMessage.textContent = 'Error loading results. Please refresh the page.';
    }
});

// Calculate and render metrics
function renderMetrics(responses) {
    const total = responses.length;
    const aiUsers = responses.filter(r => r.usesAI !== 'no').length;
    const adoptionRate = ((aiUsers / total) * 100).toFixed(0);

    // Calculate average satisfaction
    const satisfactionScores = {
        'very-helpful': 4,
        'helpful': 3,
        'neutral': 2,
        'not-helpful': 1,
        'na': 0
    };

    const validSatisfactions = responses.filter(r => r.satisfaction && r.satisfaction !== 'na');
    const avgScore = validSatisfactions.length > 0
        ? validSatisfactions.reduce((sum, r) => sum + satisfactionScores[r.satisfaction], 0) / validSatisfactions.length
        : 0;

    const satisfactionText = avgScore >= 3.5 ? 'Very Positive'
        : avgScore >= 2.5 ? 'Positive'
        : avgScore >= 1.5 ? 'Neutral'
        : avgScore > 0 ? 'Negative'
        : 'N/A';

    // Most popular tool
    const toolCounts = {};
    responses.forEach(r => {
        r.tools.forEach(tool => {
            if (tool !== 'none') {
                toolCounts[tool] = (toolCounts[tool] || 0) + 1;
            }
        });
    });

    const popularTool = Object.keys(toolCounts).length > 0
        ? Object.keys(toolCounts).reduce((a, b) => toolCounts[a] > toolCounts[b] ? a : b)
        : 'N/A';

    const toolNames = {
        'claude': 'Claude',
        'gemini': 'Gemini',
        'chatgpt': 'ChatGPT',
        'copilot': 'Copilot',
        'other': 'Other'
    };

    document.getElementById('totalResponses').textContent = total;
    document.getElementById('adoptionRate').textContent = adoptionRate + '%';
    document.getElementById('avgSatisfaction').textContent = satisfactionText;
    document.getElementById('popularTool').textContent = toolNames[popularTool] || popularTool;
}

// Render all charts
function renderCharts(responses) {
    renderTeamChart(responses);
    renderPositionChart(responses);
    renderSeniorityChart(responses);
    renderToolsChart(responses);
    renderFrequencyChart(responses);
    renderWorkUsageChart(responses);
    renderUseCasesChart(responses);
    renderSatisfactionChart(responses);
    renderTaskComplexityChart(responses);
    renderAdoptionByTeamChart(responses);
    renderAdoptionByPositionChart(responses);
    renderAdoptionBySeniorityChart(responses);
    renderSatisfactionByTeamChart(responses);
    renderSatisfactionByPositionChart(responses);
    renderComplexityByRoleChart(responses);
}

// Color schemes - more distinct colors
const colors = {
    primary: 'rgb(226, 0, 116)',
    secondary: '#c0005d',
    accent1: '#ff6b9d',
    accent2: '#ff1f75',
    accent3: '#990052',
    palette: [
        '#E20074',  // Magenta Pink (T-Mobile primary)
        '#00D9E0',  // Cyan
        '#7B61FF',  // Purple
        '#FFB400',  // Orange
        '#00A651',  // Green
        '#FF6B9D',  // Light Pink
        '#990052'   // Dark Magenta
    ]
};

// Team Distribution (Pie)
function renderTeamChart(responses) {
    const teamCounts = countBy(responses, 'team');
    new Chart(document.getElementById('teamChart'), {
        type: 'pie',
        data: {
            labels: ['Digital', 'Omnichannel'],
            datasets: [{
                data: [teamCounts.digital || 0, teamCounts.omnichannel || 0],
                backgroundColor: [colors.palette[0], colors.palette[1]]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Position Distribution (Pie)
function renderPositionChart(responses) {
    const positionCounts = countBy(responses, 'position');
    const labels = ['Developer', 'Analyst', 'QA Engineer', 'Business/Product'];
    const data = [
        positionCounts.developer || 0,
        positionCounts.analyst || 0,
        positionCounts.qa || 0,
        positionCounts.business || 0
    ];

    new Chart(document.getElementById('positionChart'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.palette.slice(0, 4)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Seniority Distribution (Doughnut)
function renderSeniorityChart(responses) {
    const seniorityCounts = countBy(responses, 'seniority');
    const labels = ['Junior', 'Mid', 'Senior', 'Lead/Principal'];
    const data = [
        seniorityCounts.junior || 0,
        seniorityCounts.mid || 0,
        seniorityCounts.senior || 0,
        seniorityCounts.lead || 0
    ];

    new Chart(document.getElementById('seniorityChart'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.palette.slice(0, 4)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// AI Tools (Horizontal Bar)
function renderToolsChart(responses) {
    const toolCounts = {};
    responses.forEach(r => {
        r.tools.forEach(tool => {
            if (tool !== 'none') {
                toolCounts[tool] = (toolCounts[tool] || 0) + 1;
            }
        });
    });

    const labels = ['Claude', 'Gemini', 'ChatGPT', 'GitHub Copilot', 'Other'];
    const data = [
        toolCounts.claude || 0,
        toolCounts.gemini || 0,
        toolCounts.chatgpt || 0,
        toolCounts.copilot || 0,
        toolCounts.other || 0
    ];

    new Chart(document.getElementById('toolsChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Users',
                data: data,
                backgroundColor: colors.palette.slice(0, 5)
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

// Usage Frequency (Doughnut)
function renderFrequencyChart(responses) {
    const frequencyCounts = countBy(responses, 'frequency');
    const labels = ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Tried & gave up', 'Never'];
    const data = [
        frequencyCounts.daily || 0,
        frequencyCounts.weekly || 0,
        frequencyCounts.monthly || 0,
        frequencyCounts.rarely || 0,
        frequencyCounts['tried-gave-up'] || 0,
        frequencyCounts.never || 0
    ];

    new Chart(document.getElementById('frequencyChart'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.palette.slice(0, 6)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Work Usage (Bar)
function renderWorkUsageChart(responses) {
    const usageCounts = {};
    responses.forEach(r => {
        r.workUsage.forEach(usage => {
            if (usage !== 'none') {
                usageCounts[usage] = (usageCounts[usage] || 0) + 1;
            }
        });
    });

    const labels = ['Chat interface', 'IDE extensions', 'CLI tools', 'M365 Copilot'];
    const data = [
        usageCounts['web-interface'] || 0,
        usageCounts['ide-extensions'] || 0,
        usageCounts.cli || 0,
        usageCounts.m365 || 0
    ];

    new Chart(document.getElementById('workUsageChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Users',
                data: data,
                backgroundColor: colors.palette.slice(0, 4)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

// Use Cases (Horizontal Bar)
function renderUseCasesChart(responses) {
    const useCaseCounts = {};
    responses.forEach(r => {
        r.useCases.forEach(useCase => {
            useCaseCounts[useCase] = (useCaseCounts[useCase] || 0) + 1;
        });
    });

    const labelMap = {
        'coding': 'Code/script generation',
        'debugging': 'Debugging',
        'test-cases': 'Test cases',
        'data-analysis': 'Data analysis',
        'documentation': 'Documentation',
        'requirements': 'Requirements',
        'learning': 'Learning',
        'reports': 'Reports',
        'research': 'Research',
        'other': 'Other'
    };

    const labels = Object.keys(labelMap).map(key => labelMap[key]);
    const data = Object.keys(labelMap).map(key => useCaseCounts[key] || 0);

    // Create a repeating pattern of colors for 10 items
    const backgroundColors = [...colors.palette, ...colors.palette.slice(0, 3)];

    new Chart(document.getElementById('useCasesChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Users',
                data: data,
                backgroundColor: backgroundColors.slice(0, 10)
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

// Satisfaction (Doughnut)
function renderSatisfactionChart(responses) {
    const satisfactionCounts = countBy(responses.filter(r => r.satisfaction !== 'na'), 'satisfaction');
    const labels = ['Very helpful', 'Helpful', 'Neutral', 'Not helpful'];
    const data = [
        satisfactionCounts['very-helpful'] || 0,
        satisfactionCounts.helpful || 0,
        satisfactionCounts.neutral || 0,
        satisfactionCounts['not-helpful'] || 0
    ];

    new Chart(document.getElementById('satisfactionChart'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.palette.slice(0, 4)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Task Complexity (Doughnut with percentages)
function renderTaskComplexityChart(responses) {
    const validResponses = responses.filter(r => r.taskComplexity !== 'na');
    const complexityCounts = countBy(validResponses, 'taskComplexity');
    const labels = ['Quick answers', 'Discrete tasks', 'Multi-step workflows', 'Complex end-to-end'];
    const counts = [
        complexityCounts.snippets || 0,
        complexityCounts['small-tasks'] || 0,
        complexityCounts.moderate || 0,
        complexityCounts.complex || 0
    ];

    const total = validResponses.length;
    const percentages = counts.map(count => total > 0 ? ((count / total) * 100).toFixed(1) : 0);

    new Chart(document.getElementById('taskComplexityChart'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: percentages,
                backgroundColor: colors.palette.slice(0, 4)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// AI Adoption by Team (100% Stacked Bar)
function renderAdoptionByTeamChart(responses) {
    const teams = ['digital', 'omnichannel'];
    const frequencies = ['daily', 'weekly', 'monthly', 'rarely', 'never'];

    const datasets = frequencies.map((freq, index) => {
        return {
            label: freq.charAt(0).toUpperCase() + freq.slice(1).replace('-', ' '),
            data: teams.map(team => {
                const teamResponses = responses.filter(r => r.team === team);
                const freqCount = responses.filter(r => r.team === team && r.frequency === freq).length;
                return teamResponses.length > 0 ? ((freqCount / teamResponses.length) * 100).toFixed(1) : 0;
            }),
            backgroundColor: colors.palette[index]
        };
    });

    new Chart(document.getElementById('adoptionByTeamChart'), {
        type: 'bar',
        data: {
            labels: ['Digital', 'Omnichannel'],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });
}

// AI Adoption by Position (100% Stacked Bar)
function renderAdoptionByPositionChart(responses) {
    const positions = ['developer', 'analyst', 'qa', 'business'];
    const positionLabels = ['Developer', 'Analyst', 'QA', 'Business'];

    const usesAI = positions.map(pos => {
        const posResponses = responses.filter(r => r.position === pos);
        const aiCount = responses.filter(r => r.position === pos && r.usesAI !== 'no').length;
        return posResponses.length > 0 ? ((aiCount / posResponses.length) * 100).toFixed(1) : 0;
    });

    const doesNotUse = positions.map(pos => {
        const posResponses = responses.filter(r => r.position === pos);
        const noAiCount = responses.filter(r => r.position === pos && r.usesAI === 'no').length;
        return posResponses.length > 0 ? ((noAiCount / posResponses.length) * 100).toFixed(1) : 0;
    });

    new Chart(document.getElementById('adoptionByPositionChart'), {
        type: 'bar',
        data: {
            labels: positionLabels,
            datasets: [
                {
                    label: 'Uses AI',
                    data: usesAI,
                    backgroundColor: colors.palette[0]
                },
                {
                    label: 'Does not use AI',
                    data: doesNotUse,
                    backgroundColor: colors.palette[1]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });
}

// AI Adoption by Seniority (100% Stacked Bar)
function renderAdoptionBySeniorityChart(responses) {
    const seniorities = ['junior', 'mid', 'senior', 'lead'];
    const seniorityLabels = ['Junior', 'Mid', 'Senior', 'Lead'];
    const frequencies = ['daily', 'weekly', 'monthly', 'rarely', 'never'];

    // Calculate sample sizes
    const sampleSizes = seniorities.map(sen =>
        responses.filter(r => r.seniority === sen).length
    );

    // Create labels with sample sizes
    const labelsWithCounts = seniorityLabels.map((label, index) =>
        `${label} (n=${sampleSizes[index]})`
    );

    const datasets = frequencies.map((freq, index) => {
        return {
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
            data: seniorities.map(sen => {
                const senResponses = responses.filter(r => r.seniority === sen);
                const freqCount = responses.filter(r => r.seniority === sen && r.frequency === freq).length;
                return senResponses.length > 0 ? ((freqCount / senResponses.length) * 100).toFixed(1) : 0;
            }),
            backgroundColor: colors.palette[index]
        };
    });

    new Chart(document.getElementById('adoptionBySeniorityChart'), {
        type: 'bar',
        data: {
            labels: labelsWithCounts,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        },
                        afterLabel: function(context) {
                            const seniorityIndex = context.dataIndex;
                            const sampleSize = sampleSizes[seniorityIndex];
                            const percentage = parseFloat(context.parsed.y);
                            const actualCount = Math.round((percentage * sampleSize) / 100);
                            return `(${actualCount} of ${sampleSize} responses)`;
                        }
                    }
                }
            }
        }
    });
}

// Satisfaction by Team (100% Stacked Bar)
function renderSatisfactionByTeamChart(responses) {
    const teams = ['digital', 'omnichannel'];
    const satisfactions = ['very-helpful', 'helpful', 'neutral', 'not-helpful'];
    const satLabels = ['Very helpful', 'Helpful', 'Neutral', 'Not helpful'];

    const datasets = satisfactions.map((sat, index) => {
        return {
            label: satLabels[index],
            data: teams.map(team => {
                const teamResponses = responses.filter(r => r.team === team && r.satisfaction !== 'na');
                const satCount = responses.filter(r => r.team === team && r.satisfaction === sat).length;
                return teamResponses.length > 0 ? ((satCount / teamResponses.length) * 100).toFixed(1) : 0;
            }),
            backgroundColor: colors.palette[index]
        };
    });

    new Chart(document.getElementById('satisfactionByTeamChart'), {
        type: 'bar',
        data: {
            labels: ['Digital', 'Omnichannel'],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });
}

// Satisfaction by Position (100% Stacked Bar)
function renderSatisfactionByPositionChart(responses) {
    const positions = ['developer', 'analyst', 'qa', 'business'];
    const positionLabels = ['Developer', 'Analyst', 'QA', 'Business'];
    const satisfactions = ['very-helpful', 'helpful', 'neutral', 'not-helpful'];
    const satLabels = ['Very helpful', 'Helpful', 'Neutral', 'Not helpful'];

    const datasets = satisfactions.map((sat, index) => {
        return {
            label: satLabels[index],
            data: positions.map(pos => {
                const posResponses = responses.filter(r => r.position === pos && r.satisfaction !== 'na');
                const satCount = responses.filter(r => r.position === pos && r.satisfaction === sat).length;
                return posResponses.length > 0 ? ((satCount / posResponses.length) * 100).toFixed(1) : 0;
            }),
            backgroundColor: colors.palette[index]
        };
    });

    new Chart(document.getElementById('satisfactionByPositionChart'), {
        type: 'bar',
        data: {
            labels: positionLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });
}

// Task Complexity by Role (100% Stacked Bar)
function renderComplexityByRoleChart(responses) {
    const positions = ['developer', 'analyst', 'qa', 'business'];
    const positionLabels = ['Developer', 'Analyst', 'QA', 'Business'];
    const complexities = ['snippets', 'small-tasks', 'moderate', 'complex'];
    const complexityLabels = ['Quick answers', 'Discrete tasks', 'Multi-step', 'Complex'];

    const datasets = complexities.map((comp, index) => {
        return {
            label: complexityLabels[index],
            data: positions.map(pos => {
                const posResponses = responses.filter(r => r.position === pos && r.taskComplexity !== 'na');
                const compCount = responses.filter(r => r.position === pos && r.taskComplexity === comp).length;
                return posResponses.length > 0 ? ((compCount / posResponses.length) * 100).toFixed(1) : 0;
            }),
            backgroundColor: colors.palette[index]
        };
    });

    new Chart(document.getElementById('complexityByRoleChart'), {
        type: 'bar',
        data: {
            labels: positionLabels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });
}

// Render data table
function renderDataTable(responses) {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = '';

    responses.forEach(r => {
        const row = document.createElement('tr');
        const timestamp = r.timestamp ? r.timestamp.toDate().toLocaleString() : 'N/A';

        row.innerHTML = `
            <td>${timestamp}</td>
            <td>${capitalize(r.team)}</td>
            <td>${capitalize(r.position)}</td>
            <td>${capitalize(r.seniority)}</td>
            <td>${formatUsesAI(r.usesAI)}</td>
            <td>${capitalize(r.frequency.replace('-', ' '))}</td>
            <td>${formatSatisfaction(r.satisfaction)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Helper functions
function countBy(arr, key) {
    return arr.reduce((acc, item) => {
        const value = item[key];
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatUsesAI(value) {
    const map = {
        'yes-work': 'Yes (work)',
        'yes-personal': 'Yes (personal)',
        'yes-both': 'Yes (both)',
        'no': 'No'
    };
    return map[value] || value;
}

function formatSatisfaction(value) {
    const map = {
        'very-helpful': 'Very helpful',
        'helpful': 'Helpful',
        'neutral': 'Neutral',
        'not-helpful': 'Not helpful',
        'na': 'N/A'
    };
    return map[value] || value;
}
