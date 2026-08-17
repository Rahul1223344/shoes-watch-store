const BUCKET = "product-images";

export function getProductImageUrl(
  supabaseUrl: string,
  storagePath: string
) {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}