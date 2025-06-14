import React from 'react'
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'

const transitionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[url(/img/grid.svg)] opacity-40 dark:opacity-20" />
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup className="absolute left-1/2 top-0 z-10 -translate-x-1/2 opacity-40 dark:opacity-20">
                            <div className="rotate-[33deg] rounded-full bg-primary/20 blur-3xl size-80 md:size-[32rem]" />
                            <div className="absolute bottom-10 left-1/2 size-24 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl md:size-40" />
                        </AnimatedGroup>
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <a
                                        href="#link"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">Introducing Support for AI Models</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                        
                                    <h1
                                        className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                        Modern Solutions for Customer Engagement
                                    </h1>
                                    <p
                                        className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                        AI-powered social media management and engagement platform that automates your interactions with intelligent comments, DMs, and viral content creation.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup className="mt-10 flex items-center justify-center gap-4">
                                    <Button size="lg">
                                        Get Started
                                        <ChevronRight className="size-5" />
                                    </Button>
                                    <Button variant="outline" size="lg">
                                        Book a Demo
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup className="mt-24" variants={transitionVariants}>
                            <div className="mx-auto max-w-7xl px-6">
                                <div className="relative">
                                    <div className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
                                    <img
                                        src="/img/screenshot.png"
                                        alt="screenshot"
                                        className="relative rounded-3xl shadow-2xl shadow-black/10"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <section className="mt-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <AnimatedGroup className="mx-auto grid max-w-3xl gap-12 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3">
                            <div className="text-center">
                                <img
                                    src="/img/customers/stripe.svg"
                                    alt="Stripe"
                                    className="mx-auto object-contain"
                                />
                            </div>
                            <div className="text-center">
                                <img
                                    src="/img/customers/vercel.svg"
                                    alt="Vercel"
                                    className="mx-auto object-contain"
                                />
                            </div>
                            <div className="text-center">
                                <img
                                    src="/img/customers/slack.svg"
                                    alt="Slack"
                                    className="mx-auto object-contain"
                                />
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Solution', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <a
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                                <span className="text-xl font-bold text-foreground">Interact</span>
                            </a>

                            <button
                                className="relative size-10 lg:hidden [&[data-state=active]>div:nth-child(1)]:translate-y-1.5 [&[data-state=active]>div:nth-child(1)]:rotate-45 [&[data-state=active]>div:nth-child(2)]:opacity-0 [&[data-state=active]>div:nth-child(3)]:translate-y-[-1.5rem] [&[data-state=active]>div:nth-child(3)]:-rotate-45">
                                <Menu
                                    onClick={() => setMenuState(true)}
                                    className={cn('absolute inset-0 size-5 transition-opacity duration-300 group-[[data-state=active]]:opacity-0')}
                                />
                                <X
                                    onClick={() => setMenuState(false)}
                                    className={cn('absolute inset-0 size-5 opacity-0 transition-opacity duration-300 group-[[data-state=active]]:opacity-100')}
                                />
                            </button>
                        </div>

                        <div className="hidden lg:flex lg:w-auto">
                            <ul className="flex items-center space-x-6">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <a
                                            className="text-sm font-medium text-foreground transition-colors hover:text-primary"
                                            href={item.href}>
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="hidden lg:flex lg:w-auto">
                            <div className="flex items-center space-x-6">
                                <Button>
                                    Get Started
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = () => {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="16" fill="url(#paint0_linear_106_715)" />
            <path d="M16.0003 10.6667L10.6669 21.3333H21.3336L16.0003 10.6667Z" fill="white" />
            <defs>
                <linearGradient id="paint0_linear_106_715" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7C3AED" />
                    <stop offset="1" stopColor="#4C51BF" />
                </linearGradient>
            </defs>
        </svg>
    )
}
