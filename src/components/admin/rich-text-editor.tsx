"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect } from "react";
import { adminApi } from "@/lib/api";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  token?: string;
  minHeight?: number;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something compelling…",
  token,
  minHeight = 220,
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-stone max-w-none focus:outline-none px-4 py-3 text-[15px] leading-[1.6]",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  /* Keep editor content in sync if the value is replaced externally
     (e.g., switching between rows in a list editor). */
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const insertLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!token) {
        const url = window.prompt("Image URL");
        if (url) editor.chain().focus().setImage({ src: url }).run();
        return;
      }
      try {
        const res = await adminApi.uploadMedia(token, file, { folder: "richtext" });
        editor.chain().focus().setImage({ src: res.url, alt: file.name }).run();
      } catch (err) {
        console.error(err);
        window.alert("Upload failed. Check the console.");
      }
    };
    input.click();
  }, [editor, token]);

  if (!editor) {
    return (
      <div
        className="rounded-md border border-stone-200 bg-stone-50/50"
        style={{ minHeight }}
      />
    );
  }

  return (
    <div className="rounded-md border border-stone-200 bg-white">
      <Toolbar editor={editor} onLink={insertLink} onImage={insertImage} />
      <div style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function Toolbar({
  editor,
  onLink,
  onImage,
}: {
  editor: Editor;
  onLink: () => void;
  onImage: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-stone-200 bg-stone-50/60 px-2 py-1.5">
      <Btn label="B"   active={editor.isActive("bold")}       onClick={() => editor.chain().focus().toggleBold().run()}       title="Bold"            className="font-bold" />
      <Btn label="I"   active={editor.isActive("italic")}     onClick={() => editor.chain().focus().toggleItalic().run()}     title="Italic"          className="italic" />
      <Btn label="S"   active={editor.isActive("strike")}     onClick={() => editor.chain().focus().toggleStrike().run()}     title="Strike"          className="line-through" />
      <Divider />
      <Btn label="H2"  active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2" />
      <Btn label="H3"  active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3" />
      <Btn label="¶"   active={editor.isActive("paragraph")}              onClick={() => editor.chain().focus().setParagraph().run()}               title="Paragraph" />
      <Divider />
      <Btn label="•"   active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list" />
      <Btn label="1."  active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered list" />
      <Btn label={"“"} active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote" />
      <Btn label={"</>"}    active={editor.isActive("codeBlock")}  onClick={() => editor.chain().focus().toggleCodeBlock().run()}  title="Code block" />
      <Divider />
      <Btn label="🔗"  active={editor.isActive("link")}       onClick={onLink}                                                  title="Link" />
      <Btn label="🖼"   active={false}                         onClick={onImage}                                                 title="Image" />
      <Divider />
      <Btn label="↶"   active={false} onClick={() => editor.chain().focus().undo().run()} title="Undo" disabled={!editor.can().undo()} />
      <Btn label="↷"   active={false} onClick={() => editor.chain().focus().redo().run()} title="Redo" disabled={!editor.can().redo()} />
    </div>
  );
}

function Btn({
  label,
  active,
  onClick,
  title,
  className,
  disabled,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  title: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={[
        "h-7 min-w-7 rounded px-1.5 text-[12px] font-medium transition-colors",
        active ? "bg-stone-900 text-white" : "text-stone-700 hover:bg-stone-200",
        disabled ? "opacity-40 cursor-not-allowed" : "",
        className || "",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 inline-block h-5 w-px bg-stone-300" />;
}
