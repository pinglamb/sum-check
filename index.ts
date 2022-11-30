// number of vars
const VAR = 3;
const B = [0, 1];
const FP = 128;

// g(x1, x2, x3) = 2 * x1^3 + x1 * x3 + x2 * x3
// [coefficient, [varlist]], 0: x1, 1: x2, ...
// const G = [
//   [2, [0, 0, 0]],
//   [1, [0, 2]],
//   [1, [1, 2]],
// ];
const G = [
  [3, [0, 0, 0, 1]],
  [2, [0, 1, 2]],
  [1, [1, 2]],
  [1, [2]],
];

const R = [2, 3, 6];

function rand(max: number): number {
  return Math.floor(Math.random() * max);
}

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
  console.log("H =", h);

  const r = [];

  let c = h;
  for (let i = 0; i < VAR; i++) {
    console.log("================================");
    console.log(`c${i + 1} =`, c);
    const gr = gi(G, i, r);
    console.log(`g${i + 1}: ${toStr(gr)}`);
    const xpad = [];
    for (let j = 0; j < i; j++) {
      xpad.push(0);
    }
    const sr = val(gr, xpad.concat([0])) + val(gr, xpad.concat([1]));
    console.log(`g${i + 1}(0) + g${i + 1}(1) =`, sr);
    if (sr == c) {
      console.log(`g${i + 1}(0) + g${i + 1}(1) == c${i + 1}, accept!`);
    } else {
      console.log(`g${i + 1}(0) + g${i + 1}(1) != c${i + 1}, reject!`);
      return;
    }
    // r.push(R[i]);
    r.push(2 + rand(FP - 2));
    console.log(`r${i + 1} =`, r[i]);
    c = val(gr, r);
  }

  console.log("================================");
  console.log(`c${VAR} =`, c);
  const gr = val(G, r);
  console.log("g(r) =", gr);
  if (gr == c) {
    console.log(`g(r) == c${VAR}, accept!`);
    console.log("done!");
  } else {
    console.log(`g(r) != c${VAR}, reject!`);
    return;
  }
}

main();
