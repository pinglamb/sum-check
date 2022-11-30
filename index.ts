// number of vars
const VAR = 3;
const B = [0, 1];

// g(x1, x2, x3) = 2 * x1^3 + x1 * x3 + x2 * x3
// [coefficient, [varlist]], 0: x1, 1: x2, ...
const G = [
  [2, [0, 0, 0]],
  [1, [0, 2]],
  [1, [1, 2]],
];

function bits(x: number): number[] {
  const bits = [];
  let c = x;
  bits.push(c % 2);
  c = Math.floor(c / 2);
  while (c > 0) {
    bits.push(c % 2);
    c = Math.floor(c / 2);
  }
  return bits;
}

function pads(bits: number[], len: number): number[] {
  while (len > bits.length) {
    bits.push(0);
  }
  return bits;
}

function val(g: any, x: any): number {
  let val = 0;

  for (const t of g) {
    let tv = 1;
    for (const v of t[1]) {
      tv *= x[v];
    }
    tv *= t[0];
    val += tv;
  }

  return val;
}

function sum(g: any): number {
  let sum = 0;
  for (let i = 0; i < Math.pow(2, VAR); i++) {
    const x = pads(bits(i), VAR);
    sum += val(g, x);
  }

  return sum;
}

function pval(g: any, xi: number, x: any): any {
  const ng = [];
  for (const t of g) {
    let ncoe = t[0];
    const nv = [];
    for (const v of t[1]) {
      if (v == xi) {
        nv.push(v);
      } else {
        ncoe *= x[v];
      }
    }
    ng.push([ncoe, nv]);
  }

  return ng;
}

function pcom(gs: any[]) {
  const coes = [];
  let xi = 0;
  for (const g of gs) {
    for (const t of g) {
      const pow = t[1].length;
      if (pow > 0) {
        xi = t[1][0];
      }
      if (coes[pow] == undefined) {
        coes[pow] = t[0];
      } else {
        coes[pow] += t[0];
      }
    }
  }

  const g = [];
  for (let i = coes.length - 1; i >= 0; i--) {
    const coe = coes[i];
    if (coe !== undefined && coe !== 0) {
      const v = [];
      for (let j = 0; j < i; j++) {
        v.push(xi);
      }
      g.push([coe, v]);
    }
  }
  return g;
}

function gi(g: any, xi: number, r: any): any {
  const gs = [];
  const t = Math.pow(2, VAR - xi - 1);
  for (let i = 0; i < t; i++) {
    const x = r.concat([0]).concat(pads(bits(i), t));
    gs.push(pval(g, xi, x));
  }

  return pcom(gs);
}

function toStr(g: any): string {
  const ts = [];
  for (const t of g) {
    const sts = [];
    if (t[0] > 1 || t[1].length == 0) {
      sts.push(t[0]);
    }
    const pows = [];
    for (let i = 0; i < VAR; i++) {
      pows.push(0);
    }
    for (const v of t[1]) {
      pows[v] += 1;
    }
    for (const [i, p] of pows.entries()) {
      if (p == 0) {
      } else if (p == 1) {
        sts.push(`x${i + 1}`);
      } else {
        sts.push(`x${i + 1}^${p}`);
      }
    }
    ts.push(sts.join(" * "));
  }

  return ts.join(" + ");
}

function main(): void {
  console.log(`${VAR}-variant polynomial: ${toStr(G)}`);

  const h = sum(G);
  console.log("C1 =", h);

  console.log("================================");
  const g1 = gi(G, 0, []);
  console.log(`g1: ${toStr(g1)}`);
  const s1 = val(g1, [0]) + val(g1, [1]);
  console.log("g1(0) + g1(1) =", s1);
  if (s1 == h) {
    console.log("g1(0) + g1(1) = C1, accept!");
  } else {
    console.log("g1(0) + g1(1) != C1, reject!");
    return;
  }
  const r1 = 2;
  console.log("r1 =", r1);

  console.log("================================");
  const g2 = gi(G, 1, [r1]);
  console.log(`g2: ${toStr(g2)}`);
  const s2 = val(g2, [0, 0]) + val(g2, [0, 1]);
  console.log("g2(0) + g2(1) =", s2);
  const g1r1 = val(g1, [r1]);
  console.log("g1(r1) =", g1r1);
  if (s2 == g1r1) {
    console.log("g2(0) + g2(1) = g1(r1), accept!");
  } else {
    console.log("g2(0) + g2(1) != g1(r1), reject!");
    return;
  }
  const r2 = 3;
  console.log("r2 =", r2);

  console.log("================================");
  const g3 = gi(G, 2, [r1, r2]);
  console.log(`g3: ${toStr(g3)}`);
  const s3 = val(g3, [0, 0, 0]) + val(g3, [0, 0, 1]);
  console.log("g3(0) + g3(1) =", s3);
  const g2r2 = val(g2, [0, r2]);
  console.log("g2(r2) =", g2r2);
  if (s3 == g2r2) {
    console.log("g3(0) + g3(1) = g2(r2), accept!");
  } else {
    console.log("g3(0) + g3(1) != g2(r2), reject!");
    return;
  }
  const r3 = 6;
  console.log("r3 =", r3);

  console.log("================================");
  const gr = val(G, [r1, r2, r3]);
  console.log("g(r) =", gr);
  const g3r3 = val(g3, [0, 0, r3]);
  console.log("g3(r3) =", g3r3);
  if (gr == g3r3) {
    console.log("g3(r3) = g(r), accept!");
    console.log("done!");
  } else {
    console.log("g3(r3) != g(r), reject!");
    return;
  }
}

main();
