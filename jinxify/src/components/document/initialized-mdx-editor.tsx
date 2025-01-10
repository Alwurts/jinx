'use client'

import type { ForwardedRef } from 'react'
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  CodeToggle,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  Separator,
  InsertCodeBlock,
  codeBlockPlugin,
  codeMirrorPlugin,
  ChangeCodeMirrorLanguage,
  ConditionalContents,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
} from '@mdxeditor/editor'

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin(),
        tablePlugin(),
        codeBlockPlugin(),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: 'JavaScript',
            css: 'CSS',
            ts: 'TypeScript',
            tsx: 'TypeScript (React)',
            jsx: 'JavaScript (React)',
            py: 'Python',
            html: 'HTML',
            json: 'JSON',
            md: 'Markdown',
          }
        }),
        diffSourcePlugin({
          diffMarkdown: props.markdown || '',
          viewMode: 'rich-text'
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <div className="flex flex-wrap gap-2">
                <UndoRedo />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <CreateLink />
                <InsertImage />
                <Separator />
                <ListsToggle />
                <Separator />
                <InsertTable />
                <InsertThematicBreak />
                <InsertCodeBlock />
                <ConditionalContents
                  options={[
                    {
                      when: (editor) => editor?.editorType === 'codeblock',
                      contents: () => <ChangeCodeMirrorLanguage />
                    }
                  ]}
                />
              </div>
            </DiffSourceToggleWrapper>
          )
        })
      ]}
      {...props}
      ref={editorRef}
      contentEditableClassName="prose dark:prose-invert max-w-none"
    />
  )
} 