"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

export interface VariantItem {
  id: string;
  value: string;
  label: string;
  disabled?: boolean;
}

interface VariantSelectorBasicProps {
  value: string;
  onValueChange: (value: string) => void;
  variants: VariantItem[];
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  // selectedClassName is being removed as redundant
}

const VariantSelectorBasic = ({
  className,
  itemClassName,
  labelClassName,
  onValueChange,
  value,
  variants,
}: VariantSelectorBasicProps) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex flex-wrap gap-3", className)}
      value={value}
      onValueChange={onValueChange}
    >
      {variants.map((variant) => (
        <div key={variant.id} className="flex items-center">
          <RadioGroupPrimitive.Item
            id={variant.id}
            value={variant.value}
            disabled={variant.disabled}
            className={cn(
              "peer relative h-10 w-full min-w-[80px] rounded-md border border-border px-3 py-2 text-center text-sm transition-all",
              "data-[state=checked]:border-primary data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2",
              "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
              itemClassName,
            )}
          >
            <span className={cn("font-medium", labelClassName)}>
              {variant.label}
            </span>
          </RadioGroupPrimitive.Item>
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  );
};

export default VariantSelectorBasic;
