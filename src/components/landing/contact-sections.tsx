"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, Mail, MapPin } from "lucide-react";
import { api } from "@/lib/api";

const MUMBAI_CENTRAL_MAP_EMBED =
  "https://maps.google.com/maps?q=Mumbai+Central,+Mumbai,+Maharashtra,+India&t=&z=15&ie=UTF8&iwloc=&output=embed";

const PRIMARY = "#1f3a56";

export default function ContactPageContent() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const response = await api.post("/contact", formData);
      if (response && response.status) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-background">
      {/* Minimal Header */}
      <section className="relative px-4 py-16 md:py-24 overflow-hidden border-b border-border/40 bg-muted/10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase mb-4 text-primary">
            Get in touch
          </p>
          <h1 className="font-serif text-4xl font-normal tracking-tight text-foreground sm:text-5xl md:text-6xl">
            How can we help?
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed max-w-xl mx-auto text-base sm:text-lg">
            Whether you have a question about an order, styling advice, or our latest ethnic collections, our team is ready to assist you.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr] lg:items-start">

            {/* Left: Contact Information */}
            <div className="flex flex-col space-y-12">
              <div>
                <h3 className="font-serif text-2xl font-medium text-foreground">
                  Contact Information
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Reach out to us through any of the following channels. We aim to respond to all inquiries within 24 hours.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide text-foreground">Email</h4>
                    <a
                      href="mailto:support@ethnicelegance.store"
                      className="mt-1 block text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      support@ethnicelegance.store
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide text-foreground">Boutique Location</h4>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      Mumbai Central, Mumbai<br />
                      Maharashtra, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Minimal Map embed */}
              <div className="mt-8 overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                <iframe
                  src={MUMBAI_CENTRAL_MAP_EMBED}
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mumbai Central – Ethnic Elegance"
                  className="block w-full"
                />
              </div>
            </div>

            {/* Right: Minimal Form */}
            <div className="rounded-2xl border border-border/40 bg-card p-8 sm:p-12 shadow-sm">
              <div className="mb-8">
                <h3 className="font-serif text-2xl font-medium text-foreground">
                  Send a Message
                </h3>
              </div>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <CheckCircle2 className="size-8" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-medium text-foreground">Message Received</h3>
                  <p className="mt-2 text-muted-foreground text-sm max-w-sm">
                    Thank you for reaching out. A member of our team will get back to you shortly.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-8 px-8 rounded-full border-border hover:bg-muted"
                    onClick={() => setStatus("idle")}
                  >
                    Send another
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contact-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Your Name
                      </Label>
                      <Input
                        id="contact-name"
                        name="name"
                        type="text"
                        placeholder="Jane Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="contact-email"
                        name="email"
                        type="email"
                        placeholder="jane@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="contact-subject" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Subject
                    </Label>
                    <Input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <Label htmlFor="contact-message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Message
                    </Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                    />
                  </div>

                  {status === "error" && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                      An error occurred while sending your message. Please try again.
                    </div>
                  )}

                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full h-14 rounded-full text-sm font-medium tracking-wide transition-all shadow-md hover:shadow-lg"
                      style={{ backgroundColor: PRIMARY, color: "white" }}
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="size-4 animate-spin" />
                          <span>Sending Message...</span>
                        </div>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
