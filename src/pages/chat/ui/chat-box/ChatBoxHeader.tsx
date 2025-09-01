"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  fetchModels,
  selectModel,
} from "../../../../../app/store/models/modelsSlice";
import { useAppDispatch, useAppSelector } from "../../../../../app/store/hooks";
import { useEffect } from "react";
import { Skeleton } from "@/shared/ui/skeleton";
import { Alert, AlertTitle } from "@/shared/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export const ChatBoxHeader = () => {
  const dispatch = useAppDispatch();
  const { models, loading } = useAppSelector((state) => state.models);
  const selectedModel = models.find((model) => model.isSelected);

  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  if (loading === "pending") {
    return (
      <Skeleton className="ml-3 h-[32px] w-[85px] rounded-sm bg-gray-500" />
    );
  }
  if (loading === "failed") {
    return <div className="text-red-500">Unable to load LLM's</div>;
  }

  if (loading === "succeeded") {
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
                onClick={() =>
                  dispatch(
                    selectModel({
                      name: model.name,
                    })
                  )
                }
              >
                <button className="hover:cursor-pointer">
                  {model.name} {model.isSelected ? "+" : ""}
                </button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
};
