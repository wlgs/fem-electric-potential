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

    k = a + (i - 1) * h;
    l = a + i * h;
    m = a + (i + 1) * h;

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

    k = a + (i - 1) * h;
    l = a + i * h;
    m = a + (i + 1) * h;

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

function integrate(f, a, b) {
    return gaussLegendre(f, a, b, 5);
}

function fem(n) { }
