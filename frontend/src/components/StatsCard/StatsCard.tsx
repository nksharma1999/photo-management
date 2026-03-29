import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string
  value: string
  icon: ReactNode
  navigateTo?: string
}

export default function StatsCard({ title, value, icon, navigateTo }: Props) {
  const navigate = useNavigate();
  return (
      <div className="stats-card" onClick={()=> navigate(navigateTo || "")}>
        <div className="stats-top">
        <p>{title}</p>
        <div className="stats-icon">{icon}</div>
      </div>

      <h2>{value}</h2>
    </div>
  );
}