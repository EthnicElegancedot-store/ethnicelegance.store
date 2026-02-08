"use client";

import Image from "next/image";
import { use, useEffect, useMemo, useState } from "react";

import Review_04 from "@/components/commerce-ui/review-04";
import { Header } from "@/components/landing/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Product as ApiProduct, ProductVariant } from "@/types/product";
import { Star } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

type ProductWithReviews = ApiProduct & {
  review?: Array<Record<string, any>>;
};

const isValidObjectId = (value?: string) =>
  typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params);

  const [product, setProduct] = useState<ProductWithReviews | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /*                                 FETCH                                    */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      if (!isValidObjectId(id)) {
        setError("Invalid product id");
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get<{
          status: boolean;
          message?: string;
          data?: ProductWithReviews;
        }>(`/product/${encodeURIComponent(id)}`);

        if (!res.status || !res.data) {
          throw new Error(res.message || "Failed to fetch product");
        }

        if (!mounted) return;

        setProduct(res.data);

        const firstColor = res.data.variants?.[0]?.color;
        setSelectedVariant(firstColor);
        setSelectedSize(res.data.variants?.[0]?.size?.[0]?.size || null);
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to load product");
        }
      } finally {
        mounted && setIsLoading(false);
      }
    };

    fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  /* ------------------------------------------------------------------------ */
  /*                            VARIANT MAPPING                               */
  /* ------------------------------------------------------------------------ */

  const galleryImages = useMemo(() => {
    if (!product) return [] as string[];
    const set = new Set<string>();
    product.variants?.forEach((variant) => {
      variant.images?.forEach((img) => img && set.add(img));
    });
    return Array.from(set);
  }, [product]);

  const sizeOptions = useMemo(() => {
    if (!product) return [] as string[];
    const set = new Set<string>();
    product.variants?.forEach((variant) => {
      variant.size?.forEach((s) => s.size && set.add(s.size));
    });
    return Array.from(set);
  }, [product]);

  const colorOptions = useMemo(() => {
    if (!product) return [] as string[];
    const set = new Set<string>();
    product.variants?.forEach(
      (variant) => variant.color && set.add(variant.color),
    );
    return Array.from(set);
  }, [product]);

  useEffect(() => {
    if (galleryImages.length && !selectedImage) {
      setSelectedImage(galleryImages[0]);
    }
  }, [galleryImages, selectedImage]);

  /* ------------------------------------------------------------------------ */
  /*                               ACTIONS                                    */
  /* ------------------------------------------------------------------------ */

  const handleAddToCart = () => {
    console.log("ADD TO CART", { id, selectedVariant, selectedSize, quantity });
  };

  const handleBuyNow = () => {
    console.log("BUY NOW", { id, selectedVariant, selectedSize, quantity });
  };

  const discount = useMemo(() => {
    if (!product) return 0;
    if (product.mrp > product.price) {
      return Math.round(((product.mrp - product.price) / product.mrp) * 100);
    }
    return 0;
  }, [product]);

  /* ------------------------------------------------------------------------ */
  /*                                   UI                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10">
        {isLoading && (
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="h-80 animate-pulse rounded-xl bg-muted" />
              <div className="space-y-4">
                <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-10 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
            <p className="font-semibold">Could not load product</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!isLoading && product && (
          <div>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="flex items-center justify-center rounded-2xl border bg-card p-4">
                {selectedImage ? (
                  <div className="relative h-[420px] w-full overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={selectedImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </div>
                ) : (
                  <div className="flex h-[420px] w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              {galleryImages.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img) => (
                    <button
                      key={img}
                      onClick={() => setSelectedImage(img)}
                      className={cn(
                        "relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border",
                        selectedImage === img
                          ? "border-primary"
                          : "border-border",
                      )}
                    >
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {product.category}{" "}
                  {product.subCategory ? `• ${product.subCategory}` : ""}
                </p>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-semibold leading-tight">
                    {product.name}
                  </h1>
                  {product.label && (
                    <Badge variant="secondary">{product.label}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span className="font-medium text-foreground">
                      {product.averageRating?.toFixed(1) || "0.0"}
                    </span>
                  </div>
                  <span>({product.ratingCount || 0})</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-foreground">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
                {product.mrp > product.price && (
                  <>
                    <p className="text-muted-foreground line-through">
                      ₹{product.mrp.toLocaleString("en-IN")}
                    </p>
                    <Badge
                      variant="outline"
                      className="border-primary/50 text-primary"
                    >
                      {discount}% off
                    </Badge>
                  </>
                )}
              </div>

              <div className="rounded-lg border bg-background">
                <div className="flex divide-x divide-border border-b">
                  <button className="flex-1 px-3 py-2 text-sm font-medium text-foreground">
                    Description
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm text-muted-foreground">
                    Features
                  </button>
                  <button className="flex-1 px-3 py-2 text-sm text-muted-foreground">
                    Shipping
                  </button>
                </div>
                <div className="p-4 text-sm text-muted-foreground">
                  {product.productInformation ||
                    product.description ||
                    "No description"}
                </div>
              </div>

              {colorOptions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Color</p>
                  <div className="flex gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedVariant(color)}
                        className={cn(
                          "h-9 w-9 rounded-full border",
                          selectedVariant === color
                            ? "border-primary ring-2 ring-primary/40"
                            : "border-border",
                        )}
                        aria-label={color}
                        title={color}
                      >
                        <span className="sr-only">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizeOptions.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "rounded-md border px-4 py-2 text-sm",
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background",
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button className="flex-1" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </div>

              <Separator />

              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">SKU:</span>{" "}
                  {product.sku}
                </p>
                <p>
                  <span className="font-medium text-foreground">Design:</span>{" "}
                  {product.design}
                </p>
              </div>

             
            </div>
            
          </div>
           <div className="rounded-xl border bg-background p-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Customer Reviews
                </h3>
                <p className="text-sm text-muted-foreground">
                  {product.review?.length
                    ? `${product.review.length} review(s)`
                    : "No reviews yet"}
                </p>
                <div className="mt-4">
                  <Review_04 />
                </div>
              </div>
              </div>
        )}
        
      </main>
    </div>
  );
}
