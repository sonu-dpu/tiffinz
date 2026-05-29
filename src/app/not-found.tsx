"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, ChefHat, HelpCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-secondary/15 p-4">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:16px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative ambient glow blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-secondary/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Main Card Container */}
      <div className="group relative max-w-md w-full text-center p-8 rounded-2xl bg-card/65 backdrop-blur-md border border-border shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-primary/20">
        
        {/* Decorative background "404" */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9rem] font-black select-none pointer-events-none text-muted-foreground/30 tracking-wider font-mono">
          404
        </div>

        {/* Interactive SVG Illustration */}
        <div className="relative z-10 select-none">
          <svg
            viewBox="0 0 200 200"
            className="w-44 h-44 mx-auto mb-6 text-primary drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <style>{`
              @keyframes steam {
                0% { transform: translateY(12px) scaleX(0.85); opacity: 0; }
                15% { opacity: 0.55; }
                50% { opacity: 0.3; }
                100% { transform: translateY(-20px) scaleX(1.15); opacity: 0; }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-4px); }
              }
              .steam-1 { animation: steam 3s infinite linear; }
              .steam-2 { animation: steam 3s infinite linear 1s; }
              .steam-3 { animation: steam 3s infinite linear 2s; }
              .floating-cloche { animation: float 5s infinite ease-in-out; }
            `}</style>

            {/* Steam lines (revealed slightly, more visible on hover) */}
            <g className="text-primary/30 dark:text-primary/50 transition-opacity duration-300">
              <path
                d="M 85 85 Q 80 75 85 65 T 85 45"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="steam-1"
              />
              <path
                d="M 100 85 Q 105 75 100 65 T 100 45"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="steam-2"
              />
              <path
                d="M 115 85 Q 110 75 115 65 T 115 45"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="steam-3"
              />
            </g>

            {/* Content inside the plate (revealed when cloche is lifted) */}
            <g className="transition-opacity duration-300 opacity-60 group-hover:opacity-100">
              <circle cx="100" cy="118" r="16" className="fill-primary/5 stroke-primary/20 stroke-[1.5] stroke-dashed" />
              <text
                x="100"
                y="126"
                textAnchor="middle"
                className="text-2xl font-bold fill-primary/85 dark:fill-primary select-none animate-pulse"
                style={{ fontFamily: 'var(--font-sans), sans-serif' }}
              >
                ?
              </text>
            </g>

            {/* Cloche Lid (lifts and tilts on group-hover) */}
            <g className="transition-transform duration-500 ease-out origin-[145px_135px] group-hover:-translate-y-9 group-hover:rotate-12 floating-cloche">
              {/* Knob / Handle */}
              <circle cx="100" cy="80" r="5.5" className="fill-primary stroke-background stroke-2" />
              <path d="M 100 85 L 100 90" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" />
              
              {/* Dome */}
              <path
                d="M 50 135 C 50 88 150 88 150 135 Z"
                className="fill-primary/95 dark:fill-primary/85 stroke-primary-foreground/15 stroke-2"
              />
              
              {/* Decorative accent curve on cloche */}
              <path
                d="M 55 128 C 65 102 135 102 145 128"
                className="stroke-primary-foreground/25 fill-none stroke-2"
              />
              
              {/* Lid Rim */}
              <rect x="46" y="133" width="108" height="6.5" rx="3.25" className="fill-primary stroke-primary-foreground/10 stroke-1" />
            </g>

            {/* Plate Base (Static) */}
            <g>
              {/* Rim */}
              <path
                d="M 30 145 C 30 162 170 162 170 145 Z"
                className="fill-muted/90 dark:fill-card stroke-border stroke-[3]"
              />
              {/* Inner Plate Surface */}
              <ellipse
                cx="100"
                cy="144"
                rx="65"
                ry="8"
                className="fill-background/50 dark:fill-background/25 stroke-border/30 stroke-1"
              />
              {/* Under Plate Shadow */}
              <ellipse
                cx="100"
                cy="159"
                rx="58"
                ry="5"
                className="fill-foreground/5 dark:fill-black/35 blur-[2.5px]"
              />
            </g>
          </svg>
        </div>

        {/* Content Area */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4 border border-primary/20">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Recipe Missing</span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight mb-2 bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent dark:from-primary dark:to-emerald-400">
            Page Not Found
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">
            It looks like this page was devoured by our hungry kitchen crew, or the menu has changed. Let&apos;s get you back to something delicious!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 cursor-pointer transition-transform active:scale-95 border-border hover:bg-accent/60 dark:hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button
              variant="default"
              asChild
              className="flex-1 cursor-pointer transition-transform active:scale-95 bg-primary text-primary-foreground hover:bg-primary/95"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="mt-8 pt-6 border-t border-border/60 relative z-10 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Lost? Visit our</span>
          <Link href="/dashboard" className="text-primary hover:underline font-medium">
            Dashboard
          </Link>
          <span>or contact support.</span>
        </div>
      </div>
    </div>
  );
}
