#!/usr/bin/env python3
"""Decode a B-17 Flying Fortress shape resource (shpe*) to PNG.

Works on a resource that XTRACT.EXE has already decompressed, the same
step b17img.py performs for bmap/sprt:

    xtract shpecube R0000.BIN

A shape is a bytecode display list, not a bitmap.  The header is tiny and
the game's loader (file offset 0x153A2 in B17.EXE) reads only three words:

    0x00  word  magic, 0x1234 (0x5678 selects the alternate form)
    0x02  word  primary display-list offset
    0x04  word  alternate display-list offset (used when [0x1286] == 0xFF)

The dispatch loop at 0x153D9 is

    bl = es:[di]
    bh = 0
    di += 1
    call word [bx + 0x17DE]

with a 57-entry table of near pointers at DS:0x17DE (file 0x4FDE).  Because
the table is word-indexed the stream stores 2*opcode, so entry N serves
byte 2N: 0x00, 0x02, ... 0x70.

This script walks the primary list, reconstructs the vertices produced by
the box and vertex-construction opcodes, collects the 0x00 polygons, and
renders the result with a simple isometric projection.  It is a static
read of the local frame; the game rotates the corner set by the object's
current orientation before drawing.

Usage:
    python3 b17shpe.py shpecube.bin
    python3 b17shpe.py shpefw190.bin --png shpefw190.png --size 900

Standard library only.
"""

import math
import struct
import sys
import zlib

# ------------------------------------------------------------------ header

def u16(b, o):
    return struct.unpack_from("<H", b, o)[0]


def s16(b, o):
    return struct.unpack_from("<h", b, o)[0]


def parse_header(b):
    return {"magic": u16(b, 0), "primary": u16(b, 2), "alternate": u16(b, 4)}


# ----------------------------------------------------------------- opcodes

# operand bytes for the simple "read N and continue" handlers
FIXED = {
    0x08: 2, 0x0A: 6, 0x0C: 12, 0x0E: 4, 0x10: 4, 0x12: 2,
    0x1A: 0, 0x1C: 0, 0x1E: 2, 0x20: 2, 0x22: 2, 0x24: 6,
    0x28: 6, 0x2A: 6, 0x2C: 6, 0x30: 6, 0x32: 6, 0x34: 0,
    0x36: 0, 0x3A: 12, 0x3C: 4, 0x3E: 4, 0x42: 9, 0x44: 19,
    0x46: 2, 0x48: 2, 0x4A: 6, 0x4C: 4, 0x4E: 6, 0x50: 6,
    0x52: 14, 0x54: 24, 0x5E: 12, 0x60: 6, 0x62: 6, 0x64: 6,
    0x66: 6, 0x68: 5, 0x6A: 4, 0x6C: 4, 0x6E: 0, 0x70: 0,
}

GOTO = {0x02, 0x2E}       # di = operand_start + signed word
CALL = 0x04
RET, END, EXIT = 0x06, 0x38, 0x5C
END_NAMES = {RET: "RET", END: "END", EXIT: "EXIT"}

# 0x14 vertex-construction items.  The selector byte is indexed straight
# into cs:[si+0x2D43], so it is 2*subop:
#   0x00 copy      dest = src1                   5 bytes
#   0x02 midpoint  dest = (src1 + src2) / 2      7
#   0x04 add       dest = src1 + src2            7
#   0x06 subtract  dest = src1 - src2            7
#   0x08 negate    dest = -src1                  5
#   0x0A transform dest = M * (src1, src2, src3) 9
SEL_LEN = {0x00: 5, 0x02: 7, 0x04: 7, 0x06: 7, 0x08: 5, 0x0A: 9}
SEL_NAME = {0x00: "copy", 0x02: "mid", 0x04: "add", 0x06: "sub",
            0x08: "neg", 0x0A: "xform"}

# eight corner slots written by the single-box form of 0x0C / 0x3A
CORNERS = {
    0x10: (-1, +1, -1), 0x20: (+1, +1, -1),
    0x30: (+1, -1, -1), 0x40: (-1, -1, -1),
    0x50: (-1, +1, +1), 0x60: (+1, +1, +1),
    0x70: (+1, -1, +1), 0x80: (-1, -1, +1),
}


def decode(b, start, max_ops=20000):
    """Yield (offset, opcode, operand_bytes, note) along the display list.

    CALL/RET are followed, and a block reached twice is not expanded again.
    """
    p, stack, done, n = start, [], set(), 0
    while 0 <= p < len(b) and n < max_ops:
        if p in done:
            yield p, None, b"", "seen (loop/call)"
            return
        done.add(p)
        n += 1
        op = b[p]
        if op & 1 or (op >> 1) > 56:
            yield p, op, b"", "INVALID"
            return
        if op in END_NAMES:
            if op == RET and stack:
                ret = stack.pop()
                yield p, op, b"", "RET -> %#x" % ret
                p = ret
                continue
            yield p, op, b"", END_NAMES[op]
            return
        if op == 0x00:
            if p + 8 > len(b):
                yield p, op, b"", "0x00 truncated"
                return
            count = b[p + 7]
            ln = 1 + 8 + 2 * count
            yield p, op, b[p + 1:p + ln], "face count=%d attr=%#x" % (
                count, b[p + 8])
            p += ln
            continue
        if op == 0x14:
            cnt = u16(b, p + 1)
            q = p + 3
            items = []
            for _ in range(cnt):
                if q >= len(b):
                    break
                sel = b[q]
                ln = SEL_LEN.get(sel)
                if ln is None:
                    yield p, op, b[p + 1:q + 1], "0x14 selector %#x" % sel
                    return
                dst = u16(b, q + 1)
                args = [u16(b, q + 3 + 2 * i) for i in range((ln - 3) // 2)]
                items.append((sel, dst, args))
                q += ln
            yield p, op, b[p + 1:q], "0x14 count=%d %s" % (
                cnt, " | ".join("%s d=%#x %s" % (
                    SEL_NAME.get(s, "?"), d,
                    " ".join("%#x" % a for a in args))
                    for s, d, args in items))
            p = q
            continue
        if op == 0x16:
            cnt = u16(b, p + 1)
            ln = 1 + 4 + 6 * cnt
            yield p, op, b[p + 1:p + ln], "normals count=%d base=%#x" % (
                cnt, u16(b, p + 3))
            p += ln
            continue
        if op == 0x18:
            cnt = u16(b, p + 1)
            q = p + 3
            for _ in range(cnt):
                if q + 2 > len(b):
                    break
                q += 6 if s16(b, q) > 0 else 4
            yield p, op, b[p + 1:q], "face-list count=%d" % cnt
            p = q
            continue
        if op == 0x26:
            cnt = u16(b, p + 1)
            ln = 1 + 2 + 4 * cnt
            yield p, op, b[p + 1:p + ln], "lod-table count=%d" % cnt
            p += ln
            continue
        if op == CALL:
            off = s16(b, p + 1)
            dest = p + 1 + off
            if dest in done:
                yield p, op, b[p + 1:p + 3], "call %#x (seen)" % dest
                p += 3
                continue
            yield p, op, b[p + 1:p + 3], "call %#x" % dest
            stack.append(p + 3)
            p = dest
            continue
        if op in GOTO:
            off = s16(b, p + 1)
            dest = p + 1 + off
            if dest in done:
                yield p, op, b[p + 1:p + 3], "goto %#x (seen)" % dest
                return
            yield p, op, b[p + 1:p + 3], "goto %#x" % dest
            p = dest
            continue
        if op in (0x6A, 0x6C):
            w0, w1 = u16(b, p + 1), u16(b, p + 3)
            dest = max(w0, w1)
            yield p, op, b[p + 1:p + 5], "loop %#x/%#x" % (w0, w1)
            if dest in done:
                return
            p = dest
            continue
        if op in FIXED:
            ln = 1 + FIXED[op]
            yield p, op, b[p + 1:p + ln], ""
            p += ln
            continue
        yield p, op, b"", "UNKNOWN size"
        return
    yield p, None, b"", "limit"


# -------------------------------------------------------- reconstruction

def parse(b, start):
    """Return (vertices, faces, boxes, edges).

    vertices: offset -> (x, y, z)
    faces:    list of (vertex-offset list, attribute byte)
    boxes:    list of (count, ex, ey, ez, base, stride)
    edges:    list of (vertex, vertex) segments from 0x18
    """
    verts = {0x0000: (0, 0, 0)}
    faces, boxes, edges = [], [], []
    p, stack, done, steps = start, [], set(), 0
    while 0 <= p < len(b) and steps < 100000:
        steps += 1
        if p in done:
            if stack:
                p = stack.pop()
                continue
            break
        done.add(p)
        op = b[p]
        if op in (RET, END, EXIT):
            if stack:
                p = stack.pop()
                continue
            break
        if op in (0x0C, 0x3A):
            cnt, ex, ey, ez, base, stride = struct.unpack_from(
                "<Hhhhhh", b, p + 1)
            boxes.append((cnt, ex, ey, ez, base, stride))
            # Only count==1/base==0/stride==0x10 writes the eight corner
            # slots +0x10..+0x80; the count>1 form is a different draw path.
            if cnt == 1 and base == 0 and stride == 0x10:
                for off, (sx, sy, sz) in CORNERS.items():
                    verts[off] = (sx * ex, sy * ey, sz * ez)
            p += 13
            continue
        if op == 0x14:
            cnt = u16(b, p + 1)
            q = p + 3
            for _ in range(cnt):
                sel = b[q]
                ln = SEL_LEN.get(sel)
                if ln is None:
                    p = len(b)
                    break
                dst = u16(b, q + 1)
                a = u16(b, q + 3) if ln >= 5 else None
                c = u16(b, q + 5) if ln >= 7 else None
                va = verts.get(a)
                if sel == 0x00 and va is not None:
                    verts[dst] = va
                elif sel in (0x02, 0x04, 0x06) and va is not None and c in verts:
                    vc = verts[c]
                    if sel == 0x02:
                        verts[dst] = tuple((va[i] + vc[i]) // 2
                                           for i in range(3))
                    elif sel == 0x04:
                        verts[dst] = tuple(va[i] + vc[i] for i in range(3))
                    else:
                        verts[dst] = tuple(va[i] - vc[i] for i in range(3))
                elif sel == 0x08 and va is not None:
                    verts[dst] = tuple(-va[i] for i in range(3))
                q += ln
            p = q
            continue
        if op == 0x00:
            cnt = b[p + 7]
            offs = [u16(b, p + 9 + 2 * i) for i in range(cnt)]
            faces.append((offs, b[p + 8]))
            p += 1 + 8 + 2 * cnt
            continue
        if op == CALL:
            dest = p + 1 + s16(b, p + 1)
            if dest in done:
                p += 3
            else:
                stack.append(p + 3)
                p = dest
            continue
        if op in GOTO:
            dest = p + 1 + s16(b, p + 1)
            if dest in done:
                if stack:
                    p = stack.pop()
                else:
                    break
            else:
                p = dest
            continue
        if op in (0x6A, 0x6C):
            p = max(u16(b, p + 1), u16(b, p + 3))
            continue
        if op == 0x16:
            p += 1 + 4 + 6 * u16(b, p + 1)
            continue
        if op == 0x18:
            cnt = u16(b, p + 1)
            q = p + 3
            for _ in range(cnt):
                if q + 2 > len(b):
                    break
                w = s16(b, q)
                if w > 0:
                    if q + 6 <= len(b):
                        edges.append((u16(b, q + 2), u16(b, q + 4)))
                    q += 6
                else:
                    q += 4
            p = q
            continue
        if op == 0x26:
            p += 1 + 2 + 4 * u16(b, p + 1)
            continue
        if op in FIXED:
            p += 1 + FIXED[op]
            continue
        break
    return verts, faces, boxes, edges


# -------------------------------------------------------------- rendering

def write_png(path, w, h, rows):
    raw = bytearray()
    for row in rows:
        raw.append(0)
        for r, g, bl in row:
            raw += bytes((r, g, bl))
    comp = zlib.compress(bytes(raw), 9)

    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data +
                struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
    png += chunk(b"IDAT", comp)
    png += chunk(b"IEND", b"")
    open(path, "wb").write(png)


def render(verts, faces, boxes, edges=(), size=600):
    W = H = size
    rows = [[(12, 12, 18)] * W for _ in range(H)]

    allpts = {k: v for k, v in verts.items() if k != 0x1FE}
    used = set()
    for offs, _ in faces:
        used.update(offs)
    for a, c in edges:
        used.update((a, c))
    for base, stride, cnt in ((bx[4], bx[5], bx[0]) for bx in boxes or []):
        if cnt == 1 and base == 0 and stride == 0x10:
            used.update(CORNERS)
    used &= set(allpts)
    pts = {k: allpts[k] for k in used} if used else allpts
    if not pts:
        return rows

    # +x right, +y up, +z along the model's long axis.  Put the long axis
    # horizontal so aircraft read nose-left/right instead of nose-up.
    def remap(v):
        x, y, z = v
        return (z, y, x)

    vp = {k: remap(v) for k, v in pts.items()}

    def flat(v):
        X, Y, Z = v
        return ((X - Z) * 0.8660254, (X + Z) * 0.5 - Y, X + Y + Z)

    flatpts = {k: flat(v) for k, v in vp.items()}
    xs = [p[0] for p in flatpts.values()]
    ys = [p[1] for p in flatpts.values()]
    margin = 0.08
    scale = min(W * (1 - 2 * margin) / ((max(xs) - min(xs)) or 1),
                H * (1 - 2 * margin) / ((max(ys) - min(ys)) or 1))
    cx = (max(xs) + min(xs)) / 2
    cy = (max(ys) + min(ys)) / 2

    def project(k):
        px, py, _ = flatpts[k]
        return ((px - cx) * scale + W / 2, (py - cy) * scale + H / 2)

    def fill_poly(poly, color):
        if len(poly) < 3:
            return
        minx = max(0, int(min(p[0] for p in poly)))
        maxx = min(W - 1, int(max(p[0] for p in poly)) + 1)
        miny = max(0, int(min(p[1] for p in poly)))
        maxy = min(H - 1, int(max(p[1] for p in poly)) + 1)
        for y in range(miny, maxy + 1):
            for x in range(minx, maxx + 1):
                inside, j = False, len(poly) - 1
                for i in range(len(poly)):
                    xi, yi = poly[i]
                    xj, yj = poly[j]
                    if (yi > y) != (yj > y):
                        if x < (xj - xi) * (y - yi) / (yj - yi) + xi:
                            inside = not inside
                    j = i
                if inside:
                    rows[y][x] = color

    def line(a, b, color):
        x0, y0 = a
        x1, y1 = b
        dx, dy = abs(x1 - x0), -abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx + dy
        while True:
            ix, iy = int(x0), int(y0)
            if 0 <= ix < W and 0 <= iy < H:
                rows[iy][ix] = color
            if abs(x0 - x1) < 1 and abs(y0 - y1) < 1:
                break
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                x0 += sx
            if e2 <= dx:
                err += dx
                y0 += sy

    light = (0.35, 0.55, 0.76)
    polys = []
    for offs, attr in faces:
        if any(o not in pts for o in offs):
            continue
        poly = [project(o) for o in offs]
        depth = sum(flatpts[o][2] for o in offs) / len(offs)
        nrm = None
        for i in range(1, len(offs) - 1):
            a, c, e = vp[offs[0]], vp[offs[i]], vp[offs[i + 1]]
            u = [c[k] - a[k] for k in range(3)]
            w = [e[k] - a[k] for k in range(3)]
            n = [u[1] * w[2] - u[2] * w[1],
                 u[2] * w[0] - u[0] * w[2],
                 u[0] * w[1] - u[1] * w[0]]
            m = math.sqrt(sum(t * t for t in n))
            if m > 1e-6:
                nrm = [t / m for t in n]
                break
        polys.append((depth, poly, nrm))
    polys.sort(key=lambda t: t[0])

    for _, poly, nrm in polys:
        lit = abs(sum(nrm[k] * light[k] for k in range(3))) if nrm else 0.5
        base = int(45 + 185 * lit)
        fill_poly(poly, (base, base, min(255, base + 12)))
    for _, poly, _ in polys:
        for i in range(len(poly)):
            line(poly[i], poly[(i + 1) % len(poly)], (235, 235, 235))

    # 0x18 edge lists: the wireframe detail (window frames, railings, ...)
    for a, c in edges:
        if a in pts and c in pts:
            line(project(a), project(c), (120, 150, 205))

    # A shape with no polygons (shpecube) still shows its generated box.
    if not polys:
        for cnt, ex, ey, ez, base, stride in boxes:
            if not (cnt == 1 and base == 0 and stride == 0x10):
                continue
            corners = list(CORNERS)
            for i in range(len(corners)):
                for j in range(i + 1, len(corners)):
                    a, c = CORNERS[corners[i]], CORNERS[corners[j]]
                    if sum(1 for k in range(3) if a[k] != c[k]) == 1:
                        if corners[i] in pts and corners[j] in pts:
                            line(project(corners[i]),
                                 project(corners[j]), (255, 220, 120))
    return rows


# --------------------------------------------------------------------- cli

def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    path = argv[1]
    out = None
    size = 700
    if "--png" in argv:
        out = argv[argv.index("--png") + 1]
    if "--size" in argv:
        size = int(argv[argv.index("--size") + 1])

    b = open(path, "rb").read()
    h = parse_header(b)
    print("%s  %d bytes  magic=%#06x  primary=%#x  alternate=%#x" %
          (path, len(b), h["magic"], h["primary"], h["alternate"]))
    if h["magic"] not in (0x1234, 0x5678):
        print("not a shape (magic is neither 0x1234 nor 0x5678)")
        return 1

    verts, faces, boxes, edges = parse(b, h["primary"])
    print("%d vertices, %d faces, %d box primitives, %d edges" %
          (len(verts), len(faces), len(boxes), len(edges)))
    for cnt, ex, ey, ez, base, stride in boxes:
        print("  box count=%d ext=(%d,%d,%d) base=%#x stride=%#x" %
              (cnt, ex, ey, ez, base, stride))

    if out:
        write_png(out, size, size, render(verts, faces, boxes, edges, size))
        print("wrote", out)
    else:
        for off, op, raw, note in decode(b, h["primary"]):
            if op is None:
                print("  %04x  ---- %s" % (off, note))
            else:
                print("  %04x  %02x  %-42s %s" %
                      (off, op, raw.hex(" "), note))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
