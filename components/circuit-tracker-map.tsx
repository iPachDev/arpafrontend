"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  curveCatmullRomClosed,
  line,
  select,
  zoom,
  zoomIdentity,
  type ZoomBehavior,
} from "d3";
import {
  LocateFixed,
  MapPinned,
  Radio,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BusinessLocation } from "@/lib/locations";

type LiveRace = NonNullable<BusinessLocation["liveRace"]>;
type Driver = LiveRace["participants"][number];
type AnimatedDriver = Driver & {
  baseProgress: number;
  color: string;
  speed: number;
};

export const circuitDriverColors = [
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#3b82f6",
  "#ec4899",
  "#84cc16",
];

const circuitCoordinates: Array<[number, number]> = [
  [112, 430], [90, 372], [100, 315], [135, 270], [205, 250],
  [268, 270], [308, 235], [300, 178], [335, 125], [405, 96],
  [475, 112], [520, 158], [540, 205], [590, 226], [642, 194],
  [695, 142], [758, 112], [820, 140], [856, 194], [864, 256],
  [838, 305], [780, 324], [730, 354], [742, 402], [806, 424],
  [850, 466], [842, 518], [792, 550], [720, 548], [660, 516],
  [606, 475], [545, 456], [490, 474], [450, 522], [392, 548],
  [326, 536], [278, 500], [254, 452], [196, 430],
];

const driverProgress = [0.735, 0.704, 0.672, 0.628, 0.574, 0.49, 0.42, 0.34];

export function CircuitTrackerMap({
  race,
  hoveredNumber,
  onHoveredNumberChange,
}: {
  race: LiveRace;
  hoveredNumber: string | null;
  onHoveredNumberChange: (number: string | null) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [direction, setDirection] = useState<"clockwise" | "counterclockwise">(
    "clockwise",
  );
  const pathData = useMemo(
    () =>
      line<[number, number]>()
        .x((point) => point[0])
        .y((point) => point[1])
        .curve(curveCatmullRomClosed.alpha(0.55))(circuitCoordinates) ?? "",
    [],
  );
  const hoveredDriver = race.participants.find(
    (participant) => participant.number === hoveredNumber,
  );

  useEffect(() => {
    const svgElement = svgRef.current;
    const trackElement = trackRef.current;
    if (!svgElement || !trackElement) return;

    const svg = select(svgElement);
    const viewport = svg.select<SVGGElement>(".circuit-viewport");
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 3.5])
      .translateExtent([[-150, -120], [1100, 720]])
      .on("zoom", (event) => {
        viewport.attr("transform", event.transform.toString());
      });
    zoomBehaviorRef.current = zoomBehavior;
    svg.call(zoomBehavior);

    const trackLength = trackElement.getTotalLength();
    const drivers: AnimatedDriver[] = race.participants.map(
      (participant, index) => ({
        ...participant,
        baseProgress: driverProgress[index] ?? 0.3 - index * 0.035,
        color: circuitDriverColors[index % circuitDriverColors.length],
        speed: 0.012 + (race.participants.length - index) * 0.00018,
      }),
    );

    const markers = viewport
      .select<SVGGElement>(".driver-markers")
      .selectAll<SVGGElement, AnimatedDriver>("g.driver-marker")
      .data(drivers, (participant) => participant.number)
      .join((enter) => {
        const group = enter
          .append("g")
          .attr("class", "driver-marker cursor-pointer")
          .attr("tabindex", 0)
          .attr("role", "button");
        group.append("circle").attr("r", 16).attr("stroke-width", 4);
        group
          .append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "0.35em")
          .attr("font-size", 10)
          .attr("font-weight", 800)
          .attr("fill", "white");
        return group;
      });

    markers
      .attr("aria-label", (participant) =>
        `Piloto ${participant.name}, número ${participant.number}`,
      )
      .on("mouseenter focus", (_, participant) =>
        onHoveredNumberChange(participant.number),
      )
      .on("mouseleave blur", () => onHoveredNumberChange(null));
    markers
      .select("circle")
      .attr("fill", (participant) => participant.color)
      .attr("stroke", "var(--background)");
    markers.select("text").text((participant) => participant.number);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const startedAt = performance.now();
    let animationFrame = 0;

    const renderPositions = (timestamp: number) => {
      const elapsedSeconds = reducedMotion ? 0 : (timestamp - startedAt) / 1000;
      markers.attr("transform", (participant) => {
        const directionMultiplier = direction === "clockwise" ? 1 : -1;
        const progress =
          (participant.baseProgress +
            elapsedSeconds * participant.speed * directionMultiplier +
            1) %
          1;
        const point = trackElement.getPointAtLength(trackLength * progress);
        return `translate(${point.x},${point.y})`;
      });
      if (!reducedMotion) animationFrame = requestAnimationFrame(renderPositions);
    };
    renderPositions(startedAt);

    return () => {
      cancelAnimationFrame(animationFrame);
      svg.on(".zoom", null);
    };
  }, [direction, onHoveredNumberChange, race]);

  useEffect(() => {
    if (!svgRef.current) return;
    select(svgRef.current)
      .selectAll<SVGCircleElement, AnimatedDriver>(".driver-marker circle")
      .attr("r", (participant) =>
        participant.number === hoveredNumber ? 19 : 16,
      );
  }, [hoveredNumber]);

  function scaleCircuit(factor: number) {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    select(svgRef.current)
      .transition()
      .duration(250)
      .call(zoomBehaviorRef.current.scaleBy, factor);
  }

  function resetCircuit() {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomBehaviorRef.current.transform, zoomIdentity);
  }

  return (
    <div className="relative min-h-[540px] overflow-hidden bg-muted/20">
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <Badge variant="secondary"><MapPinned /> Circuito SVG + D3</Badge>
        <Badge variant="outline"><Radio className="text-red-500" /> Posiciones en vivo</Badge>
        <Select
          value={direction}
          onValueChange={(value) =>
            setDirection(value as "clockwise" | "counterclockwise")
          }
        >
          <SelectTrigger className="h-7 w-44 bg-background/90 backdrop-blur-sm">
            {direction === "clockwise" ? <RotateCw /> : <RotateCcw />}
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clockwise">Sentido horario</SelectItem>
            <SelectItem value="counterclockwise">Sentido antihorario</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1 rounded-xl border bg-background/85 p-1 shadow-sm backdrop-blur-md">
        <Button type="button" size="icon" variant="outline" aria-label="Acercar circuito" onClick={() => scaleCircuit(1.3)}><ZoomIn /></Button>
        <Button type="button" size="icon" variant="outline" aria-label="Alejar circuito" onClick={() => scaleCircuit(0.77)}><ZoomOut /></Button>
        <Button type="button" size="icon" variant="outline" aria-label="Restablecer circuito" onClick={resetCircuit}><RotateCcw /></Button>
      </div>

      {hoveredDriver && (
        <Card size="sm" className="absolute right-4 bottom-4 z-10 w-64">
          <CardHeader>
            <CardDescription>Piloto #{hoveredDriver.number}</CardDescription>
            <CardTitle>{hoveredDriver.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-xs">
            <div><p className="text-muted-foreground">Vuelta actual</p><p className="font-mono font-semibold">{hoveredDriver.currentLapTime} s</p></div>
            <div><p className="text-muted-foreground">Mejor vuelta</p><p className="font-mono font-semibold">{hoveredDriver.bestLapTime} s</p></div>
          </CardContent>
        </Card>
      )}

      <svg ref={svgRef} viewBox="55 55 850 535" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full touch-none" role="img" aria-label="Circuito SVG animado con la ubicación de los pilotos">
        <defs>
          <pattern id="checkered-finish" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill="var(--background)" />
            <rect width="6" height="6" fill="var(--foreground)" />
            <rect x="6" y="6" width="6" height="6" fill="var(--foreground)" />
          </pattern>
        </defs>
        <g className="circuit-viewport">
          <path ref={trackRef} d={pathData} fill="none" stroke="var(--border)" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" />
          <path d={pathData} fill="none" stroke="var(--background)" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
          <path d={pathData} pathLength="100" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="32 68" />
          <path d={pathData} pathLength="100" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="34 66" strokeDashoffset="-32" />
          <path d={pathData} pathLength="100" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="34 66" strokeDashoffset="-66" />
          <g transform="translate(114 454) rotate(14 12 12)" aria-label="Meta"><rect width="24" height="24" rx="2" fill="url(#checkered-finish)" stroke="var(--border)" strokeWidth="2" /></g>
          <g className="text-[8px] font-bold">
            <g transform="translate(365 88)"><rect x="-10" y="-7" width="20" height="14" rx="4" fill="#f59e0b" /><text textAnchor="middle" dy="0.35em" fill="white">S1</text></g>
            <g transform="translate(866 306)"><rect x="-10" y="-7" width="20" height="14" rx="4" fill="#ef4444" /><text textAnchor="middle" dy="0.35em" fill="white">S2</text></g>
            <g transform="translate(438 548)"><rect x="-10" y="-7" width="20" height="14" rx="4" fill="#0ea5e9" /><text textAnchor="middle" dy="0.35em" fill="white">S3</text></g>
          </g>
          <g className="driver-markers" />
        </g>
      </svg>

      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 text-xs text-muted-foreground">
        <LocateFixed className="size-4" /> Pilotos en movimiento · arrastra para mover
      </div>
    </div>
  );
}
