import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Compass,
  MapPin,
  Minus,
  Move,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import TuscaniniLogo from "../TuscaniniLogo";
import {
  ITALY_REGIONS,
  LAKES,
  MAP_H,
  MAP_W,
  NEIGHBORS,
  RIVERS,
  project,
} from "../../lib/italyGeo";
import {
  sourcingRegionByGeometry,
  sourcingRegions,
  type SourcingRegion,
} from "../../data/sourcing-regions";
import "./sourcingMap.css";

interface View {
  k: number;
  cx: number;
  cy: number;
}

interface HoverTip {
  region: SourcingRegion;
  /** Anchor coordinates as fractions of the container, retained across resizes. */
  x: number;
  y: number;
  kind: "region" | "marker";
}

const DEFAULT_VIEW: View = { k: 1, cx: MAP_W / 2, cy: MAP_H / 2 };
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const PIN_STEM = "M0 0 L-2.2-8.4 L2.2-8.4 Z";

const LONGITUDES = [6, 8, 10, 12, 14, 16, 18, 20];
const LATITUDES = [36, 38, 40, 42, 44, 46, 48];

const SEA_LABELS = [
  { name: "Mar Ligure", lng: 8.25, lat: 43.45, rotation: -10 },
  { name: "Mar Tirreno", lng: 11.2, lat: 40.5, rotation: -8 },
  { name: "Mar Adriatico", lng: 15.1, lat: 43.2, rotation: -39 },
  { name: "Mar Ionio", lng: 17.1, lat: 38.6, rotation: -8 },
];

const CITY_LABELS = [
  { name: "Torino", lng: 7.687, lat: 45.07 },
  { name: "Milano", lng: 9.19, lat: 45.464 },
  { name: "Venezia", lng: 12.327, lat: 45.438 },
  { name: "Bologna", lng: 11.343, lat: 44.494 },
  { name: "Firenze", lng: 11.255, lat: 43.77 },
  { name: "Roma", lng: 12.483, lat: 41.893 },
  { name: "Napoli", lng: 14.268, lat: 40.851 },
  { name: "Bari", lng: 16.862, lat: 41.126 },
  { name: "Palermo", lng: 13.362, lat: 38.116 },
];

const NEIGHBOR_LABELS = [
  { name: "FRANCE", lng: 6.1, lat: 44.1 },
  { name: "SWITZERLAND", lng: 8.7, lat: 47 },
  { name: "AUSTRIA", lng: 13.2, lat: 47.35 },
  { name: "CROATIA", lng: 16.8, lat: 44.8 },
  { name: "TUNISIA", lng: 9.2, lat: 35.9 },
];

const MOUNTAIN_POINTS: [number, number, number][] = [
  [7.1, 45.6, 1.05],
  [7.7, 45.95, 0.9],
  [8.4, 46.35, 1.1],
  [9.1, 46.35, 0.85],
  [9.9, 46.45, 1.05],
  [10.7, 46.45, 0.9],
  [11.5, 46.7, 1.1],
  [12.3, 46.55, 0.9],
  [10.1, 44.25, 0.9],
  [10.8, 44.05, 1.05],
  [11.6, 43.75, 0.85],
  [12.3, 43.35, 0.95],
  [13.1, 42.8, 0.9],
  [13.8, 42.25, 1.1],
  [14.6, 41.55, 0.9],
  [15.5, 40.55, 0.85],
  [16, 39.5, 0.9],
];

const MOUNTAINS = MOUNTAIN_POINTS.map(([lng, lat, scale]) => {
  const [x, y] = project(lng, lat);
  return { x, y, scale };
});

const PROJECTED_CITIES = CITY_LABELS.map((city) => ({
  ...city,
  point: project(city.lng, city.lat),
}));

const PROJECTED_SEAS = SEA_LABELS.map((sea) => ({
  ...sea,
  point: project(sea.lng, sea.lat),
}));

const PROJECTED_NEIGHBORS = NEIGHBOR_LABELS.map((label) => ({
  ...label,
  point: project(label.lng, label.lat),
}));

function clampView(view: View): View {
  const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.k));
  const halfWidth = MAP_W / (2 * k);
  const halfHeight = MAP_H / (2 * k);

  return {
    k,
    cx: Math.min(MAP_W - halfWidth + 48, Math.max(halfWidth - 48, view.cx)),
    cy: Math.min(MAP_H - halfHeight + 48, Math.max(halfHeight - 48, view.cy)),
  };
}

function InfoCard({
  region,
  compact = false,
  onBack,
}: {
  region: SourcingRegion;
  compact?: boolean;
  onBack?: () => void;
}) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border border-on-surface/10 bg-aged-cream/95 shadow-2xl backdrop-blur-md ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-5">
        <div>
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.28em] text-primary">
            {region.eyebrow}
          </span>
          <h3 className="font-headline text-2xl font-semibold text-heading">
            {region.name}
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-on-surface/10 bg-white/50"
            style={{ color: region.color }}
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </span>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to the full map of Italy"
              title="Back to Italy"
              className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-on-surface/10 bg-white/50 text-on-surface/80 transition-colors hover:bg-white hover:text-heading"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <p className="font-serif-alt text-sm italic leading-relaxed text-on-surface/80">
        {region.description}
      </p>

      <div className="mt-5 border-t border-on-surface/10 pt-4">
        <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface/80">
          Regional specialties
        </span>
        <div className="flex flex-wrap gap-1.5">
          {region.products.map((product) => (
            <span
              key={product}
              className="rounded-full bg-white/65 px-2.5 py-1 text-[11px] font-semibold text-on-surface/70"
            >
              {product}
            </span>
          ))}
        </div>
      </div>

      <Link
        to={`/category/${region.categorySlug}`}
        className="group mt-5 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:text-burnt-terracotta"
      >
        Shop the collection
        <ChevronRight
          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </article>
  );
}

function ControlButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center bg-aged-cream/90 text-on-surface/80 transition-colors hover:bg-white hover:text-heading disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

export default function SourcingMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startView: DEFAULT_VIEW,
    distance: 0,
  });
  const ignoreClickRef = useRef(false);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchDistanceRef = useRef<number | null>(null);
  const [view, setView] = useState<View>(DEFAULT_VIEW);
  const [animated, setAnimated] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoverTip, setHoverTip] = useState<HoverTip | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const selectedRegion = useMemo(
    () => sourcingRegions.find((region) => region.id === selectedId) ?? null,
    [selectedId],
  );

  const activeGeometry = useMemo(
    () => new Set(sourcingRegions.map((region) => region.geometryName)),
    [],
  );

  const projectedMarkers = useMemo(
    () =>
      sourcingRegions.map((region, index) => ({
        region,
        index,
        point: project(region.coordinates[0], region.coordinates[1]),
      })),
    [],
  );

  const outline = useMemo(
    () => ITALY_REGIONS.map((region) => region.d).join(""),
    [],
  );

  const baseScale = useCallback(() => {
    const rectangle = containerRef.current?.getBoundingClientRect();
    if (!rectangle) return 1;
    return Math.min(rectangle.width / MAP_W, rectangle.height / MAP_H);
  }, []);

  const screenToSvg = useCallback((clientX: number, clientY: number) => {
    const rectangle = containerRef.current?.getBoundingClientRect();
    if (!rectangle) return [MAP_W / 2, MAP_H / 2] as const;
    const scale = Math.min(rectangle.width / MAP_W, rectangle.height / MAP_H);
    const offsetX = (rectangle.width - MAP_W * scale) / 2;
    const offsetY = (rectangle.height - MAP_H * scale) / 2;
    return [
      (clientX - rectangle.left - offsetX) / scale,
      (clientY - rectangle.top - offsetY) / scale,
    ] as const;
  }, []);

  const zoomAt = useCallback(
    (factor: number, clientX?: number, clientY?: number) => {
      setAnimated(false);
      setView((current) => {
        const nextZoom = Math.min(
          MAX_ZOOM,
          Math.max(MIN_ZOOM, current.k * factor),
        );
        if (nextZoom === current.k) return current;

        const [screenX, screenY] =
          clientX == null || clientY == null
            ? ([MAP_W / 2, MAP_H / 2] as const)
            : screenToSvg(clientX, clientY);
        const translateX = MAP_W / 2 - current.k * current.cx;
        const translateY = MAP_H / 2 - current.k * current.cy;
        const mapX = (screenX - translateX) / current.k;
        const mapY = (screenY - translateY) / current.k;

        return clampView({
          k: nextZoom,
          cx: mapX - (screenX - MAP_W / 2) / nextZoom,
          cy: mapY - (screenY - MAP_H / 2) / nextZoom,
        });
      });
    },
    [screenToSvg],
  );

  const resetMap = useCallback(() => {
    setAnimated(true);
    setSelectedId(null);
    setHoveredId(null);
    setHoverTip(null);
    setView(DEFAULT_VIEW);
  }, []);

  const selectRegion = useCallback(
    (region: SourcingRegion, toggle = true) => {
      if (ignoreClickRef.current) return;
      if (toggle && selectedId === region.id) {
        resetMap();
        return;
      }

      const geometry = ITALY_REGIONS.find(
        (candidate) => candidate.name === region.geometryName,
      );
      if (!geometry) return;

      const [x0, y0, x1, y1] = geometry.bbox;
      const width = Math.max(1, x1 - x0);
      const height = Math.max(1, y1 - y0);
      const nextZoom = Math.min(
        4.4,
        Math.max(
          2.15,
          Math.min((MAP_W * 0.76) / width, (MAP_H * 0.76) / height),
        ),
      );

      setAnimated(true);
      setSelectedId(region.id);
      setHoveredId(null);
      setHoverTip(null);
      containerRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "center",
      });
      setView(
        clampView({
          k: nextZoom,
          cx: (x0 + x1) / 2,
          cy: (y0 + y1) / 2,
        }),
      );
    },
    [resetMap, selectedId],
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      const rectangle = element.getBoundingClientRect();
      setContainerSize({ width: rectangle.width, height: rectangle.height });
    });
    resizeObserver.observe(element);

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      setHoverTip(null);
      zoomAt(Math.exp(-event.deltaY * 0.0016), event.clientX, event.clientY);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      resizeObserver.disconnect();
      element.removeEventListener("wheel", handleWheel);
    };
  }, [zoomAt]);

  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointersRef.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    if (pointersRef.current.size === 2) {
      const [first, second] = [...pointersRef.current.values()];
      pinchDistanceRef.current = Math.hypot(
        first.x - second.x,
        first.y - second.y,
      );
      dragRef.current.active = false;
      setDragging(false);
      return;
    }
    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startView: view,
      distance: 0,
    };
    setAnimated(false);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (pointersRef.current.has(event.pointerId)) {
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
    }

    if (pointersRef.current.size >= 2) {
      const [first, second] = [...pointersRef.current.values()];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);
      if (pinchDistanceRef.current && pinchDistanceRef.current > 0) {
        zoomAt(
          distance / pinchDistanceRef.current,
          (first.x + second.x) / 2,
          (first.y + second.y) / 2,
        );
      }
      pinchDistanceRef.current = distance;
      return;
    }

    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    drag.distance = Math.hypot(deltaX, deltaY);
    if (drag.distance > 3) {
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragging(true);
      setHoverTip(null);
    }

    const scale = baseScale();
    setView(
      clampView({
        ...drag.startView,
        cx: drag.startView.cx - deltaX / (scale * drag.startView.k),
        cy: drag.startView.cy - deltaY / (scale * drag.startView.k),
      }),
    );
  };

  const handlePointerUp = (event: ReactPointerEvent<SVGSVGElement>) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) pinchDistanceRef.current = null;
    if (dragRef.current.pointerId !== event.pointerId) return;
    ignoreClickRef.current =
      dragRef.current.distance > 4 || pointersRef.current.size > 0;
    dragRef.current.active = false;
    setDragging(false);
    window.setTimeout(() => {
      ignoreClickRef.current = false;
    }, 0);
  };

  const handleMapKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;

    const step = 35 / view.k;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setView((current) => clampView({ ...current, cx: current.cx - step }));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setView((current) => clampView({ ...current, cx: current.cx + step }));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setView((current) => clampView({ ...current, cy: current.cy - step }));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setView((current) => clampView({ ...current, cy: current.cy + step }));
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoomAt(1.35);
    } else if (event.key === "-") {
      event.preventDefault();
      zoomAt(1 / 1.35);
    } else if (event.key === "Escape") {
      event.preventDefault();
      if (hoverTip) {
        setHoverTip(null);
        setHoveredId(null);
      } else if (selectedId) {
        resetMap();
      } else {
        setView(DEFAULT_VIEW);
      }
    } else if (event.key === "0") {
      event.preventDefault();
      resetMap();
    }
  };

  const updateRegionTip = (
    region: SourcingRegion,
    event: ReactPointerEvent<SVGElement>,
  ) => {
    if (event.pointerType !== "mouse") return;
    const rectangle = containerRef.current?.getBoundingClientRect();
    if (!rectangle || rectangle.width <= 0 || rectangle.height <= 0) return;
    setContainerSize({ width: rectangle.width, height: rectangle.height });
    setHoveredId(region.id);
    setHoverTip({
      region,
      x: (event.clientX - rectangle.left) / rectangle.width,
      y: (event.clientY - rectangle.top) / rectangle.height,
      kind: "region",
    });
  };

  const updateMarkerTip = (
    region: SourcingRegion,
    target: Element,
    pointerType?: string,
  ) => {
    if (pointerType && pointerType !== "mouse") return;
    const container = containerRef.current?.getBoundingClientRect();
    if (!container || container.width <= 0 || container.height <= 0) return;
    const marker = target.getBoundingClientRect();
    const x = marker.left - container.left + marker.width / 2;
    const y = marker.top - container.top;
    setContainerSize({ width: container.width, height: container.height });
    setHoveredId(region.id);
    setHoverTip({
      region,
      x: x / container.width,
      y: y / container.height,
      kind: "marker",
    });
  };

  const clearHover = () => {
    setHoveredId(null);
    setHoverTip(null);
  };

  const { k, cx, cy } = view;
  const translateX = MAP_W / 2 - k * cx;
  const translateY = MAP_H / 2 - k * cy;
  const transform = `translate(${translateX} ${translateY}) scale(${k})`;
  const hoverTipY = hoverTip
    ? Math.min(containerSize.height, Math.max(0, hoverTip.y * containerSize.height))
    : 0;
  const hoverTipBelow = hoverTipY < (hoverTip?.kind === "marker" ? 205 : 180);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleMapKeyDown}
        aria-label="Interactive map of Italian food regions. Use arrow keys to pan, plus and minus to zoom, and zero to reset."
        className="sourcing-atlas group relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-on-surface/10 bg-aged-cream shadow-[0_35px_90px_rgba(59,44,32,0.16)] outline-none focus-visible:ring-2 focus-visible:ring-primary md:aspect-[16/10]"
      >
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          preserveAspectRatio="xMidYMid meet"
          className={`h-full w-full touch-none select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          role="img"
          aria-label="A map of Italy with seven food regions"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={(event) => zoomAt(1.6, event.clientX, event.clientY)}
          onClick={() => {
            if (ignoreClickRef.current) return;
            clearHover();
            if (selectedId) resetMap();
          }}
        >
          <defs>
            <linearGradient id="atlas-sea" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e4eee9" />
              <stop offset="48%" stopColor="#d8e8e2" />
              <stop offset="100%" stopColor="#c6ded8" />
            </linearGradient>
            <radialGradient id="atlas-vignette" cx="50%" cy="45%" r="72%">
              <stop offset="58%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#55756b" stopOpacity="0.18" />
            </radialGradient>
            <linearGradient id="atlas-active" x1="0" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stopColor="#efd9b8" />
              <stop offset="100%" stopColor="#d9aa78" />
            </linearGradient>
            <linearGradient id="atlas-selected" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c56f48" />
              <stop offset="100%" stopColor="#8c3b24" />
            </linearGradient>
            <filter
              id="atlas-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="150%"
            >
              <feDropShadow
                dx="0"
                dy="6"
                stdDeviation="6"
                floodColor="#3b2c20"
                floodOpacity="0.18"
              />
            </filter>
            <filter
              id="atlas-paper"
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="2"
                seed="8"
                result="noise"
              />
              <feColorMatrix
                in="noise"
                type="saturate"
                values="0"
                result="mono"
              />
              <feComponentTransfer in="mono" result="faintNoise">
                <feFuncA type="table" tableValues="0 0.065" />
              </feComponentTransfer>
              <feBlend in="SourceGraphic" in2="faintNoise" mode="multiply" />
            </filter>
          </defs>

          <rect width={MAP_W} height={MAP_H} fill="url(#atlas-sea)" />

          <g opacity="0.18" aria-hidden="true">
            {LONGITUDES.map((longitude) => {
              const [x1, y1] = project(longitude, 35);
              const [x2, y2] = project(longitude, 48.5);
              return (
                <line
                  key={`lng-${longitude}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#52746a"
                  strokeWidth="0.7"
                  strokeDasharray="2 6"
                />
              );
            })}
            {LATITUDES.map((latitude) => {
              const [x1, y1] = project(4.5, latitude);
              const [x2, y2] = project(21, latitude);
              return (
                <line
                  key={`lat-${latitude}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#52746a"
                  strokeWidth="0.7"
                  strokeDasharray="2 6"
                />
              );
            })}
          </g>

          <g
            transform={transform}
            className={
              animated
                ? "sourcing-atlas__zoom sourcing-atlas__zoom--animated"
                : "sourcing-atlas__zoom"
            }
          >
            <g aria-hidden="true">
              {NEIGHBORS.map((neighbor) => (
                <path
                  key={neighbor.name}
                  d={neighbor.d}
                  fill="#e7e0d4"
                  stroke="#b8afa0"
                  strokeWidth="0.7"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {PROJECTED_NEIGHBORS.map((label) => (
                <text
                  key={label.name}
                  x={label.point[0]}
                  y={label.point[1]}
                  textAnchor="middle"
                  fontSize={7 / k}
                  letterSpacing={1.5 / k}
                  fill="#746e65"
                  opacity={k < 1.65 ? 0.55 : 0}
                  style={{ transition: "opacity 250ms ease" }}
                >
                  {label.name}
                </text>
              ))}
            </g>

            <path
              d={outline}
              fill="none"
              stroke="#55483c"
              strokeOpacity="0.18"
              strokeWidth="12"
              vectorEffect="non-scaling-stroke"
              filter="url(#atlas-shadow)"
              aria-hidden="true"
            />

            <g filter="url(#atlas-paper)">
              {ITALY_REGIONS.map((geometry) => {
                const source = sourcingRegionByGeometry.get(geometry.name);
                const selected = source?.id === selectedId;
                const hovered = source?.id === hoveredId;
                const interactive = activeGeometry.has(geometry.name);

                return (
                  <path
                    key={geometry.name}
                    d={geometry.d}
                    fill={
                      selected
                        ? "url(#atlas-selected)"
                        : interactive
                          ? "url(#atlas-active)"
                          : "#f8f4eb"
                    }
                    stroke={selected ? "#71301d" : "#a79e91"}
                    strokeWidth={selected ? 1.8 : 0.9}
                    vectorEffect="non-scaling-stroke"
                    className={`sourcing-atlas__region ${
                      interactive ? "sourcing-atlas__region--active" : ""
                    } ${selected ? "sourcing-atlas__region--selected" : ""} ${
                      hovered ? "sourcing-atlas__region--hovered" : ""
                    }`}
                    tabIndex={interactive ? 0 : undefined}
                    role={interactive ? "button" : undefined}
                    aria-label={
                      source
                        ? `${source.name} food region. ${source.products.join(", ")}.`
                        : undefined
                    }
                    onPointerEnter={
                      source
                        ? (event) => updateRegionTip(source, event)
                        : undefined
                    }
                    onPointerMove={
                      source
                        ? (event) => updateRegionTip(source, event)
                        : undefined
                    }
                    onPointerLeave={source ? clearHover : undefined}
                    onClick={
                      source
                        ? (event) => {
                            event.stopPropagation();
                            selectRegion(source);
                          }
                        : undefined
                    }
                    onKeyDown={
                      source
                        ? (event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              event.stopPropagation();
                              selectRegion(source);
                            }
                          }
                        : undefined
                    }
                  />
                );
              })}
            </g>

            {selectedRegion &&
              (() => {
                const geometry = ITALY_REGIONS.find(
                  (candidate) => candidate.name === selectedRegion.geometryName,
                );
                return geometry ? (
                  <path
                    d={geometry.d}
                    fill="none"
                    stroke="#f4d49b"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    pathLength="1000"
                    strokeDasharray="9 7"
                    className="sourcing-atlas__survey"
                    pointerEvents="none"
                  />
                ) : null;
              })()}

            <g aria-hidden="true">
              {LAKES.map((lake) => (
                <path
                  key={lake.name}
                  d={lake.d}
                  fill="#a8cec8"
                  stroke="#719e97"
                  strokeWidth="0.65"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {RIVERS.map((river) => (
                <path
                  key={river.name}
                  d={river.d}
                  fill="none"
                  stroke="#72a7a1"
                  strokeWidth="0.65"
                  strokeLinecap="round"
                  opacity={k > 1.25 ? 0.75 : 0.45}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>

            <g aria-hidden="true" opacity={k > 2.15 ? 0.62 : 0.34}>
              {MOUNTAINS.map((mountain, index) => (
                <path
                  key={`${mountain.x}-${mountain.y}-${index}`}
                  d={`M${mountain.x - 4.5 * mountain.scale} ${mountain.y + 2.5 * mountain.scale} L${mountain.x} ${mountain.y - 4.5 * mountain.scale} L${mountain.x + 4.5 * mountain.scale} ${mountain.y + 2.5 * mountain.scale}`}
                  fill="none"
                  stroke="#756b5d"
                  strokeWidth="0.8"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>

            <g aria-hidden="true" opacity={k > 1.45 ? 0.72 : 0}>
              {PROJECTED_CITIES.map((city) => (
                <g key={city.name}>
                  <circle
                    cx={city.point[0]}
                    cy={city.point[1]}
                    r={1.45 / k}
                    fill="#55483c"
                  />
                  <text
                    x={city.point[0] + 4 / k}
                    y={city.point[1] + 2 / k}
                    fontSize={7.5 / k}
                    fill="#55483c"
                  >
                    {city.name}
                  </text>
                </g>
              ))}
            </g>

            <g aria-hidden="true" opacity={k < 1.8 ? 0.48 : 0}>
              {PROJECTED_SEAS.map((sea) => (
                <text
                  key={sea.name}
                  x={sea.point[0]}
                  y={sea.point[1]}
                  textAnchor="middle"
                  fontFamily="Noto Serif, serif"
                  fontStyle="italic"
                  fontSize={9 / k}
                  letterSpacing={0.8 / k}
                  fill="#315f5a"
                  transform={`rotate(${sea.rotation} ${sea.point[0]} ${sea.point[1]})`}
                >
                  {sea.name}
                </text>
              ))}
            </g>

            {projectedMarkers.map(({ region, point, index }) => {
              const selected = selectedId === region.id;
              const hovered = hoveredId === region.id;
              const active = selected || hovered;
              return (
                <g
                  key={region.id}
                  transform={`translate(${point[0]} ${point[1]})`}
                  className="sourcing-atlas__marker-position"
                >
                  <g transform={`scale(${1 / k})`}>
                    <g
                      className={`sourcing-atlas__marker ${
                        active ? "sourcing-atlas__marker--selected" : ""
                      }`}
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      {active && (
                        <circle
                          className="sourcing-atlas__pulse"
                          cy="-13.5"
                          r="14"
                          fill="none"
                          stroke={region.color}
                          strokeWidth="1.4"
                        />
                      )}
                      <ellipse
                        cx="0"
                        cy="1.5"
                        rx={active ? 6.5 : 5}
                        ry={active ? 2.4 : 1.8}
                        fill="#2f241d"
                        opacity={active ? 0.24 : 0.16}
                      />
                      <g className="sourcing-atlas__pin-body">
                        <path
                          d={PIN_STEM}
                          fill={region.color}
                          stroke="#fffaf0"
                          strokeWidth="1.15"
                          strokeLinejoin="round"
                        />
                        <circle
                          cy="-13.5"
                          r="7.5"
                          fill={region.color}
                          stroke="#fffaf0"
                          strokeWidth="1.8"
                        />
                        <circle
                          cx="-2.3"
                          cy="-16"
                          r="1.6"
                          fill="#ffffff"
                          opacity="0.5"
                        />
                        <circle cy="-13.5" r="2.25" fill="#fffaf0" />
                      </g>
                    </g>
                    <circle
                      cy="-11"
                      r="20"
                      fill="transparent"
                      role="button"
                      tabIndex={0}
                      aria-label={`Explore ${region.name}`}
                      className="sourcing-atlas__marker-hit"
                      onPointerEnter={(event) =>
                        updateMarkerTip(
                          region,
                          event.currentTarget,
                          event.pointerType,
                        )
                      }
                      onPointerLeave={clearHover}
                      onFocus={(event) =>
                        updateMarkerTip(region, event.currentTarget)
                      }
                      onBlur={clearHover}
                      onClick={(event) => {
                        event.stopPropagation();
                        selectRegion(region, false);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          event.stopPropagation();
                          selectRegion(region, false);
                        }
                      }}
                    />
                  </g>
                </g>
              );
            })}
          </g>

          <rect
            width={MAP_W}
            height={MAP_H}
            fill="url(#atlas-vignette)"
            pointerEvents="none"
            aria-hidden="true"
          />

          <g transform="translate(651 82)" aria-hidden="true" opacity="0.72">
            <circle
              r="25"
              fill="#f8f2e7"
              fillOpacity="0.72"
              stroke="#725a45"
              strokeOpacity="0.4"
            />
            <path d="M0 -17 L5 0 L0 17 L-5 0 Z" fill="#8c3b24" opacity="0.84" />
            <path d="M-17 0 L0 -5 L17 0 L0 5 Z" fill="#4e665b" opacity="0.52" />
            <text
              y="-31"
              textAnchor="middle"
              fontSize="8"
              fontWeight="700"
              fill="#4b3b2f"
            >
              N
            </text>
          </g>
        </svg>

        <div className="pointer-events-none absolute left-4 top-4 select-none rounded-2xl border border-white/55 bg-aged-cream/80 px-4 py-3 shadow-lg backdrop-blur-md md:left-6 md:top-6 md:px-5 md:py-4">
          <TuscaniniLogo className="h-5 w-auto text-heading md:h-6" />
          <div className="mt-2 flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.26em] text-on-surface/80 md:text-[11px]">
            <Compass className="h-3 w-3 text-primary" aria-hidden="true" />
            Regions of Italy
          </div>
        </div>

        {selectedRegion && (
          <div className="absolute right-5 top-5 hidden w-[285px] md:block">
            <InfoCard region={selectedRegion} compact onBack={resetMap} />
          </div>
        )}

        {hoverTip && (
          <div
            className={`pointer-events-none absolute z-30 hidden -translate-x-1/2 md:block ${
              hoverTipBelow ? "translate-y-4" : "-translate-y-[calc(100%+18px)]"
            }`}
            style={{
              left: Math.min(
                Math.max(hoverTip.x * containerSize.width, 125),
                containerSize.width - 125,
              ),
              top: hoverTipY,
            }}
          >
            <div className="sourcing-atlas__tooltip w-60 rounded-2xl border border-on-surface/10 bg-heading/95 px-4 py-3.5 text-aged-cream shadow-2xl backdrop-blur-md">
              <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-aged-cream/50">
                {hoverTip.region.eyebrow}
              </span>
              <span className="block font-headline text-base font-semibold">
                {hoverTip.region.name}
              </span>
              <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-aged-cream/60">
                {hoverTip.region.products.join(" · ")}
              </span>
              <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#edbf8a]">
                {selectedId === hoverTip.region.id
                  ? "Selected · click again for Italy"
                  : hoverTip.kind === "marker"
                    ? "Click the pin to explore"
                    : "Click the region to zoom"}
              </span>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 left-4 hidden items-center gap-2 rounded-full border border-white/60 bg-aged-cream/80 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface/80 shadow-md backdrop-blur md:flex">
          <Sparkles className="h-3 w-3 text-primary" aria-hidden="true" />
          Click a region · hover a pin · scroll to zoom
        </div>

        {k > 2.15 && (
          <div className="pointer-events-none absolute bottom-16 left-4 hidden rounded-xl border border-on-surface/10 bg-aged-cream/85 p-1.5 shadow-lg backdrop-blur md:block">
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              className="h-20 w-auto"
              aria-label="Overview of the current map position"
            >
              <path
                d={outline}
                fill="#eee2d1"
                stroke="#9d8d7b"
                strokeWidth="2"
              />
              <rect
                x={cx - MAP_W / (2 * k)}
                y={cy - MAP_H / (2 * k)}
                width={MAP_W / k}
                height={MAP_H / k}
                rx="7"
                fill="#a94f3120"
                stroke="#a94f31"
                strokeWidth="5"
              />
            </svg>
          </div>
        )}

        <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1.5">
          {k > 1.01 && (
            <span className="rounded-full border border-on-surface/10 bg-aged-cream/90 px-2 py-0.5 text-[10px] font-bold tabular-nums text-on-surface/80 shadow-md backdrop-blur">
              {k.toFixed(1)}×
            </span>
          )}
          <div className="flex flex-col overflow-hidden rounded-xl border border-on-surface/10 bg-aged-cream/90 shadow-lg backdrop-blur">
            <ControlButton
              label="Zoom in"
              onClick={() => zoomAt(1.4)}
              disabled={k >= MAX_ZOOM}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </ControlButton>
            <span className="h-px bg-on-surface/10" />
            <ControlButton
              label="Zoom out"
              onClick={() => zoomAt(1 / 1.4)}
              disabled={k <= MIN_ZOOM}
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </ControlButton>
            <span className="h-px bg-on-surface/10" />
            <ControlButton label="Reset map" onClick={resetMap}>
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </ControlButton>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/60 bg-aged-cream/80 px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.14em] text-on-surface/80 shadow-sm backdrop-blur md:hidden">
          <Move className="h-3 w-3" aria-hidden="true" />
          Drag · pinch · tap
        </div>
      </div>

      <div className="mt-4 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:justify-center">
        {sourcingRegions.map((region) => (
          <button
            key={region.id}
            type="button"
            onClick={() => selectRegion(region)}
            className={`shrink-0 snap-start rounded-full border px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] transition-all ${
              selectedId === region.id
                ? "border-primary bg-primary text-white shadow-md"
                : "border-on-surface/10 bg-white/45 text-on-surface/80 hover:border-primary/30 hover:bg-white/70 hover:text-heading"
            }`}
          >
            {region.name}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-[1px] md:hidden">
        {selectedRegion && (
          <InfoCard region={selectedRegion} onBack={resetMap} />
        )}
      </div>

      <p className="mt-4 text-center text-[11px] leading-relaxed tracking-wide text-on-surface/80">
        Regional map data © Openpolis and ISTAT, licensed CC BY 4.0. Context
        data from Natural Earth.
      </p>
    </div>
  );
}
