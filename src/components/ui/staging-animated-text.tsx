"use client"

import * as React from "react"
import { motion, Variants } from "motion/react"
import { cn } from "@/lib/utils"

interface StagingAnimatedTextProps
    extends React.HTMLAttributes<HTMLDivElement> {
    text: string
    duration?: number
    delay?: number
    replay?: boolean
    underline?: boolean
    className?: string
    textClassName?: string
    underlineClassName?: string
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
    underlineGradient?: string
    underlineHeight?: string
    underlineOffset?: string
    onAnimationComplete?: () => void
}

const StagingAnimatedText = React.forwardRef<HTMLDivElement, StagingAnimatedTextProps>(
    (
        {
            text,
            duration = 0.06,
            delay = 0.05,
            replay = true,
            underline = true,
            className,
            textClassName,
            underlineClassName,
            as: Component = "div",
            underlineGradient = "from-[#07553D] via-[#D4AF37] to-[#07553D]",
            underlineHeight = "h-[2.5px]",
            underlineOffset = "-bottom-2",
            onAnimationComplete,
            ...props
        },
        ref
    ) => {
        const letters = Array.from(text)
        const hasCompletedRef = React.useRef(false)

        React.useEffect(() => {
            if (!replay) {
                hasCompletedRef.current = false
                return
            }

            // Safety fallback timer ensuring completion triggers reliably
            const underlineDelay = underline ? Math.max(0.15, letters.length * duration * 0.75) : 0
            const underlineDuration = underline ? 0.7 : 0
            const totalDurationMs = Math.max(
                500,
                Math.max(
                    (letters.length * duration + delay + 0.5) * 1000,
                    (underlineDelay + underlineDuration + 0.2) * 1000
                )
            )
            const timer = setTimeout(() => {
                if (!hasCompletedRef.current) {
                    hasCompletedRef.current = true
                    onAnimationComplete?.()
                }
            }, totalDurationMs)

            return () => clearTimeout(timer)
        }, [replay, letters.length, duration, delay, underline, onAnimationComplete])

        const container: Variants = {
            hidden: {
                opacity: 0,
            },

            visible: (i: number = 1) => ({
                opacity: 1,
                transition: {
                    staggerChildren: duration,
                    delayChildren: i * delay,
                },
            }),
        }

        const child: Variants = {
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                    type: "spring",
                    damping: 12,
                    stiffness: 200,
                },
            },

            hidden: {
                opacity: 0,
                y: 20,
                transition: {
                    type: "spring",
                    damping: 12,
                    stiffness: 200,
                },
            },
        }

        // Underline stages up in Y and extends outward symmetrically from center to both ends
        const lineVariants: Variants | undefined = underline
            ? {
                hidden: {
                    width: "0%",
                    left: "50%",
                    x: "-50%",
                    y: 10,
                    opacity: 0,
                },

                visible: {
                    width: "100%",
                    left: "50%",
                    x: "-50%",
                    y: 0,
                    opacity: 1,

                    transition: {
                        delay: Math.max(0.15, letters.length * duration * 0.75),
                        duration: 0.7,
                        ease: [0.22, 1, 0.36, 1],
                    },
                },
            }
            : undefined

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Tag = (Component || "div") as any;

        return (
            <Tag
                ref={ref}
                className={cn(
                    "flex flex-col items-center justify-center gap-2",
                    className
                )}
                {...props}
            >
                <div className={cn("relative inline-block", !underline && "contents")}>
                    <motion.div
                        style={{
                            display: "inline-flex",
                            overflow: "visible",
                        }}
                        variants={container}
                        initial="hidden"
                        animate={replay ? "visible" : "hidden"}
                        onAnimationComplete={(definition) => {
                            if (definition === "visible" && !hasCompletedRef.current) {
                                hasCompletedRef.current = true
                                onAnimationComplete?.()
                            }
                        }}
                        className={cn(
                            "text-4xl font-bold text-center",
                            textClassName
                        )}
                    >
                        {letters.map((letter, index) => (
                            <motion.span key={index} variants={child}>
                                {letter === " " ? "\u00A0" : letter}
                            </motion.span>
                        ))}
                    </motion.div>

                    {underline && lineVariants && (
                        <motion.div
                            variants={lineVariants}
                            initial="hidden"
                            animate={replay ? "visible" : "hidden"}
                            className={cn(
                                "absolute rounded-full",
                                underlineHeight,
                                underlineOffset,
                                "bg-linear-to-r",
                                underlineGradient,
                                underlineClassName
                            )}
                            style={{
                                background: "linear-gradient(90deg, var(--color-primary, #07553D) 0%, var(--color-gold, #D4AF37) 50%, var(--color-primary, #07553D) 100%)",
                            }}
                        />
                    )}
                </div>
            </Tag>
        )
    }
)

StagingAnimatedText.displayName = "StagingAnimatedText"

export { StagingAnimatedText }
