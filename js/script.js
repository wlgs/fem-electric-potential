var snackbarContainer = document.querySelector("#information");
var cnt = 0;
window.onload = () => {
    document.getElementById("btn").addEventListener("click", () => {
        if (document.getElementById("inputValue").value != "") {
            var date1 = new Date();
            drawGraph(fem(Number(document.getElementById("inputValue").value)));
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