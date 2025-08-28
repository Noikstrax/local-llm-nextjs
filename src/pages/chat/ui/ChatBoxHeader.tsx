"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { selectModel } from "../../../../app/store/models/modelsSlice";
import { useAppDispatch, useAppSelector } from "../../../../app/store/hooks";

export const ChatBoxHeader = () => {
  const dispatch = useAppDispatch();
  const models = useAppSelector((state) => state.models);
  const selectedModel = models.find((model) => model.isSelected);

  return (
    <div className="ml-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-sm hover:bg-gray-500 px-1 py-1 hover:cursor-pointer">
          {selectedModel?.name ?? "Model is not selected"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Models</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {models.map((model) => (
            <DropdownMenuItem
              key={model.name}
              className="rounded-sm hover:bg-gray-500 px-1 py-1 hover:cursor-pointer"
            >
              <button
                onClick={() =>
                  dispatch(
                    selectModel({
                      name: model.name,
                    })
                  )
                }
              >
                {model.name} {model.isSelected ? "+" : ""}
              </button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
