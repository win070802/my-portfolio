"use client";

import {
  Avatar,
  Button,
  Column,
  Flex,
  Heading,
  Text,
  Schema,
  Meta,
} from "@once-ui-system/core";
import { baseURL, about, person, eCard } from "@/resources";
import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";

// Since this is a client component, we can't export generateMetadata directly
// We'll handle SEO through the Schema component and meta tags in the head

export default function ECard() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showPaymentQR, setShowPaymentQR] = useState(false);
  const [paymentQRLoading, setPaymentQRLoading] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const paymentQRUrl = "https://img.vietqr.io/image/MB-4456456456789-qr_only.png?accountName=TRAN+MINH+KHOI&addInfo=Scanned+from+your+portfolio";

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${eCard.contact.name}
ORG:${eCard.contact.name}
TITLE:${person.role}
EMAIL:${eCard.contact.email}
TEL:${eCard.contact.phone}
ADR:;;${eCard.contact.location};;;;
URL:${baseURL}
END:VCARD`;

      const qrDataUrl = await QRCode.toDataURL(vCardData, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleCardTap = () => {
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current === 2) {
      // Double tap detected
      handleShowPaymentQR();
      tapCountRef.current = 0;
    } else {
      // Single tap - reset after 300ms
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0;
      }, 300);
    }
  };

  const handleShowPaymentQR = async () => {
    if (showPaymentQR) {
      setShowPaymentQR(false);
      return;
    }

    setPaymentQRLoading(true);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setShowPaymentQR(true);
      setPaymentQRLoading(false);
    }, 800);
  };

  const downloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${eCard.contact.name}
ORG:${eCard.contact.name}
TITLE:${person.role}
EMAIL:${eCard.contact.email}
TEL:${eCard.contact.phone}
ADR:;;${eCard.contact.location};;;;
URL:${baseURL}
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${eCard.contact.name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Column maxWidth="s" fillWidth style={{ height: "100vh", marginBottom: "30px" }}>
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={eCard.path}
        title={eCard.title}
        description={eCard.description}
        image={`/api/og/generate?title=${encodeURIComponent(eCard.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      <Heading marginBottom="l" variant="display-strong-s">
        {eCard.intro.title}
      </Heading>

      {/* E-Card Content */}
      <Flex direction="column" gap="xl" marginBottom="xl">
        {/* Profile Section */}
        <Column 
          gap="s" 
          padding="xl" 
          background="neutral-alpha-weak" 
          radius="l"
          onClick={handleCardTap}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          {/* Avatar and Name */}
          <Flex fillWidth direction="column" gap="l" horizontal="center">
            <Avatar src={person.avatar} size="xl" />
            <Column gap="s" horizontal="center">
              <Heading variant="heading-strong-l">{eCard.contact.name}</Heading>
              <Text variant="body-default-m" onBackground="neutral-weak">
                {person.role}
              </Text>
            </Column>
          </Flex>

          {/* Note */}
          <Flex horizontal="center" marginBottom="s">
            <Text variant="body-default-s" onBackground="neutral-weak" style={{ textAlign: "center" }}>
              {showPaymentQR 
                ? "Double tap to get VCard" 
                : "Double tap to get Payment QR"
              }
            </Text>
          </Flex>

          {/* QR Code Section */}
          <Column gap="m" horizontal="center">
            {paymentQRLoading ? (
              <Flex
                padding="l"
                background="page"
                radius="m"
                shadow="m"
                horizontal="center"
                style={{ width: "200px", height: "200px" }}
              >
                <Flex fillWidth horizontal="center" vertical="center">
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Loading...
                  </Text>
                </Flex>
              </Flex>
            ) : showPaymentQR ? (
              <Flex
                padding="l"
                background="page"
                radius="m"
                shadow="m"  
                horizontal="center"
              >
                <img
                  src={paymentQRUrl}
                  alt="Payment QR Code"
                  style={{ width: "200px", height: "200px" }}
                />
              </Flex>
            ) : qrCodeUrl ? (
              <Flex
                padding="l"
                background="page"
                radius="m"
                shadow="m"
                horizontal="center"
              >
                <img
                  src={qrCodeUrl}
                  alt="QR Code for contact information"
                  style={{ width: "200px", height: "200px" }}
                />
              </Flex>
            ) : null}

            <Flex horizontal="center" fillWidth>
              <Text variant="body-default-s" onBackground="neutral-weak" style={{ textAlign: "center" }}>
                {showPaymentQR 
                  ? "Scan the QR code to pay" 
                  : "Scan the QR code to get my contact information"
                }
              </Text>
            </Flex>
          </Column>

          {/* Action Buttons */}
          <Flex direction="column" gap="s">
            <Button
              onClick={downloadVCard}
              variant="tertiary"
              size="m"
              prefixIcon="download"
              fillWidth
            >
              Download vCard
            </Button>
          </Flex>
        </Column>
      </Flex>
    </Column>
  );
}
