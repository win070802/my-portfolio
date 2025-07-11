'use client';

import { usePathname } from 'next/navigation';
import { Flex, Text, Icon } from "@once-ui-system/core";
import Link from 'next/link';
import { baseURL } from "@/resources";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];
    
    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Capitalize and clean up segment
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Custom labels for known routes
      if (segment === 'work') label = 'Projects';
      if (segment === 'contact') label = 'Contact';
      if (segment === 'e-card') label = 'Digital Card';
      if (segment === 'blog') label = 'Blog';
      
      // For project/blog slugs, limit length
      if (index > 0 && label.length > 25) {
        label = label.substring(0, 25) + '...';
      }
      
      breadcrumbs.push({
        label,
        href: currentPath
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  // Don't show breadcrumbs on home page or if only one item
  if (breadcrumbs.length <= 1) return null;

  // Generate JSON-LD for breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `${baseURL}${item.href}`
    }))
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Visual Breadcrumbs */}
      <Flex gap="xs" vertical="center" marginBottom="m">
        {breadcrumbs.map((crumb, index) => (
          <Flex key={crumb.href} gap="xs" vertical="center">
            {index === breadcrumbs.length - 1 ? (
              <Text variant="body-default-s" onBackground="neutral-weak">
                {crumb.label}
              </Text>
            ) : (
              <>
                <Link href={crumb.href}>
                  <Text variant="body-default-s" onBackground="neutral-strong">
                    {crumb.label}
                  </Text>
                </Link>
                <Icon name="chevronRight" size="xs" onBackground="neutral-weak" />
              </>
            )}
          </Flex>
        ))}
      </Flex>
    </>
  );
} 