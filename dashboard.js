// dashboard.js
class Dashboard {
    constructor() {
        this.data = this.generateDashboardData();
        this.init();
    }

    // Generate random account ID
    generateAccountId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({length: 12}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    // Generate realistic dashboard data
    generateDashboardData() {
        const data = [];
        const baseDate = new Date();

        for (let i = 0; i < 25; i++) {
            const commitment = (Math.random() * 2).toFixed(3);
            const change = (Math.random() * 20 - 10).toFixed(2); // -10% to +10%
            const currentValue = (commitment * 206.73 * (1 + parseFloat(change) / 100)).toFixed(2);
            const daysAgo = Math.floor(Math.random() * 14) + 1;
            const unlockDate = new Date(baseDate);
            unlockDate.setFullYear(unlockDate.getFullYear() + 3);

            data.push({
                accountId: this.generateAccountId(),
                commitment: `${commitment} SOL`,
                currentValue: `$${currentValue}`,
                changePercentage: change,
                hurdle: '8%',
                carry: '20%',
                fee: '2%',
                unlock: unlockDate.toLocaleDateString('en-GB').split('/').reverse().join('.'),
                createdAt: `${daysAgo} DAYS AGO`
            });
        }

        return data;
    }

    // Update metrics overview
    updateMetrics() {
        const totalCommitment = this.data.reduce((sum, item) => {
            return sum + parseFloat(item.commitment);
        }, 0);

        const totalValue = this.data.reduce((sum, item) => {
            return sum + parseFloat(item.currentValue.replace('$', ''));
        }, 0);

        // Update the metrics display
        document.querySelectorAll('.metric-value').forEach((metric, index) => {
            if (index === 0) metric.textContent = `$${totalValue.toFixed(2)}`;
            if (index === 1) metric.textContent = `${totalCommitment.toFixed(2)} SOL`;
        });
    }

    // Populate table with data
    populateTable() {
        const tbody = document.querySelector('table tbody');
        tbody.innerHTML = '';

        this.data.forEach(item => {
            const row = document.createElement('tr');
            const changeClass = parseFloat(item.changePercentage) >= 0 ? 'value-positive' : 'value-negative';
            
            row.innerHTML = `
                <td class="account-id">${item.accountId.slice(0, 8)}...${item.accountId.slice(-8)}</td>
                <td>${item.commitment}</td>
                <td class="${changeClass}">
                    ${item.currentValue}
                    <span class="change">${item.changePercentage >= 0 ? '+' : ''}${item.changePercentage}%</span>
                </td>
                <td>${item.hurdle}</td>
                <td>${item.carry}</td>
                <td>${item.fee}</td>
                <td>${item.unlock}</td>
                <td>${item.createdAt}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    // Handle navigation
    initializeNavigation() {
        const navItems = document.querySelectorAll('.metrics-nav .nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                // Here you could add logic to switch between different views
            });
        });
    }

    // Initialize real-time updates
    initializeRealTimeUpdates() {
        setInterval(() => {
            this.data.forEach(item => {
                const change = (Math.random() * 2 - 1).toFixed(2); // -1% to +1%
                const currentValue = parseFloat(item.currentValue.replace('$', ''));
                item.currentValue = `$${(currentValue * (1 + parseFloat(change) / 100)).toFixed(2)}`;
                item.changePercentage = change;
            });
            
            this.populateTable();
            this.updateMetrics();
        }, 5000); // Update every 5 seconds
    }

    // Sort table by column
    initializeTableSorting() {
        const headers = document.querySelectorAll('table th');
        
        headers.forEach((header, index) => {
            header.addEventListener('click', () => {
                const isAscending = header.classList.contains('sort-asc');
                
                headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
                header.classList.toggle(isAscending ? 'sort-desc' : 'sort-asc');

                this.data.sort((a, b) => {
                    let valueA = Object.values(a)[index];
                    let valueB = Object.values(b)[index];

                    // Handle numeric values
                    if (valueA.startsWith('$')) {
                        valueA = parseFloat(valueA.replace('$', ''));
                        valueB = parseFloat(valueB.replace('$', ''));
                    } else if (valueA.endsWith('SOL')) {
                        valueA = parseFloat(valueA);
                        valueB = parseFloat(valueB);
                    }

                    if (valueA < valueB) return isAscending ? -1 : 1;
                    if (valueA > valueB) return isAscending ? 1 : -1;
                    return 0;
                });

                this.populateTable();
            });
        });
    }

    // Initialize all dashboard functionality
    init() {
        this.populateTable();
        this.updateMetrics();
        this.initializeNavigation();
        this.initializeTableSorting();
        this.initializeRealTimeUpdates();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});