import React, { useRef, useEffect, useState } from "react";

const ACCENT = "#78DC64";
const A = [120, 220, 100]; // accent RGB

const HQ = { lat: 33.5731, lng: -7.5898, name: "dB PROD·FACTORY", city: "Casablanca", country: "Maroc" };

// ── City / country geocoding lookup ──────────────────────────────────────────
const CITIES = {
  "paris": [48.85, 2.35], "marseille": [43.30, 5.37], "lyon": [45.75, 4.83],
  "toulouse": [43.60, 1.44], "nice": [43.71, 7.26], "bordeaux": [44.84, -0.58],
  "nantes": [47.22, -1.55], "strasbourg": [48.57, 7.75], "lille": [50.63, 3.06],
  "rennes": [48.11, -1.68], "grenoble": [45.19, 5.72], "montpellier": [43.61, 3.87],
  "london": [51.51, -0.12], "manchester": [53.48, -2.24], "birmingham": [52.49, -1.90],
  "edinburgh": [55.95, -3.19], "glasgow": [55.86, -4.26],
  "new york": [40.71, -74.00], "los angeles": [34.05, -118.24], "chicago": [41.88, -87.63],
  "houston": [29.76, -95.37], "miami": [25.77, -80.20], "san francisco": [37.77, -122.42],
  "seattle": [47.61, -122.33], "boston": [42.36, -71.06], "dallas": [32.78, -96.80],
  "atlanta": [33.75, -84.39], "denver": [39.74, -104.98], "las vegas": [36.17, -115.14],
  "washington": [38.91, -77.04], "washington dc": [38.91, -77.04],
  "toronto": [43.65, -79.38], "montreal": [45.50, -73.57], "vancouver": [49.25, -123.12],
  "calgary": [51.05, -114.07], "ottawa": [45.42, -75.69],
  "casablanca": [33.57, -7.59], "rabat": [34.02, -6.84], "marrakech": [31.63, -8.00],
  "fes": [34.04, -5.00], "tanger": [35.76, -5.80], "agadir": [30.42, -9.60],
  "algiers": [36.74, 3.06], "oran": [35.70, -0.63],
  "tunis": [36.82, 10.18], "sfax": [34.74, 10.76],
  "cairo": [30.04, 31.24], "alexandria": [31.20, 29.92],
  "dubai": [25.20, 55.27], "abu dhabi": [24.47, 54.37], "sharjah": [25.35, 55.40],
  "riyadh": [24.69, 46.72], "jeddah": [21.54, 39.17], "dammam": [26.43, 50.10],
  "doha": [25.28, 51.53], "kuwait city": [29.37, 47.98], "muscat": [23.61, 58.59],
  "beirut": [33.89, 35.50], "amman": [31.96, 35.95], "tel aviv": [32.09, 34.79],
  "istanbul": [41.01, 28.95], "ankara": [39.93, 32.86], "izmir": [38.42, 27.14],
  "berlin": [52.52, 13.40], "munich": [48.14, 11.58], "hamburg": [53.55, 10.00],
  "frankfurt": [50.11, 8.68], "cologne": [50.94, 6.96], "stuttgart": [48.78, 9.18],
  "madrid": [40.42, -3.70], "barcelona": [41.39, 2.17], "valencia": [39.47, -0.38],
  "seville": [37.39, -5.99], "bilbao": [43.26, -2.93],
  "rome": [41.89, 12.48], "milan": [45.46, 9.19], "naples": [40.85, 14.27],
  "turin": [45.07, 7.69], "florence": [43.77, 11.25],
  "amsterdam": [52.37, 4.90], "rotterdam": [51.92, 4.48], "the hague": [52.08, 4.31],
  "brussels": [50.85, 4.35], "antwerp": [51.22, 4.40],
  "zurich": [47.38, 8.54], "geneva": [46.20, 6.15], "bern": [46.95, 7.45],
  "vienna": [48.21, 16.37], "graz": [47.07, 15.44],
  "stockholm": [59.33, 18.07], "gothenburg": [57.71, 11.97],
  "oslo": [59.91, 10.75], "bergen": [60.39, 5.32],
  "copenhagen": [55.68, 12.57], "aarhus": [56.16, 10.21],
  "helsinki": [60.17, 24.94], "tampere": [61.50, 23.77],
  "warsaw": [52.23, 21.01], "krakow": [50.06, 19.94],
  "prague": [50.08, 14.43], "budapest": [47.50, 19.04],
  "bucharest": [44.44, 26.10], "sofia": [42.70, 23.32],
  "athens": [37.98, 23.73], "thessaloniki": [40.64, 22.94],
  "moscow": [55.75, 37.62], "saint petersburg": [59.93, 30.32],
  "kyiv": [50.45, 30.52], "lviv": [49.84, 24.03],
  "mumbai": [19.08, 72.88], "delhi": [28.61, 77.21], "bangalore": [12.97, 77.59],
  "hyderabad": [17.39, 78.49], "chennai": [13.08, 80.27], "kolkata": [22.57, 88.36],
  "pune": [18.52, 73.86], "ahmedabad": [23.03, 72.58],
  "karachi": [24.86, 67.01], "lahore": [31.55, 74.34], "islamabad": [33.72, 73.04],
  "dhaka": [23.81, 90.41], "colombo": [6.93, 79.85], "kathmandu": [27.71, 85.31],
  "beijing": [39.91, 116.39], "shanghai": [31.23, 121.47], "guangzhou": [23.13, 113.27],
  "shenzhen": [22.54, 114.06], "chengdu": [30.57, 104.07], "wuhan": [30.59, 114.31],
  "hong kong": [22.32, 114.17], "macau": [22.20, 113.54],
  "taipei": [25.04, 121.56], "kaohsiung": [22.63, 120.27],
  "seoul": [37.57, 126.98], "busan": [35.10, 129.03],
  "tokyo": [35.69, 139.69], "osaka": [34.69, 135.50], "kyoto": [35.01, 135.77],
  "nagoya": [35.18, 136.91], "fukuoka": [33.59, 130.40], "sapporo": [43.07, 141.35],
  "singapore": [1.35, 103.82], "kuala lumpur": [3.14, 101.69], "johor bahru": [1.47, 103.76],
  "jakarta": [-6.21, 106.85], "surabaya": [-7.25, 112.75], "bandung": [-6.91, 107.61],
  "manila": [14.60, 120.98], "quezon city": [14.68, 121.04], "cebu": [10.31, 123.89],
  "bangkok": [13.75, 100.52], "chiang mai": [18.79, 98.98], "pattaya": [12.93, 100.88],
  "ho chi minh city": [10.82, 106.63], "hanoi": [21.03, 105.85], "da nang": [16.07, 108.22],
  "phnom penh": [11.56, 104.92], "yangon": [16.87, 96.19],
  "sydney": [-33.87, 151.21], "melbourne": [-37.81, 144.96], "brisbane": [-27.47, 153.03],
  "perth": [-31.95, 115.86], "adelaide": [-34.93, 138.60], "canberra": [-35.28, 149.13],
  "auckland": [-36.86, 174.77], "wellington": [-41.29, 174.78], "christchurch": [-43.53, 172.64],
  "dakar": [14.72, -17.47], "abidjan": [5.34, -4.02], "accra": [5.56, -0.20],
  "lagos": [6.52, 3.38], "abuja": [9.07, 7.40], "kano": [12.00, 8.52],
  "nairobi": [1.29, 36.82], "mombasa": [-4.05, 39.67], "kampala": [0.32, 32.58],
  "addis ababa": [9.03, 38.74], "dar es salaam": [-6.79, 39.21],
  "johannesburg": [-26.20, 28.04], "cape town": [-33.92, 18.42], "durban": [-29.86, 31.02],
  "pretoria": [-25.75, 28.19], "harare": [-17.83, 31.05], "lusaka": [-15.42, 28.28],
  "kinshasa": [-4.32, 15.32], "kigali": [-1.94, 30.06],
  "mexico city": [19.43, -99.13], "guadalajara": [20.66, -103.35], "monterrey": [25.67, -100.31],
  "bogota": [4.71, -74.07], "medellin": [6.24, -75.58], "cali": [3.44, -76.52],
  "lima": [-12.05, -77.05], "santiago": [-33.46, -70.65], "buenos aires": [-34.60, -58.38],
  "sao paulo": [-23.55, -46.63], "rio de janeiro": [-22.91, -43.17], "brasilia": [-15.78, -47.93],
  "belo horizonte": [-19.92, -43.94], "salvador": [-12.97, -38.51],
  "caracas": [10.48, -66.88], "bogota": [4.71, -74.07], "quito": [-0.23, -78.52],
  "havana": [23.13, -82.38], "san jose": [9.93, -84.08], "panama city": [8.99, -79.52],
};

const COUNTRIES = {
  "france": [46.23, 2.21], "usa": [37.09, -95.71], "états-unis": [37.09, -95.71],
  "uk": [55.38, -3.44], "united kingdom": [55.38, -3.44], "royaume-uni": [55.38, -3.44],
  "germany": [51.17, 10.45], "allemagne": [51.17, 10.45],
  "spain": [40.46, -3.75], "espagne": [40.46, -3.75],
  "italy": [41.87, 12.57], "italie": [41.87, 12.57],
  "maroc": [31.79, -7.09], "morocco": [31.79, -7.09],
  "uae": [23.42, 53.85], "emirates": [23.42, 53.85], "émirats": [23.42, 53.85],
  "saudi arabia": [23.89, 45.08], "arabie saoudite": [23.89, 45.08],
  "canada": [56.13, -106.35], "australia": [-25.27, 133.78], "australie": [-25.27, 133.78],
  "japan": [36.20, 138.25], "japon": [36.20, 138.25],
  "china": [35.86, 104.20], "chine": [35.86, 104.20],
  "india": [20.59, 78.96], "inde": [20.59, 78.96],
  "brazil": [-14.24, -51.93], "brésil": [-14.24, -51.93],
  "netherlands": [52.13, 5.29], "pays-bas": [52.13, 5.29],
  "belgium": [50.50, 4.47], "belgique": [50.50, 4.47],
  "switzerland": [46.82, 8.23], "suisse": [46.82, 8.23],
  "sweden": [60.13, 18.64], "suède": [60.13, 18.64],
  "norway": [60.47, 8.47], "norvège": [60.47, 8.47],
  "denmark": [56.26, 9.50], "danemark": [56.26, 9.50],
  "poland": [51.92, 19.15], "pologne": [51.92, 19.15],
  "portugal": [39.40, -8.22], "russia": [61.52, 105.32], "russie": [61.52, 105.32],
  "turkey": [38.96, 35.24], "turquie": [38.96, 35.24],
  "egypt": [26.82, 30.80], "égypte": [26.82, 30.80],
  "nigeria": [9.08, 8.68], "south africa": [-30.56, 22.94], "afrique du sud": [-30.56, 22.94],
  "kenya": [-0.02, 37.91], "senegal": [14.50, -14.45], "sénégal": [14.50, -14.45],
  "algeria": [28.03, 1.66], "algérie": [28.03, 1.66],
  "tunisia": [33.89, 9.54], "tunisie": [33.89, 9.54],
  "singapore": [1.35, 103.82], "singapour": [1.35, 103.82],
  "malaysia": [4.21, 108.96], "malaisie": [4.21, 108.96],
  "indonesia": [-0.79, 113.92], "indonésie": [-0.79, 113.92],
  "thailand": [15.87, 100.99], "thaïlande": [15.87, 100.99],
  "vietnam": [14.06, 108.28], "philippines": [12.88, 121.77],
  "mexico": [23.63, -102.55], "mexique": [23.63, -102.55],
  "argentina": [-38.42, -63.62], "argentine": [-38.42, -63.62],
  "colombia": [4.57, -74.30], "colombie": [4.57, -74.30],
  "chile": [-35.68, -71.54], "chili": [-35.68, -71.54],
  "new zealand": [-40.90, 174.89], "nouvelle-zélande": [-40.90, 174.89],
};

function geocode(city, country) {
  const c = city?.toLowerCase().trim() || "";
  const co = country?.toLowerCase().trim() || "";
  if (c) {
    const full = `${c},${co}`;
    if (CITIES[full]) return CITIES[full];
    if (CITIES[c]) return CITIES[c];
  }
  if (co && COUNTRIES[co]) return COUNTRIES[co];
  return null;
}

// ── 3D math ──────────────────────────────────────────────────────────────────
function toXYZ(lat, lng) {
  const la = (lat * Math.PI) / 180;
  const lo = (lng * Math.PI) / 180;
  return { x: Math.cos(la) * Math.cos(lo), y: Math.sin(la), z: Math.cos(la) * Math.sin(lo) };
}

function rotatePoint(p, rY, rX) {
  // Y-axis (longitude)
  const x1 = p.x * Math.cos(rY) - p.z * Math.sin(rY);
  const z1 = p.x * Math.sin(rY) + p.z * Math.cos(rY);
  // X-axis (tilt)
  const y2 = p.y * Math.cos(rX) - z1 * Math.sin(rX);
  const z2 = p.y * Math.sin(rX) + z1 * Math.cos(rX);
  // Flip x so east appears on the right (standard map orientation) —
  // this un-mirrors the globe so continents face the correct way.
  return { x: -x1, y: y2, z: z2 };
}

function slerp(a, b, t) {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const omega = Math.acos(Math.abs(dot));
  if (omega < 0.001) return a;
  const s = Math.sin(omega);
  const fa = Math.sin((1 - t) * omega) / s;
  const fb = Math.sin(t * omega) / s;
  return { x: fa * a.x + fb * b.x, y: fa * a.y + fb * b.y, z: fa * a.z + fb * b.z };
}

function makeArc(from, to, steps = 80) {
  const pts = [];
  for (let i = 0; i <= steps; i++) pts.push(slerp(from, to, i / steps));
  return pts;
}

// ── Fallback land data: approximate continent outlines (offline-safe) ────────
// Each polygon is an array of [lng, lat] points — rough coastlines of the
// major landmasses. Resolved against via ray-casting point-in-polygon.
const LAND_POLYGONS = [
  // Africa
  [[-17,14],[-17,21],[-12,28],[-7,33],[0,33],[10,33],[18,31],[25,32],[32,31],
   [35,23],[37,15],[43,12],[51,12],[52,7],[44,-10],[40,-15],[35,-24],[30,-29],
   [22,-34],[18,-35],[13,-15],[10,-5],[7,4],[2,6],[-4,5],[-8,7],[-13,10],[-16,14]],
  // Europe
  [[-9,36],[-9,43],[-5,44],[-1,49],[-5,58],[5,58],[8,64],[15,68],[25,70],[35,70],
   [40,65],[55,60],[55,55],[48,45],[42,45],[35,42],[30,35],[26,37],[20,38],
   [10,37],[0,36],[-9,36]],
  // Asia (inc. Middle East, India, SE Asia mainland, Siberia)
  [[30,35],[40,41],[48,41],[55,45],[60,48],[55,55],[35,55],[35,69],[60,70],
   [75,74],[100,76],[130,73],[150,72],[170,68],[170,55],[160,52],[145,44],
   [130,40],[122,35],[120,23],[110,18],[105,8],[102,5],[105,1],[100,-2],
   [95,-3],[95,5],[92,21],[85,10],[80,6],[77,8],[73,15],[70,23],[60,25],
   [55,17],[50,14],[45,14],[45,20],[42,30],[38,33],[35,37],[30,35]],
  // North America (Alaska → Central America → East Coast → Arctic)
  [[-168,65],[-160,70],[-150,71],[-135,69],[-128,54],[-124,42],[-117,32],[-110,22],
   [-100,18],[-90,15],[-83,8],[-78,8],[-75,11],[-64,19],[-75,22],[-81,31],
   [-75,36],[-65,44],[-60,47],[-55,52],[-63,60],[-77,63],[-90,66],[-82,73],
   [-95,78],[-115,74],[-130,71],[-140,70],[-155,72],[-168,65]],
  // South America
  [[-78,12],[-72,12],[-62,8],[-50,4],[-38,-5],[-38,-23],[-52,-34],[-58,-40],
   [-65,-52],[-72,-54],[-72,-40],[-76,-20],[-80,-8],[-80,0],[-78,12]],
  // Australia
  [[113,-22],[115,-32],[130,-34],[146,-39],[151,-34],[153,-26],[146,-18],
   [140,-12],[130,-12],[120,-17],[113,-22]],
  // Greenland
  [[-55,60],[-42,60],[-22,70],[-17,80],[-30,83],[-55,80],[-65,75],[-55,60]],
];

function pointInPoly(lng, lat, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    if (((yi > lat) !== (yj > lat)) &&
        (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}

function isApproxLand(lat, lng) {
  if (lat < -60) return true; // Antarctica
  // Small / irregular land masses not worth a full polygon
  if (lat > 63 && lat < 67 && lng > -25 && lng < -13) return true; // Iceland
  if (lat > 49 && lat < 61 && lng > -9 && lng < 3) return true;    // British Isles
  if (lat > -26 && lat < -11 && lng > 43 && lng < 51) return true; // Madagascar
  if (lat > 5 && lat < 10 && lng > 79 && lng < 82) return true;    // Sri Lanka
  if (lat > 30 && lat < 46 && lng > 128 && lng < 146) return true; // Japan
  if (lat > 5 && lat < 20 && lng > 117 && lng < 127) return true;  // Philippines
  if (lat > -10 && lat < 6 && lng > 109 && lng < 120) return true; // Borneo
  if (lat > -9 && lat < 6 && lng > 95 && lng < 107) return true;   // Sumatra
  if (lat > -9 && lat < -5 && lng > 105 && lng < 118) return true; // Java
  if (lat > -47 && lat < -33 && lng > 166 && lng < 178) return true;// NZ
  // Main continents via ray-casting PIP
  for (const poly of LAND_POLYGONS) if (pointInPoly(lng, lat, poly)) return true;
  return false;
}

function buildFallbackDots(step = 2) {
  const dots = [];
  for (let lat = -87; lat <= 87; lat += step)
    for (let lng = -180; lng < 180; lng += step)
      if (isApproxLand(lat, lng)) dots.push([lat, lng]);
  return dots;
}

// ── Load land data from world-atlas (Natural Earth 110m) ─────────────────────
async function loadLandDots() {
  try {
    const cached = sessionStorage.getItem("globe-land-v7");
    if (cached) { const d = JSON.parse(cached); if (d.length > 100) return d; }

    const topo = await fetch(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json"
    ).then(r => r.json());

    const { scale: s, translate: t } = topo.transform;
    const arcs = topo.arcs.map(arc => {
      let x = 0, y = 0;
      return arc.map(([dx, dy]) => {
        x += dx; y += dy;
        return [x * s[0] + t[0], y * s[1] + t[1]]; // [lng, lat]
      });
    });

    // Draw land polygons onto a 720×360 offscreen canvas
    const W = 720, H = 360;
    const oc = document.createElement("canvas");
    oc.width = W; oc.height = H;
    const cx = oc.getContext("2d");
    cx.fillStyle = "#000"; cx.fillRect(0, 0, W, H);
    cx.fillStyle = "#fff";

    // Draw a polygon (array of rings — outer + optional holes)
    // All rings in one beginPath so evenodd rule handles holes correctly.
    // prevPx guard prevents antimeridian crossings from spanning the whole canvas.
    const drawPolygon = (polygon) => {
      cx.beginPath();
      for (const ringArcs of polygon) {
        let first = true;
        let prevPx = null;
        for (const idx of ringArcs) {
          const rev = idx < 0;
          const arc = arcs[rev ? ~idx : idx];
          const pts = rev ? [...arc].reverse() : arc;
          for (const [lng, lat] of pts) {
            const px = (lng + 180) * (W / 360);
            const py = (90 - lat) * (H / 180);
            // Break path if antimeridian crossing detected (|Δpx| > half width)
            if (first || (prevPx !== null && Math.abs(px - prevPx) > W * 0.6)) {
              cx.moveTo(px, py);
              first = false;
            } else {
              cx.lineTo(px, py);
            }
            prevPx = px;
          }
        }
        cx.closePath();
      }
      cx.fill("evenodd");
    };

    const drawGeom = (g) => {
      if (g.type === "Polygon") {
        drawPolygon(g.arcs); // arcs = [outerRing, ...holes]
      } else if (g.type === "MultiPolygon") {
        g.arcs.forEach(polygon => drawPolygon(polygon));
      } else if (g.type === "GeometryCollection") {
        g.geometries.forEach(drawGeom);
      }
    };
    drawGeom(topo.objects.land);

    // Sample at 2px intervals (0.5° resolution) for dense accurate dots
    const img = cx.getImageData(0, 0, W, H).data;
    const dots = [];
    const step = 3;
    for (let py = 1; py < H - 1; py += step) {
      for (let px = 1; px < W - 1; px += step) {
        if (img[(py * W + px) * 4] > 128) {
          dots.push([90 - py * (180 / H), px * (360 / W) - 180]);
        }
      }
    }

    if (dots.length < 300) throw new Error(`sparse result: only ${dots.length} dots`);
    sessionStorage.setItem("globe-land-v7", JSON.stringify(dots));
    return dots;
  } catch (e) {
    console.warn("Globe: topojson approach failed, using geographic fallback:", e.message);
    const fb = buildFallbackDots(2); // 2° resolution for good density
    try { sessionStorage.setItem("globe-land-v7", JSON.stringify(fb)); } catch {}
    return fb;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function GlobeWidget({ clients = [] }) {
  const canvasRef = useRef(null);
  const landRef = useRef([]);
  const [loaded, setLoaded] = useState(false);

  const state = useRef({
    rotY: -1.44, rotX: 0,         // centers Casablanca; rotX=0 → horizontal equator
    autoRotate: true,
    mouseDown: false, dragged: false,
    lastMouse: { x: 0, y: 0 },
    phase: 0,
    hovered: null,
  });

  // Resolve client coordinates
  const clientsData = clients
    .map((c, i) => {
      let lat = c.lat, lng = c.lng;
      if (lat == null || lng == null) {
        const coords = geocode(c.city, c.country);
        if (!coords) return null;
        [lat, lng] = coords;
      }
      return { ...c, lat, lng, xyz: toXYZ(lat, lng), arc_offset: i / Math.max(clients.length, 1) };
    })
    .filter(Boolean)
    .map(c => ({ ...c, arc: makeArc(toXYZ(HQ.lat, HQ.lng), c.xyz) }));

  // Load land async
  useEffect(() => {
    loadLandDots().then(dots => { landRef.current = dots; setLoaded(true); });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    let raf;

    function resize() {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      const { rotY, rotX, phase } = state.current;
      const W = canvas.width / dpr, H = canvas.height / dpr;
      const cx = W / 2, cy = H / 2;
      const R = Math.min(W, H) * 0.42;

      ctx.clearRect(0, 0, W, H);

      // ── Outer atmosphere ──
      const atmo = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.2);
      atmo.addColorStop(0, `rgba(${A},0.10)`);
      atmo.addColorStop(0.5, `rgba(${A},0.03)`);
      atmo.addColorStop(1, `rgba(${A},0)`);
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = atmo; ctx.fill();

      // ── Sphere body ──
      const sphere = ctx.createRadialGradient(cx - R * 0.22, cy - R * 0.22, R * 0.06, cx, cy, R);
      sphere.addColorStop(0, "#181830");
      sphere.addColorStop(0.55, "#0D0D22");
      sphere.addColorStop(1, "#080810");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = sphere; ctx.fill();

      // ── Clip all interior to sphere ──
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

      // Grid lines
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(120,140,255,0.07)";
      for (let lat = -75; lat <= 75; lat += 30) {
        ctx.beginPath(); let f = true;
        for (let lng = -180; lng <= 180; lng += 4) {
          const p = rotatePoint(toXYZ(lat, lng), rotY, rotX);
          if (p.z < 0) { f = true; continue; }
          f ? ctx.moveTo(cx + p.x * R, cy - p.y * R) : ctx.lineTo(cx + p.x * R, cy - p.y * R);
          f = false;
        }
        ctx.stroke();
      }
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath(); let f = true;
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = rotatePoint(toXYZ(lat, lng), rotY, rotX);
          if (p.z < 0) { f = true; continue; }
          f ? ctx.moveTo(cx + p.x * R, cy - p.y * R) : ctx.lineTo(cx + p.x * R, cy - p.y * R);
          f = false;
        }
        ctx.stroke();
      }

      // Land dots
      for (const [lat, lng] of landRef.current) {
        const p = rotatePoint(toXYZ(lat, lng), rotY, rotX);
        if (p.z < 0) continue;
        const alpha = Math.min(1, p.z * 2.2) * 0.7;
        ctx.beginPath();
        ctx.arc(cx + p.x * R, cy - p.y * R, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${A},${alpha})`;
        ctx.fill();
      }

      ctx.restore(); // end sphere clip

      // ── Arcs + client nodes ──
      for (const c of clientsData) {
        // Base arc line
        ctx.beginPath(); let first = true;
        for (const raw of c.arc) {
          const p = rotatePoint(raw, rotY, rotX);
          const sx = cx + p.x * R, sy = cy - p.y * R;
          if (p.z < -0.04) { first = true; continue; }
          first ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
          first = false;
        }
        ctx.strokeStyle = `rgba(${A},0.22)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Animated pulse
        const t = ((phase * 0.35 + c.arc_offset) % 1 + 1) % 1;
        const pidx = Math.floor(t * (c.arc.length - 1));
        const pRaw = c.arc[pidx];
        const pp = rotatePoint(pRaw, rotY, rotX);
        if (pp.z > 0) {
          const sx = cx + pp.x * R, sy = cy - pp.y * R;
          const g2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, 7);
          g2.addColorStop(0, `rgba(${A},0.9)`);
          g2.addColorStop(1, `rgba(${A},0)`);
          ctx.beginPath(); ctx.arc(sx, sy, 7, 0, Math.PI * 2);
          ctx.fillStyle = g2; ctx.fill();
          ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fillStyle = ACCENT; ctx.fill();
        }

        // Client node
        const np = rotatePoint(c.xyz, rotY, rotX);
        if (np.z > -0.1) {
          const sx = cx + np.x * R, sy = cy - np.y * R;
          const pulse = 0.5 + 0.5 * Math.sin(phase * 2.2 + c.arc_offset * 8);
          ctx.beginPath(); ctx.arc(sx, sy, 7 + pulse * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${A},${0.06 + pulse * 0.06})`; ctx.fill();
          ctx.beginPath(); ctx.arc(sx, sy, 5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${A},${0.55 + pulse * 0.35})`;
          ctx.lineWidth = 1.3; ctx.stroke();
          ctx.beginPath(); ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = ACCENT; ctx.fill();
        }
      }

      // ── HQ badge — dB at Casablanca ──
      const hqP = rotatePoint(toXYZ(HQ.lat, HQ.lng), rotY, rotX);
      if (hqP.z > -0.05) {
        const sx = cx + hqP.x * R, sy = cy - hqP.y * R;
        const pulse = 0.5 + 0.5 * Math.sin(phase * 2.8);
        // Glow halo
        const hg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 22 + pulse * 6);
        hg.addColorStop(0, `rgba(${A},0.35)`);
        hg.addColorStop(1, `rgba(${A},0)`);
        ctx.beginPath(); ctx.arc(sx, sy, 22 + pulse * 6, 0, Math.PI * 2);
        ctx.fillStyle = hg; ctx.fill();
        // Badge
        const bw = 34, bh = 18;
        ctx.beginPath();
        ctx.roundRect(sx - bw / 2, sy - bh - 8, bw, bh, 4);
        ctx.fillStyle = ACCENT; ctx.fill();
        ctx.font = `700 10px "JetBrains Mono",monospace`;
        ctx.fillStyle = "#0A0A0F";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("dB", sx, sy - bh / 2 - 8);
        // Stem + dot
        ctx.beginPath(); ctx.moveTo(sx, sy - 8); ctx.lineTo(sx, sy - 2);
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = ACCENT; ctx.fill();
      }

      // ── Specular highlight (makes it feel 3D) ──
      const spec = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, 0, cx - R * 0.2, cy - R * 0.2, R * 0.55);
      spec.addColorStop(0, "rgba(255,255,255,0.06)");
      spec.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = spec; ctx.fill();
      // Edge rim
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${A},0.18)`; ctx.lineWidth = 1.5; ctx.stroke();
    }

    // ── Hit test ──
    function hitTest(mx, my) {
      const W = canvas.width / dpr, H = canvas.height / dpr;
      const cx = W / 2, cy = H / 2, R = Math.min(W, H) * 0.42;
      let best = null, bestD = 16;
      for (const c of clientsData) {
        const p = rotatePoint(c.xyz, state.current.rotY, state.current.rotX);
        if (p.z < 0) continue;
        const d = Math.hypot(mx - (cx + p.x * R), my - (cy - p.y * R));
        if (d < bestD) { bestD = d; best = c; }
      }
      // HQ
      const hqP = rotatePoint(toXYZ(HQ.lat, HQ.lng), state.current.rotY, state.current.rotX);
      if (hqP.z > 0 && Math.hypot(mx - (cx + hqP.x * R), my - (cy - hqP.y * R)) < 18) {
        best = { ...HQ, isHQ: true };
      }
      return best;
    }

    function loop() {
      if (state.current.autoRotate && !state.current.mouseDown) {
        state.current.rotY += 0.004;
      }
      state.current.phase += 0.022;
      draw();
      raf = requestAnimationFrame(loop);
    }
    loop();

    // ── Events ──
    function onMouseDown(e) {
      state.current.mouseDown = true;
      state.current.dragged = false;
      state.current.lastMouse = { x: e.clientX, y: e.clientY };
    }
    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left, my = e.clientY - rect.top;
      // Hover tooltip
      const hit = hitTest(mx, my);
      state.current.hovered = hit;
      canvas.style.cursor = hit ? "pointer" : (state.current.mouseDown ? "grabbing" : "grab");
      if (hit) {
        const W2 = canvas.width / dpr, H2 = canvas.height / dpr;
        const c2 = W2 / 2, c2y = H2 / 2, R2 = Math.min(W2, H2) * 0.42;
        const lat2 = hit.lat ?? HQ.lat, lng2 = hit.lng ?? HQ.lng;
        const p2 = rotatePoint(toXYZ(lat2, lng2), state.current.rotY, state.current.rotX);
        setTooltip({ ...hit, sx: rect.left + c2 + p2.x * R2, sy: rect.top + c2y - p2.y * R2 });
      } else {
        setTooltip(null);
      }
      if (!state.current.mouseDown) return;
      const dx = e.clientX - state.current.lastMouse.x;
      const dy = e.clientY - state.current.lastMouse.y;
      if (Math.hypot(dx, dy) > 3) state.current.dragged = true;
      // Horizontal: drag right → surface moves right (grab-and-drag convention, x is mirrored)
      // Vertical:   drag down  → see more of the south (kept as user confirmed correct)
      state.current.rotY += dx * 0.007;
      state.current.rotX = Math.max(-0.65, Math.min(0.65, state.current.rotX - dy * 0.005));
      state.current.lastMouse = { x: e.clientX, y: e.clientY };
    }
    function onMouseUp() { state.current.mouseDown = false; }
    function onClick() {
      if (!state.current.dragged) {
        state.current.autoRotate = !state.current.autoRotate;
      }
    }
    function onTouchStart(e) {
      const t = e.touches[0];
      state.current.mouseDown = true; state.current.dragged = false;
      state.current.lastMouse = { x: t.clientX, y: t.clientY };
      state.current.autoRotate = false;
    }
    function onTouchMove(e) {
      if (!state.current.mouseDown) return;
      const t = e.touches[0];
      state.current.rotY += (t.clientX - state.current.lastMouse.x) * 0.007;
      state.current.rotX = Math.max(-0.65, Math.min(0.65, state.current.rotX - (t.clientY - state.current.lastMouse.y) * 0.005));
      state.current.lastMouse = { x: t.clientX, y: t.clientY };
      state.current.dragged = true;
      e.preventDefault();
    }
    function onTouchEnd() { state.current.mouseDown = false; }

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [loaded]);

  const [tooltip, setTooltip] = useState(null);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block", borderRadius: "50%" }}
      />

      {/* Loading shimmer */}
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle at 40% 35%, #181830, #0A0A14)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-mute)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Chargement…
          </span>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position: "fixed", zIndex: 9999, pointerEvents: "none",
          left: tooltip.sx, top: tooltip.sy - 14,
          transform: "translate(-50%,-100%)",
          background: "color-mix(in oklab, var(--bg-elev) 90%, transparent)",
          border: "1px solid var(--line-2)", borderRadius: 8,
          padding: "8px 14px", backdropFilter: "blur(12px)",
          whiteSpace: "nowrap",
        }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: tooltip.isHQ ? ACCENT : "var(--fg)" }}>
            {tooltip.name}
          </div>
          {(tooltip.city || tooltip.country) && (
            <div style={{ fontSize: 10, color: "var(--fg-dim)", fontFamily: "var(--f-mono)", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 2 }}>
              {[tooltip.city, tooltip.country].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(8,8,16,0.75)", backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.06)", borderRadius: 999,
        padding: "5px 14px", whiteSpace: "nowrap",
      }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 6px ${ACCENT}`, flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--f-mono)", fontSize: 9, color: "var(--fg-mute)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Cliquer · pause / rotation · Glisser · orienter
        </span>
      </div>
    </div>
  );
}
