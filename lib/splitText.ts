// A small, dependency-free stand-in for GSAP's paid SplitText plugin.
// Wraps each character in an inner span (for the transform) inside an
// overflow-hidden outer span (so the reveal clips cleanly), and returns the
// inner spans so callers can animate them with a stagger.
export function splitChars(container: HTMLElement): HTMLElement[] {
  const words = container.textContent?.split(" ") ?? [];
  container.textContent = "";
  container.setAttribute("aria-label", words.join(" "));

  const chars: HTMLElement[] = [];

  words.forEach((word, wi) => {
    const wordSpan = document.createElement("span");
    wordSpan.style.display = "inline-block";
    wordSpan.style.whiteSpace = "nowrap";

    for (const ch of word) {
      const outer = document.createElement("span");
      outer.style.display = "inline-block";
      outer.style.overflow = "hidden";
      outer.style.verticalAlign = "top";

      const inner = document.createElement("span");
      inner.style.display = "inline-block";
      inner.style.willChange = "transform";
      inner.textContent = ch;

      outer.appendChild(inner);
      wordSpan.appendChild(outer);
      chars.push(inner);
    }

    container.appendChild(wordSpan);
    if (wi < words.length - 1) {
      container.appendChild(document.createTextNode("\u00A0"));
    }
  });

  return chars;
}
