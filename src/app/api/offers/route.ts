import { NextResponse } from "next/server";
import { getCollectionData } from "@/lib/content";

// Get all offers (public or admin depending on needs, DecapCMS handles management)
export async function GET(req: Request) {
    try {
        const offers = getCollectionData<any>('offers');

        // Return active offers
        const activeOffers = offers.filter(o => o.isActive);

        return NextResponse.json(activeOffers);
    } catch (error) {
        console.error("Get offers error:", error);
        return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    return NextResponse.json({ error: "Creation is now managed via DecapCMS admin panel." }, { status: 501 });
}
