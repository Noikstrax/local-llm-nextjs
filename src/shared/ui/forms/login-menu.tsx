"use client";

import { Label } from "../label";
import { Input } from "../input";
import { Button } from "../button";
import { FormProvider, useForm } from "react-hook-form";

import * as z from "zod";
import { loginSchema, TLoginValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "next/link";

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
    <div className="flex justify-center items-center h-screen">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-gray-800 p-5 rounded-md shadow-lg"
        >
          <div className="flex flex-col items-center text-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-center">
                Account registration
              </h2>
              <p className="text-center text-lg">
                Not{" "}
                <Link
                  href="/register"
                  className="text-blue-400 hover:text-blue-300"
                >
                  registered
                </Link>
              </p>
            </div>
            <div className="grid gap-4 mt-3 text-gray-200">
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-gray-400">
                  Email
                </Label>
                <Input
                  {...form.register("email")}
                  id="email"
                  name="email"
                  type="email"
                  required
                ></Input>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password" className="text-gray-400">
                  Password
                </Label>
                <Input
                  {...form.register("password")}
                  id="password"
                  name="password"
                  type="password"
                  required
                ></Input>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full hover:cursor-pointer text-white text-lg mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
