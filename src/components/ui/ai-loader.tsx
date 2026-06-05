import { cn } from "@/lib/utils";

interface AILoaderProps {
  size?: number;
  className?: string;
}

export const AILoader = ({ size = 16, className }: AILoaderProps) => (
  <span
    role="status"
    aria-label="Loading"
    className={cn("ai-loader-star shrink-0", className)}
    style={{ width: size, height: size }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 67 67"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path
        d="M14.36236,13.828641c-7.17984,0-13.17528-5.882486-13.17528-12.93287C1.18736,0.408103,0.7718,0,0.275,0c-.50322,0-.91236.401714-.91236.895765c0,7.05045-5.99532,12.932876-13.17525,12.932876-.504439,0-.91239.401716-.91239.895729v.0012c0,.495273.407951.895789.91239.895789c7.17981,0,13.17525,5.882486,13.17525,12.932852c0,.487652.41556.895789.91236.895789.50322,0,.91236-.401716.91236-.895789c0-7.050426,5.99526-12.932852,13.17528-12.932852.50442,0,.91236-.401716.91236-.895789v-.0012c0-.495213-.40794-.895729-.91236-.895729Z"
        fill="var(--trellis-color-magenta-900, #d20688)"
        transform="translate(33.2 18.75)"
      />
    </svg>
  </span>
);

export default AILoader;
