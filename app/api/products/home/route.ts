import { NextRequest, NextResponse } from "next/server";

import {
  getHomeProducts,
} from "@/lib/supabase/productQueries";

export async function GET(
  request: NextRequest
) {
  const searchParams =
    request.nextUrl.searchParams;

  const category =
    searchParams.get(
      "category"
    );

  const pageParam =
    searchParams.get("page");

  const limitParam =
    searchParams.get("limit");

  if (
    category !== "shoes" &&
    category !== "watches"
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid category.",
      },
      {
        status: 400,
      }
    );
  }

  const page = Number(
    pageParam ?? 0
  );

  const limit = Number(
    limitParam ?? 8
  );

  if (
    !Number.isInteger(page) ||
    page < 0 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 8
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid pagination.",
      },
      {
        status: 400,
      }
    );
  }

  const result =
    await getHomeProducts(
      category,
      page,
      limit
    );

  return NextResponse.json(
    result
  );
}