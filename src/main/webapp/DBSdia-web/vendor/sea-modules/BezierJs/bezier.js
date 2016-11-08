var Bezier = function(t) {
    function n(i) {
        if (r[i]) return r[i].exports;
        var e = r[i] = {
            exports: {},
            id: i,
            loaded: !1
        };
        return t[i].call(e.exports, e, e.exports, n),
        e.loaded = !0,
        e.exports
    }
    var r = {};
    return n.m = t,
    n.c = r,
    n.p = "",
    n(0)
} ([function(t, n, r) {
    "use strict";
    t.exports = r(1)
},
function(t, n, r) {
    "use strict";
    var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ?
    function(t) {
        return typeof t
    }: function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol ? "symbol": typeof t
    }; !
    function() {
        function n(t, n, r, i, e) {
            "undefined" == typeof e && (e = .5);
            var o = h.projectionratio(e, t),
            s = 1 - o,
            u = {
                x: o * n.x + s * i.x,
                y: o * n.y + s * i.y
            },
            a = h.abcratio(e, t),
            f = {
                x: r.x + (r.x - u.x) / a,
                y: r.y + (r.y - u.y) / a
            };
            return {
                A: f,
                B: r,
                C: u
            }
        }
        var e = Math.abs,
        o = Math.min,
        s = Math.max,
        u = Math.acos,
        a = Math.sqrt,
        f = Math.PI,
        c = {
            x: 0,
            y: 0,
            z: 0
        },
        h = r(2),
        x = r(3),
        y = function(t) {
            var n = t && t.forEach ? t: [].slice.call(arguments),
            r = !1;
            if ("object" === i(n[0])) {
                r = n.length;
                var o = [];
                n.forEach(function(t) { ["x", "y", "z"].forEach(function(n) {
                        "undefined" != typeof t[n] && o.push(t[n])
                    })
                }),
                n = o
            }
            var s = !1,
            u = n.length;
            if (r) {
                if (r > 4) {
                    if (1 !== arguments.length) throw new Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");
                    s = !0
                }
            } else if (6 !== u && 8 !== u && 9 !== u && 12 !== u && 1 !== arguments.length) throw new Error("Only new Bezier(point[]) is accepted for 4th and higher order curves");
            var a = !s && (9 === u || 12 === u) || t && t[0] && "undefined" != typeof t[0].z;
            this._3d = a;
            for (var f = [], c = 0, x = a ? 3 : 2; u > c; c += x) {
                var y = {
                    x: n[c],
                    y: n[c + 1]
                };
                a && (y.z = n[c + 2]),
                f.push(y)
            }
            this.order = f.length - 1,
            this.points = f;
            var p = ["x", "y"];
            a && p.push("z"),
            this.dims = p,
            this.dimlen = p.length,
            function(t) {
                for (var n = t.order,
                r = t.points,
                i = h.align(r, {
                    p1: r[0],
                    p2: r[n]
                }), o = 0; o < i.length; o++) if (e(i[o].y) > 1e-4) return void(t._linear = !1);
                t._linear = !0
            } (this),
            this._t1 = 0,
            this._t2 = 1,
            this.update()
        };
        y.fromSVG = function(t) {
            var n = t.match(/[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?/g).map(parseFloat),
            r = /[cq]/.test(t);
            return r ? (n = n.map(function(t, r) {
                return 2 > r ? t: t + n[r % 2]
            }), new y(n)) : new y(n)
        },
        y.quadraticFromPoints = function(t, r, i, e) {
            if ("undefined" == typeof e && (e = .5), 0 === e) return new y(r, r, i);
            if (1 === e) return new y(t, r, r);
            var o = n(2, t, r, i, e);
            return new y(t, o.A, i)
        },
        y.cubicFromPoints = function(t, r, i, e, o) {
            "undefined" == typeof e && (e = .5);
            var s = n(3, t, r, i, e);
            "undefined" == typeof o && (o = h.dist(r, s.C));
            var u = o * (1 - e) / e,
            a = h.dist(t, i),
            f = (i.x - t.x) / a,
            c = (i.y - t.y) / a,
            x = o * f,
            p = o * c,
            l = u * f,
            v = u * c,
            d = {
                x: r.x - x,
                y: r.y - p
            },
            m = {
                x: r.x + l,
                y: r.y + v
            },
            g = s.A,
            z = {
                x: g.x + (d.x - g.x) / (1 - e),
                y: g.y + (d.y - g.y) / (1 - e)
            },
            b = {
                x: g.x + (m.x - g.x) / e,
                y: g.y + (m.y - g.y) / e
            },
            _ = {
                x: t.x + (z.x - t.x) / e,
                y: t.y + (z.y - t.y) / e
            },
            w = {
                x: i.x + (b.x - i.x) / (1 - e),
                y: i.y + (b.y - i.y) / (1 - e)
            };
            return new y(t, _, w, i)
        };
        var p = function() {
            return h
        };
        y.getUtils = p,
        y.prototype = {
            getUtils: p,
            valueOf: function() {
                return this.toString()
            },
            toString: function() {
                return h.pointsToString(this.points)
            },
            toSVG: function(t) {
                if (this._3d) return ! 1;
                for (var n = this.points,
                r = n[0].x, i = n[0].y, e = ["M", r, i, 2 === this.order ? "Q": "C"], o = 1, s = n.length; s > o; o++) e.push(n[o].x),
                e.push(n[o].y);
                return e.join(" ")
            },
            update: function() {
                this.dpoints = [];
                for (var t = this.points,
                n = t.length,
                r = n - 1; n > 1; n--, r--) {
                    for (var i, e = [], o = 0; r > o; o++) i = {
                        x: r * (t[o + 1].x - t[o].x),
                        y: r * (t[o + 1].y - t[o].y)
                    },
                    this._3d && (i.z = r * (t[o + 1].z - t[o].z)),
                    e.push(i);
                    this.dpoints.push(e),
                    t = e
                }
                this.computedirection()
            },
            computedirection: function() {
                var t = this.points,
                n = h.angle(t[0], t[this.order], t[1]);
                this.clockwise = n > 0
            },
            length: function() {
                return h.length(this.derivative.bind(this))
            },
            _lut: [],
            getLUT: function(t) {
                if (t = t || 100, this._lut.length === t) return this._lut;
                this._lut = [];
                for (var n = 0; t >= n; n++) this._lut.push(this.compute(n / t));
                return this._lut
            },
            on: function(t, n) {
                n = n || 5;
                for (var r, i = this.getLUT(), e = [], o = 0, s = 0; s < i.length; s++) r = i[s],
                h.dist(r, t) < n && (e.push(r), o += s / i.length);
                return e.length ? o /= e.length: !1
            },
            project: function(t) {
                var n = this.getLUT(),
                r = n.length - 1,
                i = h.closest(n, t),
                e = i.mdist,
                o = i.mpos;
                if (0 === o || o === r) {
                    var s = o / r,
                    u = this.compute(s);
                    return u.t = s,
                    u.d = e,
                    u
                }
                var a, s, f, c, x = (o - 1) / r,
                y = (o + 1) / r,
                p = .1 / r;
                for (e += 1, s = x, a = s; y + p > s; s += p) f = this.compute(s),
                c = h.dist(t, f),
                e > c && (e = c, a = s);
                return f = this.compute(a),
                f.t = a,
                f.d = e,
                f
            },
            get: function(t) {
                return this.compute(t)
            },
            point: function(t) {
                return this.points[t]
            },
            compute: function(t) {
                if (0 === t) return this.points[0];
                if (1 === t) return this.points[this.order];
                var n = this.points,
                r = 1 - t;
                if (1 === this.order) return f = {
                    x: r * n[0].x + t * n[1].x,
                    y: r * n[0].y + t * n[1].y
                },
                this._3d && (f.z = r * n[0].z + t * n[1].z),
                f;
                if (this.order < 4) {
                    var i, e, o, s = r * r,
                    u = t * t,
                    a = 0;
                    2 === this.order ? (n = [n[0], n[1], n[2], c], i = s, e = r * t * 2, o = u) : 3 === this.order && (i = s * r, e = s * t * 3, o = r * u * 3, a = t * u);
                    var f = {
                        x: i * n[0].x + e * n[1].x + o * n[2].x + a * n[3].x,
                        y: i * n[0].y + e * n[1].y + o * n[2].y + a * n[3].y
                    };
                    return this._3d && (f.z = i * n[0].z + e * n[1].z + o * n[2].z + a * n[3].z),
                    f
                }
                for (var h = JSON.parse(JSON.stringify(this.points)); h.length > 1;) {
                    for (var x = 0; x < h.length - 1; x++) h[x] = {
                        x: h[x].x + (h[x + 1].x - h[x].x) * t,
                        y: h[x].y + (h[x + 1].y - h[x].y) * t
                    },
                    "undefined" != typeof h[x].z && (h[x] = h[x].z + (h[x + 1].z - h[x].z) * t);
                    h.splice(h.length - 1, 1)
                }
                return h[0]
            },
            raise: function() {
                for (var t, n, r, i = this.points,
                e = [i[0]], o = i.length, t = 1; o > t; t++) n = i[t],
                r = i[t - 1],
                e[t] = {
                    x: (o - t) / o * n.x + t / o * r.x,
                    y: (o - t) / o * n.y + t / o * r.y
                };
                return e[o] = i[o - 1],
                new y(e)
            },
            derivative: function(t) {
                var n, r, i = 1 - t,
                e = 0,
                o = this.dpoints[0];
                2 === this.order && (o = [o[0], o[1], c], n = i, r = t),
                3 === this.order && (n = i * i, r = i * t * 2, e = t * t);
                var s = {
                    x: n * o[0].x + r * o[1].x + e * o[2].x,
                    y: n * o[0].y + r * o[1].y + e * o[2].y
                };
                return this._3d && (s.z = n * o[0].z + r * o[1].z + e * o[2].z),
                s
            },
            inflections: function() {
                return h.inflections(this.points)
            },
            normal: function(t) {
                return this._3d ? this.__normal3(t) : this.__normal2(t)
            },
            __normal2: function(t) {
                var n = this.derivative(t),
                r = a(n.x * n.x + n.y * n.y);
                return {
                    x: -n.y / r,
                    y: n.x / r
                }
            },
            __normal3: function(t) {
                var n = this.derivative(t),
                r = this.derivative(t + .01),
                i = a(n.x * n.x + n.y * n.y + n.z * n.z),
                e = a(r.x * r.x + r.y * r.y + r.z * r.z);
                n.x /= i,
                n.y /= i,
                n.z /= i,
                r.x /= e,
                r.y /= e,
                r.z /= e;
                var o = {
                    x: r.y * n.z - r.z * n.y,
                    y: r.z * n.x - r.x * n.z,
                    z: r.x * n.y - r.y * n.x
                },
                s = a(o.x * o.x + o.y * o.y + o.z * o.z);
                o.x /= s,
                o.y /= s,
                o.z /= s;
                var u = [o.x * o.x, o.x * o.y - o.z, o.x * o.z + o.y, o.x * o.y + o.z, o.y * o.y, o.y * o.z - o.x, o.x * o.z - o.y, o.y * o.z + o.x, o.z * o.z],
                f = {
                    x: u[0] * n.x + u[1] * n.y + u[2] * n.z,
                    y: u[3] * n.x + u[4] * n.y + u[5] * n.z,
                    z: u[6] * n.x + u[7] * n.y + u[8] * n.z
                };
                return f
            },
            hull: function(t) {
                var n, r = this.points,
                i = [],
                e = [],
                o = 0,
                s = 0,
                u = 0;
                for (e[o++] = r[0], e[o++] = r[1], e[o++] = r[2], 3 === this.order && (e[o++] = r[3]); r.length > 1;) {
                    for (i = [], s = 0, u = r.length - 1; u > s; s++) n = h.lerp(t, r[s], r[s + 1]),
                    e[o++] = n,
                    i.push(n);
                    r = i
                }
                return e
            },
            split: function(t, n) {
                if (0 === t && n) return this.split(n).left;
                if (1 === n) return this.split(t).right;
                var r = this.hull(t),
                i = {
                    left: new y(2 === this.order ? [r[0], r[3], r[5]] : [r[0], r[4], r[7], r[9]]),
                    right: new y(2 === this.order ? [r[5], r[4], r[2]] : [r[9], r[8], r[6], r[3]]),
                    span: r
                };
                if (i.left._t1 = h.map(0, 0, 1, this._t1, this._t2), i.left._t2 = h.map(t, 0, 1, this._t1, this._t2), i.right._t1 = h.map(t, 0, 1, this._t1, this._t2), i.right._t2 = h.map(1, 0, 1, this._t1, this._t2), !n) return i;
                n = h.map(n, t, 1, 0, 1);
                var e = i.right.split(n);
                return e.left
            },
            extrema: function() {
                var t, n, r = this.dims,
                i = {},
                e = [];
                return r.forEach(function(r) {
                    n = function(t) {
                        return t[r]
                    },
                    t = this.dpoints[0].map(n),
                    i[r] = h.droots(t),
                    3 === this.order && (t = this.dpoints[1].map(n), i[r] = i[r].concat(h.droots(t))),
                    i[r] = i[r].filter(function(t) {
                        return t >= 0 && 1 >= t
                    }),
                    e = e.concat(i[r].sort())
                }.bind(this)),
                e = e.sort().filter(function(t, n) {
                    return e.indexOf(t) === n
                }),
                i.values = e,
                i
            },
            bbox: function() {
                var t = this.extrema(),
                n = {};
                return this.dims.forEach(function(r) {
                    n[r] = h.getminmax(this, r, t[r])
                }.bind(this)),
                n
            },
            overlaps: function(t) {
                var n = this.bbox(),
                r = t.bbox();
                return h.bboxoverlap(n, r)
            },
            offset: function(t, n) {
                if ("undefined" != typeof n) {
                    var r = this.get(t),
                    i = this.normal(t),
                    e = {
                        c: r,
                        n: i,
                        x: r.x + i.x * n,
                        y: r.y + i.y * n
                    };
                    return this._3d && (e.z = r.z + i.z * n),
                    e
                }
                if (this._linear) {
                    var o = this.normal(0),
                    s = this.points.map(function(n) {
                        var r = {
                            x: n.x + t * o.x,
                            y: n.y + t * o.y
                        };
                        return n.z && i.z && (r.z = n.z + t * o.z),
                        r
                    });
                    return [new y(s)]
                }
                var u = this.reduce();
                return u.map(function(n) {
                    return n.scale(t)
                })
            },
            simple: function() {
                if (3 === this.order) {
                    var t = h.angle(this.points[0], this.points[3], this.points[1]),
                    n = h.angle(this.points[0], this.points[3], this.points[2]);
                    if (t > 0 && 0 > n || 0 > t && n > 0) return ! 1
                }
                var r = this.normal(0),
                i = this.normal(1),
                o = r.x * i.x + r.y * i.y;
                this._3d && (o += r.z * i.z);
                var s = e(u(o));
                return f / 3 > s
            },
            reduce: function() {
                var t, n, r = 0,
                i = 0,
                o = .01,
                s = [],
                u = [],
                a = this.extrema().values;
                for ( - 1 === a.indexOf(0) && (a = [0].concat(a)), -1 === a.indexOf(1) && a.push(1), r = a[0], t = 1; t < a.length; t++) i = a[t],
                n = this.split(r, i),
                n._t1 = r,
                n._t2 = i,
                s.push(n),
                r = i;
                return s.forEach(function(t) {
                    for (r = 0, i = 0; 1 >= i;) for (i = r + o; 1 + o >= i; i += o) if (n = t.split(r, i), !n.simple()) {
                        if (i -= o, e(r - i) < o) return [];
                        n = t.split(r, i),
                        n._t1 = h.map(r, 0, 1, t._t1, t._t2),
                        n._t2 = h.map(i, 0, 1, t._t1, t._t2),
                        u.push(n),
                        r = i;
                        break
                    }
                    1 > r && (n = t.split(r, 1), n._t1 = h.map(r, 0, 1, t._t1, t._t2), n._t2 = t._t2, u.push(n))
                }),
                u
            },
            scale: function(t) {
                var n = this.order,
                r = !1;
                if ("function" == typeof t && (r = t), r && 2 === n) return this.raise().scale(r);
                var i = this.clockwise,
                e = r ? r(0) : t,
                o = r ? r(1) : t,
                s = [this.offset(0, 10), this.offset(1, 10)],
                u = h.lli4(s[0], s[0].c, s[1], s[1].c);
                if (!u) throw new Error("cannot scale this curve. Try reducing it first.");
                var f = this.points,
                c = [];
                return [0, 1].forEach(function(t) {
                    var r = c[t * n] = h.copy(f[t * n]);
                    r.x += (t ? o: e) * s[t].n.x,
                    r.y += (t ? o: e) * s[t].n.y
                }.bind(this)),
                r ? ([0, 1].forEach(function(e) {
                    if (2 !== this.order || !e) {
                        var o = f[e + 1],
                        s = {
                            x: o.x - u.x,
                            y: o.y - u.y
                        },
                        h = r ? r((e + 1) / n) : t;
                        r && !i && (h = -h);
                        var x = a(s.x * s.x + s.y * s.y);
                        s.x /= x,
                        s.y /= x,
                        c[e + 1] = {
                            x: o.x + h * s.x,
                            y: o.y + h * s.y
                        }
                    }
                }.bind(this)), new y(c)) : ([0, 1].forEach(function(t) {
                    if (2 !== this.order || !t) {
                        var r = c[t * n],
                        i = this.derivative(t),
                        e = {
                            x: r.x + i.x,
                            y: r.y + i.y
                        };
                        c[t + 1] = h.lli4(r, e, u, f[t + 1])
                    }
                }.bind(this)), new y(c))
            },
            outline: function(t, n, r, i) {
                function e(t, n, r, i, e) {
                    return function(o) {
                        var s = i / r,
                        u = (i + e) / r,
                        a = n - t;
                        return h.map(o, 0, 1, t + s * a, t + u * a)
                    }
                }
                n = "undefined" == typeof n ? t: n;
                var o, s = this.reduce(),
                u = s.length,
                a = [],
                f = [],
                c = 0,
                y = this.length(),
                p = "undefined" != typeof r && "undefined" != typeof i;
                s.forEach(function(o) {
                    _ = o.length(),
                    p ? (a.push(o.scale(e(t, r, y, c, _))), f.push(o.scale(e( - n, -i, y, c, _)))) : (a.push(o.scale(t)), f.push(o.scale( - n))),
                    c += _
                }),
                f = f.map(function(t) {
                    return o = t.points,
                    o[3] ? t.points = [o[3], o[2], o[1], o[0]] : t.points = [o[2], o[1], o[0]],
                    t
                }).reverse();
                var l = a[0].points[0],
                v = a[u - 1].points[a[u - 1].points.length - 1],
                d = f[u - 1].points[f[u - 1].points.length - 1],
                m = f[0].points[0],
                g = h.makeline(d, l),
                z = h.makeline(v, m),
                b = [g].concat(a).concat([z]).concat(f),
                _ = b.length;
                return new x(b)
            },
            outlineshapes: function(t, n, r) {
                n = n || t;
                for (var i = this.outline(t, n).curves, e = [], o = 1, s = i.length; s / 2 > o; o++) {
                    var u = h.makeshape(i[o], i[s - o], r);
                    u.startcap.virtual = o > 1,
                    u.endcap.virtual = s / 2 - 1 > o,
                    e.push(u)
                }
                return e
            },
            intersects: function(t, n) {
                return t ? t.p1 && t.p2 ? this.lineIntersects(t) : (t instanceof y && (t = t.reduce()), this.curveintersects(this.reduce(), t, n)) : this.selfintersects(n)
            },
            lineIntersects: function(t) {
                var n = o(t.p1.x, t.p2.x),
                r = o(t.p1.y, t.p2.y),
                i = s(t.p1.x, t.p2.x),
                e = s(t.p1.y, t.p2.y),
                u = this;
                return h.roots(this.points, t).filter(function(t) {
                    var o = u.get(t);
                    return h.between(o.x, n, i) && h.between(o.y, r, e)
                })
            },
            selfintersects: function(t) {
                var n, r, i, e, o = this.reduce(),
                s = o.length - 2,
                u = [];
                for (n = 0; s > n; n++) i = o.slice(n, n + 1),
                e = o.slice(n + 2),
                r = this.curveintersects(i, e, t),
                u = u.concat(r);
                return u
            },
            curveintersects: function(t, n, r) {
                var i = [];
                t.forEach(function(t) {
                    n.forEach(function(n) {
                        t.overlaps(n) && i.push({
                            left: t,
                            right: n
                        })
                    })
                });
                var e = [];
                return i.forEach(function(t) {
                    var n = h.pairiteration(t.left, t.right, r);
                    n.length > 0 && (e = e.concat(n))
                }),
                e
            },
            arcs: function(t) {
                t = t || .5;
                var n = [];
                return this._iterate(t, n)
            },
            _error: function(t, n, r, i) {
                var o = (i - r) / 4,
                s = this.get(r + o),
                u = this.get(i - o),
                a = h.dist(t, n),
                f = h.dist(t, s),
                c = h.dist(t, u);
                return e(f - a) + e(c - a)
            },
            _iterate: function(t, n) {
                var r, i = 0,
                e = 1;
                do {
                    r = 0, e = 1;
                    var o, s, u, a, f, c = this.get(i), x = !1, y = !1, p = e, l = 1, v = 0;
                    do {
                        y = x, a = u, p = (i + e) / 2, v++, o = this.get(p), s = this.get(e), u = h.getccenter(c, o, s), u.interval = {
                            start: i,
                            end: e
                        };
                        var d = this._error(u, c, i, e);
                        if (x = t >= d, f = y && !x, f || (l = e), x) {
                            if (e >= 1) {
                                l = 1,
                                a = u;
                                break
                            }
                            e += (e - i) / 2
                        } else e = p
                    } while (! f && r ++< 100 );
                    if (r >= 100) {
                        console.error("arc abstraction somehow failed...");
                        break
                    }
                    a = a ? a: u, n.push(a), i = l
                } while ( 1 > e );
                return n
            }
        },
        t.exports = y
    } ()
},
function(t, n, r) {
    "use strict"; !
    function() {
        var n = Math.abs,
        i = Math.cos,
        e = Math.sin,
        o = Math.acos,
        s = Math.atan2,
        u = Math.sqrt,
        a = Math.pow,
        f = function(t) {
            return 0 > t ? -a( - t, 1 / 3) : a(t, 1 / 3)
        },
        c = Math.PI,
        h = 2 * c,
        x = c / 2,
        y = 1e-6,
        p = {
            Tvalues: [ - .06405689286260563, .06405689286260563, -.1911188674736163, .1911188674736163, -.3150426796961634, .3150426796961634, -.4337935076260451, .4337935076260451, -.5454214713888396, .5454214713888396, -.6480936519369755, .6480936519369755, -.7401241915785544, .7401241915785544, -.820001985973903, .820001985973903, -.8864155270044011, .8864155270044011, -.9382745520027328, .9382745520027328, -.9747285559713095, .9747285559713095, -.9951872199970213, .9951872199970213],
            Cvalues: [.12793819534675216, .12793819534675216, .1258374563468283, .1258374563468283, .12167047292780339, .12167047292780339, .1155056680537256, .1155056680537256, .10744427011596563, .10744427011596563, .09761865210411388, .09761865210411388, .08619016153195327, .08619016153195327, .0733464814110803, .0733464814110803, .05929858491543678, .05929858491543678, .04427743881741981, .04427743881741981, .028531388628933663, .028531388628933663, .0123412297999872, .0123412297999872],
            arcfn: function(t, n) {
                var r = n(t),
                i = r.x * r.x + r.y * r.y;
                return "undefined" != typeof r.z && (i += r.z * r.z),
                u(i)
            },
            between: function(t, n, r) {
                return t >= n && r >= t || p.approximately(t, n) || p.approximately(t, r)
            },
            approximately: function(t, r, i) {
                return n(t - r) <= (i || y)
            },
            length: function(t) {
                var n, r, i = .5,
                e = 0,
                o = p.Tvalues.length;
                for (n = 0; o > n; n++) r = i * p.Tvalues[n] + i,
                e += p.Cvalues[n] * p.arcfn(r, t);
                return i * e
            },
            map: function(t, n, r, i, e) {
                var o = r - n,
                s = e - i,
                u = t - n,
                a = u / o;
                return i + s * a
            },
            lerp: function(t, n, r) {
                var i = {
                    x: n.x + t * (r.x - n.x),
                    y: n.y + t * (r.y - n.y)
                };
                return n.z && r.z && (i.z = n.z + t * (r.z - n.z)),
                i
            },
            pointToString: function(t) {
                var n = t.x + "/" + t.y;
                return "undefined" != typeof t.z && (n += "/" + t.z),
                n
            },
            pointsToString: function(t) {
                return "[" + t.map(p.pointToString).join(", ") + "]"
            },
            copy: function(t) {
                return JSON.parse(JSON.stringify(t))
            },
            angle: function(t, n, r) {
                var i, e = n.x - t.x,
                o = n.y - t.y,
                a = r.x - t.x,
                f = r.y - t.y,
                c = e * f - o * a,
                h = u(e * e + o * o),
                x = u(a * a + f * f);
                return e /= h,
                o /= h,
                a /= x,
                f /= x,
                i = e * a + o * f,
                s(c, i)
            },
            round: function(t, n) {
                var r = "" + t,
                i = r.indexOf(".");
                return parseFloat(r.substring(0, i + 1 + n))
            },
            dist: function(t, n) {
                var r = t.x - n.x,
                i = t.y - n.y;
                return u(r * r + i * i)
            },
            closest: function(t, n) {
                var r, i, e = a(2, 63);
                return t.forEach(function(t, o) {
                    i = p.dist(n, t),
                    e > i && (e = i, r = o)
                }),
                {
                    mdist: e,
                    mpos: r
                }
            },
            abcratio: function(t, r) {
                if (2 !== r && 3 !== r) return ! 1;
                if ("undefined" == typeof t) t = .5;
                else if (0 === t || 1 === t) return t;
                var i = a(t, r) + a(1 - t, r),
                e = i - 1;
                return n(e / i)
            },
            projectionratio: function(t, n) {
                if (2 !== n && 3 !== n) return ! 1;
                if ("undefined" == typeof t) t = .5;
                else if (0 === t || 1 === t) return t;
                var r = a(1 - t, n),
                i = a(t, n) + r;
                return r / i
            },
            lli8: function(t, n, r, i, e, o, s, u) {
                var a = (t * i - n * r) * (e - s) - (t - r) * (e * u - o * s),
                f = (t * i - n * r) * (o - u) - (n - i) * (e * u - o * s),
                c = (t - r) * (o - u) - (n - i) * (e - s);
                return 0 == c ? !1 : {
                    x: a / c,
                    y: f / c
                }
            },
            lli4: function(t, n, r, i) {
                var e = t.x,
                o = t.y,
                s = n.x,
                u = n.y,
                a = r.x,
                f = r.y,
                c = i.x,
                h = i.y;
                return p.lli8(e, o, s, u, a, f, c, h)
            },
            lli: function(t, n) {
                return p.lli4(t, t.c, n, n.c)
            },
            makeline: function(t, n) {
                var i = r(1),
                e = t.x,
                o = t.y,
                s = n.x,
                u = n.y,
                a = (s - e) / 3,
                f = (u - o) / 3;
                return new i(e, o, e + a, o + f, e + 2 * a, o + 2 * f, s, u)
            },
            findbbox: function(t) {
                var n = 99999999,
                r = n,
                i = -n,
                e = i;
                return t.forEach(function(t) {
                    var o = t.bbox();
                    n > o.x.min && (n = o.x.min),
                    r > o.y.min && (r = o.y.min),
                    i < o.x.max && (i = o.x.max),
                    e < o.y.max && (e = o.y.max)
                }),
                {
                    x: {
                        min: n,
                        mid: (n + i) / 2,
                        max: i,
                        size: i - n
                    },
                    y: {
                        min: r,
                        mid: (r + e) / 2,
                        max: e,
                        size: e - r
                    }
                }
            },
            shapeintersections: function(t, n, r, i, e) {
                if (!p.bboxoverlap(n, i)) return [];
                var o = [],
                s = [t.startcap, t.forward, t.back, t.endcap],
                u = [r.startcap, r.forward, r.back, r.endcap];
                return s.forEach(function(n) {
                    n.virtual || u.forEach(function(i) {
                        if (!i.virtual) {
                            var s = n.intersects(i, e);
                            s.length > 0 && (s.c1 = n, s.c2 = i, s.s1 = t, s.s2 = r, o.push(s))
                        }
                    })
                }),
                o
            },
            makeshape: function(t, n, r) {
                var i = n.points.length,
                e = t.points.length,
                o = p.makeline(n.points[i - 1], t.points[0]),
                s = p.makeline(t.points[e - 1], n.points[0]),
                u = {
                    startcap: o,
                    forward: t,
                    back: n,
                    endcap: s,
                    bbox: p.findbbox([o, t, n, s])
                },
                a = p;
                return u.intersections = function(t) {
                    return a.shapeintersections(u, u.bbox, t, t.bbox, r)
                },
                u
            },
            getminmax: function(t, n, r) {
                if (!r) return {
                    min: 0,
                    max: 0
                };
                var i, e, o = 0x10000000000000000,
                s = -o; - 1 === r.indexOf(0) && (r = [0].concat(r)),
                -1 === r.indexOf(1) && r.push(1);
                for (var u = 0,
                a = r.length; a > u; u++) i = r[u],
                e = t.get(i),
                e[n] < o && (o = e[n]),
                e[n] > s && (s = e[n]);
                return {
                    min: o,
                    mid: (o + s) / 2,
                    max: s,
                    size: s - o
                }
            },
            align: function(t, n) {
                var r = n.p1.x,
                o = n.p1.y,
                u = -s(n.p2.y - o, n.p2.x - r),
                a = function(t) {
                    return {
                        x: (t.x - r) * i(u) - (t.y - o) * e(u),
                        y: (t.x - r) * e(u) + (t.y - o) * i(u)
                    }
                };
                return t.map(a)
            },
            roots: function(t, n) {
                n = n || {
                    p1: {
                        x: 0,
                        y: 0
                    },
                    p2: {
                        x: 1,
                        y: 0
                    }
                };
                var r = t.length - 1,
                e = p.align(t, n),
                s = function(t) {
                    return t >= 0 && 1 >= t
                };
                if (2 === r) {
                    var a = e[0].y,
                    c = e[1].y,
                    x = e[2].y,
                    y = a - 2 * c + x;
                    if (0 !== y) {
                        var l = -u(c * c - a * x),
                        v = -a + c,
                        d = -(l + v) / y,
                        m = -( - l + v) / y;
                        return [d, m].filter(s)
                    }
                    return c !== x && 0 === y ? [(2 * c - x) / 2 * (c - x)].filter(s) : []
                }
                var g, d, z, b, _, w = e[0].y,
                E = e[1].y,
                S = e[2].y,
                M = e[3].y,
                y = -w + 3 * E - 3 * S + M,
                a = (3 * w - 6 * E + 3 * S) / y,
                c = ( - 3 * w + 3 * E) / y,
                x = w / y,
                e = (3 * c - a * a) / 3,
                k = e / 3,
                O = (2 * a * a * a - 9 * a * c + 27 * x) / 27,
                T = O / 2,
                j = T * T + k * k * k;
                if (0 > j) {
                    var C = -e / 3,
                    q = C * C * C,
                    U = u(q),
                    B = -O / (2 * U),
                    F = -1 > B ? -1 : B > 1 ? 1 : B,
                    I = o(F),
                    J = f(U),
                    N = 2 * J;
                    return z = N * i(I / 3) - a / 3,
                    b = N * i((I + h) / 3) - a / 3,
                    _ = N * i((I + 2 * h) / 3) - a / 3,
                    [z, b, _].filter(s)
                }
                if (0 === j) return g = 0 > T ? f( - T) : -f(T),
                z = 2 * g - a / 3,
                b = -g - a / 3,
                [z, b].filter(s);
                var P = u(j);
                return g = f( - T + P),
                d = f(T + P),
                [g - d - a / 3].filter(s)
            },
            droots: function(t) {
                if (3 === t.length) {
                    var n = t[0],
                    r = t[1],
                    i = t[2],
                    e = n - 2 * r + i;
                    if (0 !== e) {
                        var o = -u(r * r - n * i),
                        s = -n + r,
                        a = -(o + s) / e,
                        f = -( - o + s) / e;
                        return [a, f]
                    }
                    return r !== i && 0 === e ? [(2 * r - i) / (2 * (r - i))] : []
                }
                if (2 === t.length) {
                    var n = t[0],
                    r = t[1];
                    return n !== r ? [n / (n - r)] : []
                }
            },
            inflections: function(t) {
                if (t.length < 4) return [];
                var n = p.align(t, {
                    p1: t[0],
                    p2: t.slice( - 1)[0]
                }),
                r = n[2].x * n[1].y,
                i = n[3].x * n[1].y,
                e = n[1].x * n[2].y,
                o = n[3].x * n[2].y,
                s = 18 * ( - 3 * r + 2 * i + 3 * e - o),
                u = 18 * (3 * r - i - 3 * e),
                a = 18 * (e - r);
                if (p.approximately(s, 0)) return [];
                var f = u * u - 4 * s * a,
                c = Math.sqrt(f),
                o = 2 * s;
                return p.approximately(o, 0) ? [] : [(c - u) / o, -(u + c) / o].filter(function(t) {
                    return t >= 0 && 1 >= t
                })
            },
            bboxoverlap: function(t, r) {
                var i, e, o, s, u, a = ["x", "y"],
                f = a.length;
                for (i = 0; f > i; i++) if (e = a[i], o = t[e].mid, s = r[e].mid, u = (t[e].size + r[e].size) / 2, n(o - s) >= u) return ! 1;
                return ! 0
            },
            expandbox: function(t, n) {
                n.x.min < t.x.min && (t.x.min = n.x.min),
                n.y.min < t.y.min && (t.y.min = n.y.min),
                n.z && n.z.min < t.z.min && (t.z.min = n.z.min),
                n.x.max > t.x.max && (t.x.max = n.x.max),
                n.y.max > t.y.max && (t.y.max = n.y.max),
                n.z && n.z.max > t.z.max && (t.z.max = n.z.max),
                t.x.mid = (t.x.min + t.x.max) / 2,
                t.y.mid = (t.y.min + t.y.max) / 2,
                t.z && (t.z.mid = (t.z.min + t.z.max) / 2),
                t.x.size = t.x.max - t.x.min,
                t.y.size = t.y.max - t.y.min,
                t.z && (t.z.size = t.z.max - t.z.min)
            },
            pairiteration: function(t, n, r) {
                var i = t.bbox(),
                e = n.bbox(),
                o = 1e5,
                s = r || .5;
                if (i.x.size + i.y.size < s && e.x.size + e.y.size < s) return [(o * (t._t1 + t._t2) / 2 | 0) / o + "/" + (o * (n._t1 + n._t2) / 2 | 0) / o];
                var u = t.split(.5),
                a = n.split(.5),
                f = [{
                    left: u.left,
                    right: a.left
                },
                {
                    left: u.left,
                    right: a.right
                },
                {
                    left: u.right,
                    right: a.right
                },
                {
                    left: u.right,
                    right: a.left
                }];
                f = f.filter(function(t) {
                    return p.bboxoverlap(t.left.bbox(), t.right.bbox())
                });
                var c = [];
                return 0 === f.length ? c: (f.forEach(function(t) {
                    c = c.concat(p.pairiteration(t.left, t.right, s))
                }), c = c.filter(function(t, n) {
                    return c.indexOf(t) === n
                }))
            },
            getccenter: function(t, n, r) {
                var o, u = n.x - t.x,
                a = n.y - t.y,
                f = r.x - n.x,
                c = r.y - n.y,
                y = u * i(x) - a * e(x),
                l = u * e(x) + a * i(x),
                v = f * i(x) - c * e(x),
                d = f * e(x) + c * i(x),
                m = (t.x + n.x) / 2,
                g = (t.y + n.y) / 2,
                z = (n.x + r.x) / 2,
                b = (n.y + r.y) / 2,
                _ = m + y,
                w = g + l,
                E = z + v,
                S = b + d,
                M = p.lli8(m, g, _, w, z, b, E, S),
                k = p.dist(M, t),
                O = s(t.y - M.y, t.x - M.x),
                T = s(n.y - M.y, n.x - M.x),
                j = s(r.y - M.y, r.x - M.x);
                return j > O ? ((O > T || T > j) && (O += h), O > j && (o = j, j = O, O = o)) : T > j && O > T ? (o = j, j = O, O = o) : j += h,
                M.s = O,
                M.e = j,
                M.r = k,
                M
            }
        };
        t.exports = p
    } ()
},
function(t, n, r) {
    "use strict"; !
    function() {
        var n = r(2),
        i = function(t) {
            this.curves = [],
            this._3d = !1,
            t && (this.curves = t, this._3d = this.curves[0]._3d)
        };
        i.prototype = {
            valueOf: function() {
                return this.toString()
            },
            toString: function() {
                return n.pointsToString(this.points)
            },
            addCurve: function(t) {
                this.curves.push(t),
                this._3d = this._3d || t._3d
            },
            length: function() {
                return this.curves.map(function(t) {
                    return t.length()
                }).reduce(function(t, n) {
                    return t + n
                })
            },
            curve: function(t) {
                return this.curves[t]
            },
            bbox: function e() {
                for (var t = this.curves,
                e = t[0].bbox(), r = 1; r < t.length; r++) n.expandbox(e, t[r].bbox());
                return e
            },
            offset: function o(t) {
                var o = [];
                return this.curves.forEach(function(n) {
                    o = o.concat(n.offset(t))
                }),
                new i(o)
            }
        },
        t.exports = i
    } ()
}]);
