

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

class PerformanceChart {
    constructor() {
        this.svg = document.querySelector('.chart-svg');
        this.line = document.querySelector('.chart-line');
        this.area = document.querySelector('.chart-area');
        this.tooltip = document.querySelector('.chart-tooltip');
        this.gridLines = document.querySelector('.grid-lines');
        this.axisLabels = document.querySelector('.axis-labels');
        this.hoverPoints = document.querySelector('.hover-points');
        
        this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
        this.currentPeriod = '1D';
        this.data = [];
        
        this.initializeChart();
    }

    generateData(period) {
        const points = {
            '1D': 24,
            '1W': 7,
            '1M': 30,
            '1Y': 12
        }[period];

        let baseValue = 1000;
        const volatility = 0.1;
        
        return Array.from({ length: points }, (_, i) => {
            const random = Math.random() * 2 - 1;
            baseValue = baseValue * (1 + random * volatility);
            
            let label;
            switch(period) {
                case '1D':
                    label = `${i}:00`;
                    break;
                case '1W':
                    label = `Day ${i + 1}`;
                    break;
                case '1M':
                    label = `Week ${Math.floor(i/7) + 1}`;
                    break;
                case '1Y':
                    label = `Month ${i + 1}`;
                    break;
            }
            
            return {
                date: label,
                value: baseValue
            };
        });
    }

    updateDimensions() {
        const rect = this.svg.getBoundingClientRect();
        this.width = rect.width - this.margin.left - this.margin.right;
        this.height = rect.height - this.margin.top - this.margin.bottom;
    }

    createScales() {
        const minValue = Math.min(...this.data.map(d => d.value));
        const maxValue = Math.max(...this.data.map(d => d.value));
        const padding = (maxValue - minValue) * 0.1;

        this.xScale = (x) => (x / (this.data.length - 1)) * this.width;
        this.yScale = (y) => this.height - ((y - (minValue - padding)) / ((maxValue + padding) - (minValue - padding)) * this.height);
    }

    createPath() {
        let path = `M ${this.margin.left + this.xScale(0)} ${this.margin.top + this.yScale(this.data[0].value)}`;
        let areaPath = path;

        for (let i = 1; i < this.data.length; i++) {
            const x = this.margin.left + this.xScale(i);
            const y = this.margin.top + this.yScale(this.data[i].value);
            
            // Use curve interpolation
            const prevX = this.margin.left + this.xScale(i - 1);
            const prevY = this.margin.top + this.yScale(this.data[i - 1].value);
            
            const controlX = prevX + (x - prevX) / 2;
            path += ` C ${controlX} ${prevY}, ${controlX} ${y}, ${x} ${y}`;
            areaPath += ` C ${controlX} ${prevY}, ${controlX} ${y}, ${x} ${y}`;
        }

        // Complete the area path
        areaPath += ` L ${this.margin.left + this.width} ${this.margin.top + this.height}`;
        areaPath += ` L ${this.margin.left} ${this.margin.top + this.height} Z`;

        this.line.setAttribute('d', path);
        this.area.setAttribute('d', areaPath);
    }

    drawGridAndLabels() {
        // Clear existing grid and labels
        this.gridLines.innerHTML = '';
        this.axisLabels.innerHTML = '';
        
        // Draw horizontal grid lines and y-axis labels
        const yGridCount = 5;
        const minValue = Math.min(...this.data.map(d => d.value));
        const maxValue = Math.max(...this.data.map(d => d.value));
        
        for (let i = 0; i <= yGridCount; i++) {
            const y = this.margin.top + (this.height * i) / yGridCount;
            const value = maxValue - ((maxValue - minValue) * i) / yGridCount;
            
            // Grid line
            const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            gridLine.setAttribute('x1', this.margin.left);
            gridLine.setAttribute('x2', this.margin.left + this.width);
            gridLine.setAttribute('y1', y);
            gridLine.setAttribute('y2', y);
            this.gridLines.appendChild(gridLine);
            
            // Label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', this.margin.left - 10);
            label.setAttribute('y', y);
            label.setAttribute('text-anchor', 'end');
            label.setAttribute('alignment-baseline', 'middle');
            label.textContent = `$${Math.round(value)}`;
            this.axisLabels.appendChild(label);
        }
        
        // X-axis labels
        const xLabelCount = Math.min(this.data.length, 6);
        for (let i = 0; i < xLabelCount; i++) {
            const index = Math.floor((i * (this.data.length - 1)) / (xLabelCount - 1));
            const x = this.margin.left + this.xScale(index);
            
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', this.margin.top + this.height + 20);
            label.setAttribute('text-anchor', 'middle');
            label.textContent = this.data[index].date;
            this.axisLabels.appendChild(label);
        }
    }

    setupHoverEffects() {
        const hoverArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        hoverArea.setAttribute('x', this.margin.left);
        hoverArea.setAttribute('y', this.margin.top);
        hoverArea.setAttribute('width', this.width);
        hoverArea.setAttribute('height', this.height);
        hoverArea.setAttribute('fill', 'transparent');
        
        hoverArea.addEventListener('mousemove', (e) => {
            const rect = this.svg.getBoundingClientRect();
            const x = e.clientX - rect.left - this.margin.left;
            const index = Math.round((x / this.width) * (this.data.length - 1));
            
            if (index >= 0 && index < this.data.length) {
                const dataPoint = this.data[index];
                const xPos = this.margin.left + this.xScale(index);
                const yPos = this.margin.top + this.yScale(dataPoint.value);
                
                // Update tooltip
                this.tooltip.style.display = 'block';
                this.tooltip.style.left = `${xPos}px`;
                this.tooltip.style.top = `${yPos}px`;
                this.tooltip.querySelector('.tooltip-date').textContent = dataPoint.date;
                this.tooltip.querySelector('.tooltip-value').textContent = `$${dataPoint.value.toFixed(2)}`;
                
                // Update hover point
                this.hoverPoints.innerHTML = '';
                const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                point.setAttribute('cx', xPos);
                point.setAttribute('cy', yPos);
                point.classList.add('active');
                this.hoverPoints.appendChild(point);
            }
        });
        
        hoverArea.addEventListener('mouseleave', () => {
            this.tooltip.style.display = 'none';
            this.hoverPoints.innerHTML = '';
        });
        
        this.svg.appendChild(hoverArea);
    }

    updateChart(period) {
        this.currentPeriod = period;
        this.data = this.generateData(period);
        this.updateDimensions();
        this.createScales();
        this.createPath();
        this.drawGridAndLabels();
    }

    initializeChart() {
        // Set up period controls
        document.querySelectorAll('.chart-control').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.chart-control').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.updateChart(button.dataset.period);
            });
        });

        // Initialize with default period
        this.updateChart(this.currentPeriod);
        this.setupHoverEffects();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateChart(this.currentPeriod);
        });
    }
}

// Initialize the chart when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chart = new PerformanceChart();
});

// Select all timeline items
const timelineItems = document.querySelectorAll('.timeline-item');

// Add click event listener
timelineItems.forEach((item) => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        timelineItems.forEach((el) => el.classList.remove('active'));
        
        // Add active class to the clicked item
        item.classList.add('active');
    });
});

// Whitepaper Download Functionality
document.getElementById("download-whitepaper").addEventListener("click", function () {
    const fileUrl = "/src/AegisAI Coin Whitepaper.pdf"; // Replace with the actual file URL
    const fileName = "AegisAI Coin Whitepaper.pdf";
  
    // Create a temporary anchor element for download
    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = fileName;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
  
    // Trigger the download
    anchor.click();
  
    // Remove the temporary element
    document.body.removeChild(anchor);
});
  
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextureLoader } from 'three';

// Set up scene, camera, and renderer
const container = document.getElementById('d3viewer');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true; // Enable shadows
container.appendChild(renderer.domElement);



// Add lighting
const sunlight = new THREE.DirectionalLight(0xffffff, 1);
sunlight.position.set(10, 20, 10);
sunlight.castShadow = true;
scene.add(sunlight);

const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.4);
scene.add(ambientLight);

// Load the 3D squirrel model
const loader = new GLTFLoader();
let mixer;
loader.load('./src/coin.glb', (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
        }
    });
    scene.add(model);

    // Apply animations if available
    if (gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
    }

    model.position.set(0, 0, 0); // Pin to the ground
    model.scale.set(0.5, 0.5, 0.5);
}, undefined, (error) => {
    console.error('An error occurred:', error);
});


// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1;
controls.maxDistance = 20;

// Handle resizing
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Render loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    if (mixer) mixer.update(clock.getDelta());
    controls.update();
    renderer.render(scene, camera);
}
animate();