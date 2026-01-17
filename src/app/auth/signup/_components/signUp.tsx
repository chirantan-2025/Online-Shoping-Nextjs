"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z
  .object({
    username: z.string().min(2, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    mobile_no: z
      .string()
      .min(10, "Ph no. is required")
      .regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters")
      .max(20, "Password must be at most 20 characters"),
    confirm_password: z
      .string()
      .min(4, "Password must be at least 4 characters")
      .max(20, "Password must be at most 20 characters"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

const SignUp = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      mobile_no: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.username,
          email: values.email,
          phone: values.mobile_no,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success(data.message || "Registration successful!");
      router.push("/auth/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center  w-full max-w-md gap-6 p-6 rounded-xl 
                    border-1 border-sky-200
                    transition-all duration-300
                    hover:shadow-lg hover:border-sky-400 mx-auto my-10"
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-bold text-sky-400">
              Create your account
            </h1>
            <p className="text-balance text-xs text-muted-foreground">
              Enter your credentials below to create new account
            </p>
          </div>
          <div className="grid">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-sky-400 text-lg">Name</FormLabel>
                  <FormControl>
                    <Input
                      className="hover:border-sky-400 focus:border-sky-400 focus:ring-0"
                      placeholder="Enter your Full Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-sky-400 text-lg">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="hover:border-sky-400 focus:border-sky-400 focus:ring-0"
                      placeholder="Enter your Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Mobile number */}
            <FormField
              control={form.control}
              name="mobile_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-sky-400 text-lg">
                    Mobile Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="hover:border-sky-400 focus:border-sky-400 focus:ring-0"
                      placeholder="Enter your Phone no."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-sky-400 text-lg">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="hover:border-sky-400 focus:border-sky-400 focus:ring-0"
                      type="password"
                      placeholder="***********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" text-sky-400 text-lg">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="hover:border-sky-400 focus:border-sky-400 focus:ring-0"
                      type="password"
                      placeholder="***********"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  {/* <div className="text-right mt-1">
                    <a
                      href="/auth/forgot-password"
                      className="text-sm text-sky-400 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div> */}
                </FormItem>
              )}
            />
            <div className="flex items-start gap-3 mt-4">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-gray-300 
                   focus:ring-0 focus:outline-none 
                   text-sky-500 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="/terms" className="text-sky-500 hover:underline">
                  Terms & Conditions
                </a>
              </label>
            </div>

            {/* SUBMIT button  */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-1/2 mx-auto cursor-pointer bg-sky-400 hover:bg-sky-700 font-bold text-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </div>
          <div className="text-center text-md">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="underline underline-offset-4 text-sky-400 hover:text-sky-700"
            >
              Login
            </a>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SignUp;
