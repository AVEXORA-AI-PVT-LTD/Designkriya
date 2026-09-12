"use client";

// Placeholder team \u2014 swap in your real team's names, roles and brand
// colors before publishing.
const TEAM = [
  { initials: "AN", name: "Anita Nair", role: "Principal Designer", color: "#8a5a36" },
  { initials: "RK", name: "Rohan Kamath", role: "Project Lead", color: "#4e4941" },
  { initials: "SP", name: "Sana Poonawalla", role: "Materials & Sourcing", color: "#7c8a6e" },
  { initials: "VD", name: "Vikram Desai", role: "Site Execution", color: "#a67a5b" },
];

export default function TeamStrip() {
  return (
    <div className="flex flex-wrap gap-6 sm:gap-8">
      {TEAM.map((person) => (
        <div key={person.initials} className="group flex flex-col items-center gap-3">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full font-display text-lg text-stone-50 transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: person.color }}
          >
            {person.initials}
          </div>
          <div className="text-center">
            <p className="font-body text-[12px] text-stone-800">{person.name}</p>
            <p className="font-body text-[11px] text-stone-500">{person.role}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
