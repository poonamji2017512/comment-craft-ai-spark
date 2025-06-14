
'use client';
import React from 'react';
import { Plus, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './badge';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { BorderTrail } from './border-trail';

export function Pricing() {
	return (
		<section className="relative min-h-screen overflow-hidden py-24">
			<div id="pricing" className="mx-auto w-full max-w-6xl space-y-5 px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
					viewport={{ once: true }}
					className="mx-auto max-w-xl space-y-5"
				>
					<div className="flex justify-center">
						<div className="rounded-lg border px-4 py-1 font-mono">Pricing</div>
					</div>
					<h2 className="mt-5 text-center text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl">
						Simple Pricing
					</h2>
					<p className="text-muted-foreground mt-5 text-center text-sm md:text-base">
						Choose the plan that works best for you
					</p>
				</motion.div>

				<div className="relative">
					<div
						className={cn(
							'z--10 pointer-events-none absolute inset-0 size-full',
							'bg-[linear-gradient(to_right,--theme(--color-foreground/.2)_1px,transparent_1px),linear-gradient(to_bottom,--theme(--color-foreground/.2)_1px,transparent_1px)]',
							'bg-[size:32px_32px]',
							'[mask-image:radial-gradient(ellipse_at_center,var(--background)_10%,transparent)]',
						)}
					/>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
						viewport={{ once: true }}
						className="mx-auto w-full max-w-4xl space-y-2"
					>	
						<div className="grid md:grid-cols-2 bg-background relative border p-4 gap-4">
							<Plus className="absolute -top-3 -left-3 size-5.5" />
							<Plus className="absolute -top-3 -right-3 size-5.5" />
							<Plus className="absolute -bottom-3 -left-3 size-5.5" />
							<Plus className="absolute -right-3 -bottom-3 size-5.5" />

							{/* PRO Plan */}
							<div className="w-full px-4 pt-5 pb-4 border rounded-lg">
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<h3 className="leading-none font-semibold text-lg">PRO</h3>
										<Badge variant="secondary">3-day free trial</Badge>
									</div>
									<p className="text-muted-foreground text-sm">Ideal for individual creators and getting started with AI comments.</p>
								</div>
								<div className="mt-6 space-y-4">
									<div className="text-muted-foreground flex items-end gap-0.5 text-xl">
										<span>$</span>
										<span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
											20
										</span>
										<span>/month</span>
									</div>
									
									<div className="space-y-2 text-sm">
										<div className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary" />
											<span>Access to Standard AI Models</span>
										</div>
										<div className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary" />
											<span>LinkedIn, X, Reddit, Threads, Bluesky, Facebook, YouTube</span>
										</div>
										<div className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary" />
											<span>Meme Creator</span>
										</div>
										<div className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary" />
											<span>Unlimited Tone Selection</span>
										</div>
									</div>
									
									<Button className="w-full" variant="outline" asChild>
										<a href="/dashboard">Continue with Pro</a>
									</Button>
								</div>
							</div>

							{/* ULTRA Plan */}
							<div className="relative w-full rounded-lg border px-4 pt-5 pb-4">
								<BorderTrail
									style={{
										boxShadow:
											'0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
									}}
									size={100}
								/>
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<h3 className="leading-none font-semibold text-lg">ULTRA</h3>
										<Badge>Popular</Badge>
									</div>
									<p className="text-muted-foreground text-sm">Best for power users, teams, and businesses needing advanced AI.</p>
								</div>
								<div className="mt-6 space-y-4">
									<div className="text-muted-foreground flex items-end text-xl">
										<span>$</span>
										<span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
											40
										</span>
										<span>/month</span>
									</div>
									
									<div className="space-y-2 text-sm">
										<div className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary" />
											<span>Full Access to Google, Claude, and OpenAI models</span>
										</div>
										<div className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary" />
											<span>All platforms + Content Creator with Workflows</span>
										</div>
										<div className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary" />
											<span>Team Features (collaboration, shared access)</span>
										</div>
										<div className="flex items-center gap-2">
											<Check className="h-4 w-4 text-primary" />
											<span>⚡️ Priority Support</span>
										</div>
									</div>
									
									<Button className="w-full" asChild>
										<a href="/dashboard">Continue with Ultra</a>
									</Button>
								</div>
							</div>
						</div>

						<div className="text-muted-foreground flex items-center justify-center gap-x-2 text-sm">
							<ShieldCheck className="size-4" />
							<span>3-day free trial for both plans with no hidden fees</span>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
