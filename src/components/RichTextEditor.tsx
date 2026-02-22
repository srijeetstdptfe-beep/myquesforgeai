"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  minimal?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Enter text...',
  className,
  minimal = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
      }),
      Placeholder.configure({ placeholder }),
      Underline,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[60px] px-3 py-2',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className={cn('border border-border rounded-md bg-background', className)}>
      {!minimal && (
        <div className="flex items-center gap-1 border-b border-border px-2 py-1 bg-muted/30">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn('h-7 w-7 p-0', editor.isActive('bold') && 'bg-muted')}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn('h-7 w-7 p-0', editor.isActive('italic') && 'bg-muted')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn('h-7 w-7 p-0', editor.isActive('underline') && 'bg-muted')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-3.5 w-3.5" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn('h-7 w-7 p-0', editor.isActive('bulletList') && 'bg-muted')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn('h-7 w-7 p-0', editor.isActive('orderedList') && 'bg-muted')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
