"use client";

import { addBookmark } from "@/app/bookmarks/actions";
import { useState } from "react";
import { useRef } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer rounded px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {pending && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      )}
      {pending ? "Adding..." : "Add Bookmark"}
    </button>
  );
}

export default function AddBookmarkForm() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await addBookmark(formData);
    setIsOpen(false);
    formRef.current?.reset();
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg ring-1 ring-white/10 bg-white/5 hover:bg-white/10 transition-colors"
      >
        <span className="text-lg">+</span>
        <span>Add Bookmark</span>
        <span
          className={`ml-auto transition-transform ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>

      {isOpen && (
        <form
          ref={formRef}
          action={handleSubmit}
          className="space-y-3 p-4 rounded-lg ring-1 ring-white/10 bg-white/5"
        >
          <div className="grid grid-cols-1 gap-3">
            <input
              name="url"
              type="url"
              required
              placeholder="https://example.com"
              className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
            />
            <input
              name="title"
              type="text"
              placeholder="Title (optional - will be auto-filled from webpage)"
              className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
            />
            <textarea
              name="description"
              placeholder="Description (optional)"
              rows={3}
              className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50 resize-none"
            />
            <input
              name="tags"
              type="text"
              placeholder="Tags (comma separated)"
              className="bg-transparent rounded px-3 py-2 ring-1 ring-white/10 focus:outline-none focus:ring-blue-500/50"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer rounded px-4 py-2 text-sm ring-1 ring-white/10 hover:bg-white/10"
            >
              Cancel
            </button>
            <SubmitButton />
          </div>
        </form>
      )}
    </div>
  );
}
