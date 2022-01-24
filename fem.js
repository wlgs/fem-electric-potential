/* const */

const rho = 1;
const a = 0;
const b = 3;
const length = Math.abs(b - a);

/* functions */

function e_r(x) {
    if (x >= 0 && x <= 1) return 10;
    else if (x > 1 && x <= 2) return 5;
    else return 1;
}

function e_i(i, n, x) {
    /*
      i - idx
      n - precision
      x - point
  
      the logic is like that
      x_i-1    x_i     x_i+1
      k         l        m
      */
    let h = length / n;

    let k = a + (i - 1) * h;
    let l = a + i * h;
    let m = a + (i + 1) * h;

    if (i == 0) {
        /* lewy brzeg */
        if (x >= 0 && x <= h) return (m - x) / h;
        return 0;
    } else if (i == n) {
        /* prawy brzeg */
        if (x >= b - h && x <= b) return (x - k) / h;
        return 0;
    } else {
        if (x >= k && x <= l) return (x - k) / h;
        else if (x >= l && x <= m) return (m - x) / h;
        else return 0;
    }
}

function de_i(i, n, x) {
    /*
      i - idx
      n - precision
      x - point
  
      the logic is like that
      x_i-1    x_i     x_i+1
      k         l        m
      */
    let h = length / n;

    let k = a + (i - 1) * h;
    let l = a + i * h;
    let m = a + (i + 1) * h;

    if (i == 0) {
        /* lewy brzeg */
        if (x >= 0 && x <= h) return -1 / h;
        return 0;
    } else if (i == n) {
        /* prawy brzeg */
        if (x >= b - h && x <= b) return 1 / h;
        return 0;
    } else {
        if (x >= k && x <= l) return 1 / h;
        else if (x >= l && x <= m) return -1 / h;
        else return 0;
    }
}
/* shift */
function w(n,x){
    return 2*e_i(n, n, x)
}

function integrate(f, a, b) {
    return gaussLegendre(f, a, b, 5);
}

function B(i, j, n){
    let C = e_i(i,n,0)*e_i(j,n,0) // e_i(0)e_j(0)
    function product(x){
        return de_i(i, n, x)*de_i(j,n,x)
    }

    if (i == j){
        var left = (i-1)*h
        var right = (i+1)*h
    } 
    else{
        var left = Math.min(i, j) * h
        var right = Math.max(i, j) * h
    }

    return C - integrate(product, left, right)
}

function L(i, n){
    let C = 5*e_i(i, n, 0)
    function e_i2(x){
        return e_i(i,n,x)
    }
    return C - integrate(e_i2, a, b)
}

function L2(i,n){
    return L(i,n) - 2*B(n, i, n)
}

function fem(n) { }
