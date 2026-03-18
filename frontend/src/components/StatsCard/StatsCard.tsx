import type { ReactNode } from "react";

type Props = {
  title: string
  value: string
  icon: ReactNode
}

export default function StatsCard({ title, value, icon }: Props) {
  return (
    <div className="stats-card">
      <div className="stats-top">
        <p>{title}</p>
        <div className="stats-icon">{icon}</div>
      </div>

      <h2>{value}</h2>
    </div>
  );
}