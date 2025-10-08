"use client";

import { Label } from "../label";
import { Input } from "../input";
import { Button } from "../button";
import { FormProvider, useForm } from "react-hook-form";
import { loginSchema, TLoginValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const LoginMenu = () => {
  const navigate = useRouter();
  const form = useForm<TLoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TLoginValues) => {
    console.log("onSubmit");
    try {
      const resp = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!resp?.ok) {
        throw Error();
      }

      console.log("Вы успешно вошли в аккаунт");
      navigate.push("/");
    } catch (e) {
      console.error("Error [LOGIN]: ", e);
      console.log("Не удалось войти в аккаунт");
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
            <div className="flex gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() =>
                  signIn("github", {
                    callbackUrl: "/",
                    redirect: true,
                  })
                }
                type="button"
                className="gap-2 h-12 p-2 flex-1 bg-gray-700 hover:bg-gray-600 hover:cursor-pointer"
              >
                <div className="relative w-6 h-6">
                  <Image
                    className=""
                    src="https://github.githubassets.com/favicons/favicon.svg"
                    fill
                    alt="github-icon"
                  />
                </div>
                GitHub
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: "/",
                    redirect: true,
                  })
                }
                type="button"
                className="gap-2 h-12 p-2 flex-1 bg-gray-700 hover:bg-gray-600 hover:cursor-pointer"
              >
                <div className="relative w-6 h-6">
                  <Image
                    className=""
                    src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                    fill
                    alt="google-icon"
                  />
                </div>
                Google
              </Button>
            </div>
            <Button
              disabled={form.formState.isSubmitting}
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
