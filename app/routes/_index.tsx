import type { MetaFunction, LinksFunction } from "@remix-run/node"
import * as stylex from "@stylexjs/stylex"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import "../landing.css"

export const meta: MetaFunction = () => {
  return [
    { title: "Inline - Messaging for teams that crave high-quality software" },
    {
      name: "description",
      content:
        "We're building a native, fast, powerful chat app for teams. It's ultra-low RAM, 120 fps, tranquil and has context-aware notifications.",
    },
  ]
}

export const links: LinksFunction = () => {
  return [
    { rel: "preload", href: "/content-bg.jpg", as: "image" },
    {
      rel: "preload",
      href: "/content-bg@2x.jpg",
      as: "image",
      media: "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
    },
  ]
}

const addTransitionEffect = () => {
  const style = document.createElement("style")
  style.textContent = "*, div { transition: all 300ms ease-out !important; }"
  document.head.appendChild(style)

  setTimeout(() => {
    document.head.removeChild(style)
  }, 200)
}

const messagesLength = 4
const apiEndpoint = process.env.NODE_ENV == "production" ? "https://api.inline.chat" : "http://localhost:8000"
const centerWidth = 983
const centerHeight = 735
const cardRadius = 22
const firstContentRowHeight = 445
const buttonHeight = 44
export default function Index() {
  const [focused, setFocused] = useState(false)
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [failed, setFailed] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [isntInitialRender, setIsntInitialRender] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const [formActive, setFormActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsntInitialRender(true)
    setMousePosition({ x: document.documentElement.clientWidth / 2, y: document.documentElement.clientHeight / 2 })
  }, [])

  const lastPlayedAtRef = useRef(0)
  const [message, setMessage] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const [fontAvailable, setFontAvailable] = useState(false)

  useEffect(() => {
    // Check if the 'Red Hat Display' font is available
    document.fonts.ready.then(() => {
      if (document.fonts.check("12px 'Red Hat Display'")) {
        setFontAvailable(true)
      } else {
        setFontAvailable(false)
      }
    })
  }, [])
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY })
      if (!hasInteracted) {
        addTransitionEffect()
        setTimeout(() => {
          setHasInteracted(true)
        }, 50)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [hasInteracted])

  const calculateParallax = () => {
    if (typeof document === "undefined") return { x: 0, y: 0 }
    const centerElement = document.querySelector("#center")
    if (!centerElement) return { x: 0, y: 0 }

    const rect = centerElement.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const offsetX = (mousePosition.x - centerX) / 50
    const offsetY = (mousePosition.y - centerY) / 50

    return { x: -offsetX, y: -offsetY }
  }

  const parallaxOffset = calculateParallax()

  return (
    <motion.div {...stylex.props(styles.root)}>
      <motion.div {...stylex.props(styles.centerBox, styles.center)} id="center">
        <motion.div
          {...stylex.props(styles.centerBox, styles.bg)}
          initial={{ filter: "brightness(1)" }}
          animate={{
            filter: formActive ? "brightness(1.15)" : undefined,
          }}
          style={{
            position: "absolute",
            transform: hasInteracted
              ? `translate(${parallaxOffset.x * 0.2}px, ${parallaxOffset.y * 0.15}px)`
              : undefined,
            boxShadow: hasInteracted
              ? `${parallaxOffset.x * 1.8}px ${20 + parallaxOffset.y * 1}px 20px -10px rgba(0, 0, 0, 0.2)`
              : undefined,
          }}
        >
          <motion.div
            animate={{ opacity: 0.18 }}
            style={{
              position: "absolute",
              zIndex: 2,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(${55 + parallaxOffset.x * 1.5}deg,
              rgba(255,255,255,0) 30%,
              rgba(255,255,255,0.1) 45%,
              rgba(255,255,255,0.4) 50%,
              rgba(255,255,255,0.1) 55%,
              rgba(255,255,255,0) 70%)`,
              // opacity: 0.18,
              opacity: 0,
              transform: `scale(1.5) ${
                hasInteracted ? `translateX(${parallaxOffset.x * -2}px) translateY(${parallaxOffset.y * -1}px)` : ""
              }`,
              pointerEvents: "none",
              boxShadow: "inset 0px 10px 80px 120px rgba(255, 255, 255, 1)",
            }}
          />
        </motion.div>

        <div
          {...stylex.props(styles.content)}
          // style={{
          //   transform: `translate(${parallaxOffset.x * 0.1}px, ${
          //     parallaxOffset.y * 0.1
          //   }px)`,
          // }}
        >
          <h1 {...stylex.props(styles.logotype)}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              animate={fontAvailable ? { opacity: 1, y: 0 } : undefined}
            >
              <motion.img
                drag
                whileTap={{ scale: 1.15 }}
                dragElastic={0.1}
                dragConstraints={{
                  top: 10,
                  left: 10,
                  right: 10,
                  bottom: 10,
                }}
                src="/logotype-white.svg"
                alt="Inline"
                height="18px"
                width="75px"
              />
            </motion.div>
          </h1>
          <motion.h2
            style={{ userSelect: "none" }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ delay: 0, duration: 0.4 }}
            animate={fontAvailable ? { opacity: 1, y: 0, scale: 1 } : undefined}
            // layout="preserve-aspect"
            {...stylex.props(styles.subheading)}
            onClick={() => {
              setMessage((m) => (m < messagesLength - 1 ? m + 1 : 0))
            }}
          >
            {message === 0 && (
              <>
                Chat that isn&apos;t from{" "}
                <span
                  {...stylex.props(styles.dated)}
                  onPointerEnter={() => {
                    // limit it to once per 2s
                    if (Date.now() - lastPlayedAtRef.current < 1500) return
                    const audio = new Audio("/sounds/slack-notification.mp3")
                    audio.volume = 0.2
                    audio.play()
                    lastPlayedAtRef.current = Date.now()
                  }}
                >
                  2010s
                </span>
              </>
            )}
            {message === 1 && <>Where chat happens</>}
            {message === 2 && <>iMessage, but for teams</>}
            {message === 3 && <>Messaging for focused work</>}
          </motion.h2>
          <motion.p
            {...stylex.props(styles.description)}
            initial={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            animate={fontAvailable ? { opacity: 1, y: 0, scale: 1 } : undefined}
          >
            We're building a native, high-quality messaging app for teams who crave the best.
          </motion.p>

          <motion.div
            style={{
              height: buttonHeight,
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            animate={fontAvailable ? { opacity: 1, y: 0, scale: 1 } : undefined}
          >
            <AnimatePresence>
              {formActive ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, width: 0, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    width: 300,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, width: 0, scale: 0.6 }}
                  onSubmit={(e) => {
                    e.preventDefault()
                    setFormActive(false)
                    setSubmitting(true)

                    const revert = () => {
                      setTimeout(() => {
                        setFormActive(false)
                        setSubmitting(false)
                        setSubscribed(false)
                        setFailed(false)
                      }, 1500)
                    }

                    // submit
                    fetch(`${apiEndpoint}/waitlist/subscribe`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email,
                        userAgent: navigator.userAgent,
                        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                      }),
                    })
                      .then(() => {
                        setFormActive(false)
                        setSubmitting(false)
                        setSubscribed(true)
                        setEmail("")
                        revert()
                      })
                      .catch(() => {
                        setFailed(true)
                        setFormActive(false)
                        setSubmitting(false)
                        setSubscribed(false)
                        revert()
                      })
                  }}
                  {...stylex.props(styles.emailForm, focused ? styles.emailFormActive : null)}
                  style={{
                    top: 0,
                    overflow: "hidden",
                    position: "absolute",
                    transform: hasInteracted
                      ? `translate(${parallaxOffset.x * 0.2 * -1}px, ${parallaxOffset.y * 0.1 * -1}px)`
                      : undefined,
                  }}
                >
                  <motion.input
                    key="input"
                    type="email"
                    ref={inputRef}
                    placeholder="What's your work email?"
                    {...stylex.props(styles.emailInput)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => {
                      setFocused(true)
                    }}
                    onBlur={() => {
                      setFocused(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setFormActive(false)
                      }
                    }}
                  />

                  <motion.button {...stylex.props(styles.emailButton)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="btn"
                  {...stylex.props(styles.button)}
                  initial={isntInitialRender ? { opacity: 0, width: 0, scale: 0.6 } : undefined}
                  animate={{
                    opacity: 1,
                    width: 300,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.6, width: 0 }}
                  style={{
                    top: 0,
                    position: "absolute",
                    transform: hasInteracted
                      ? `translate(${parallaxOffset.x * 0.2 * -1}px, ${parallaxOffset.y * 0.1 * -1}px)`
                      : undefined,
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    setFormActive(true)
                    requestAnimationFrame(() => {
                      // focus input
                      inputRef.current?.focus()
                      inputRef.current?.select()
                    })
                  }}
                  whileTap={{ scale: formActive ? 1 : 0.95 }}
                >
                  <span
                    style={{
                      display: "block",
                      transform: `translate(${parallaxOffset.x * 0.08 * -1}px, 0px)`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {failed
                      ? "Failed to submit"
                      : submitting
                      ? "Submitting..."
                      : subscribed
                      ? "You're on the waitlist 🎉"
                      : "Get on the Waitlist"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div {...stylex.props(styles.features)}>
          {[
            {
              title: "Lightweight",
              desc: "Sub-1% CPU usage, ultra-low RAM, and under-designed UI.",
            },
            {
              title: "Designed for speed",
              desc: "120-fps, instant app startup, no spinners. Works fast on any network.",
            },
            {
              title: "Simple",
              desc: "Powerful, yet easy to use. Minimum clicks and modals. Clutter-free.",
            },
            {
              title: "Intelligent",
              desc: "Agents can handle workflows across apps via custom reaction triggers.",
            },
            {
              title: "Tranquil",
              desc: "Only what's relevant to you shows in the sidebar. Dig deeper at your will.",
            },
            {
              title: "Context-aware notifications",
              desc: "Inline differentiates urgent messages vs casual pings.",
            },
          ].map(({ title, desc }, index) => (
            <motion.div
              {...stylex.props(styles.card)}
              key={title}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1 + index * 0.05,
                // duration: 0.2,
                // ease: "easeOut",
              }}
            >
              <h3 {...stylex.props(styles.cardHeading)}>{title}</h3>
              <p {...stylex.props(styles.cardText)}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* == */}
      <footer {...stylex.props(styles.footer)}>
        <div>
          <div>Coming soon in early access for macOS and iOS, written in Swift, and for the web</div>
        </div>

        <div {...stylex.props(styles.footerSecondRow)}>
          <div>
            <a
              href="https://x.com/intent/follow?screen_name=inline_chat"
              target="_blank"
              rel="noopener noreferrer"
              {...stylex.props(styles.footerLink)}
            >
              Follow updates on X (Twitter)
            </a>
          </div>
          <div>
            <a
              href="https://github.com/inline-chat"
              target="_blank"
              rel="noopener noreferrer"
              {...stylex.props(styles.footerLink)}
            >
              GitHub
            </a>
          </div>
          <div>
            <a
              href="https://status.inline.chat"
              target="_blank"
              rel="noopener noreferrer"
              {...stylex.props(styles.footerLink)}
            >
              Status
            </a>
          </div>
          <div>
            <a href="/privacy" {...stylex.props(styles.footerLink)}>
              Privacy
            </a>
          </div>
          <a
            href="mailto:hey@inline.chat"
            target="_blank"
            rel="noopener noreferrer"
            {...stylex.props(styles.footerLink)}
          >
            hey@inline.chat
          </a>
        </div>

        <div {...stylex.props(styles.footerSecondRow)}>
          <div {...stylex.props(styles.copyRight)}>© 2025 Inline Chat</div>
        </div>
      </footer>
    </motion.div>
  )
}

const flash = stylex.keyframes({
  "0%": { opacity: 1 },
  "50%": { opacity: 0.5 },
  "100%": { opacity: 1 },
})

const styles = stylex.create({
  root: {
    // default text style
    fontSize: 15,
    minHeight: "100%",

    fontWeight: "400",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: {
      default: "center",
      "@media (max-width: 1000px)": "flex-start",
    },
    padding: {
      default: "1rem", // This replaces the Tailwind p-4 class
      "@media (max-width: 1000px)": "12px",
    },
    paddingTop: {
      default: 32,
      "@media (max-width: 1000px)": 12,
    },
    overflow: "hidden",
  },

  centerBox: {
    width: {
      default: centerWidth,
      "@media (max-width: 1000px)": "100%",
    },
    height: {
      default: centerHeight,
      "@media (max-width: 1000px)": "100%",
    },
    borderRadius: {
      default: cardRadius,
      "@media (max-width: 1000px)": 10,
    },
  },

  bg: {
    top: 0,
    left: 0,
    backgroundImage: `url(/content-bg.jpg), linear-gradient(
   to bottom,
    #536D9C 0%,
    #5476A3 40%,
    #7D9AAA 60%,
    #5A6A7B 80%,
    #303848 100%

  )`,
    "@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)": {
      backgroundImage: "url(/content-bg@2x.jpg)",
    },
    backgroundSize: "cover",
    backgroundPosition: "center",
    zIndex: 1,
    overflow: "hidden",

    "::after": {
      content: '""',
      display: {
        default: "none",
        "@media (max-width: 1000px)": "block",
      },
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backdropFilter: "blur(30px)",
      WebkitBackdropFilter: "blur(30px)", // For Safari support
      // zIndex: 2,
    },
  },

  center: {
    display: "block",
    margin: "0 auto",
    position: "relative",
    color: "white",
  },

  content: {
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 16,

    position: "relative",
    zIndex: 3,
    height: firstContentRowHeight,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  features: {
    position: "relative",
    zIndex: 3,
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(3, 1fr)",
      "@media (min-width: 800px) and (max-width: 1000px)": "repeat(2, 1fr)",
      "@media (max-width: 800px)": "repeat(1, 1fr)",
    },
    gridTemplateRows: {
      default: "repeat(2, auto)",
      "@media (min-width: 800px) and (max-width: 1000px)": "repeat(3, auto)",
      "@media (max-width: 800px)": "repeat(6, auto)",
    },

    rowGap: 40,
    columnGap: 28,
    padding: "52px 60px",
  },

  card: {},

  cardHeading: {
    fontFamily: '"Red Hat Display", sans-serif',
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
    color: "rgba(255,255,255,0.95)",
    textShadow: "0 1px 1px rgba(0,0,0,0.1)",
  },
  cardText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.85)",
    textShadow: "0 1px 1px rgba(0,0,0,0.1)",
  },

  logotype: {
    marginBottom: 32,
    opacity: {
      default: 0.94,
      ":hover": 1,
    },
    filter: {
      default: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
      ":hover": "drop-shadow(0 3px 10px rgba(255,255,255,0.4))",
    },
    transition: "opacity 0.15s ease-out, filter 0.15s ease-out",
  },

  subheading: {
    marginBottom: 18,
    fontSize: { default: 48, "@media (max-width: 500px)": 28 },
    lineHeight: 1.2,
    fontWeight: "700",
    cursor: "default",
    // maxWidth: 480,
    fontFamily: '"Red Hat Display", sans-serif',
    WebkitFontSmoothing: "unset",
    MozOsxFontSmoothing: "unset",
    textShadow: "0 1px 1px rgba(0,0,0,0.1)",
  },

  softBreak: {
    display: "block",
    "@media (max-width: 500px)": {
      display: "none",
    },
  },

  description: {
    fontSize: { default: 21, "@media (max-width: 500px)": 18 },
    maxWidth: 480,
    marginBottom: 28,
    cursor: "default",
    color: "rgba(255,255,255,0.88)",
    textShadow: "0 1px 1px rgba(0,0,0,0.1)",
  },

  button: {
    overflow: "hidden",
    height: buttonHeight,
    width: 300,
    textAlign: "center",
    userSelect: "none",
    cursor: "pointer",
    backgroundColor: {
      default: "rgba(255,255,255,0.24)",
      ":hover": "rgba(255,255,255,0.32)",
      ":active": "rgba(255,255,255,0.35)",
    },
    boxShadow: {
      default: "inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 -1px 2px 2px rgba(255, 255, 255, 0.05)",
      ":hover":
        "inset 0 1px 0 0 rgba(255, 255, 255, 0.5), 0 -1px 2px 2px rgba(255, 255, 255, 0.1), 0 -3px 6px 5px rgba(255, 255, 255, 0.06)",
    },
    textShadow: "0 1px 1px rgba(0,0,0,0.1)",
    transform: {
      default: "scale(1)",
      ":active": "scale(0.95)",
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backdropFilter: "blur(25px)",
    color: "white",
    borderRadius: 40,
    textDecoration: "none",
    fontSize: { default: 18, "@media (max-width: 500px)": 15 },
    fontWeight: "700",
    transition: "background-color 0.15s ease-out, transform 0.18s ease-out, box-shadow 0.15s ease-out",
  },

  emailForm: {
    height: buttonHeight,
    paddingLeft: 4,
    paddingRight: 4,
    userSelect: "none",
    cursor: "pointer",
    backgroundColor: {
      default: "rgba(255,255,255,0.24)",
      ":hover": "rgba(255,255,255,0.32)",
      ":active": "rgba(255,255,255,0.35)",
    },
    boxShadow: {
      default: "inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 0 -1px 2px 2px rgba(255, 255, 255, 0.05)",
      ":hover":
        "inset 0 1px 0 0 rgba(255, 255, 255, 0.5), 0 -1px 2px 2px rgba(255, 255, 255, 0.1), 0 -3px 6px 5px rgba(255, 255, 255, 0.06)",
    },
    textShadow: "0 1px 1px rgba(0,0,0,0.1)",
    transform: {
      default: "scale(1)",
      ":active": "scale(0.95)",
    },
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backdropFilter: "blur(25px)",
    color: "white",
    borderRadius: 40,
    textDecoration: "none",
    fontSize: { default: 18, "@media (max-width: 500px)": 15 },
    fontWeight: "700",
    transition: "background-color 0.15s ease-out, transform 0.18s ease-out, box-shadow 0.15s ease-out",
  },

  emailFormActive: {
    backgroundColor: "rgba(255,255,255,0.35)",
    boxShadow:
      "inset 0 1px 0 0 rgba(255, 255, 255, 0.5), 0 -1px 2px 2px rgba(255, 255, 255, 0.1), 0 -3px 6px 5px rgba(255, 255, 255, 0.06)",
  },

  emailInput: {
    height: buttonHeight - 8,
    background: "none",
    width: "100%",
    minWidth: 0,
    flexShrink: 1,
    color: "white",
    fontWeight: 700,
    textAlign: "center",
    fontSize: 18,
    "::placeholder": {
      color: "rgba(255,255,255,0.9)",
      fontWeight: 400,
    },
    border: "none",
    outline: "none",
  },

  emailButton: {
    flexShrink: 0,
    height: buttonHeight - 8,
    width: buttonHeight - 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    background: {
      default: "rgba(255,255,255,0.2)",
      ":hover": "rgba(255,255,255,0.3)",
    },
    transition: "background-color 0.15s ease-out",
    borderRadius: 25,
  },

  footer: {
    textAlign: "center",
    width: {
      default: centerWidth,
      "@media (max-width: 1000px)": "100%",
    },
    color: {
      default: "rgba(44, 54, 66, 0.8)",
      "@media (prefers-color-scheme: dark)": "rgba(255,255,255,0.8)",
    },
    padding: "60px 50px",
    fontFamily: '"Reddit Mono", monospace',
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  footerSecondRow: {
    display: "flex",
    flexDirection: {
      default: "row",
      "@media (max-width: 500px)": "column",
    },
    textAlign: {
      default: "unset",
      "@media (max-width: 500px)": "center",
    },
    marginTop: 8,
  },

  copyRight: {
    marginRight: "auto",
    opacity: 0.5,
  },

  footerLink: {
    position: "relative",
    display: "block",
    padding: "4px 8px",
    opacity: {
      default: 0.8,
      ":hover": 1,
    },
    marginLeft: {
      default: 12,
      "@media (max-width: 500px)": 0,
    },
    transition: "color 0.12s ease-out",
  },

  dated: {
    cursor: "wait",
    opacity: 1,
    animationDuration: "0.12s",
    animationIterationCount: 4,
    animationTimingFunction: "ease-in",
    animationName: {
      default: "none",
      ":hover": flash,
    },
    animationPlayState: {
      default: "paused",
      ":hover": "running",
    },
  },

  columns: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: {
      default: "1fr 1fr",
      "@media (max-width: 600px)": "1fr",
    },
    gap: 40,
    marginBottom: 32,
  },

  footerColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: {
      default: "flex-start",
      "@media (max-width: 600px)": "center",
    },
    textAlign: {
      default: "left",
      "@media (max-width: 600px)": "center",
    },
  },

  footerLogo: {
    marginBottom: 16,
  },

  footerText: {
    marginTop: 12,
    opacity: 0.9,
  },

  footerColumnTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    opacity: 0.9,
  },

  footerLinks: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
})
