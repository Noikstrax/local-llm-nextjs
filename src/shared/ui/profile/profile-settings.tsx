"use client";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { Button } from "../button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Label } from "../label";
import { TemperatureSlider } from "./temperature-slider";
import { temperatureSchema, TTemperatureValue } from "../forms/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export function ProfileSettings({ children }: React.PropsWithChildren) {
  const [open, setOpen] = useState(false);

  const form = useForm<TTemperatureValue>({
    resolver: zodResolver(temperatureSchema),
    defaultValues: {
      temperature: 0.5,
    },
  });

  const onSubmit = async (data: TTemperatureValue) => {
    try {
      const res = await fetch(`/api/profile/settings/temperature/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temperature: data.temperature }),
      });

      if (!res.ok) {
        throw new Error("[UPDATE_TEMPERATURE] fetch error");
      }

      setOpen(false);
    } catch (e) {
      console.error("Update temperature error: ", e);
    }
  };

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <FormProvider {...form}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Profile settings</DialogTitle>
                <DialogDescription>Profile Settings</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Controller
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <TemperatureSlider
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant={"secondary"} type="submit">
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </FormProvider>
      </Dialog>
    </div>
  );
}
