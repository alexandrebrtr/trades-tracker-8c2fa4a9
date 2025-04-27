import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: {
          DEFAULT: 'hsl(var(--border))',
          dark: 'hsl(var(--border-dark))'
        },
        input: {
          DEFAULT: 'hsl(var(--input))',
          dark: 'hsl(var(--input-dark))'
        },
        ring: {
          DEFAULT: 'hsl(var(--ring))',
          dark: 'hsl(var(--ring-dark))'
        },
        background: {
          DEFAULT: '240 10% 3.9%',
          dark: '240 10% 3.9%'
        },
        foreground: {
          DEFAULT: '0 0% 98%',
          dark: '0 0% 98%'
        },
        primary: {
          DEFAULT: '210 100% 50%',
          foreground: '0 0% 98%'
        },
        secondary: {
          DEFAULT: '240 3.7% 15.9%',
          foreground: '0 0% 98%'
        },
        muted: {
          DEFAULT: '240 3.7% 15.9%',
          foreground: '240 5% 64.9%'
        },
        card: {
          DEFAULT: '240 10% 3.9%',
          foreground: '0 0% 98%'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        profit: {
          DEFAULT: '#34d399',
          light: '#a7f3d0',
          dark: '#065f46'
        },
        loss: {
          DEFAULT: '#ef4444',
          light: '#fecaca',
          dark: '#991b1b'
        },
        neutral: {
          DEFAULT: '#6b7280',
          light: '#e5e7eb',
          dark: '#1f2937'
        },
        chart: {
          blue: '#60a5fa',
          green: '#34d399',
          red: '#ef4444',
          purple: '#a78bfa',
          orange: '#f97316',
          yellow: '#fbbf24',
          teal: '#2dd4bf',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
            opacity: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
            opacity: '1'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
            opacity: '1'
          },
          to: {
            height: '0',
            opacity: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'fade-out': {
          '0%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(10px)'
          }
        },
        'scale-in': {
          '0%': {
            transform: 'scale(0.97)',
            opacity: '0'
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1'
          }
        },
        'slide-in': {
          '0%': {
            transform: 'translateX(-10px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1'
          }
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(10px)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(-5px)'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'scale-in': 'scale-in 0.4s ease-out',
        'slide-in': 'slide-in 0.4s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
          },
        },
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
