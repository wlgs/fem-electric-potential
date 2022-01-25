
/* IMPORTED SOLVER AND GAUSSLEGENDRE END*/

/* GRAPHS AND BUTTON HANDLERS */

function drawGraph(n) {
    myChart = new Chart(document.getElementById("femChart").getContext("2d"), {
        type: "line",
        data: {
            datasets: [
                {
                    label: "calculated FEM",
                    data: fem(n),
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

var myChart = null
var cnt = 0;
var snackbarContainer = document.querySelector("#information");
window.onload = () => {
    document.getElementById("btn").addEventListener("click", () => {
        if (document.getElementById("inputValue").value != "") {
            var date1 = new Date();

            drawGraph(Number(document.getElementById("inputValue").value));
            var date2 = new Date();
            var diff = date2 - date1;
            var data = { message: "Calculated in " + diff + "ms" };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        } else {
            var data = { message: "Input some values first!" };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }
    });

    document.getElementById("switch-1").addEventListener("click", () => {
        if (cnt % 2 == 0)
            myChart.options.elements.point.radius = 0;
        else
            myChart.options.elements.point.radius = 3;
        cnt += 1
        myChart.update();
    });
};

/* GRAPHS AND BUTTON HANDLERS END*/

/* REAL CODE BEGINS HERE */

const integrate = (fn, a, b) => gaussLegendre(fn, a, b, 5);

const rho = 1;
const a = 0;
const b = 3;
const length = Math.abs(b - a);

function e_r(x) {
    if (x >= 0 && x <= 1) return 10;
    else if (x > 1 && x <= 2) return 5;
    else return 1;
}

function e(i, x, n) {
    let h = length / n;
    let xi1 = h * (i - 1);
    let xi2 = h * i;
    let xi3 = h * (i + 1);

    if (x > xi1 && x <= xi2) return (x - xi1) / h;
    else if (x > xi2 && x <= xi3) return (xi3 - x) / h;
    return 0;
}

function de(i, x, n) {
    let h = length / n;
    let xi1 = h * (i - 1);
    let xi2 = h * i;
    let xi3 = h * (i + 1);

    if (x > xi1 && x <= xi2) return 1 / h;
    else if (x > xi2 && x < xi3) return -1 / h;
    return 0;
}

function B(i, j, n) {
    let h = length / n;
    var left = e(i, 0, n) * e(j, 0, n);

    var integralBoundLeft = Math.max(0, (i - 1) * h, (j - 1) * h);
    var integralBoundRight = Math.min((i + 1) * h, (j + 1) * h);;

    function fn(x) {
        return de(i, x, n) * de(j, x, n);
    }
    var integral = integrate(fn, integralBoundLeft, integralBoundRight);
    return left - integral;
}

function L(i, n) {
    let h = length / n;
    var left = 5 * e(i, 0, n);

    var integralBoundLeft = Math.max(0, (i - 1) * h);
    var integralBoundRight = Math.min((i + 1) * h, 3);

    function fn(x) {
        return e(i, x, n) / e_r(x);
    }
    var integral = integrate(fn, integralBoundLeft, integralBoundRight);
    return left - integral;
}

function L2(i, n) {
    return L(i, n) - 2 * B(n, i, n);
}

function fem(n) {
    let h = length / n;
    var matrixB = new Array(n);
    for (let i = 0; i <= n - 1; i++) matrixB[i] = new Array(n).fill(0);
    var matrixL = new Array(n).fill(0);

    for (let i = 0; i <= n - 1; i++)
        for (let j = 0; j <= n - 1; j++) {
            if (Math.abs(i - j) <= 1) {
                matrixB[i][j] = B(i, j, n);
            }
        }
    for (let i = 0; i <= n - 1; i++) {
        matrixL[i] = L2(i, n);
    }
    var matrixW = solve(matrixB, matrixL);

    var finalRes = new Array()
    for (let i = 0; i <= n - 1; i++) {
        finalRes.push({
            x: i * h,
            y: getY(matrixW, i * h, n)
        })
    }
    return finalRes
}
function getY(matrixW, x, n) {
    var res = 0
    for (let i = 0; i <= n - 1; i++) {
        res += matrixW[i] * e(i, x, n)
    }
    res += 2 * e(n, x, n)
    return res
}