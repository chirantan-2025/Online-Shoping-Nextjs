import z from "zod";

export const backuserSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(255, { message: "Name must be at most 255 characters." }),

  email: z.string().email({ message: "Invalid email address." }),

  phone: z
    .string()
    .min(10, { message: "Phone number is required." })
    .regex(/^[6-9]\d{9}$/, { message: "Invalid mobile number." }),

  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(20, "Password must be at most 20 characters"),

  roleId: z.string().uuid().optional(),
});
