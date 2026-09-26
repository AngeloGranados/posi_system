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
    AlignJustify,
    AlignCenter,
    AlignLeft,
    AlignRight
} from 'lucide-react'

type ToolBarProps = {
    editor: Editor | null;
} 

function alignText(editor: Editor | null, textAlign: 'left' | 'center' | 'right' | 'justify') {
    editor?.chain().focus().command(({ tr, state }) => {
        const { from, to } = state.selection

        if (from === to) {
            const $from = state.selection.$from
            for (let depth = $from.depth; depth > 0; depth -= 1) {
                const node = $from.node(depth)
                if (node.isTextblock) {
                    tr.setNodeMarkup($from.before(depth), undefined, {
                        ...node.attrs,
                        textAlign,
                    })
                    return true
                }
            }
        }

        state.doc.nodesBetween(from, to, (node, position) => {
            if (node.isTextblock) {
                tr.setNodeMarkup(position, undefined, {
                    ...node.attrs,
                    textAlign,
                })
            }
        })

        return true
    }).run()
}

function ToogleButton({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {

    return (
        <button
            type="button"
            className={`px-4 py-2 bg-gray-200 rounded ${pressed ? 'bg-gray-300' : ''}`}
            aria-pressed={pressed}
            onClick={onClick}
        >
            { children }
        </button>
    )
}

export default function ToolBar({ editor }: ToolBarProps) {
    return (
        <div className="flex space-x-2 p-2 border-b border-gray-300 flex-wrap gap-2">
            <ToogleButton pressed={editor?.isActive('bold') ?? false} onClick={() => editor?.chain().focus().toggleBold().run()}>
                <Bold size={24} />
            </ToogleButton>
            <ToogleButton pressed={editor?.isActive('italic') ?? false} onClick={() => editor?.chain().focus().toggleItalic().run()}>
                <Italic size={24} />
            </ToogleButton>
            <ToogleButton pressed={editor?.isActive('underline') ?? false} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                <Underline size={24} />
            </ToogleButton>
            <ToogleButton pressed={editor?.isActive('strike') ?? false} onClick={() => editor?.chain().focus().toggleStrike().run()}>
                <Strikethrough size={24} />
            </ToogleButton>
            <ToogleButton pressed={editor?.isActive('heading', { level: 2 }) ?? false} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>
                <Heading2 size={24} />
            </ToogleButton>
            <ToogleButton pressed={editor?.isActive('bulletList') ?? false} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                <List size={24} />
            </ToogleButton>
            <ToogleButton pressed={editor?.isActive('orderedList') ?? false} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                <ListOrdered size={24} />
            </ToogleButton>
            <ToogleButton pressed={editor?.isActive({ textAlign: 'left' }) ?? false} onClick={() => alignText(editor, 'left')}>
                <AlignLeft size={24} />
            </ToogleButton>
            <ToogleButton pressed={editor?.isActive({ textAlign: 'center' }) ?? false} onClick={() => alignText(editor, 'center')}>
                <AlignCenter size={24} />
            </ToogleButton>
            <ToogleButton pressed={editor?.isActive({ textAlign: 'right' }) ?? false} onClick={() => alignText(editor, 'right')}>
                <AlignRight size={24} />
            </ToogleButton>
            <ToogleButton pressed={editor?.isActive({ textAlign: 'justify' }) ?? false} onClick={() => alignText(editor, 'justify')}>
                <AlignJustify size={24} />
            </ToogleButton>
        </div>
    );
}