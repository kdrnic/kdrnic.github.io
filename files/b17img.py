#!/usr/bin/env python3
"""Decode a B-17 Flying Fortress bitmap resource (bmap*) to PNG.

Decompression is left to the game's own routines: this drives XTRACT.EXE
(published with the article) inside a headless DOSBox-X, so all four
decompression variants stay bit-exact.  Everything else is stdlib only.

The container is documented in b17bmap.txt next to this file; the short
version:

    0x00 word  width            0x02 word  height
    0x09 byte  format byte      0x0E word  payload length
    0x14 ...   payload

The payload is a row-major sequence of [skip][count][bytes] runs.  `skip`
transparent pixels are followed by one `count` byte and `count` bytes of pixel
data - except when the skip alone reaches the right edge, in which case the
row ends there and no count byte follows.

The bytes of a run are per VGA plane, not per pixel: a run of N pixels
starting at x is split into four chunks, written in plane order starting at
plane (x & 3), with size (N + 3 - i) / 4 at offset (x + i) / 4.  Therefore
byte b of plane p is the palette index of pixel 4*b + p:

    pixel(x) = plane[x & 3][x >> 2]

Palette resources are a short header plus 256 RGB triples in 6-bit VGA format
(the colour block is the last 768 bytes).  Raw sprites (sprt*) share the same
header front but use a 16-byte header, format byte 0x02, and store
width * height palette indices without any run encoding.

Example:
    python3 b17img.py bmapdeaduk --scale 2
    python3 b17img.py sprtb17over --palette sprtb17pal
"""
import argparse
import os
import shutil
import struct
import subprocess
import sys
import zlib

IDX_FILES_OFF = 0x10   # file name table
IDX_FILE_LEN = 0x50
IDX_NFILES = 28
IDX_RES_OFF = 0x8D4    # resource entry table: name[12], file, algo, off32, len16, raw16
IDX_RES_LEN = 0x16

CONF = """[sdl]
fullscreen=false
windowresolution=640x400
output=surface
autolock=false

[dosbox]
machine=svga_s3
memsize=16
cputype=auto
cycles=fixed 12000

[cpu]
core=auto

[mixer]
nosound=true

[autoexec]
mount c "{dosdir}"
c:
{cmd}
exit
"""


def parse_index(path):
    """Return {name: {file, algo, offset, stored, raw}} from _INDEX."""
    d = open(path, "rb").read()
    files = [d[IDX_FILES_OFF + i * IDX_FILE_LEN:
                IDX_FILES_OFF + (i + 1) * IDX_FILE_LEN].split(b"\x00")[0]
             .decode("latin-1") for i in range(IDX_NFILES)]
    res = {}
    off = IDX_RES_OFF
    while off + IDX_RES_LEN <= len(d):
        name = d[off:off + 12].decode("latin-1").rstrip()
        if not name:
            break
        fileid, algo = d[off + 12], d[off + 13]
        roff, stored, raw = struct.unpack_from("<IHH", d, off + 14)
        res[name] = {
            "file": files[fileid - 1] if 1 <= fileid <= IDX_NFILES else None,
            "algo": algo, "offset": roff, "stored": stored, "raw": raw,
        }
        off += IDX_RES_LEN
    return res


def run_xtract(resource, outname, game, work, dosbox, xtract_exe):
    """Decompress `resource` with XTRACT inside headless DOSBox-X."""
    dosdir = os.path.join(work, "dos")
    os.makedirs(dosdir, exist_ok=True)

    # stage the files the DOS program needs
    shutil.copy(os.path.join(game, "_INDEX"), os.path.join(dosdir, "_INDEX"))
    shutil.copy(xtract_exe, os.path.join(dosdir, "xtract.exe"))

    entry = parse_index(os.path.join(game, "_INDEX"))[resource]
    datafile = entry["file"]
    for candidate in (datafile.upper(), datafile, datafile.lower()):
        src = os.path.join(game, candidate)
        if os.path.exists(src):
            shutil.copy(src, os.path.join(dosdir, os.path.basename(candidate).upper()))
            break
    else:
        raise SystemExit(f"data file {datafile!r} not found in {game}")

    conf = os.path.join(work, "xtract.conf")
    with open(conf, "w") as f:
        f.write(CONF.format(dosdir=dosdir,
                            cmd=f"xtract {resource} {outname}"))

    # SDL's dummy driver keeps DOSBox-X from opening a window (or needing X11)
    env = dict(os.environ, SDL_VIDEODRIVER="dummy")
    subprocess.run([dosbox, "-conf", conf, "-exit"], env=env,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                   check=False)

    out = os.path.join(dosdir, outname.upper())
    if not os.path.exists(out):
        out = os.path.join(dosdir, outname)
    if not os.path.exists(out):
        raise SystemExit(f"XTRACT failed for {resource}")
    return out


def decode_bitmap(blob):
    """Return (width, height, [rowbytes]) for a decompressed bitmap resource."""
    width, height = struct.unpack_from("<HH", blob, 0)
    payload = struct.unpack_from("<H", blob, 0x0E)[0]
    if blob[9] == 0x40 or (blob[9] == 0x81 and payload == 0):
        raise SystemExit("resource is a palette, not a bitmap")

    if blob[9] & 0x02:
        # sprt: 16-byte header, one palette index per pixel, no run encoding
        pos = 0x10
        if len(blob) != pos + width * height:
            print(f"warning: {len(blob)} bytes for {width}x{height} raw",
                  file=sys.stderr)
        return width, height, [blob[pos + y * width:pos + (y + 1) * width]
                               for y in range(height)]

    if width % 4:
        raise SystemExit(f"unsupported width {width}: not a multiple of 4")
    plane_w = width // 4

    pos = 0x14
    rows = []
    for _ in range(height):
        planes = [bytearray(plane_w) for _ in range(4)]
        x = 0
        while x < width:
            skip = blob[pos]
            pos += 1
            # skipped pixels are transparent: the blitter does not write them
            x += skip
            if x >= width:
                # trailing transparency: the row ends after the skip, and the
                # next byte already belongs to the next row (no count byte)
                break
            count = blob[pos]
            pos += 1
            for i in range(4):
                plane = (x + i) & 3
                size = (count + 3 - i) // 4
                off = (x + i) >> 2
                planes[plane][off:off + size] = blob[pos:pos + size]
                pos += size
            x += count
        rows.append(bytes(planes[x & 3][x >> 2] for x in range(width)))

    if pos != len(blob):
        print(f"warning: consumed {pos} of {len(blob)} bytes", file=sys.stderr)
    return width, height, rows


def decode_palette(blob):
    """Return 256 (r, g, b) tuples from a decompressed palette resource.

    Palettes are a short header followed by 768 colour bytes (256 triples in
    6-bit VGA format).  The header differs between families - 24 bytes for
    bmap palettes, 20 for sprt palettes - so take the colour block from the
    end of the resource.
    """
    if len(blob) < 768 + 16:
        raise SystemExit(f"palette resource too short ({len(blob)} bytes)")
    body = blob[len(blob) - 768:]
    return [(body[3 * i] * 255 // 63,
             body[3 * i + 1] * 255 // 63,
             body[3 * i + 2] * 255 // 63) for i in range(256)]


def write_png(path, width, height, rows, colors, scale=1):
    """Write an 8-bit RGB PNG without third-party modules."""
    raw = bytearray()
    for row in rows:
        line = bytearray()
        for idx in row:
            line += bytes(colors[idx]) * scale
        for _ in range(scale):
            raw.append(0)          # filter type 0
            raw += line

    def chunk(tag, data):
        body = tag + data
        return (struct.pack(">I", len(data)) + body
                + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF))

    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", struct.pack(">IIBBBBB", width * scale,
                                        height * scale, 8, 2, 0, 0, 0))
           + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
           + chunk(b"IEND", b""))
    open(path, "wb").write(png)


def guess_palette(name, resources):
    """bmapdeaduk -> bmapdukpal, sprtb17over -> sprtb17pal, ..."""
    stems = []
    if name.startswith("bmapdead"):
        stems.append("bmapd" + name[len("bmapdead"):])
    if name.startswith("bmap"):
        stems.append(name[len("bmap"):])
    stems.append(name)
    for stem in stems:
        for candidate in (stem + "pal", "bmap" + stem + "pal"):
            if candidate in resources:
                return candidate
    # longest prefix that names a palette, e.g. sprtnav1ok -> sprtnavpal
    for end in range(len(name) - 1, 3, -1):
        candidate = name[:end] + "pal"
        if candidate in resources:
            return candidate
    return None


def main():
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("resource", help="bitmap resource name, e.g. bmapdeaduk")
    ap.add_argument("--palette", help="palette resource name (default: guessed)")
    ap.add_argument("--out", help="output PNG (default: <resource>.png)")
    ap.add_argument("--scale", type=int, default=1, help="integer upscale")
    ap.add_argument("--game", default=os.environ.get("B17_GAME", "GAME"),
                    help="game data directory holding _INDEX (default: ./GAME)")
    ap.add_argument("--work", default=os.environ.get("B17_WORK", "work"),
                    help="scratch directory (default: ./work)")
    ap.add_argument("--dosbox", default=os.environ.get("DOSBOX", "dosbox-x"),
                    help="DOSBox-X executable (default: $DOSBOX or dosbox-x)")
    ap.add_argument("--xtract", default=os.environ.get("XTRACT"),
                    help="XTRACT.EXE path (default: ./xtract.exe or "
                         "work/xtract/xtract.exe)")
    ap.add_argument("--keep", action="store_true",
                    help="keep the decompressed .bin files in the work dir")
    args = ap.parse_args()

    xtract_exe = args.xtract
    for candidate in (xtract_exe,
                      os.path.join(args.work, "xtract", "xtract.exe"),
                      "xtract.exe"):
        if candidate and os.path.exists(candidate):
            xtract_exe = candidate
            break
    else:
        raise SystemExit("XTRACT.EXE not found; pass --xtract")

    resources = parse_index(os.path.join(args.game, "_INDEX"))
    if args.resource not in resources:
        raise SystemExit(f"resource {args.resource!r} is not in _INDEX")
    entry = resources[args.resource]
    print(f"{args.resource}: file={entry['file']} algo={entry['algo']} "
          f"offset={entry['offset']} stored={entry['stored']} raw={entry['raw']}")

    palette = args.palette or guess_palette(args.resource, resources)
    if not palette or palette not in resources:
        raise SystemExit("cannot guess the palette resource; pass --palette")
    print(f"palette: {palette}")

    bitmap = open(run_xtract(args.resource, "res.bin", args.game, args.work,
                             args.dosbox, xtract_exe), "rb").read()
    palblob = open(run_xtract(palette, "pal.bin", args.game, args.work,
                              args.dosbox, xtract_exe), "rb").read()

    width, height, rows = decode_bitmap(bitmap)
    colors = decode_palette(palblob)

    out = args.out or f"{args.resource}.png"
    write_png(out, width, height, rows, colors, args.scale)
    print(f"wrote {out} ({width}x{height}"
          f"{' x%d' % args.scale if args.scale > 1 else ''})")

    if not args.keep:
        for name in ("res.bin", "pal.bin"):
            path = os.path.join(args.work, "dos", name)
            if os.path.exists(path):
                os.remove(path)


if __name__ == "__main__":
    main()
