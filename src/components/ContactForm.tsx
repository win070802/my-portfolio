'use client';

import {
  Avatar,
  Button,
  Column,
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
  Tag,
} from "@once-ui-system/core";
import { person, contact, social, newsletter } from "@/resources";
import { Mailchimp } from "@/components";
import { trackContactForm, trackExternalLink } from "@/utils/analytics";

export function ContactForm() {
  return (
    <>
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

          {/* Social Links with Tracking */}
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
                onClick={() => {
                  trackExternalLink(item.link, item.name);
                  if (item.name.toLowerCase().includes('email')) {
                    trackContactForm('email');
                  } else if (item.name.toLowerCase().includes('phone')) {
                    trackContactForm('phone');
                  } else if (item.name.toLowerCase().includes('linkedin')) {
                    trackContactForm('linkedin');
                  }
                }}
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

      {/* Primary Contact Actions with Tracking */}
      <Flex direction="column" gap="s" marginBottom="xl">
        <Button
          href={`mailto:${person.email}`}
          variant="primary"
          size="m"
          prefixIcon="email"
          fillWidth
          onClick={() => trackContactForm('email')}
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
          onClick={() => trackContactForm('linkedin')}
        >
          Connect on LinkedIn
        </Button>
      </Flex>

      {/* Newsletter signup */}
      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </>
  );
} 