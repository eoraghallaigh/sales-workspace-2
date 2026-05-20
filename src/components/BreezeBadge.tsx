interface BreezeBadgeProps {
  className?: string;
}

const BreezeBadge = ({ className = "" }: BreezeBadgeProps) => (
  <span
    data-figma-component-key="7069:6182"
    className={`inline-flex items-center justify-center align-middle gap-[2px] px-1 py-[3px] ${className}`}
    style={{
      borderRadius: "4px",
      background:
        "var(--specialty-breeze-color-fill-special-btn-default, linear-gradient(114deg, var(--specialty-breeze-color-fill-special-btn-default-gradient-stop1-color, #FF3842) 7.66%, var(--specialty-breeze-color-fill-special-btn-default-gradient-stop2-color, #D20688) 100.76%)) padding-box, linear-gradient(114deg, var(--specialty-breeze-color-border-badge-default-gradient-stop1-color, #FF3842) 7.66%, var(--specialty-breeze-color-border-badge-default-gradient-stop2-color, #D20688) 100.76%) border-box",
      border: "1px solid transparent",
    }}
  >
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M4 0.0027771C4.15777 0.0027771 4.28568 0.130728 4.28571 0.288491C4.28571 2.18212 5.82065 3.71706 7.71429 3.71706C7.87206 3.71706 7.99996 3.84501 8 4.00278C8 4.16057 7.87208 4.28849 7.71429 4.28849C5.82068 4.28849 4.28575 5.82346 4.28571 7.71706C4.28571 7.87486 4.1578 8.00278 4 8.00278C3.8422 8.00278 3.71429 7.87486 3.71429 7.71706C3.71425 5.82346 2.17932 4.28849 0.285714 4.28849C0.127919 4.28849 0 4.16057 0 4.00278C3.76915e-05 3.84501 0.127942 3.71706 0.285714 3.71706C2.17935 3.71706 3.71429 2.18212 3.71429 0.288491C3.71432 0.130728 3.84223 0.0027771 4 0.0027771Z"
        fill="white"
      />
    </svg>
    <span
      style={{
        color: "var(--color-text-core-on-fill-default, #FFF)",
        fontFeatureSettings: "'ss01' on",
        fontFamily: 'var(--typography-detail-100-fontFamily, "Lexend Deca")',
        fontSize: "var(--typography-detail-100-fontSize, 12px)",
        fontStyle: "normal",
        fontWeight: "var(--typography-detail-100-fontWeight, 300)" as unknown as number,
        lineHeight: "var(--typography-detail-100-lineHeight, 14px)",
        letterSpacing: "var(--typography-detail-100-letterSpacing, 0)",
        whiteSpace: "nowrap",
      }}
    >
      AI
    </span>
  </span>
);

export default BreezeBadge;
