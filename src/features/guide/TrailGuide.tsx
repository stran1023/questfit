type TrailGuideMood = "welcome" | "thinking" | "pointing" | "cheering";

type TrailGuideProps = { message: string; mood?: TrailGuideMood; compact?: boolean };

const moodLabel: Record<TrailGuideMood, string> = {
  welcome: "waving",
  thinking: "checking the route",
  pointing: "pointing ahead",
  cheering: "celebrating",
};

export function TrailGuide({ message, mood = "welcome", compact = false }: TrailGuideProps) {
  return (
    <aside className={`trail-guide trail-guide-${mood}${compact ? " trail-guide-compact" : ""}`} aria-label="Scout, your AI trail guide">
      <div className="trail-guide-portrait" role="img" aria-label={`Scout ${moodLabel[mood]}`} />
      <div className="trail-guide-dialogue"><span><b>Scout</b> · AI trail guide</span><p>{message}</p></div>
    </aside>
  );
}
