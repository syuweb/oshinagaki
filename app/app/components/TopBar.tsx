"use client";

import { Plus, Trash2, MoreHorizontal, Menu } from "lucide-react";
import { IconButton } from "@/components/IconButton";
import { useEffect, useRef } from "react";

export type TopBarMode =
  | "normal"
  | "edit";

type Props = {
  title: string;
  mode: TopBarMode;

  // normal
  onAdd?: () => void;
  onOpenMenu?: () => void;
  onOpenOptions?: () => void;

  // edit
  canDelete?: boolean;
  isAllSelected?: boolean;
  onToggleAll?: () => void;
  onDelete?: () => void;
  onCancelEdit?: () => void;
  isIndeterminate?: boolean;
};

export function TopBar(props: Props) {
  return (
    <div className="sticky top-0 z-10 h-12 bg-white relative">
      {renderByMode(props)}
    </div>
  );
}

function renderByMode(props: Props) {
  switch (props.mode) {
    case "normal":
      return <NormalMode {...props} />;
    case "edit":
      return <EditMode {...props} />;
    default:
      return null;
  }
}

/*
function renderByMode(props: Props) {
  switch (props.mode) {
    case "normal":
      return renderNormal(props);
    case "edit":
      return renderEdit(props);
    default:
      return null;
  }
}
*/

function NormalMode(props: Props) {
  return (
    <>
      {/* 左 */}
      <div className="absolute left-0 top-0 h-full flex items-center">
        <IconButton onClick={props.onOpenMenu}>
          <Menu size={24} />
        </IconButton>
      </div>

      {/* 中央 */}
      <div className="h-full flex items-center justify-center">
        <div className="text-sm font-medium truncate">{props.title}</div>
      </div>

      {/* 右 */}
      <div className="absolute right-0 top-0 h-full flex items-center">
        <IconButton onClick={props.onAdd}>
          <Plus size={24} />
        </IconButton>
        <IconButton onClick={props.onOpenOptions}>
          <MoreHorizontal size={24} />
        </IconButton>
      </div>
    </>
  );
}

function renderNormal({
  title,
  onOpenMenu,
  onAdd,
  onOpenOptions,
}: Props) {
  return (
    <>
      {/* 左 */}
      <div className="absolute left-0 top-0 h-full flex items-center">
        <IconButton onClick={onOpenMenu}>
          <Menu size={24} />
        </IconButton>
      </div>

      {/* 中央 */}
      <div className="h-full flex items-center justify-center">
        <div className="text-sm font-medium truncate">{title}</div>
      </div>

      {/* 右 */}
      <div className="absolute right-0 top-0 h-full flex items-center">
        <IconButton onClick={onAdd}>
          <Plus size={24} />
        </IconButton>
        <IconButton onClick={onOpenOptions}>
          <MoreHorizontal size={24} />
        </IconButton>
      </div>
    </>
  );
}

function renderEdit({
  title,
  isAllSelected,
  onToggleAll,
  canDelete,
  onDelete,
  onCancelEdit,
  isIndeterminate,
}: Props) {
  //const checkboxRef = useRef<HTMLInputElement>(null);
  /*
    useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate =
          !!isIndeterminate;
      }
    }, [isIndeterminate]);
  */

  return (
    <>
      {/* 左：全選択 */}
      <div className="absolute left-0 top-0 h-full flex items-center gap-2 px-2">
        <input
          //ref={checkboxRef}
          type="checkbox"
          checked={isAllSelected}
          onChange={onToggleAll}
        />
        <span className="text-sm">全選択</span>
      </div>

      {/* 中央 */}
      <div className="h-full flex items-center justify-center">
        <div className="text-sm font-medium truncate">{title}</div>
      </div>

      {/* 右 */}
      <div className="absolute right-0 top-0 h-full flex items-center">
        <IconButton onClick={onDelete} disabled={!canDelete}>
          <Trash2 size={24} />
        </IconButton>

        <button
          onClick={onCancelEdit}
          className="px-3 text-sm font-medium text-blue-600 min-h-[44px]"
        >
          キャンセル
        </button>
      </div>
    </>
  );
}

function EditMode(props: Props) {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate =
        !!props.isIndeterminate;
    }
  }, [props.isIndeterminate]);

  return (
    <>
      {/* 左 */}
      <div className="absolute left-0 top-0 h-full flex items-center gap-2 px-2">
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={props.isAllSelected}
          onChange={props.onToggleAll}
        />
        <span className="text-sm">全選択</span>
      </div>

      {/* 中央 */}
      <div className="h-full flex items-center justify-center">
        <div className="text-sm font-medium truncate">
          {props.title}
        </div>
      </div>

      {/* 右 */}
      <div className="absolute right-0 top-0 h-full flex items-center">
        <IconButton
          onClick={props.onDelete}
          disabled={!props.canDelete}
        >
          <Trash2 size={24} />
        </IconButton>

        <button
          onClick={props.onCancelEdit}
          className="px-3 text-sm font-medium text-blue-600 min-h-[44px]"
        >
          キャンセル
        </button>
      </div>
    </>
  );
}
