<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style: background color + Chrome/Edge autofill fix --}}
        <style>
            html {
                background-color: oklch(1 0 0);
                color-scheme: light;
            }

            html.dark {
                background-color: oklch(0.145 0 0);
                color-scheme: dark;
            }

            /* NOTE: the donor app shell (.donor-shell) is a light-only design.
               Its light colors are pinned in resources/css/app.css so that a
               dark-mode OS/browser (html.dark) can no longer turn its text
               white-on-white — that was why headers and typed input text were
               invisible in Chrome/Edge but fine in Brave (light mode). */

            /* Chrome/Edge autofill paints its own box over the field — keep the
               (always light) donor shell fields readable */
            .donor-shell input:-webkit-autofill,
            .donor-shell input:-webkit-autofill:hover,
            .donor-shell input:-webkit-autofill:focus,
            .donor-shell textarea:-webkit-autofill,
            .donor-shell textarea:-webkit-autofill:hover,
            .donor-shell textarea:-webkit-autofill:focus,
            .donor-shell select:-webkit-autofill,
            .donor-shell select:-webkit-autofill:hover,
            .donor-shell select:-webkit-autofill:focus {
                -webkit-text-fill-color: #1f2937 !important;
                -webkit-box-shadow: 0 0 0 1000px #ffffff inset !important;
                caret-color: #1f2937 !important;
                transition: background-color 9999s ease-in-out 0s !important;
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>