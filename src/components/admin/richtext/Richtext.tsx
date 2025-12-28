"use client";

import {
  FaBold,
  FaItalic,
  FaUndo,
  FaRedo,
  FaUnderline,
  FaStrikethrough,
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaLink,
  FaImage,
} from "react-icons/fa";
import {
  MdOutlineFormatListNumbered,
  MdFormatListBulleted,
} from "react-icons/md";
import { RiH1, RiH2, RiH3 } from "react-icons/ri";
import { AiOutlineHighlight } from "react-icons/ai";
import React, { useEffect, useRef, useState, memo } from "react";
import { EditorButton } from "./EditorButton";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { useAddImageBlog } from "@/hooks/useBlog";
import { toast } from "react-hot-toast";

export default memo(function RichText({
  value,
  onChange,
  placeholder,
  blogId,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  blogId?: number | null;
}) {
  const { mutateAsync: uploadImage, isPending: isUploading } =
    useAddImageBlog();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    content: value,
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc ml-4 space-y-1" } },
        orderedList: {
          HTMLAttributes: { class: "list-decimal ml-5 space-y-1" },
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      TextAlign.configure({ types: ["paragraph", "heading"] }),
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
      }),
      Highlight.configure({ multicolor: true }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] prose prose-zinc dark:prose-invert max-w-none " +
          "p-5 focus:outline-none bg-white dark:bg-zinc-900 " +
          "rounded-xl border border-zinc-200 dark:border-zinc-700 " +
          "shadow-sm transition-shadow focus:shadow-md",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const [, forceUpdate] = useState({});
  useEffect(() => {
    if (!editor) return;
    const update = () => forceUpdate({});
    editor.on("selectionUpdate", update);
    editor.on("transaction", update);
    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor || !blogId) {
      if (!blogId) toast.error("Blog ID is missing");
      return;
    }

    let tempUrl: string | undefined;
    try {
      tempUrl = URL.createObjectURL(file);
      editor.chain().focus().setImage({ src: tempUrl }).run();
      const uploadedImages = await uploadImage({ blogId, file });
      const imageUrl = uploadedImages[uploadedImages.length - 1]?.imageUrl;
      if (!imageUrl) throw new Error("No URL returned from upload");

      editor
        .chain()
        .focus()
        .command(({ tr }) => {
          tr.doc.descendants((node, pos) => {
            if (node.type.name === "image" && node.attrs.src === tempUrl) {
              tr.setNodeMarkup(pos, undefined, { src: imageUrl });
            }
          });
          return true;
        })
        .run();

      URL.revokeObjectURL(tempUrl);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!editor) return null;

  return (
    <div className="space-y-4">
      {/* Modern Toolbar */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800 pb-2 pt-1">
        <div className="flex flex-wrap gap-2 items-center px-1">
          {/* Undo / Redo group */}
          <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/60 px-2 py-1 rounded-lg">
            <EditorButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              icon={<FaUndo size={16} />}
              desc="Undo (Ctrl+Z)"
            />
            <EditorButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              icon={<FaRedo size={16} />}
              desc="Redo (Ctrl+Y)"
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-6 w-px bg-zinc-300 dark:bg-zinc-700 mx-1" />

          {/* Headings */}
          <div className="flex items-center gap-1">
            <EditorButton
              isActive={editor.isActive("heading", { level: 1 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              icon={<RiH1 size={18} />}
              desc="Heading 1"
            />
            <EditorButton
              isActive={editor.isActive("heading", { level: 2 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              icon={<RiH2 size={18} />}
              desc="Heading 2"
            />
            <EditorButton
              isActive={editor.isActive("heading", { level: 3 })}
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              icon={<RiH3 size={18} />}
              desc="Heading 3"
            />
          </div>

          {/* Text formatting */}
          <div className="flex items-center gap-1">
            <EditorButton
              isActive={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
              icon={<FaBold size={16} />}
              desc="Bold (Ctrl+B)"
            />
            <EditorButton
              isActive={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              icon={<FaItalic size={16} />}
              desc="Italic (Ctrl+I)"
            />
            <EditorButton
              isActive={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              icon={<FaUnderline size={16} />}
              desc="Underline (Ctrl+U)"
            />
            <EditorButton
              isActive={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              icon={<FaStrikethrough size={16} />}
              desc="Strikethrough"
            />
          </div>

          {/* Alignment */}
          <div className="flex items-center gap-1">
            <EditorButton
              isActive={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              icon={<FaAlignLeft size={16} />}
              desc="Align left"
            />
            <EditorButton
              isActive={editor.isActive({ textAlign: "center" })}
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              icon={<FaAlignCenter size={16} />}
              desc="Align center"
            />
            <EditorButton
              isActive={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              icon={<FaAlignRight size={16} />}
              desc="Align right"
            />
            <EditorButton
              isActive={editor.isActive({ textAlign: "justify" })}
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              icon={<FaAlignJustify size={16} />}
              desc="Align justify"
            />
          </div>

          {/* Lists + Image */}
          <div className="flex items-center gap-1">
            <EditorButton
              isActive={editor.isActive("orderedList")}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              icon={<MdOutlineFormatListNumbered size={18} />}
              desc="Numbered list"
            />
            <EditorButton
              isActive={editor.isActive("bulletList")}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              icon={<MdFormatListBulleted size={18} />}
              desc="Bullet list"
            />
            <EditorButton
              onClick={() => fileInputRef.current?.click()}
              icon={
                isUploading ? (
                  <span className="animate-spin text-lg">⏳</span>
                ) : (
                  <FaImage size={17} />
                )
              }
              desc="Insert image"
              disabled={isUploading}
            />
          </div>

          {/* Highlight + Link */}
          <div className="flex items-center gap-1">
            <EditorButton
              isActive={editor.isActive("highlight", { color: "#ffc078" })}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: "#ffc078" })
                  .run()
              }
              icon={<AiOutlineHighlight size={18} />}
              desc="Highlight"
            />
            <EditorButton
              icon={<FaLink size={16} />}
              desc="Insert/edit link"
              // TODO: implement link logic
            />
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Editor Content */}
      <div className="relative">
        <EditorContent editor={editor} className="prose-headings:font-bold" />
      </div>
    </div>
  );
});
