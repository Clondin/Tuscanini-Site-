import type { ImgHTMLAttributes } from "react";
import { useState } from "react";

/** Settles a pack onto its shelf as it arrives instead of popping in. */
export default function ShelfImage({
  className = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      {...props}
      ref={(image) => {
        if (image?.complete && image.naturalWidth > 0) setLoaded(true);
      }}
      onLoad={() => setLoaded(true)}
      className={`${className} transition duration-500 ease-out motion-reduce:transition-none ${loaded ? "opacity-100" : "opacity-0 translate-y-2"}`}
    />
  );
}
