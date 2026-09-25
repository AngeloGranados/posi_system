'use client'
import { type Editor } from '@tiptap/react'
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading2,
    ListOrdered,
    List,
} from 'lucide-react'
import { useState } from 'react';

type ToolBarProps = {
    editor: Editor | null;
} 

function ToogleButton({ size, pressed, onPressedChange, children }: { size: number; pressed: boolean; onPressedChange: (pressed: boolean) => void; children: React.ReactNode }) {

    return (
        <button
            type="button"
            className={`px-4 py-2 bg-gray-200 rounded ${pressed ? 'bg-gray-300' : ''}`}
            aria-pressed={pressed}
            onClick={() => onPressedChange(!pressed)}
        >
            { children }
        </button>
    )
}

export default function ToolBar({ editor }: ToolBarProps) {
    return (
        <div className="flex space-x-2 p-2 border-b border-gray-300 flex-wrap gap-2">
            <ToogleButton size={24} pressed={editor?.isActive('bold') ?? false} onPressedChange={() => editor?.chain().focus().toggleBold().run()}>
                <Bold size={24} />
            </ToogleButton>
            <ToogleButton size={24} pressed={editor?.isActive('italic') ?? false} onPressedChange={() => editor?.chain().focus().toggleItalic().run()}>
                <Italic size={24} />
            </ToogleButton>
            <ToogleButton size={24} pressed={editor?.isActive('underline') ?? false} onPressedChange={() => editor?.chain().focus().toggleUnderline().run()}>
                <Underline size={24} />
            </ToogleButton>
            <ToogleButton size={24} pressed={editor?.isActive('strike') ?? false} onPressedChange={() => editor?.chain().focus().toggleStrike().run()}>
                <Strikethrough size={24} />
            </ToogleButton>
            <ToogleButton size={24} pressed={editor?.isActive('heading', { level: 2 }) ?? false} onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 size={24} />
            </ToogleButton>
            <ToogleButton size={24} pressed={editor?.isActive('bulletList') ?? false} onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}>
                <List size={24} />
            </ToogleButton>
            <ToogleButton size={24} pressed={editor?.isActive('orderedList') ?? false} onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}>
                <ListOrdered size={24} />
            </ToogleButton>
        </div>
    );
}