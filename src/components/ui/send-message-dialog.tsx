"use client";

import { useCallback } from "react";
import { Mail, ExternalLink } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import {
    MAIL_CONFIG,
    formatEmailBody,
    buildMailtoUrl,
    buildGmailComposeUrl,
    type ContactMessageData,
} from "@/config/MailConfig";

export type SendMessageDialogData = ContactMessageData;

export interface SendMessageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    submittedData?: SendMessageDialogData | null;
    title?: string;
    description?: string;
    subject?: string;
    recipientEmail?: string;
}

export function SendMessageDialog({
    open,
    onOpenChange,
    submittedData,
    title,
    description,
    subject,
    recipientEmail,
}: SendMessageDialogProps) {
    const activeRecipient = recipientEmail || MAIL_CONFIG.recipientEmail;

    const activeSubject =
        subject ||
        (submittedData?.name || submittedData?.message
            ? MAIL_CONFIG.subjects.contactForm
            : MAIL_CONFIG.subjects.directInquiry);

    const activeTitle = title || MAIL_CONFIG.messages.dialogTitle;

    const activeDescription =
        description ||
        (submittedData?.name || submittedData?.message
            ? MAIL_CONFIG.messages.dialogDescContact
            : MAIL_CONFIG.messages.dialogDescDirect);

    /**
     * Open default mail application.
     */
    const handleOpenMailApp = useCallback(() => {
        const body = formatEmailBody(submittedData);
        const mailtoUrl = buildMailtoUrl(activeRecipient, activeSubject, body);

        try {
            window.location.href = mailtoUrl;
        } catch {
            // Fallback for browsers that block direct navigation.
            const anchor = document.createElement("a");
            anchor.href = mailtoUrl;
            anchor.click();
        }

        onOpenChange(false);
    }, [submittedData, activeRecipient, activeSubject, onOpenChange]);

    /**
     * Open Gmail compose in a new tab.
     */
    const handleOpenGmail = useCallback(() => {
        const body = formatEmailBody(submittedData);
        const gmailUrl = buildGmailComposeUrl(activeRecipient, activeSubject, body);

        window.open(gmailUrl, "_blank", "noopener,noreferrer");
        onOpenChange(false);
    }, [submittedData, activeRecipient, activeSubject, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="contact-dialog-content sm:max-w-md rounded-[18px]! border! border-[rgba(212,175,55,0.4)]! bg-[rgba(255,253,245,0.98)]! p-7! shadow-[0_24px_60px_-15px_rgba(7,85,61,0.25)]!"
            >
                <DialogHeader className="contact-dialog-header flex items-center text-center">
                    <div
                        className="contact-dialog-badge inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(7,85,61,0.1)] mb-1"
                        aria-hidden="true"
                    >
                        <Mail className="size-5 text-(--color-primary)" />
                    </div>

                    <DialogTitle
                        className="contact-dialog-title text-[1.45rem]! font-bold! leading-tight! text-[#07553D]!"
                        style={{
                            fontFamily:
                                'var(--font-tempting), var(--font-unna), "Unna", serif',
                        }}
                    >
                        {activeTitle}
                    </DialogTitle>

                    <DialogDescription
                        className="contact-dialog-desc text-[1rem]! leading-[1.45]! text-[rgba(0,0,0,0.7)]!"
                        style={{
                            fontFamily:
                                'var(--font-unna), "Unna", serif',
                        }}
                    >
                        {activeDescription}
                    </DialogDescription>
                </DialogHeader>

                <div className="contact-dialog-actions mt-2! flex! flex-row! items-center! justify-center! gap-3! max-[640px]:w-full! max-[640px]:flex-col!">
                    <Button
                        type="button"
                        className="contact-dialog-btn contact-dialog-btn-mail inline-flex! h-11! items-center! justify-center! rounded-[10px]! bg-(--color-primary,#07553D)! px-4! font-[var(--font-inter),sans-serif]! text-[0.95rem]! font-semibold! text-white! transition-all! duration-200! ease-in-out! hover:bg-[#0a4f3a]! hover:transform! hover:-translate-y-px! max-[640px]:w-full!"
                        onClick={handleOpenMailApp}
                    >
                        <Mail className="mr-2 size-4" aria-hidden="true" />
                        <span>{MAIL_CONFIG.messages.mailAppButton}</span>
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="contact-dialog-btn contact-dialog-btn-gmail inline-flex! h-11! items-center! justify-center! rounded-[10px]! border! border-[rgba(7,85,61,0.3)]! bg-[rgba(255,255,255,0.9)]! px-4! font-[var(--font-inter),sans-serif]! text-[0.95rem]! font-semibold! text-(--color-primary,#07553D)! transition-all! duration-200! ease-in-out! hover:bg-[rgba(7,85,61,0.08)]! hover:border-(--color-primary,#07553D)! hover:transform! hover:-translate-y-px! max-[640px]:w-full!"
                        onClick={handleOpenGmail}
                    >
                        <ExternalLink className="mr-2 size-4" aria-hidden="true" />
                        <span>{MAIL_CONFIG.messages.gmailButton}</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default SendMessageDialog;
