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

const formSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
        .string()
        .min(4, "Password must be at least 4 characters")
        .max(20, "Password must be at most 20 characters"),
});

const SignUp = () => {


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
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
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className=" text-sky-400 text-lg">Email</FormLabel>
                                    <FormControl>
                                        <Input className="hover:border-sky-400 focus:border-sky-400 focus:ring-0" placeholder="Enter your Email" {...field} />
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
                                    <FormLabel className=" text-sky-400 text-lg">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                           className="hover:border-sky-400 focus:border-sky-400 focus:ring-0" 
                                            type="password"
                                            placeholder="***********"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <div className="text-right mt-1">
                                        <a
                                            href="/auth/forgot-password"
                                            className="text-sm text-sky-400 hover:underline"
                                        >
                                            Forgot Password?
                                        </a>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full cursor-pointer bg-sky-400 hover:bg-sky-700 font-bold text-md"
                        >
                            Login
                        </Button>
                    
                    
                    </div>
                    <div className="text-center text-md">
                        Don&apos;t have an account?{" "}
                        <a href="/auth/register" className="underline underline-offset-4 text-sky-400 hover:text-sky-700">
                            Sign Up
                        </a>
                    </div>
                </form>
            </Form>
        </>
    );
};

export default SignUp;
