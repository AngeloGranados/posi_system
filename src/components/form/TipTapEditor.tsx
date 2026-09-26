'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { Extension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import ToolBar from './ToolBar'

const TextAlign = Extension.create({
  name: 'textAlign',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph', 'heading'],
        attributes: {
          textAlign: {
            default: null,
            parseHTML: (element) => element.style.textAlign || null,
            renderHTML: (attributes) => attributes.textAlign
              ? { style: `text-align: ${attributes.textAlign}` }
              : {},
          },
        },
      },
    ]
  },
})

type TipTapEditorProps = {
    content: string,
    onChange: (content: string) => void,
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit, TextAlign],
        editorProps: {
            attributes: {
                class: 'border px-4 py-2 min-h-[150px] max-h-[150px] overflow-auto border-gray-300 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
            },
        },
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
    })

  return (
    <div className="border border-gray-300 rounded p-2">
      <ToolBar editor={editor}></ToolBar>
      <EditorContent editor={editor} />
    </div>
  )
}