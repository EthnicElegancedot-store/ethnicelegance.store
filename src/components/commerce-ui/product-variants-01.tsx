"use client";

import { useState } from "react";
import { Clock } from "lucide-react";

import ImageCarousel_Basic, {
  type CarouselImages,
} from "./image-carousel-basic";
import PriceFormat_Sale from "@/components/commerce-ui/price-format-sale";
import QuantityInputBasic from "@/components/commerce-ui/quantity-input-basic";
import VariantSelectorBasic, {
  VariantItem as BaseVariantItem,
} from "@/components/commerce-ui/variant-selector-basic";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface VariantItem extends BaseVariantItem {
  price: number; // product.mrp
  salePrice?: number; // product.price
  images: string[]; // variant.images
  isInStock: boolean; // derived from size[].stock
  availableQuantity: number; // sum(size.stock)
}

interface VariantSelectionPayload {
  variantId: string; // color
  variantLabel: string; // color label
  quantity: number;
  price: number; // mrp
  originalPrice?: number;
  salePrice?: number;
  totalPrice: number;
  isOnSale: boolean;
}

interface ProductVariant01Props {
  title?: string;
  description?: string;
  badge?: string | null;
  shippingInfo?: string;
  variants: VariantItem[];
  defaultImage?: string;

  selectedVariant?: string;
  onVariantChange?: (variant: string) => void;

  quantity?: number;
  onQuantityChange?: (quantity: number) => void;

  onAddToCart?: (payload: VariantSelectionPayload) => void;
  onBuyNow?: (payload: VariantSelectionPayload) => void;

  isLoading?: boolean;
  errorMessage?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

function ProductVariant_01({
  title = "Product",
  description = "",
  badge,
  shippingInfo,
  variants,
  defaultImage,

  selectedVariant: controlledVariant,
  onVariantChange,

  quantity: controlledQuantity,
  onQuantityChange,

  onAddToCart = () => {},
  onBuyNow = () => {},

  isLoading = false,
  errorMessage = null,
}: ProductVariant01Props) {
  if (!variants.length) {
    throw new Error("ProductVariant_01 requires at least one variant");
  }

  /* --------------------------- Controlled / Uncontrolled --------------------------- */

  const [internalVariant, setInternalVariant] = useState(variants[0].value);
  const [internalQuantity, setInternalQuantity] = useState(1);

  const selectedVariantId =
    controlledVariant !== undefined ? controlledVariant : internalVariant;

  const quantity =
    controlledQuantity !== undefined ? controlledQuantity : internalQuantity;

  /* ---------------------------------- Variant ---------------------------------- */

  const selectedVariant =
    variants.find((v) => v.value === selectedVariantId) ?? variants[0];

  const isOnSale =
    selectedVariant.salePrice !== undefined &&
    selectedVariant.salePrice < selectedVariant.price;

  const effectivePrice = isOnSale
    ? selectedVariant.salePrice!
    : selectedVariant.price;

  const isInStock = selectedVariant.availableQuantity > 0;

  const images =
    selectedVariant.images.length > 0
      ? selectedVariant.images
      : defaultImage
        ? [defaultImage]
        : [];

  const carouselImages: CarouselImages = images.map((url) => ({
    url,
    title: selectedVariant.label,
  }));

  /* ---------------------------------- Handlers ---------------------------------- */

  const handleVariantChange = (value: string) => {
    controlledVariant !== undefined
      ? onVariantChange?.(value)
      : setInternalVariant(value);

    // reset quantity on variant change
    controlledQuantity === undefined && setInternalQuantity(1);
  };

  const handleQuantityChange = (value: number) => {
    controlledQuantity !== undefined
      ? onQuantityChange?.(value)
      : setInternalQuantity(value);
  };

  const payload: VariantSelectionPayload = {
    variantId: selectedVariant.value,
    variantLabel: selectedVariant.label,
    quantity,
    price: selectedVariant.price,
    originalPrice: isOnSale ? selectedVariant.price : undefined,
    salePrice: isOnSale ? selectedVariant.salePrice : undefined,
    totalPrice: quantity * effectivePrice,
    isOnSale,
  };

  /* ---------------------------------- Error ---------------------------------- */

  if (errorMessage) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-destructive">
        <p className="font-semibold">Error loading product</p>
        <p className="text-sm">{errorMessage}</p>
      </div>
    );
  }

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <div className="grid max-w-screen-lg grid-cols-1 gap-12 md:grid-cols-2">
      {/* Images */}
      <div className="relative overflow-hidden rounded-2xl border bg-card p-5">
        {badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
            {badge}
          </span>
        )}

        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted/60 border-t-primary" />
          </div>
        ) : (
          <ImageCarousel_Basic images={carouselImages} />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="mt-3 text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <PriceFormat_Sale
            originalPrice={selectedVariant.price}
            salePrice={isOnSale ? selectedVariant.salePrice : undefined}
            showSavePercentage
          />

          {shippingInfo && (
            <span className="inline-flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              {shippingInfo}
            </span>
          )}
        </div>

        <div
          className={`rounded-md p-3 text-sm font-semibold ${
            isInStock
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isInStock
            ? `${selectedVariant.availableQuantity} units available`
            : "Out of stock"}
        </div>

        <VariantSelectorBasic
          value={selectedVariantId}
          onValueChange={handleVariantChange}
          variants={variants.map((v) => ({
            ...v,
            disabled: v.availableQuantity === 0,
            label:
              v.label + (v.availableQuantity === 0 ? " (Out of Stock)" : ""),
          }))}
        />

        <QuantityInputBasic
          quantity={quantity}
          onChange={handleQuantityChange}
          min={1}
          max={selectedVariant.availableQuantity}
          disabled={!isInStock}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            disabled={!isInStock}
            onClick={() => onAddToCart(payload)}
          >
            Add to Cart
          </Button>

          <Button disabled={!isInStock} onClick={() => onBuyNow(payload)}>
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductVariant_01;
export type { ProductVariant01Props, VariantItem, VariantSelectionPayload };
