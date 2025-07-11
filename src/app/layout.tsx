import '@once-ui-system/core/css/styles.css';
import '@once-ui-system/core/css/tokens.css';
import '@/resources/custom.css'

import classNames from "classnames";

import { Background, Column, Flex, Meta, opacity, SpacingToken } from "@once-ui-system/core";
import { Footer, Header, RouteGuard, Providers, Analytics, OrganizationSchema } from '@/components';
import { baseURL, effects, fonts, style, dataStyle, home } from '@/resources';

export async function generateMetadata() {
  const metadata = Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
  
  return {
    ...metadata,
    alternates: {
      canonical: `${baseURL}${home.path}`,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex
      suppressHydrationWarning
      as="html"
      lang="en"
      fillWidth
      className={classNames(
        fonts.heading.variable,
        fonts.body.variable,
        fonts.label.variable,
        fonts.code.variable,
      )}
    >
      <head>
        {/* Mobile theme color meta tags - will be updated dynamically */}
        <meta name="theme-color" content="#000000" />
        
        {/* Apple specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tran Minh Khoi" />
        
        {/* Microsoft specific meta tags */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" />
        
        {/* Android specific meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const root = document.documentElement;
                  const defaultTheme = 'system';
                  
                  // Set defaults from config
                  const config = ${JSON.stringify({
                    brand: style.brand,
                    accent: style.accent,
                    neutral: style.neutral,
                    solid: style.solid,
                    'solid-style': style.solidStyle,
                    border: style.border,
                    surface: style.surface,
                    transition: style.transition,
                    scaling: style.scaling,
                    'viz-style': dataStyle.variant,
                  })};
                  
                  // Apply default values
                  Object.entries(config).forEach(([key, value]) => {
                    root.setAttribute('data-' + key, value);
                  });
                  
                  // Resolve theme
                  const resolveTheme = (themeValue) => {
                    if (!themeValue || themeValue === 'system') {
                      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    }
                    return themeValue;
                  };
                  
                  // Apply saved theme
                  const savedTheme = localStorage.getItem('data-theme');
                  const resolvedTheme = resolveTheme(savedTheme);
                  root.setAttribute('data-theme', resolvedTheme);
                  
                  // Apply any saved style overrides
                  const styleKeys = Object.keys(config);
                  styleKeys.forEach(key => {
                    const value = localStorage.getItem('data-' + key);
                    if (value) {
                      root.setAttribute('data-' + key, value);
                    }
                  });
                  
                  // Function to convert CSS color to hex
                  const cssColorToHex = (cssColor) => {
                    // Create a temporary element to get computed color
                    const tempDiv = document.createElement('div');
                    tempDiv.style.color = cssColor;
                    document.body.appendChild(tempDiv);
                    
                    const computedColor = window.getComputedStyle(tempDiv).color;
                    document.body.removeChild(tempDiv);
                    
                    // Convert rgb/rgba to hex
                    const rgbMatch = computedColor.match(/rgb\\((\d+),\\s*(\d+),\\s*(\d+)\\)/);
                    if (rgbMatch) {
                      const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
                      const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
                      const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
                      return '#' + r + g + b;
                    }
                    
                    // If already hex, return as is
                    return cssColor;
                  };
                  
                  // Update theme color based on current theme
                  const updateThemeColor = () => {
                    // Wait for DOM to be ready and styles to be applied
                    setTimeout(() => {
                      try {
                        const computedStyle = window.getComputedStyle(root);
                        
                        // Get background color - this will be our theme color
                        let themeColor = computedStyle.getPropertyValue('--page-background').trim();
                        
                        // If no page background, try brand color
                        if (!themeColor) {
                          themeColor = computedStyle.getPropertyValue('--brand-background-strong').trim();
                        }
                        
                        // If still no color, fallback to computed background
                        if (!themeColor) {
                          const bodyStyle = window.getComputedStyle(document.body);
                          themeColor = bodyStyle.backgroundColor;
                        }
                        
                        // Convert CSS variable or color to hex
                        if (themeColor.startsWith('var(')) {
                          // Extract variable name and get its value
                          const varName = themeColor.slice(4, -1);
                          themeColor = computedStyle.getPropertyValue(varName).trim();
                        }
                        
                        // If it's still a CSS color name or rgb, convert to hex
                        if (themeColor && !themeColor.startsWith('#')) {
                          themeColor = cssColorToHex(themeColor);
                        }
                        
                                                 // Fallback colors based on theme
                         if (!themeColor || themeColor === '#0A0A0A') {
                           const isDark = root.getAttribute('data-theme') === 'dark';
                           themeColor = isDark ? '#0B1D30' : '#C4F5FE';
                         }
                        
                        // Update theme color meta tag
                        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
                        const tileColorMeta = document.querySelector('meta[name="msapplication-TileColor"]');
                        const navButtonMeta = document.querySelector('meta[name="msapplication-navbutton-color"]');
                        
                        if (themeColorMeta) {
                          themeColorMeta.setAttribute('content', themeColor);
                        }
                        if (tileColorMeta) {
                          tileColorMeta.setAttribute('content', themeColor);
                        }
                        if (navButtonMeta) {
                          navButtonMeta.setAttribute('content', themeColor);
                        }
                        
                        console.log('Theme color updated to:', themeColor);
                      } catch (e) {
                        console.warn('Could not update theme color:', e);
                      }
                    }, 100);
                  };
                  
                  // Initial theme color update
                  updateThemeColor();
                  
                  // Listen for theme changes
                  const observer = new MutationObserver(() => {
                    updateThemeColor();
                  });
                  observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
                  
                  // Also update when CSS is loaded
                  if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', updateThemeColor);
                  }
                  window.addEventListener('load', updateThemeColor);
                  
                } catch (e) {
                  console.error('Failed to initialize theme:', e);
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        <Analytics />
        <OrganizationSchema />
      </head>
      <Providers>
        <Column as="body" background="page" fillWidth style={{minHeight: "100vh"}} margin="0" padding="0" horizontal="center">
          <Background
            position="fixed"
            mask={{
              x: effects.mask.x,
              y: effects.mask.y,
              radius: effects.mask.radius,
              cursor: effects.mask.cursor,
            }}
            gradient={{
              display: effects.gradient.display,
              opacity: effects.gradient.opacity as opacity,
              x: effects.gradient.x,
              y: effects.gradient.y,
              width: effects.gradient.width,
              height: effects.gradient.height,
              tilt: effects.gradient.tilt,
              colorStart: effects.gradient.colorStart,
              colorEnd: effects.gradient.colorEnd,
            }}
            dots={{
              display: effects.dots.display,
              opacity: effects.dots.opacity as opacity,
              size: effects.dots.size as SpacingToken,
              color: effects.dots.color,
            }}
            grid={{
              display: effects.grid.display,
              opacity: effects.grid.opacity as opacity,
              color: effects.grid.color,
              width: effects.grid.width,
              height: effects.grid.height,
            }}
            lines={{
              display: effects.lines.display,
              opacity: effects.lines.opacity as opacity,
              size: effects.lines.size as SpacingToken,
              thickness: effects.lines.thickness,
              angle: effects.lines.angle,
              color: effects.lines.color,
            }}
          />
          <Flex fillWidth minHeight="16" hide="s"/>
            <Header />
            <Flex
              zIndex={0}
              fillWidth
              padding="l"
              horizontal="center"
              flex={1}
            >
              <Flex horizontal="center" fillWidth minHeight="0">
                <RouteGuard>
                  {children}
                </RouteGuard>
              </Flex>
            </Flex>
            <Footer/>
          </Column>
        </Providers>
      </Flex>
  );
}
