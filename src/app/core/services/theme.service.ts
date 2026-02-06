import { Injectable, signal, effect, inject } from '@angular/core';
import { PlatformService } from './platform.service';

export type ThemeMode = 'light' | 'dark';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private readonly THEME_KEY = 'app-theme-mode';
    private readonly COLOR_KEY = 'app-accent-color';
    private readonly DEFAULT_COLOR = '#daa520';
    private readonly platformService = inject(PlatformService);

    themeMode = signal<ThemeMode>(this.getStoredTheme());
    accentColor = signal<string>(this.getStoredColor() || this.DEFAULT_COLOR);

    constructor() {
        if (this.platformService.isServer()) return;
        // Effect to apply theme class to body
        effect(() => {
            const mode = this.themeMode();
            document.body.classList.remove('light-theme', 'dark-theme');
            document.body.classList.add(`${mode}-theme`);
            localStorage.setItem(this.THEME_KEY, mode);
        });

        // Effect to apply accent color to root
        effect(() => {
            const color = this.accentColor();
            document.documentElement.style.setProperty('--accent-gold', color);
            // Also update related colors if needed, or calculate them in CSS
            localStorage.setItem(this.COLOR_KEY, color);

            // Calculate a darker version for hover states if possible, 
            // or just use CSS filter: brightness(0.9) in styles.scss
        });
    }

    toggleTheme() {
        this.themeMode.update((mode) => (mode === 'light' ? 'dark' : 'light'));
    }

    setAccentColor(color: string) {
        this.accentColor.set(color);
    }

    private getStoredTheme(): ThemeMode {
        if (this.platformService.isServer()) return 'dark';
        const stored = localStorage.getItem(this.THEME_KEY);
        return (stored as ThemeMode) || 'dark'; // Default to dark as per current styles
    }

    private getStoredColor(): string | null {
        if (this.platformService.isServer()) return this.DEFAULT_COLOR;
        return localStorage.getItem(this.COLOR_KEY);
    }
}
