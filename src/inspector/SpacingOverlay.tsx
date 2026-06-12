import { Band, ChildBox, computeSpacing, GapMarker } from "./spacing";

const PADDING_FILL = "#7C3AED";
const GAP_FILL = "#0BA5A5";
const CHILD_OUTLINE = "#FF4800";

const Label = ({
  value,
  left,
  top,
  background,
}: {
  value: number;
  left: number;
  top: number;
  background: string;
}) => (
  <div
    data-inspector-ui="true"
    className="pointer-events-none fixed z-[2147483646] -translate-x-1/2 -translate-y-1/2 rounded-[3px] px-1 py-px font-mono text-[10px] font-semibold leading-none text-white"
    style={{ left, top, background, fontVariantNumeric: "tabular-nums" }}
  >
    {value}
  </div>
);

const PaddingBand = ({ band }: { band: Band }) => (
  <>
    <div
      data-inspector-ui="true"
      className="pointer-events-none fixed z-[2147483645]"
      style={{
        left: band.left,
        top: band.top,
        width: band.width,
        height: band.height,
        background: `${PADDING_FILL}33`,
      }}
    />
    <Label
      value={band.value}
      left={band.left + band.width / 2}
      top={band.top + band.height / 2}
      background={PADDING_FILL}
    />
  </>
);

const GapBand = ({ gap }: { gap: GapMarker }) => (
  <>
    <div
      data-inspector-ui="true"
      className="pointer-events-none fixed z-[2147483645]"
      style={{
        left: gap.left,
        top: gap.top,
        width: gap.width,
        height: gap.height,
        background: `${GAP_FILL}3D`,
        outline: `1px dashed ${GAP_FILL}`,
        outlineOffset: "-1px",
      }}
    />
    <Label
      value={gap.value}
      left={gap.left + gap.width / 2}
      top={gap.top + gap.height / 2}
      background={GAP_FILL}
    />
  </>
);

const ChildOutline = ({ box }: { box: ChildBox }) => (
  <div
    data-inspector-ui="true"
    className="pointer-events-none fixed z-[2147483644]"
    style={{
      left: box.left,
      top: box.top,
      width: box.width,
      height: box.height,
      outline: `1px dashed ${CHILD_OUTLINE}80`,
      outlineOffset: "-1px",
    }}
  />
);

const SpacingOverlay = ({ element }: { element: HTMLElement }) => {
  const { padding, gaps, children } = computeSpacing(element);

  return (
    <>
      {children.map((box, index) => (
        <ChildOutline key={`child-${index}`} box={box} />
      ))}
      {padding.map((band) => (
        <PaddingBand key={`pad-${band.side}`} band={band} />
      ))}
      {gaps.map((gap, index) => (
        <GapBand key={`gap-${index}`} gap={gap} />
      ))}
    </>
  );
};

export default SpacingOverlay;
