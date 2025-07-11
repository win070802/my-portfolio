import {
  Avatar,
  Button,
  Column,
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
  Meta,
  Schema,
  Tag,
} from "@once-ui-system/core";
import { baseURL, about, person, contact, social, newsletter } from "@/resources";
import { Mailchimp } from "@/components";

export async function generateMetadata() {
  return Meta.generate({
    title: contact.title,
    description: contact.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(contact.title)}`,
    path: contact.path,
  });
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
      
      <Heading marginBottom="l" variant="display-strong-s">
        {contact.intro.title}
      </Heading>
      
      {contact.intro.display && (
        <Text variant="body-default-l" onBackground="neutral-weak" marginBottom="xl">
          {contact.intro.description}
        </Text>
      )}

      <Flex direction="column" gap="xl" marginBottom="xl">
        {/* Contact Information */}
        <Column gap="l">
          <Flex fillWidth direction="column" gap="m">
            <Avatar src={person.avatar} size="l" />
            <Column gap="s">
              <Heading variant="heading-strong-m">{person.name}</Heading>
              <Text variant="body-default-m" onBackground="neutral-weak">
                {person.role}
              </Text>
            </Column>
          </Flex>

          {/* Social Links */}
          <Flex wrap gap="s">
            {social.map((item) => (
              <IconButton
                key={item.name}
                href={item.link}
                icon={item.icon}
                variant="secondary"
                size="s"
                tooltip={item.name}
                target="_blank"
                rel="noopener noreferrer"
              />
            ))}
          </Flex>
        </Column>

        {/* Location */}
        {contact.location.display && (
          <Column gap="s">
            <Flex gap="s" vertical="center">
              <Icon name="globe" size="s" onBackground="accent-weak" />
              <Heading variant="heading-strong-s">{contact.location.title}</Heading>
            </Flex>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {contact.location.description}
            </Text>
          </Column>
        )}

        {/* Availability */}
        {contact.availability.display && (
          <Column gap="s">
            <Flex gap="s" vertical="center">
              <Icon name="calendar" size="s" onBackground="accent-weak" />
              <Heading variant="heading-strong-s">{contact.availability.title}</Heading>
            </Flex>
            <Text variant="body-default-m" onBackground="neutral-weak">
              {contact.availability.description}
            </Text>
          </Column>
        )}

        {/* Services */}
        {contact.services.display && (
          <Column gap="s">
            <Flex gap="s" vertical="center">
              <Icon name="tool" size="s" onBackground="accent-weak" />
              <Heading variant="heading-strong-s">{contact.services.title}</Heading>
            </Flex>
            <Flex wrap gap="s" marginTop="s">
              {contact.services.items.map((service: string, index: number) => (
                <Tag key={index} size="m" variant="neutral">
                  {service}
                </Tag>
              ))}
            </Flex>
          </Column>
        )}
      </Flex>

      {/* Primary Contact Actions */}
      <Flex direction="column" gap="s" marginBottom="xl">
        <Button
          href={`mailto:${person.email}`}
          variant="primary"
          size="m"
          prefixIcon="email"
          fillWidth
        >
          Send Email
        </Button>
        <Button
          href={social.find(item => item.name === "LinkedIn")?.link}
          variant="secondary"
          size="m"
          prefixIcon="linkedin"
          fillWidth
          target="_blank"
          rel="noopener noreferrer"
        >
          Connect on LinkedIn
        </Button>
      </Flex>

      {/* Newsletter signup */}
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
} 