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
import { signInAction } from '@/lib/actions/auth'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { BookOpen, Users, GraduationCap, Star } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const res = await signInAction(values)
      if (res.success) {
        router.push('/')
      } else {
        toast({
          title: 'Error',
          description: res.data.message,
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error(error)
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
            <div className="absolute top-20 left-10">
              <BookOpen className="h-16 w-16 text-amber-500" />
            </div>
            <div className="absolute top-40 right-20">
              <GraduationCap className="h-12 w-12 text-amber-400" />
            </div>
            <div className="absolute bottom-40 left-20">
              <Users className="h-14 w-14 text-amber-300" />
            </div>
            <div className="absolute bottom-60 right-10">
              <Star className="h-10 w-10 text-amber-500" />
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
                  Welcome to the future of learning
                </h2>
                <p className="text-lg text-gray-300">
                  Join thousands of learners and educators building knowledge together through interactive communities and immersive classrooms.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Interactive learning communities</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Real-time collaboration tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Personalized learning experiences</span>
                </div>
              </div>

              <blockquote className="space-y-2 pt-6 border-t border-white/20">
                <p className="text-lg italic">
                  &quot;Learnverse has revolutionized how I engage with my students. The community features and interactive tools have made learning more collaborative and exciting than ever.&quot;
                </p>
                <footer className="text-sm text-amber-400 font-medium">
                  Dr. Sarah Chen, Professor of Computer Science
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
        
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Continue your learning journey with Learnverse
              </p>
            </div>
            
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                          placeholder="Enter your password"
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
                  Sign In to Learnverse
                </Button>
              </form>
            </Form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  New to Learnverse?
                </span>
              </div>
            </div>

            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/sign-up"
                className="hover:text-amber-600 underline underline-offset-4 font-medium"
              >
                Create your account and start learning today
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
