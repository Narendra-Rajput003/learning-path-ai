import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Mail, Globe } from 'lucide-react';

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roadmapTitle: string;
}

export function CalendarDialog({ open, onOpenChange, roadmapTitle }: CalendarDialogProps) {
  const generateCalendarLinks = () => {
    const title = encodeURIComponent(`Learning: ${roadmapTitle}`);
    const description = encodeURIComponent(`Learning session for ${roadmapTitle} roadmap`);
    
    // Example links - you'll need to adjust these based on your needs
    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${description}`,
      outlook: `https://outlook.office.com/calendar/0/deeplink/compose?subject=${title}&body=${description}`,
      apple: `webcal://calendar.google.com/calendar/ical/${title}/basic.ics`
    };
  };

  const calendarLinks = generateCalendarLinks();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Learning Time</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(calendarLinks.google, '_blank')}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Add to Google Calendar
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(calendarLinks.outlook, '_blank')}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Add to Outlook
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(calendarLinks.apple, '_blank')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Add to Apple Calendar
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}