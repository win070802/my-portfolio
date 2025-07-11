import { person, social, baseURL } from "@/resources";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${baseURL}/#person`,
        "name": person.name,
        "url": baseURL,
        "email": person.email,
        "jobTitle": person.role,
        "description": `${person.role} based in ${person.location}`,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": person.location,
          "addressCountry": "VN"
        },
        "sameAs": social.map(item => item.link),
        "image": {
          "@type": "ImageObject",
          "url": `${baseURL}${person.avatar}`,
          "width": 400,
          "height": 400
        }
      },
      {
        "@type": "WebSite", 
        "@id": `${baseURL}/#website`,
        "url": baseURL,
        "name": `${person.name} Portfolio`,
        "description": `Portfolio website showcasing work by ${person.name}`,
        "publisher": {
          "@id": `${baseURL}/#person`
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 