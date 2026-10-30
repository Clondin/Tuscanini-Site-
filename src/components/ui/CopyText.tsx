import { Fragment } from "react";
import { Link } from "react-router-dom";
import type { CopyParagraph } from "../../data/seo-copy";

/** Renders shared page copy; linked runs become client-side links. The build-time route HTML renders the same runs. */
export default function CopyText({ paragraph, linkClassName }: { paragraph: CopyParagraph; linkClassName?: string }) {
  return (
    <>
      {paragraph.map((segment, index) =>
        typeof segment === "string" ? (
          <Fragment key={index}>{segment}</Fragment>
        ) : (
          <Link key={index} to={segment.to} className={linkClassName}>
            {segment.text}
          </Link>
        ),
      )}
    </>
  );
}
