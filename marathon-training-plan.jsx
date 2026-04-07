import { useState, useEffect, useCallback } from "react";

const WEEKS = [
  { week: 1, phase: "Base Building", totalMiles: 28, days: [
    { day: "Mon", type: "Easy", desc: "4 mi easy (10:00–10:30 pace)", miles: 4, detail: "Conversational pace. If you can't talk in full sentences, slow down." },
    { day: "Tue", type: "Tempo", desc: "5 mi w/ 2 mi tempo (9:00–9:10)", miles: 5, detail: "1 mi warmup, 2 mi at goal marathon pace, 1 mi cooldown, 1 mi easy. Tempo = comfortably hard." },
    { day: "Wed", type: "Rest/Lift", desc: "Strength training or full rest", miles: 0, detail: "Full body lift: squats, deadlifts, lunges, core. Keep it moderate — you're supporting running, not bodybuilding." },
    { day: "Thu", type: "Easy", desc: "4 mi easy", miles: 4, detail: "Recovery pace. These runs build aerobic base without taxing your system." },
    { day: "Fri", type: "Intervals", desc: "5 mi w/ 4×800m @ 8:20", miles: 5, detail: "1 mi warmup, 4×800m at 8:15–8:25 with 400m jog recovery, 1 mi cooldown. Builds VO2max." },
    { day: "Sat", type: "Long Run", desc: "10 mi easy (10:00–10:30)", miles: 10, detail: "Start practicing fueling: bring water + 1 gel or chews at mile 5. This is your weekly cornerstone run." },
    { day: "Sun", type: "Rest", desc: "Full rest", miles: 0, detail: "Sleep, hydrate, stretch. Recovery is where adaptation happens." },
  ]},
  { week: 2, phase: "Base Building", totalMiles: 31, days: [
    { day: "Mon", type: "Easy", desc: "4 mi easy", miles: 4, detail: "Same easy effort. Stay disciplined — easy days should feel genuinely easy." },
    { day: "Tue", type: "Tempo", desc: "6 mi w/ 3 mi tempo (9:00–9:10)", miles: 6, detail: "1.5 mi warmup, 3 mi at marathon pace, 1.5 mi cooldown. Extending tempo duration." },
    { day: "Wed", type: "Rest/Lift", desc: "Strength training", miles: 0, detail: "Same full body approach. Add single-leg exercises: Bulgarian split squats, single-leg deadlifts." },
    { day: "Thu", type: "Easy", desc: "5 mi easy", miles: 5, detail: "Slight bump in easy mileage. Listen to your body." },
    { day: "Fri", type: "Intervals", desc: "5 mi w/ 5×800m @ 8:20", miles: 5, detail: "Added one interval. Keep recovery jogs honest — don't rush them." },
    { day: "Sat", type: "Long Run", desc: "11 mi easy", miles: 11, detail: "Fuel at mile 5 and mile 8. Practice eating/drinking while running — it's a skill." },
    { day: "Sun", type: "Rest", desc: "Full rest", miles: 0, detail: "Recovery day. Foam roll, hydrate, eat well." },
  ]},
  { week: 3, phase: "Build Phase", totalMiles: 35, days: [
    { day: "Mon", type: "Easy", desc: "5 mi easy", miles: 5, detail: "Steady easy effort. You should finish these runs feeling like you could do more." },
    { day: "Tue", type: "Tempo", desc: "7 mi w/ 4 mi tempo (8:55–9:05)", miles: 7, detail: "1.5 mi warmup, 4 mi at or slightly below marathon pace, 1.5 mi cooldown." },
    { day: "Wed", type: "Rest/Lift", desc: "Strength training", miles: 0, detail: "Reduce weight slightly as mileage increases. Focus on hip stability and glute activation." },
    { day: "Thu", type: "Easy", desc: "5 mi easy", miles: 5, detail: "Recovery effort. Good day for a flat, easy route." },
    { day: "Fri", type: "Intervals", desc: "6 mi w/ 6×800m @ 8:15", miles: 6, detail: "Slight pace increase on intervals. These build the speed reserve that makes marathon pace feel easier." },
    { day: "Sat", type: "Long Run", desc: "12 mi easy", miles: 12, detail: "First time past your 11.8 wall — but this time with fuel. Gel/chews every 45 min after mile 4." },
    { day: "Sun", type: "Rest", desc: "Full rest", miles: 0, detail: "Big week. Rest hard." },
  ]},
  { week: 4, phase: "Build Phase", totalMiles: 32, days: [
    { day: "Mon", type: "Easy", desc: "4 mi easy", miles: 4, detail: "Cutback week — intentionally lower volume to let your body absorb the work from weeks 1–3." },
    { day: "Tue", type: "Tempo", desc: "5 mi w/ 2 mi tempo", miles: 5, detail: "Shorter tempo. This is active recovery, not a push week." },
    { day: "Wed", type: "Rest/Lift", desc: "Strength or rest", miles: 0, detail: "Light session or full rest. Cutback weeks prevent overtraining." },
    { day: "Thu", type: "Easy", desc: "4 mi easy", miles: 4, detail: "Relaxed effort. Enjoy the lower volume." },
    { day: "Fri", type: "Intervals", desc: "5 mi w/ 4×800m @ 8:15", miles: 5, detail: "Fewer intervals, same quality. Stay sharp without accumulating fatigue." },
    { day: "Sat", type: "Long Run", desc: "14 mi easy", miles: 14, detail: "Despite being cutback, the long run still progresses. Fuel every 30–45 min. Test your race-day nutrition plan." },
    { day: "Sun", type: "Rest", desc: "Full rest", miles: 0, detail: "Rest and assess: any nagging pains? Address them now before peak weeks." },
  ]},
  { week: 5, phase: "Peak Phase", totalMiles: 39, days: [
    { day: "Mon", type: "Easy", desc: "5 mi easy", miles: 5, detail: "Back to building. You should feel refreshed from cutback week." },
    { day: "Tue", type: "Tempo", desc: "8 mi w/ 5 mi tempo (8:50–9:00)", miles: 8, detail: "Biggest tempo yet. 1.5 mi warmup, 5 mi at marathon pace, 1.5 mi cooldown. This is a key workout." },
    { day: "Wed", type: "Rest/Lift", desc: "Light strength", miles: 0, detail: "Reduce lifting intensity. Focus on mobility, hip stability, and core. No heavy squats." },
    { day: "Thu", type: "Easy", desc: "5 mi easy", miles: 5, detail: "Legs might be heavy from Tuesday. That's fine — keep the effort easy." },
    { day: "Fri", type: "Intervals", desc: "6 mi w/ 3×1600m @ 8:10", miles: 6, detail: "Mile repeats. 1 mi warmup, 3×1 mile at 8:10 with 800m jog recovery, 1 mi cooldown." },
    { day: "Sat", type: "Long Run", desc: "15 mi w/ last 3 at MP", miles: 15, detail: "12 mi easy, then pick up to marathon pace for the final 3 mi. Fueling is mandatory. This simulates the late-race push." },
    { day: "Sun", type: "Rest", desc: "Full rest", miles: 0, detail: "Biggest week so far. Prioritize sleep — aim for 8+ hours." },
  ]},
  { week: 6, phase: "Peak Phase", totalMiles: 42, days: [
    { day: "Mon", type: "Easy", desc: "5 mi easy", miles: 5, detail: "Easy effort. Keep these honest — ego is the enemy on easy days." },
    { day: "Tue", type: "Tempo", desc: "8 mi w/ 5 mi tempo (8:50–9:00)", miles: 8, detail: "Repeat of last week's key workout. Should feel slightly more controlled this time." },
    { day: "Wed", type: "Easy", desc: "4 mi recovery", miles: 4, detail: "Very easy shakeout. Can substitute 30 min of cross-training (bike, swim, elliptical)." },
    { day: "Thu", type: "Intervals", desc: "6 mi w/ 4×1600m @ 8:10", miles: 6, detail: "Added one mile repeat. Stay relaxed — fast and tense is slower than fast and relaxed." },
    { day: "Fri", type: "Easy", desc: "4 mi easy", miles: 4, detail: "Pre-long-run shakeout. Short and easy." },
    { day: "Sat", type: "Long Run", desc: "18 mi easy w/ last 4 at MP", miles: 18, detail: "THE BIG ONE. 14 mi easy, last 4 at marathon pace. Fuel every 30 min from mile 3 onward. Simulate race day: same shoes, same food, same timing." },
    { day: "Sun", type: "Rest", desc: "Full rest", miles: 0, detail: "Peak mileage week. You might feel rough Sunday — that's normal. Eat, sleep, recover." },
  ]},
  { week: 7, phase: "Peak Phase", totalMiles: 44, days: [
    { day: "Mon", type: "Easy", desc: "5 mi easy", miles: 5, detail: "You may still be recovering from Saturday's 18-miler. Go slow." },
    { day: "Tue", type: "Tempo", desc: "8 mi w/ 6 mi tempo (8:50–9:00)", miles: 8, detail: "Longest tempo of the plan. 1 mi warmup, 6 mi at marathon pace, 1 mi cooldown. Mental and physical prep for race day." },
    { day: "Wed", type: "Easy", desc: "4 mi recovery", miles: 4, detail: "Easy recovery. Walking breaks are fine if your legs are trashed." },
    { day: "Thu", type: "Intervals", desc: "7 mi w/ 5×1600m @ 8:10", miles: 7, detail: "Peak interval session. You're at your fittest here. Trust the work." },
    { day: "Fri", type: "Easy", desc: "4 mi easy", miles: 4, detail: "Shakeout before the long run. Stay loose." },
    { day: "Sat", type: "Long Run", desc: "20 mi easy w/ last 4 at MP", miles: 20, detail: "Longest run of the plan. This is your dress rehearsal. Everything race-day: nutrition timing, gear, pacing. You only need to do this once." },
    { day: "Sun", type: "Rest", desc: "Full rest", miles: 0, detail: "You just ran 20 miles. Be proud. Rest completely." },
  ]},
  { week: 8, phase: "Taper", totalMiles: 32, days: [
    { day: "Mon", type: "Easy", desc: "4 mi easy", miles: 4, detail: "Taper begins. Mileage drops but intensity stays. You'll feel restless — that's good." },
    { day: "Tue", type: "Tempo", desc: "6 mi w/ 3 mi tempo (8:50)", miles: 6, detail: "Short, sharp tempo. Stay at marathon pace. This keeps your legs tuned." },
    { day: "Wed", type: "Rest/Lift", desc: "Very light strength or rest", miles: 0, detail: "If lifting, go very light — bodyweight exercises, mobility work. Last lift before race." },
    { day: "Thu", type: "Easy", desc: "4 mi easy", miles: 4, detail: "Easy and short. You might feel oddly energetic — don't spend it." },
    { day: "Fri", type: "Intervals", desc: "5 mi w/ 3×1600m @ 8:10", miles: 5, detail: "Reduced intervals. Stay sharp without digging deep." },
    { day: "Sat", type: "Long Run", desc: "13 mi easy", miles: 13, detail: "Last long-ish run. All easy pace. Final fueling practice." },
    { day: "Sun", type: "Rest", desc: "Full rest", miles: 0, detail: "Rest. Trust the taper. You're not losing fitness — you're gaining freshness." },
  ]},
  { week: 9, phase: "Taper", totalMiles: 22, days: [
    { day: "Mon", type: "Easy", desc: "4 mi easy", miles: 4, detail: "Short and easy. Phantom aches are common during taper — it's your body finally feeling things it was too tired to notice." },
    { day: "Tue", type: "Tempo", desc: "5 mi w/ 2 mi tempo (8:50)", miles: 5, detail: "Brief tempo to keep the engine warm. Nothing heroic." },
    { day: "Wed", type: "Rest", desc: "Full rest", miles: 0, detail: "Rest day. Hydrate aggressively this week. Start carb-loading lightly." },
    { day: "Thu", type: "Easy", desc: "4 mi easy", miles: 4, detail: "Gentle shakeout. Your legs should be feeling springy." },
    { day: "Fri", type: "Intervals", desc: "4 mi w/ 4×400m @ 8:00", miles: 4, detail: "Short bursts to maintain turnover. These should feel fast and effortless." },
    { day: "Sat", type: "Easy", desc: "5 mi w/ 2 at MP", miles: 5, detail: "Last real workout. 3 mi easy, 2 mi at marathon pace. A confidence builder — this should feel easy." },
    { day: "Sun", type: "Rest", desc: "Full rest", miles: 0, detail: "Rest. If racing next weekend, begin serious carb-loading (7–10g carbs/kg bodyweight)." },
  ]},
  { week: 10, phase: "Race Week", totalMiles: 8, days: [
    { day: "Mon", type: "Easy", desc: "3 mi easy", miles: 3, detail: "Very easy shakeout. Stay loose. Stay calm." },
    { day: "Tue", type: "Easy", desc: "2 mi + 4×100m strides", miles: 2, detail: "Short run with a few strides to keep your legs quick. That's it." },
    { day: "Wed", type: "Rest", desc: "Full rest", miles: 0, detail: "Rest. Lay out your race gear. Finalize your fuel plan." },
    { day: "Thu", type: "Easy", desc: "2 mi easy shakeout", miles: 2, detail: "Optional. 15–20 minutes just to move. Walk if you prefer." },
    { day: "Fri", type: "Rest", desc: "Full rest", miles: 0, detail: "Pre-race rest. Eat carbs. Sleep early. Don't stress about sleeping perfectly — two nights before matters more." },
    { day: "Sat", type: "Rest", desc: "Pre-race prep", miles: 0, detail: "If racing Sunday: eat your planned pre-race meal, lay out everything, relax. If racing Saturday: GO TIME." },
    { day: "Sun", type: "Race", desc: "MARATHON — 26.2 mi", miles: 26.2, detail: "You did the work. Start conservative (9:15–9:20 first 10K), settle into pace (9:00–9:10 middle miles), and let yourself push the last 10K. Fuel every 30 min. You've got this." },
  ]},
];

const FUELING = {
  title: "Nutrition & Fueling Protocol",
  sections: [
    { name: "During Long Runs (>60 min)", items: ["30–60g carbs per hour after the first 45 minutes", "Options: energy gels (GU, Maurten, SiS), chews (Clif Bloks), or even gummy bears", "Wash down each gel with 4–6 oz of water — not sports drink (double sugar = GI distress)", "Practice every long run. Never try new fuel on race day."]},
    { name: "Pre-Run (60–90 min before)", items: ["200–300 calories of easy-to-digest carbs: toast w/ honey, banana, oatmeal, rice cake", "8–12 oz water. Small amount of coffee is fine if you're used to it.", "Avoid high fiber, fat, or protein close to run time."]},
    { name: "Daily Nutrition", items: ["Carbs are your fuel: 3–5g/kg bodyweight on easy days, 5–7g/kg on hard/long days", "Protein: 1.4–1.7g/kg for recovery and muscle maintenance", "Don't skimp on sodium — you lose 500–1500mg per hour of running in heat", "Hydrate to thirst. Aim for pale yellow urine as a general gauge."]},
    { name: "Race Week Carb Load", items: ["3 days out: increase carbs to 7–10g/kg bodyweight per day", "This is not just 'eat pasta' — it's rice, bread, potatoes, juice, pretzels all day", "Reduce fiber and fat to make room for carbs without overeating total volume", "Pre-race dinner: familiar, carb-heavy, low-fiber. White rice + chicken is a classic."]},
  ],
};

const RACE_STRATEGY = {
  title: "Race Day Execution Plan",
  paces: [
    { segment: "Miles 1–6", pace: "9:15–9:20", note: "Bank patience, not time. The first 10K should feel too easy." },
    { segment: "Miles 7–13", pace: "9:00–9:10", note: "Settle into marathon pace. You should feel strong and controlled." },
    { segment: "Miles 14–20", pace: "9:00–9:10", note: "Maintain. This is where the race begins. Stay mentally engaged." },
    { segment: "Miles 21–26.2", pace: "8:50–9:10", note: "If you have gas, use it. If you're surviving, hold pace. Don't collapse — manage." },
  ],
  fuel: "Gel or chews at miles 4, 8, 12, 16, 20, 23. Water at every aid station. Sports drink alternating with water.",
};

const TYPE_COLORS = {
  Easy: { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" },
  Tempo: { bg: "#FFF3E0", text: "#E65100", border: "#FFCC02" },
  Intervals: { bg: "#FCE4EC", text: "#C62828", border: "#EF9A9A" },
  "Long Run": { bg: "#E3F2FD", text: "#1565C0", border: "#90CAF9" },
  "Rest/Lift": { bg: "#F3E5F5", text: "#6A1B9A", border: "#CE93D8" },
  Rest: { bg: "#ECEFF1", text: "#546E7A", border: "#B0BEC5" },
  Race: { bg: "#FFF9C4", text: "#F57F17", border: "#FFF176" },
};
const PHASE_COLORS = { "Base Building": "#4CAF50", "Build Phase": "#FF9800", "Peak Phase": "#F44336", Taper: "#2196F3", "Race Week": "#FFC107" };

function LogForm({ existing, onSave, onCancel, onDelete }) {
  const [distance, setDistance] = useState(existing?.distance || "");
  const [pace, setPace] = useState(existing?.pace || "");
  const [effort, setEffort] = useState(existing?.effort || "moderate");
  const [notes, setNotes] = useState(existing?.notes || "");
  const inp = { width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #ddd", borderRadius: 6, fontFamily: "inherit", boxSizing: "border-box", background: "#fafafa" };
  const lbl = { fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: 0.8 };
  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px dashed #ddd" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div><label style={lbl}>Distance (mi)</label><input type="number" step="0.1" placeholder="0.0" value={distance} onChange={e => setDistance(e.target.value)} style={inp} /></div>
        <div><label style={lbl}>Avg Pace (min/mi)</label><input type="text" placeholder="9:27" value={pace} onChange={e => setPace(e.target.value)} style={inp} /></div>
      </div>
      <div style={{ marginBottom: 10 }}>
        <label style={lbl}>Effort</label>
        <div style={{ display: "flex", gap: 6 }}>
          {["easy", "moderate", "hard", "max"].map(e => (
            <button key={e} onClick={() => setEffort(e)} style={{ flex: 1, padding: "6px 0", fontSize: 11, fontWeight: effort === e ? 700 : 500, fontFamily: "inherit", border: effort === e ? "2px solid #1a1a1a" : "1px solid #ddd", borderRadius: 5, background: effort === e ? "#1a1a1a" : "#fff", color: effort === e ? "#fff" : "#666", cursor: "pointer", textTransform: "capitalize" }}>{e}</button>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: 12 }}><label style={lbl}>Notes</label><textarea placeholder="How did it feel? Anything notable?" value={notes} onChange={e => setNotes(e.target.value)} style={{ ...inp, minHeight: 56, resize: "vertical" }} /></div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => onSave({ distance: parseFloat(distance) || 0, pace, effort, notes, completedAt: existing?.completedAt || new Date().toISOString() })} style={{ flex: 1, padding: "9px 0", fontSize: 13, fontWeight: 700, fontFamily: "inherit", background: "#2E7D32", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>{existing ? "Update" : "Log Workout"}</button>
        {existing && <button onClick={onDelete} style={{ padding: "9px 14px", fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: "#fff", color: "#C62828", border: "1px solid #EF9A9A", borderRadius: 6, cursor: "pointer" }}>Remove</button>}
        <button onClick={onCancel} style={{ padding: "9px 14px", fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: "#f5f5f5", color: "#666", border: "none", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

export default function MarathonPlan() {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [activeTab, setActiveTab] = useState("plan");
  const [expandedDay, setExpandedDay] = useState(null);
  const [loggingDay, setLoggingDay] = useState(null);
  const [logs, setLogs] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { (async () => {
    try { const r = await window.storage.get("workout-logs"); if (r?.value) setLogs(JSON.parse(r.value)); } catch(e) {}
    setLoaded(true);
  })(); }, []);

  const saveLogs = useCallback(async (n) => { setLogs(n); try { await window.storage.set("workout-logs", JSON.stringify(n)); } catch(e) {} }, []);
  const logKey = (w, d) => `w${w}-d${d}`;
  const handleSave = (wi, di, data) => { saveLogs({ ...logs, [logKey(wi, di)]: data }); setLoggingDay(null); };
  const handleDelete = (wi, di) => { const n = { ...logs }; delete n[logKey(wi, di)]; saveLogs(n); setLoggingDay(null); };
  const handleReset = async () => { if (confirm("Clear all workout logs? This can't be undone.")) { setLogs({}); try { await window.storage.delete("workout-logs"); } catch(e) {} } };

  const week = WEEKS[selectedWeek];
  const totalLogged = Object.keys(logs).length;
  const totalPlanned = WEEKS.reduce((a, w) => a + w.days.length, 0);
  const totalActualMi = Object.values(logs).reduce((a, l) => a + (l.distance || 0), 0);
  const weekDone = week.days.filter((_, i) => logs[logKey(selectedWeek, i)]).length;

  if (!loaded) return <div style={{ padding: 40, textAlign: "center", color: "#999", fontFamily: "sans-serif" }}>Loading...</div>;

  return (
    <div style={{ fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif", maxWidth: 720, margin: "0 auto", padding: "16px", color: "#1a1a1a" }}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700;900&display=swap" rel="stylesheet" />
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#999", marginBottom: 4 }}>10-Week Program</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0, lineHeight: 1.1 }}>Sub-4:00 Marathon</h1>
        <div style={{ fontSize: 14, color: "#666", marginTop: 6 }}>Target pace: 9:09/mi • Peak mileage: 44 mi/wk • 5 runs/wk</div>
        {totalLogged > 0 && <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "#888" }}>
          <span><strong style={{ color: "#2E7D32" }}>{totalLogged}</strong> logged</span>
          <span><strong style={{ color: "#1565C0" }}>{totalActualMi.toFixed(1)}</strong> mi run</span>
          <span><strong style={{ color: "#E65100" }}>{Math.round((totalLogged / totalPlanned) * 100)}%</strong> complete</span>
        </div>}
      </div>

      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "2px solid #e0e0e0" }}>
        {[{ id: "plan", label: "Training Plan" }, { id: "fuel", label: "Fueling" }, { id: "race", label: "Race Strategy" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "10px 20px", fontSize: 13, fontWeight: activeTab === t.id ? 700 : 500, color: activeTab === t.id ? "#1a1a1a" : "#888", background: "none", border: "none", borderBottom: activeTab === t.id ? "2px solid #1a1a1a" : "2px solid transparent", cursor: "pointer", marginBottom: -2, fontFamily: "inherit" }}>{t.label}</button>
        ))}
      </div>

      {activeTab === "plan" && <>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
          {WEEKS.map((w, i) => {
            const wd = w.days.filter((_, di) => logs[logKey(i, di)]).length;
            const all = wd === w.days.length;
            return <button key={i} onClick={() => { setSelectedWeek(i); setExpandedDay(null); setLoggingDay(null); }} style={{ width: 56, padding: "8px 4px", fontSize: 11, fontWeight: selectedWeek === i ? 700 : 500, fontFamily: "inherit", background: selectedWeek === i ? "#1a1a1a" : all ? "#E8F5E9" : "#f5f5f5", color: selectedWeek === i ? "#fff" : all ? "#2E7D32" : "#666", border: all && selectedWeek !== i ? "1px solid #A5D6A7" : "1px solid transparent", borderRadius: 6, cursor: "pointer", textAlign: "center", lineHeight: 1.3, transition: "all 0.15s" }}>
              <div>Wk {w.week}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>{wd > 0 ? `${wd}/7` : `${w.totalMiles} mi`}</div>
            </button>;
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 18, fontWeight: 700 }}>Week {week.week}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: PHASE_COLORS[week.phase], marginLeft: 10, padding: "3px 8px", background: PHASE_COLORS[week.phase] + "18", borderRadius: 4 }}>{week.phase}</span>
          </div>
          <div style={{ fontSize: 13, color: "#888" }}><span style={{ fontWeight: 600 }}>{weekDone}/7</span> done • <span style={{ fontWeight: 600, color: "#666" }}>{week.totalMiles} mi</span></div>
        </div>

        <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 40, marginBottom: 16, padding: "0 2px" }}>
          {WEEKS.map((w, i) => {
            const am = w.days.reduce((a, _, di) => a + (logs[logKey(i, di)]?.distance || 0), 0);
            return <div key={i} style={{ flex: 1, height: `${(w.totalMiles / 44) * 100}%`, background: selectedWeek === i ? "#1a1a1a" : "#e0e0e0", borderRadius: 2, transition: "all 0.2s", minHeight: 4, position: "relative", overflow: "hidden" }}>
              {am > 0 && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${Math.min((am / w.totalMiles) * 100, 100)}%`, background: selectedWeek === i ? "#4CAF50" : "#A5D6A7", borderRadius: 2, transition: "all 0.3s" }} />}
            </div>;
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {week.days.map((d, i) => {
            const colors = TYPE_COLORS[d.type] || TYPE_COLORS.Rest;
            const isExp = expandedDay === i;
            const isLog = loggingDay === i;
            const log = logs[logKey(selectedWeek, i)];
            const done = !!log;
            return <div key={i} style={{ background: done ? "#FAFFF9" : "#fff", border: `1px solid ${done ? "#C8E6C9" : isExp ? colors.border : "#e8e8e8"}`, borderRadius: 8, padding: "12px 14px", transition: "all 0.15s", borderLeft: done ? "3px solid #4CAF50" : undefined }}>
              <div onClick={() => { setExpandedDay(isExp ? null : i); if (isLog) setLoggingDay(null); }} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                {done
                  ? <div style={{ width: 20, height: 20, borderRadius: 10, background: "#4CAF50", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span></div>
                  : <div style={{ width: 20, height: 20, borderRadius: 10, border: "2px solid #ddd", flexShrink: 0 }} />
                }
                <div style={{ width: 30, fontSize: 12, fontWeight: 600, color: "#999" }}>{d.day}</div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 3, background: colors.bg, color: colors.text, letterSpacing: 0.5, textTransform: "uppercase", flexShrink: 0, opacity: done ? 0.7 : 1 }}>{d.type}</span>
                <div style={{ fontSize: 13, fontWeight: 500, flex: 1, color: done ? "#555" : "#1a1a1a" }}>{d.desc}</div>
                {d.miles > 0 && <div style={{ fontSize: 12, fontWeight: 600, color: "#999", flexShrink: 0 }}>{d.miles} mi</div>}
              </div>
              {done && !isExp && <div style={{ marginTop: 6, marginLeft: 30, display: "flex", gap: 12, fontSize: 11, color: "#888" }}>
                {log.distance > 0 && <span>{log.distance} mi</span>}
                {log.pace && <span>{log.pace}/mi</span>}
                {log.effort && <span style={{ textTransform: "capitalize" }}>{log.effort}</span>}
                {log.notes && <span style={{ color: "#aaa", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.notes}</span>}
              </div>}
              {isExp && <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f0f0f0" }}>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: "#555", marginBottom: 10 }}>{d.detail}</div>
                {done && !isLog && <div style={{ background: "#f8f9f8", borderRadius: 6, padding: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#2E7D32", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>Workout Log</div>
                  <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#555", flexWrap: "wrap" }}>
                    {log.distance > 0 && <div><strong>{log.distance}</strong> mi</div>}
                    {log.pace && <div><strong>{log.pace}</strong>/mi</div>}
                    {log.effort && <div style={{ textTransform: "capitalize" }}>Effort: <strong>{log.effort}</strong></div>}
                  </div>
                  {log.notes && <div style={{ fontSize: 13, color: "#666", marginTop: 6, fontStyle: "italic" }}>"{log.notes}"</div>}
                  <div style={{ fontSize: 10, color: "#bbb", marginTop: 4 }}>{new Date(log.completedAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</div>
                </div>}
                {!isLog
                  ? <button onClick={e => { e.stopPropagation(); setLoggingDay(i); }} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, fontFamily: "inherit", background: done ? "#f5f5f5" : "#1a1a1a", color: done ? "#666" : "#fff", border: done ? "1px solid #ddd" : "none", borderRadius: 6, cursor: "pointer" }}>{done ? "Edit Log" : "Log Workout"}</button>
                  : <LogForm existing={log} onSave={data => handleSave(selectedWeek, i, data)} onCancel={() => setLoggingDay(null)} onDelete={() => handleDelete(selectedWeek, i)} />
                }
              </div>}
            </div>;
          })}
        </div>
        {totalLogged > 0 && <div style={{ marginTop: 20, textAlign: "right" }}><button onClick={handleReset} style={{ fontSize: 11, color: "#bbb", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Reset all logs</button></div>}
      </>}

      {activeTab === "fuel" && <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>{FUELING.title}</h2>
        {FUELING.sections.map((s, i) => <div key={i} style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "#333" }}>{s.name}</h3>
          {s.items.map((item, j) => <div key={j} style={{ fontSize: 13, lineHeight: 1.6, color: "#555", paddingLeft: 14, marginBottom: 4, position: "relative" }}><span style={{ position: "absolute", left: 0, color: "#ccc" }}>•</span>{item}</div>)}
        </div>)}
        <div style={{ marginTop: 20, padding: 14, background: "#FFF8E1", borderRadius: 8, border: "1px solid #FFE082", fontSize: 13, lineHeight: 1.6, color: "#6D4C00" }}><strong>Your 11.8-mile lesson:</strong> You bonked because you ran 90+ minutes on just a glass of water. With proper fueling, that same effort gets you to 13.1 and beyond. Every long run from here on is a nutrition rehearsal.</div>
      </div>}

      {activeTab === "race" && <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>{RACE_STRATEGY.title}</h2>
        <div style={{ fontSize: 13, color: "#555", marginBottom: 16, lineHeight: 1.6 }}>The #1 mistake in a marathon is going out too fast. The first miles feel amazing and that's the trap. Start slower than you think you should. The race begins at mile 20.</div>
        {RACE_STRATEGY.paces.map((p, i) => <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: i < RACE_STRATEGY.paces.length - 1 ? "1px solid #f0f0f0" : "none", alignItems: "flex-start" }}>
          <div style={{ width: 90, flexShrink: 0 }}><div style={{ fontSize: 13, fontWeight: 700 }}>{p.segment}</div><div style={{ fontSize: 16, fontWeight: 300, color: "#1565C0", marginTop: 2 }}>{p.pace}</div></div>
          <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5, paddingTop: 2 }}>{p.note}</div>
        </div>)}
        <div style={{ marginTop: 20, padding: 14, background: "#E8F5E9", borderRadius: 8, border: "1px solid #A5D6A7", fontSize: 13, lineHeight: 1.6, color: "#1B5E20" }}><strong>Fuel stations:</strong> {RACE_STRATEGY.fuel}</div>
        <div style={{ marginTop: 12, padding: 14, background: "#F3E5F5", borderRadius: 8, border: "1px solid #CE93D8", fontSize: 13, lineHeight: 1.6, color: "#4A148C" }}><strong>Target finish:</strong> ~3:55:00. That gives you a 5-minute buffer under 4:00. If you execute the pacing plan and fuel properly, you'll have room to push the last 10K.</div>
      </div>}
    </div>
  );
}
