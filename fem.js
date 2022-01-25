
/* IMPORTED SOLVER AND GAUSSLEGENDRE*/


function Mat(data, mirror) {
    // Clone the original matrix
    this.data = new Array(data.length);
    for (var i = 0, cols = data[0].length; i < data.length; i++) {
        this.data[i] = new Array(cols);
        for (var j = 0; j < cols; j++) {
            this.data[i][j] = data[i][j];
        }
    }

    if (mirror) {
        if (typeof mirror[0] !== "object") {
            for (var i = 0; i < mirror.length; i++) {
                mirror[i] = [mirror[i]];
            }
        }
        this.mirror = new Mat(mirror);
    }
}

/**
 * Swap lines i and j in the matrix
 */
Mat.prototype.swap = function (i, j) {
    if (this.mirror) this.mirror.swap(i, j);
    var tmp = this.data[i];
    this.data[i] = this.data[j];
    this.data[j] = tmp;
};

/**
 * Multiply line number i by l
 */
Mat.prototype.multline = function (i, l) {
    if (this.mirror) this.mirror.multline(i, l);
    var line = this.data[i];
    for (var k = line.length - 1; k >= 0; k--) {
        line[k] *= l;
    }
};

/**
 * Add line number j multiplied by l to line number i
 */
Mat.prototype.addmul = function (i, j, l) {
    if (this.mirror) this.mirror.addmul(i, j, l);
    var lineI = this.data[i],
        lineJ = this.data[j];
    for (var k = lineI.length - 1; k >= 0; k--) {
        lineI[k] = lineI[k] + l * lineJ[k];
    }
};

/**
 * Tests if line number i is composed only of zeroes
 */
Mat.prototype.hasNullLine = function (i) {
    for (var j = 0; j < this.data[i].length; j++) {
        if (this.data[i][j] !== 0) {
            return false;
        }
    }
    return true;
};

Mat.prototype.gauss = function () {
    var pivot = 0,
        lines = this.data.length,
        columns = this.data[0].length,
        nullLines = [];

    for (var j = 0; j < columns; j++) {
        // Find the line on which there is the maximum value of column j
        var maxValue = 0,
            maxLine = 0;
        for (var k = pivot; k < lines; k++) {
            var val = this.data[k][j];
            if (Math.abs(val) > Math.abs(maxValue)) {
                maxLine = k;
                maxValue = val;
            }
        }
        if (maxValue === 0) {
            // The matrix is not invertible. The system may still have solutions.
            nullLines.push(pivot);
        } else {
            // The value of the pivot is maxValue
            this.multline(maxLine, 1 / maxValue);
            this.swap(maxLine, pivot);
            for (var i = 0; i < lines; i++) {
                if (i !== pivot) {
                    this.addmul(i, pivot, -this.data[i][j]);
                }
            }
        }
        pivot++;
    }

    // Check that the system has null lines where it should
    for (var i = 0; i < nullLines.length; i++) {
        if (!this.mirror.hasNullLine(nullLines[i])) {
            throw new Error("singular matrix");
        }
    }
    return this.mirror.data;
};

function solve(A, b) {
    var result = new Mat(A, b).gauss();
    if (result.length > 0 && result[0].length === 1) {
        // Convert Nx1 matrices to simple javascript arrays
        for (var i = 0; i < result.length; i++) result[i] = result[i][0];
    }
    return result;
}
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

    document.getElementById("switch-1").addEventListener("click",()=>{
        if (cnt%2==0)
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

    var integralBoundLeft;
    var integralBoundRight;
    integralBoundLeft = Math.max(0, (i - 1) * h, (j - 1) * h);
    integralBoundRight = Math.min((i + 1) * h, (j + 1) * h);

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
            if(Math.abs(i-j)<=1){
                matrixB[i][j] = B(i, j, n);
            }
        }
    for (let i = 0; i <= n - 1; i++) {
        matrixL[i] = L2(i, n);
    }
    var matrixW = solve(matrixB, matrixL);
    console.log(matrixW)

    var finalRes = new Array()
    for(let i = 0; i <= n-1; i++){
        finalRes.push({
            x: i*h,
            y: getY(matrixW, i*h, n)
        })
    }
    return finalRes
}
function getY(matrixW, x, n){
    var res = 0
    for(let i =0; i<=n-1; i++){
        res += matrixW[i]*e(i,x,n)
        console.log(i, e(i, x, n))
    }
    res += 2 * e(n, x, n)
    return res
}