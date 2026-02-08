"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const sections = [
  {
    title: "Introduction",
    body: `By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use.`,
  },
  {
    title: "Accounts",
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. Notify us immediately of unauthorized use.`,
  },
  {
    title: "Orders & Payments",
    body: `All orders are subject to availability and acceptance. Prices and promotions may change. You agree to provide accurate billing, shipping, and payment information.`,
  },
  {
    title: "Shipping & Delivery",
    body: `Estimated delivery dates are not guaranteed. Risk of loss transfers to you upon delivery to the carrier. Inspect packages upon receipt and report issues promptly.`,
  },
  {
    title: "Returns & Refunds",
    body: `Eligible items may be returned within the stated return window in original condition. Refunds are processed to the original payment method after inspection.`,
  },
  {
    title: "Use of Content",
    body: `All content (text, images, assets) is owned by or licensed to us. You may not copy, distribute, or modify content without permission.`,
  },
  {
    title: "Prohibited Activities",
    body: `Do not engage in fraud, abuse, reverse engineering, interference with the site, or any unlawful activity. We may suspend accounts for violations.`,
  },
  {
    title: "Privacy",
    body: `Your use of the site is also governed by our Privacy Policy. Review it to understand how we collect and use your data.`,
  },
  {
    title: "Limitation of Liability",
    body: `To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the services.`,
  },
  {
    title: "Changes to Terms",
    body: `We may update these Terms from time to time. Continued use after changes constitutes acceptance of the revised Terms.`,
  },
  {
    title: "Contact",
    body: `For questions about these Terms, contact our support team via the Help Center or email.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm text-muted-foreground">
            Please read these terms carefully before using our website or
            services.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-2">
            <CardTitle className="text-xl">Summary</CardTitle>
            <p className="text-sm text-muted-foreground">
              This summary highlights key points. Please review the full
              sections below.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>• Accounts</span>
              <span>• Orders</span>
              <span>• Shipping</span>
              <span>• Returns</span>
              <span>• Privacy</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.map((section, idx) => (
              <div key={section.title} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  <span className="text-xs text-muted-foreground">
                    {idx + 1}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
                {idx < sections.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
          <p>Questions about these terms? We can help.</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" render={<Link href="/contact">Contact Support</Link>}>
            </Button>
            <Button size="sm" render={<Link href="/">Return Home</Link>}>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
