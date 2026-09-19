// src/config/MailConfig.ts

export interface MailConfig {
  recipientEmail: string;
  subjects: {
    contactForm: string;
    directInquiry: string;
    default: string;
  };
  messages: {
    dialogTitle: string;
    dialogDescContact: string;
    dialogDescDirect: string;
    mailAppButton: string;
    gmailButton: string;
  };
}

export interface ContactMessageData {
  name: string;
  email: string;
  message: string;
}

export const MAIL_CONFIG: MailConfig = {
  recipientEmail: "rifana0112@gmail.com",
  subjects: {
    contactForm: "New Contact Form Message",
    directInquiry: "Project Inquiry / Collaboration",
    default: "Portfolio Inquiry",
  },
  messages: {
    dialogTitle: "Choose how to send your message",
    dialogDescContact:
      "Your message has been verified and formatted. Select your preferred email method below to open your composer with the message prefilled:",
    dialogDescDirect:
      "Select your preferred email method below to start a conversation directly with Rifana:",
    mailAppButton: "Open Mail App",
    gmailButton: "Open Gmail",
  },
};

/**
 * Formats contact form data or direct inquiries into a clean, structured email body.
 */
export function formatEmailBody(data?: ContactMessageData | null): string {
  if (!data || (!data.name && !data.email && !data.message)) {
    return [
      "Hello, Rifana",
      "",
      "I'm contacting you via your portfolio regarding a new project or collaboration.",
      "",
      "Thanks & Regards,",
    ].join("\r\n");
  }

  const lines: string[] = [
    "Hello, Rifana",
    "",
    `I'm ${data.name || "A Visitor"}, Contacting you via Portfolio.`,
    "",
  ];

  if (data.email) {
    lines.push(`My Email Address : ${data.email}`, "");
  }

  if (data.message) {
    lines.push(`My Message: ${data.message}`, "");
  }

  lines.push("Thanks & Regards,", "Portfolio Contact Form");

  return lines.join("\r\n");
}

/**
 * Builds a mailto URL for the user's default mail application.
 */
export function buildMailtoUrl(
  recipient: string = MAIL_CONFIG.recipientEmail,
  subject: string = MAIL_CONFIG.subjects.default,
  body: string = ""
): string {
  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

/**
 * Builds a Gmail compose URL.
 */
export function buildGmailComposeUrl(
  recipient: string = MAIL_CONFIG.recipientEmail,
  subject: string = MAIL_CONFIG.subjects.default,
  body: string = ""
): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    recipient
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}