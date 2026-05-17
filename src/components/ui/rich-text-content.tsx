import DOMPurify from "isomorphic-dompurify";

type Props = {
  html: string | null | undefined;
  className?: string;
};

/* Render Tiptap-produced HTML safely.
   - Sanitizes with DOMPurify (allowlist of tags + safe attributes)
   - Wraps in a `.prose-monk` container so typography matches the
     site's editorial system on both light and dark themes
*/
export function RichTextContent({ html, className }: Props) {
  if (!html) return null;

  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "s",
      "u",
      "code",
      "pre",
      "blockquote",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "a",
      "img",
      "hr",
      "span",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel", "class"],
  });

  return (
    <div
      className={["prose-monk", className].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
