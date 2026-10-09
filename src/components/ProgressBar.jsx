export default function ProgressBar({ value = 0, label = "Progression" }) {
  return (
    <div className="progress-component">
      <div className="progress-label"><span>{label}</span><strong>{value}%</strong></div>
      <div className="progress-track"><div className="progress-value" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
    </div>
  );
}
