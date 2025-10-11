"use client";

import { useData } from "@/components/Providers";
import PromoCard from "@/components/shared/PromoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";

export default function PromotionsPage() {
  const { promotions, isLoading } = useData();

  const activePromotions = useMemo(() => {
    const now = new Date();
    return promotions.filter(promo => {
        const from = new Date(promo.validFrom);
        const until = new Date(promo.validUntil);
        return now >= from && now <= until;
    });
  }, [promotions]);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <h1 className="mb-8 text-center font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
        Special Offers
      </h1>

      {isLoading ? (
         <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-60 w-full rounded-lg" />)}
        </div>
      ) : activePromotions.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {activePromotions.map((promo) => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p className="text-lg">No active promotions at the moment.</p>
          <p>Please check back soon!</p>
        </div>
      )}
    </div>
  );
}
