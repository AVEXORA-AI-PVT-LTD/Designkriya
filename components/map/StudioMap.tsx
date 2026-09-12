"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

type City = { name: string; lat: number; lng: number; blurb: string };

const CITIES: City[] = [
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946, blurb: "Studio HQ" },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, blurb: "Site visits by appointment" },
  { name: "Goa", lat: 15.2993, lng: 74.124, blurb: "Weekend-home projects" },
];

export default function StudioMap() {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapElRef.current || mapRef.current) return;

      // Leaflet's default marker icons reference image URLs that don't
      // resolve correctly under bundlers - rebuild a simple, on-brand pin
      // instead of fighting the default asset paths.
      const pinIcon = L.divIcon({
        className: "",
        html: `<div style="
          width:14px;height:14px;border-radius:9999px;
          background:#f6f4f1;border:2px solid #1c1a17;
          box-shadow:0 0 0 2px rgba(246,244,241,0.35);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const map = L.map(mapElRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: true,
      }).setView([16.5, 76.5], 5.2);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> &copy; <a href="https://carto.com">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      CITIES.forEach((city) => {
        L.marker([city.lat, city.lng], { icon: pinIcon })
          .addTo(map)
          .bindPopup(
            `<strong style="font-family:sans-serif;font-size:13px;">${city.name}</strong><br/><span style="font-family:sans-serif;font-size:12px;color:#8a8175;">${city.blurb}</span>`
          );
      });

      // Only enable scroll-zoom once the visitor has deliberately focused
      // the map, so an ordinary page-scroll doesn't get captured by it.
      mapElRef.current.addEventListener("click", () => map.scrollWheelZoom.enable());
      mapElRef.current.addEventListener("mouseleave", () => map.scrollWheelZoom.disable());

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-stone-700 sm:h-[440px]">
      <div ref={mapElRef} className="h-full w-full" />
    </div>
  );
}
