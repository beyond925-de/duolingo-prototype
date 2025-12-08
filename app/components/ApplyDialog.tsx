"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { CompanyConfig } from "../types";

interface ApplyDialogProps {
  config: CompanyConfig;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ApplyDialog({
  config,
  isOpen,
  onClose,
  onConfirm,
}: ApplyDialogProps) {
  const handleWhatsAppClick = () => {
    const phoneNumber = "14155238886";
    // Create a fake session ID for demo purposes
    const sessionId = Math.random().toString(36).substring(2, 15);
    const message = `Für Später: Berufe bei ${config.company.name} spielerisch entdecken\n\n[${sessionId}] (Deine Spiel-ID)`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Job merken</DialogTitle>
          <DialogDescription>
            <strong>Lass uns mal quatschen. </strong>
            Falls du nocht nicht bereit bist empfehlen wir dir, deinen
            Spielstand für später zu speichern.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <Button
            onClick={() => {
              navigator.vibrate?.(100);
              navigator.vibrate?.([100, 100, 100, 100, 100]);
              onConfirm();
              onClose();
            }}
            variant="secondary"
            size="lg"
          >
            Jetzt Kontakt aufnehmen
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                oder
              </span>
            </div>
          </div>

          <Button
            onClick={handleWhatsAppClick}
            variant="primary"
            className="w-full gap-2"
            size="lg"
          >
            <MessageCircle className="h-5 w-5 text-green-600" />
            Spielstand speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
