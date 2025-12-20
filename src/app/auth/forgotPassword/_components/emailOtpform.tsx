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
});

const EmailOtp = () => {


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    };

    return (
        <>
        <div className="min-h-screen flex items-center justify-center px-4">
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
                            Forgot Password
                        </h1>
                        <p className="text-balance text-xs text-muted-foreground">
                            Enter your mail id to get OTP for verification
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
                        <Button
                            type="submit"
                            className="w-1/2 mx-auto cursor-pointer bg-sky-400 hover:bg-sky-700 font-bold text-md"
                        >
                            Send OTP
                        </Button>
                    
                    
                    </div>
                </form>
            </Form>
        </div>
        </>
    );
};

export default EmailOtp;
