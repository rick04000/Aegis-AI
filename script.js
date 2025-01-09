// Simulate live updates for stats
function updateStats() {
    const totalAssets = document.getElementById('totalAssets');
    const successRate = document.getElementById('successRate');
    const aiPredictions = document.getElementById('aiPredictions');
    
    setInterval(() => {
        // Simulate fluctuations
        const assetValue = 1.2 + (Math.random() * 0.1 - 0.05);
        const successValue = 92.4 + (Math.random() * 1 - 0.5);
        const predictionsValue = Math.floor(147 + (Math.random() * 10 - 5));
        
        totalAssets.textContent = `$${assetValue.toFixed(2)}B`;
        successRate.textContent = `${successValue.toFixed(1)}%`;
        aiPredictions.textContent = predictionsValue;
    }, 3000);
}

// FAQ Accordion functionality
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.style.display === 'block';
            
            // Close all answers
            document.querySelectorAll('.faq-answer').forEach(a => {
                a.style.display = 'none';
            });

            // Open clicked answer if it wasn't open
            if (!isOpen) {
                answer.style.display = 'block';
            }
        });
    });
}

// Chart controls interaction
function initChartControls() {
    document.querySelectorAll('.chart-control').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.chart-control').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            // Here you would typically update the chart data based on the selected time period
        });
    });
}

// Smooth scrolling for navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize all functionality when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    initFAQ();
    initChartControls();
    initSmoothScroll();
});