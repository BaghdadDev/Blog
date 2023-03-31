import React, { useCallback, useEffect, useMemo } from "react";
import isHotkey from "is-hotkey";
import { Editable, Slate, useSlate, withReact } from "slate-react";
import {
  createEditor,
  Editor,
  Element as SlateElement,
  Transforms,
} from "slate";
import PropTypes from "prop-types";

import {
  AiOutlineAlignCenter,
  AiOutlineAlignLeft,
  AiOutlineAlignRight,
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineOrderedList,
  AiOutlineUnderline,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { BsCodeSlash, BsJustify } from "react-icons/bs";
import { RiNumber1, RiNumber2 } from "react-icons/ri";
import { IoIosQuote } from "react-icons/io";

import { withHistory } from "slate-history";
import Toolbar from "./Toolbar.jsx";
import Button from "./Button.jsx";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

TextEditor.defaultProps = {
  readOnly: false,
  initValue: "",
  nameDraft: "textEditor-draft",
};

TextEditor.propTypes = {
  placeholder: PropTypes.string,
  error: PropTypes.string,
  initValue: PropTypes.string,
  readOnly: PropTypes.bool,
  setValue: PropTypes.func,
  nameDraft: PropTypes.string,
};

function TextEditor({
  placeholder,
  error,
  initValue,
  readOnly,
  setValue,
  nameDraft,
}) {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue = (initValue && deserialize(initValue)) ||
    (localStorage.getItem(nameDraft) &&
      deserialize(localStorage.getItem(nameDraft))) || [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ];

  // useEffect(() => {
  //   console.log(initialValue);
  // }, [initialValue]);

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(value) => {
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isAstChange) {
          const serializedValue = serialize(value);
          localStorage.setItem(nameDraft, serializedValue);
          setValue(serializedValue);
        }
      }}
    >
      <div className={"relative flex w-full flex-col items-center gap-y-2"}>
        {!readOnly && (
          <Toolbar>
            <MarkButton format="bold" Icon={AiOutlineBold} />
            <MarkButton format="italic" Icon={AiOutlineItalic} />
            <MarkButton format="underline" Icon={AiOutlineUnderline} />
            <MarkButton format="code" Icon={BsCodeSlash} />
            <BlockButton format="heading-one" Icon={RiNumber1} />
            <BlockButton format="heading-two" Icon={RiNumber2} />
            <BlockButton format="block-quote" Icon={IoIosQuote} />
            <BlockButton format="numbered-list" Icon={AiOutlineOrderedList} />
            <BlockButton format="bulleted-list" Icon={AiOutlineUnorderedList} />
            <BlockButton format="left" Icon={AiOutlineAlignLeft} />
            <BlockButton format="center" Icon={AiOutlineAlignCenter} />
            <BlockButton format="right" Icon={AiOutlineAlignRight} />
            <BlockButton format="justify" Icon={BsJustify} />
          </Toolbar>
        )}
        <Editable
          readOnly={readOnly}
          className={"w-full rounded bg-white p-2"}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
        {error?.length > 0 && (
          <p
            className={
              "absolute bottom-0 translate-y-[calc(100%_+_2px)] rounded bg-red-300 p-1 text-sm italic opacity-90"
            }
          >
            {error}
          </p>
        )}
      </div>
    </Slate>
  );
}

const serialize = (value) => {
  return JSON.stringify(value);
};

const deserialize = (string) => {
  return JSON.parse(string);
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote
          style={style}
          className={"text-editor-blockquote"}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} className={"text-editor-ul"} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} className={"text-editor-h1"} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} className={"text-editor-h2"} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} className={"text-editor-ol"} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} className={"text-editor-p"} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code className={"text-editor-code"}>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, Icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      Icon={Icon}
    />
  );
};

const MarkButton = ({ format, Icon }) => {
  const editor = useSlate();
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      Icon={Icon}
    />
  );
};

export default TextEditor;
