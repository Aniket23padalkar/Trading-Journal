interface IconProps {
  name: string;
  size: number;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
}

export default function Icon({
  name,
  size = 20,
  stroke,
  strokeWidth,
  className = "",
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      stroke={stroke}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
    >
      <use href={`/icons/sprite.svg#${name}`} />
    </svg>
  );
}
