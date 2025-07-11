import {
  Column,
  Meta,
  Schema,
} from "@once-ui-system/core";
import { baseURL, about, person, contact } from "@/resources";
import { ContactForm } from "@/components";

export async function generateMetadata() {
  const metadata = Meta.generate({
    title: contact.title,
    description: contact.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(contact.title)}`,
    path: contact.path,
  });
  
  return {
    ...metadata,
    alternates: {
      canonical: `${baseURL}${contact.path}`,
    },
  };
}

export default function Contact() {
  return (
    <Column maxWidth="s">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={contact.path}
        title={contact.title}
        description={contact.description}
        image={`/api/og/generate?title=${encodeURIComponent(contact.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      
      <ContactForm />
    </Column>
  );
} 