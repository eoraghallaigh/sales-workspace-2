// DevTools-style flexbox glyphs for the sandbox icon controls.
// Every icon draws on a 20×20 grid with `currentColor`, so the button's text
// colour drives active/inactive state. Justify and align icons take
// `mainVertical` (true when flex-direction is a column) and rotate their
// geometry so the glyph always reflects the element's real main/cross axes.

const Svg = ({ children }: { children: React.ReactNode }) => (
  <svg width={18} height={18} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {children}
  </svg>
);

const Dot = ({ x, y }: { x: number; y: number }) => (
  <rect x={x - 1.25} y={y - 1.25} width={2.5} height={2.5} rx={0.75} fill="currentColor" />
);

// ---- flex-direction -------------------------------------------------------

const Arrow = ({ dir }: { dir: "right" | "left" | "down" | "up" }) => {
  const stroke = {
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (dir === "right")
    return <path d="M4 14 H16 M13 11 L16 14 L13 17" {...stroke} />;
  if (dir === "left")
    return <path d="M16 14 H4 M7 11 L4 14 L7 17" {...stroke} />;
  if (dir === "down")
    return <path d="M14 4 V16 M11 13 L14 16 L17 13" {...stroke} />;
  return <path d="M14 16 V4 M11 7 L14 4 L17 7" {...stroke} />;
};

const directionDots = (horizontal: boolean) =>
  [5, 10, 15].map((p, i) =>
    horizontal ? <Dot key={i} x={p} y={7} /> : <Dot key={i} x={7} y={p} />,
  );

export const DirectionIcon = ({ value }: { value: string }) => {
  const horizontal = value === "row" || value === "row-reverse";
  const dir =
    value === "row"
      ? "right"
      : value === "row-reverse"
        ? "left"
        : value === "column"
          ? "down"
          : "up";
  return (
    <Svg>
      {directionDots(horizontal)}
      <Arrow dir={dir} />
    </Svg>
  );
};

// ---- flex-wrap ------------------------------------------------------------

export const WrapIcon = ({ value }: { value: string }) => {
  if (value === "nowrap")
    return (
      <Svg>
        {[4, 10, 16].map((x) => (
          <Dot key={x} x={x} y={10} />
        ))}
      </Svg>
    );
  const topRow = value === "wrap-reverse" ? [4, 10] : [4, 10, 16];
  const bottomRow = value === "wrap-reverse" ? [4, 10, 16] : [4, 10];
  return (
    <Svg>
      {topRow.map((x) => (
        <Dot key={`t${x}`} x={x} y={6} />
      ))}
      {bottomRow.map((x) => (
        <Dot key={`b${x}`} x={x} y={14} />
      ))}
    </Svg>
  );
};

// ---- justify-content (distribution along the main axis) -------------------

const JUSTIFY_CENTERS: Record<string, number[]> = {
  "flex-start": [4, 7.5, 11],
  center: [6.5, 10, 13.5],
  "flex-end": [9, 12.5, 16],
  "space-between": [3.5, 10, 16.5],
  "space-around": [4.7, 10, 15.3],
  "space-evenly": [5, 10, 15],
};

export const JustifyIcon = ({
  value,
  mainVertical,
}: {
  value: string;
  mainVertical: boolean;
}) => {
  const centers = JUSTIFY_CENTERS[value] ?? JUSTIFY_CENTERS["flex-start"];
  const thickness = 2.5;
  const length = 12;
  return (
    <Svg>
      {centers.map((c, i) =>
        mainVertical ? (
          <rect
            key={i}
            x={(20 - length) / 2}
            y={c - thickness / 2}
            width={length}
            height={thickness}
            rx={1}
            fill="currentColor"
          />
        ) : (
          <rect
            key={i}
            x={c - thickness / 2}
            y={(20 - length) / 2}
            width={thickness}
            height={length}
            rx={1}
            fill="currentColor"
          />
        ),
      )}
    </Svg>
  );
};

// ---- align-items (offset along the cross axis) ----------------------------

const alignSpan = (
  value: string,
): { start: number; size: number } => {
  switch (value) {
    case "flex-start":
    case "baseline":
      return { start: 3, size: 7 };
    case "center":
      return { start: 6.5, size: 7 };
    case "flex-end":
      return { start: 10, size: 7 };
    case "stretch":
    default:
      return { start: 3, size: 14 };
  }
};

export const AlignIcon = ({
  value,
  mainVertical,
}: {
  value: string;
  mainVertical: boolean;
}) => {
  const { start, size } = alignSpan(value);
  const mainCenters = [5, 10, 15];
  const itemMain = 3;
  const showBaseline = value === "baseline";
  return (
    <Svg>
      {mainCenters.map((m, i) =>
        mainVertical ? (
          <rect
            key={i}
            x={start}
            y={m - itemMain / 2}
            width={size}
            height={itemMain}
            rx={1}
            fill="currentColor"
          />
        ) : (
          <rect
            key={i}
            x={m - itemMain / 2}
            y={start}
            width={itemMain}
            height={size}
            rx={1}
            fill="currentColor"
          />
        ),
      )}
      {showBaseline &&
        (mainVertical ? (
          <path d="M10 3 V17" stroke="currentColor" strokeWidth={1} strokeDasharray="2 2" />
        ) : (
          <path d="M3 10 H17" stroke="currentColor" strokeWidth={1} strokeDasharray="2 2" />
        ))}
    </Svg>
  );
};
