var myChart = null

function drawGraph(dataset) {
    myChart = new Chart(document.getElementById("femChart").getContext("2d"), {
        type: "line",
        data: {
            datasets: [
                {
                    label: "calculated FEM",
                    data: dataset,
                    backgroundColor: "#041C32",
                    borderColor: "#041C32",
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [
                    {
                        type: "linear",
                    },
                ],
            },
            tooltips: {
                enabled: false,
            },
            animation: false,
            hover: { mode: null },
            elements: {
                point: {
                    radius: 3,
                },
            },
        },
    });
}

