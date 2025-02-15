"use client"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { ApiClient } from "@/lib/api-client"
import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { signupSchema } from "@/lib/db/schema/user.schema"



type SignUpForm = z.infer<typeof signupSchema>

export default function SignUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>({
        resolver: zodResolver(signupSchema),
    })

    const onSubmit = async (data: SignUpForm) => {
        try {
            setIsLoading(true);
            const apiClient = ApiClient.getInstance();
            const response = await apiClient.signUp(data);

            if (!response.error) {
                router.push('/signin');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Create an Account</h1>
                    <p className="text-muted-foreground">Start your learning journey with us</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" type="text" placeholder="Enter your name" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
                        {
                            errors.name && (
                                <p className="text-sm text-destructive">{errors.name.message}</p>
                            )
                        }
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            {...register('email')}
                            className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password')}
                            className={errors.password ? 'border-destructive' : ''}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            {...register('confirmPassword')}
                            className={errors.confirmPassword ? 'border-destructive' : ''}
                        />
                        {errors.confirmPassword && (
                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {
                            isLoading ? "Creating account..." : 'Sign Up'
                        }
                    </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/signin" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </p>

            </motion.div>
        </div>
    )
}