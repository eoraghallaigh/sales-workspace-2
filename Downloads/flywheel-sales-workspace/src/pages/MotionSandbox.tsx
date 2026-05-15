import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { CheckCircle2, Info, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TransitionKind = "spring" | "tween";

type EaseName = "easeOut" | "easeIn" | "easeInOut" | "linear" | "backOut";

type SandboxConfig = {
  kind: TransitionKind;
  // spring
  stiffness: number;
  damping: number;
  mass: number;
  // tween
  duration: number;
  ease: EaseName;
  // shared visual
  initialScale: number;
  exitScale: number;
  opacityDuration: number;
  // playback
  autoplay: boolean;
  autoplayInterval: number; // seconds between cycles
};

const DEFAULT_CONFIG: SandboxConfig = {
  kind: "spring",
  stiffness: 520,
  damping: 26,
  mass: 0.6,
  duration: 0.22,
  ease: "easeOut",
  initialScale: 0.7,
  exitScale: 0.85,
  opacityDuration: 0.12,
  autoplay: false,
  autoplayInterval: 2,
};

const PRESETS: { name: string; description: string; config: Partial<SandboxConfig> }[] = [
  {
    name: "Snappy (current)",
    description: "Quick, playful pop — used in Variant C today",
    config: {
      kind: "spring",
      stiffness: 520,
      damping: 26,
      mass: 0.6,
      initialScale: 0.7,
      exitScale: 0.85,
      opacityDuration: 0.12,
    },
  },
  {
    name: "Bouncy",
    description: "Overshoots before settling",
    config: {
      kind: "spring",
      stiffness: 380,
      damping: 14,
      mass: 0.8,
      initialScale: 0.6,
      exitScale: 0.9,
      opacityDuration: 0.12,
    },
  },
  {
    name: "Smooth",
    description: "Gentle, no overshoot — Apple-ish",
    config: {
      kind: "spring",
      stiffness: 260,
      damping: 30,
      mass: 0.9,
      initialScale: 0.92,
      exitScale: 0.96,
      opacityDuration: 0.16,
    },
  },
  {
    name: "Tween / easeOut",
    description: "Classic fixed-duration ease",
    config: {
      kind: "tween",
      duration: 0.2,
      ease: "easeOut",
      initialScale: 0.9,
      exitScale: 0.95,
      opacityDuration: 0.12,
    },
  },
];

const PvsCopy = {
  title: "High value prospect",
  points: [
    "Already using our free product",
    "75 employees",
    "Extensive tech adoption (28+ technologies)",
    "Contacts use work emails",
    "Previous sales activity (engaged ~8 months ago)",
    "Recently founded (2020)",
    "Recent HINQL: ISC",
  ],
};

const PreviewTooltip = ({
  open,
  onOpenChange,
  config,
  cycleKey,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  config: SandboxConfig;
  cycleKey: number;
}) => {
  const transition = useMemo(() => {
    if (config.kind === "spring") {
      return {
        type: "spring" as const,
        stiffness: config.stiffness,
        damping: config.damping,
        mass: config.mass,
        opacity: { duration: config.opacityDuration },
      };
    }
    return {
      duration: config.duration,
      ease: config.ease,
      opacity: { duration: config.opacityDuration },
    };
  }, [config]);

  return (
    <HoverCardPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      openDelay={0}
      closeDelay={0}
    >
      <HoverCardPrimitive.Trigger asChild>
        <span className="inline-flex items-center gap-1 cursor-default rounded-[3px] border border-dashed border-border px-2 py-1 text-sm text-foreground">
          PVS High
          <Info
            className="text-muted-foreground flex-shrink-0"
            style={{ width: 12, height: 12 }}
            strokeWidth={2}
            aria-hidden="true"
          />
        </span>
      </HoverCardPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <HoverCardPrimitive.Portal forceMount>
            <HoverCardPrimitive.Content
              forceMount
              side="top"
              align="start"
              sideOffset={8}
              asChild
              className="z-50 w-auto max-w-[440px] p-0 rounded-[3px] border border-border bg-card shadow-[0px_1px_12px_0px_rgba(0,0,0,0.08)] outline-none"
            >
              <motion.div
                key={cycleKey}
                initial={{ opacity: 0, scale: config.initialScale }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: config.exitScale }}
                transition={transition}
                style={{
                  transformOrigin:
                    "var(--radix-hover-card-content-transform-origin)",
                }}
              >
                <div className="flex flex-col">
                  <div className="px-5 pt-5 pb-0">
                    <p className="heading-100 text-foreground">
                      {PvsCopy.title}
                    </p>
                  </div>
                  <div className="px-6 py-5">
                    <ul className="flex flex-col gap-3">
                      {PvsCopy.points.map((point) => (
                        <li key={point} className="flex items-center gap-2">
                          <CheckCircle2
                            className="w-4 h-4 text-trellis-green-800 flex-shrink-0"
                            strokeWidth={2}
                          />
                          <span className="body-100 text-foreground">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </HoverCardPrimitive.Content>
          </HoverCardPrimitive.Portal>
        )}
      </AnimatePresence>
    </HoverCardPrimitive.Root>
  );
};

const codeForConfig = (config: SandboxConfig) => {
  const transitionBody =
    config.kind === "spring"
      ? `  type: "spring",
  stiffness: ${config.stiffness},
  damping: ${config.damping},
  mass: ${config.mass},
  opacity: { duration: ${config.opacityDuration} },`
      : `  duration: ${config.duration},
  ease: "${config.ease}",
  opacity: { duration: ${config.opacityDuration} },`;

  return `<motion.div
  initial={{ opacity: 0, scale: ${config.initialScale} }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: ${config.exitScale} }}
  transition={{
${transitionBody}
  }}
  style={{
    transformOrigin:
      "var(--radix-hover-card-content-transform-origin)",
  }}
/>`;
};

const SliderRow = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  format?: (n: number) => string;
}) => (
  <div className="space-y-2">
    <div className="flex items-baseline justify-between">
      <Label className="text-sm text-foreground">{label}</Label>
      <span className="text-sm tabular-nums text-muted-foreground">
        {format ? format(value) : value}
      </span>
    </div>
    <Slider
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={([v]) => onChange(v)}
    />
  </div>
);

const MotionSandbox = () => {
  const [config, setConfig] = useState<SandboxConfig>(DEFAULT_CONFIG);
  const [open, setOpen] = useState(true);
  const [cycleKey, setCycleKey] = useState(0);
  const autoplayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = <K extends keyof SandboxConfig>(key: K, value: SandboxConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const replay = () => {
    setOpen(false);
    setCycleKey((k) => k + 1);
    window.setTimeout(() => setOpen(true), 220);
  };

  useEffect(() => {
    if (autoplayTimer.current) {
      clearTimeout(autoplayTimer.current);
      autoplayTimer.current = null;
    }
    if (!config.autoplay) return;
    const loop = () => {
      setOpen(false);
      autoplayTimer.current = setTimeout(() => {
        setCycleKey((k) => k + 1);
        setOpen(true);
        autoplayTimer.current = setTimeout(
          loop,
          Math.max(0.6, config.autoplayInterval) * 1000,
        );
      }, 350);
    };
    autoplayTimer.current = setTimeout(
      loop,
      Math.max(0.6, config.autoplayInterval) * 1000,
    );
    return () => {
      if (autoplayTimer.current) clearTimeout(autoplayTimer.current);
    };
  }, [config.autoplay, config.autoplayInterval]);

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setConfig((prev) => ({ ...prev, ...preset.config }));
    setCycleKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-8 py-5">
        <h1 className="heading-300">Motion sandbox</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tune the PVS tooltip animation. Hover the trigger or hit Replay to
          re-trigger the entrance.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-0">
        <aside className="border-r border-border p-6 space-y-6 max-h-[calc(100vh-78px)] overflow-y-auto">
          <section className="space-y-3">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Presets
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className="text-left rounded-[3px] border border-border px-3 py-2 hover:bg-muted/50 transition-colors"
                >
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {p.description}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Transition type
            </h2>
            <Tabs
              value={config.kind}
              onValueChange={(v) => update("kind", v as TransitionKind)}
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="spring">Spring</TabsTrigger>
                <TabsTrigger value="tween">Tween</TabsTrigger>
              </TabsList>
            </Tabs>
          </section>

          {config.kind === "spring" ? (
            <section className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Spring
              </h2>
              <SliderRow
                label="Stiffness"
                value={config.stiffness}
                min={50}
                max={1000}
                step={10}
                onChange={(v) => update("stiffness", v)}
              />
              <SliderRow
                label="Damping"
                value={config.damping}
                min={1}
                max={60}
                step={1}
                onChange={(v) => update("damping", v)}
              />
              <SliderRow
                label="Mass"
                value={config.mass}
                min={0.1}
                max={3}
                step={0.1}
                onChange={(v) => update("mass", v)}
                format={(v) => v.toFixed(1)}
              />
            </section>
          ) : (
            <section className="space-y-4">
              <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                Tween
              </h2>
              <SliderRow
                label="Duration (s)"
                value={config.duration}
                min={0.05}
                max={1}
                step={0.01}
                onChange={(v) => update("duration", v)}
                format={(v) => v.toFixed(2)}
              />
              <div className="space-y-2">
                <Label className="text-sm">Easing</Label>
                <Select
                  value={config.ease}
                  onValueChange={(v) => update("ease", v as EaseName)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easeOut">easeOut</SelectItem>
                    <SelectItem value="easeIn">easeIn</SelectItem>
                    <SelectItem value="easeInOut">easeInOut</SelectItem>
                    <SelectItem value="linear">linear</SelectItem>
                    <SelectItem value="backOut">backOut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Scale &amp; opacity
            </h2>
            <SliderRow
              label="Initial scale"
              value={config.initialScale}
              min={0.1}
              max={1}
              step={0.01}
              onChange={(v) => update("initialScale", v)}
              format={(v) => v.toFixed(2)}
            />
            <SliderRow
              label="Exit scale"
              value={config.exitScale}
              min={0.1}
              max={1.2}
              step={0.01}
              onChange={(v) => update("exitScale", v)}
              format={(v) => v.toFixed(2)}
            />
            <SliderRow
              label="Opacity duration (s)"
              value={config.opacityDuration}
              min={0}
              max={0.5}
              step={0.01}
              onChange={(v) => update("opacityDuration", v)}
              format={(v) => v.toFixed(2)}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Playback
            </h2>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Autoplay loop</Label>
              <Switch
                checked={config.autoplay}
                onCheckedChange={(v) => update("autoplay", v)}
              />
            </div>
            {config.autoplay && (
              <SliderRow
                label="Loop interval (s)"
                value={config.autoplayInterval}
                min={0.6}
                max={6}
                step={0.1}
                onChange={(v) => update("autoplayInterval", v)}
                format={(v) => v.toFixed(1)}
              />
            )}
            <div className="flex gap-2">
              <Button onClick={replay} variant="default" className="flex-1">
                <RotateCw className="w-4 h-4 mr-2" />
                Replay
              </Button>
              <Button
                onClick={() => {
                  setConfig(DEFAULT_CONFIG);
                  setCycleKey((k) => k + 1);
                }}
                variant="outline"
              >
                Reset
              </Button>
            </div>
          </section>
        </aside>

        <main className="p-10 flex flex-col gap-8 items-center">
          <div className="w-full max-w-[760px] flex flex-col items-center gap-3">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              Preview
            </div>
            <div className="w-full rounded-[3px] border border-border bg-card flex items-center justify-center px-6 py-24 min-h-[480px]">
              <PreviewTooltip
                open={open}
                onOpenChange={setOpen}
                config={config}
                cycleKey={cycleKey}
              />
            </div>
          </div>

          <div className="w-full max-w-[760px]">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Code
            </div>
            <pre className="rounded-[3px] border border-border bg-muted/40 p-4 text-xs leading-relaxed overflow-x-auto">
              <code>{codeForConfig(config)}</code>
            </pre>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MotionSandbox;
