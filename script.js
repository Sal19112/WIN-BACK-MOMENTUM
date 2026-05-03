const csvUrl = "https://docs.google.com/spreadsheets/d/1FMhviCglcY4z2CbkOg3iHLBbKScMbTcRh6MFfG3KHMM/edit?usp=sharing";

async function loadData() {
    try {
        const response = await fetch(csvUrl);
        const data = await response.text();

        const rows = data.trim().split("\n").slice(1);

        let branches = [];
        let totalTransactions = 0;
        let areaTotals = {};

        rows.forEach(row => {
            const cols = row.split(",");

            const branch = cols[0];
            const area = cols[1];
            const transactions = parseInt(cols[2]) || 0;

            branches.push({
                branch,
                area,
                transactions
            });

            totalTransactions += transactions;

            if (!areaTotals[area]) {
                areaTotals[area] = 0;
            }

            areaTotals[area] += transactions;
        });

        branches.sort((a, b) => b.transactions - a.transactions);

        document.getElementById("totalTransactions").innerText = totalTransactions;
        document.getElementById("topBranch").innerText = branches[0]?.branch || "-";

        const topArea = Object.entries(areaTotals)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

        document.getElementById("topArea").innerText = topArea;

        populateLeaderboard(branches);
        populateAreaTable(areaTotals);

    } catch (error) {
        console.error("Error loading data:", error);
    }
}

function populateLeaderboard(branches) {
    const tbody = document.querySelector("#leaderboard tbody");
    tbody.innerHTML = "";

    branches.forEach((branch, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${branch.branch}</td>
                <td>${branch.area}</td>
                <td>${branch.transactions}</td>
            </tr>
        `;
    });
}

function populateAreaTable(areaTotals) {
    const tbody = document.querySelector("#areaTable tbody");
    tbody.innerHTML = "";

    Object.entries(areaTotals).forEach(([area, total]) => {
        tbody.innerHTML += `
            <tr>
                <td>${area}</td>
                <td>${total}</td>
            </tr>
        `;
    });
}

loadData();
setInterval(loadData, 300000);