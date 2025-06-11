'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Icons } from '@/components/icons'
import { signUpAction } from '@/lib/actions/auth'
import { useToast } from '@/hooks/use-toast'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { BookOpen, Users, GraduationCap, Lightbulb, Target } from 'lucide-react'

const formSchema = z
  .object({
    fullname: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    username: z
      .string()
      .min(2, 'Username must be at least 2 characters')
      .regex(
        /^[a-zA-Z0-9]+$/,
        'Username must contain only letters and numbers',
      ),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      dob: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('fullname', values.fullname)
      formData.append('email', values.email)
      formData.append('username', values.username)
      formData.append('password', values.password)
      formData.append('dob', values.dob)
      const res = await signUpAction(formData)
      console.log(res)
      if (res.success) {
        router.push('/create-profile')
      } else {
        toast({
          title: 'Error',
          description: res.data.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError
      console.log({
        tut: axiosError,
      })
      toast({
        title: 'Error',
        description: axiosError.response?.data as string,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="w-screen min-h-screen fixed top-0 left-0 bg-background z-50">
      <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C2533] to-[#2A3441]" />
          
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-16 left-8">
              <Target className="h-14 w-14 text-amber-500" />
            </div>
            <div className="absolute top-32 right-16">
              <Lightbulb className="h-12 w-12 text-amber-400" />
            </div>
            <div className="absolute bottom-32 left-16">
              <BookOpen className="h-16 w-16 text-amber-300" />
            </div>
            <div className="absolute bottom-48 right-12">
              <GraduationCap className="h-12 w-12 text-amber-500" />
            </div>
            <div className="absolute top-60 left-4">
              <Users className="h-10 w-10 text-amber-400" />
            </div>
          </div>

          <div className="relative z-20 flex items-center text-lg font-medium">
            <Icons.logo className="mr-2 h-8 w-8 text-amber-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Learnverse
            </span>
          </div>
          
          <div className="relative z-20 mt-auto">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold leading-tight">
                  Start your learning adventure
                </h2>
                <p className="text-lg text-gray-300">
                  Connect with educators and learners worldwide. Create, share, and discover knowledge in interactive learning environments.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Join vibrant learning communities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Create and share educational content</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Track your learning progress</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Access personalized recommendations</span>
                </div>
              </div>

              <blockquote className="space-y-2 pt-6 border-t border-white/20">
                <p className="text-lg italic">
                  &quot;Since joining Learnverse, I&apos;ve been able to connect with amazing educators and students. The platform makes collaborative learning feel natural and engaging.&quot;
                </p>
                <footer className="text-sm text-amber-400 font-medium">
                  Maria Rodriguez, Graduate Student
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
        
        <div className="lg:p-8 overflow-y-auto max-h-screen">
          <div className="mx-auto flex w-full flex-col justify-start space-y-6 sm:w-[350px] min-h-screen lg:min-h-0 py-8 lg:py-0">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Join Learnverse
              </h1>
              <p className="text-sm text-muted-foreground">
                Create your account and unlock unlimited learning possibilities
              </p>
            </div>
            
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
                          className="h-11"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose a unique username" 
                          className="h-11"
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          className="h-11"
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a strong password"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          className="h-11"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button className="w-full h-11 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium" type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Your Learnverse Account
                </Button>
              </form>
            </Form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              type="button"
              className="h-11"
              disabled={isLoading}
              onClick={async () => {
                // TODO: Implement Google OAuth
              }}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Sign up with Google
            </Button>
            
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/sign-in"
                className="hover:text-amber-600 underline underline-offset-4 font-medium"
              >
                Already have an account? Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
