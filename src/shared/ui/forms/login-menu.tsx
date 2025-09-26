"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { Label } from "../label";
import { Input } from "../input";
import { Button } from "../button";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { loginSchema, TLoginValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const LoginData = z.object({
  userEmail: z.email(),
  password: z.string(),
});

export const LoginMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<TLoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: TLoginValues) => {
    console.log("onSubmit");
    try {
      const resp = { ok: true };
      if (!resp?.ok) {
        throw new Error("acocunt is not find");
      }
      setIsOpen(false);
    } catch (e) {
      console.error("Error [LOGIN]: ", e);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="hover:cursor-pointer">
          Login
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Login menu</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 mt-3">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                {...form.register("email")}
                id="email"
                name="email"
                type="email"
                required
              ></Input>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input
                {...form.register("password")}
                id="password"
                name="password"
                type="password"
                required
              ></Input>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="hover:cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="hover:cursor-pointer">
              Login
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
