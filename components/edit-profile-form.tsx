"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateProfile } from "@/actions/update-profile"; 
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  email: z.string().email("Invalid email address"),
});

export function EditProfileForm({ user }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const { update } = useSession();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await updateProfile(values);
      await update({ name: values.name, email: values.email })
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}