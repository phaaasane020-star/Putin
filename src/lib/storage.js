import { createClient } from "@supabase/supabase-js";

const BUCKET = "works";
let admin;

function client() {
  if (!admin) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set.");
    admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return admin;
}

// Uploads an image to the public "works" bucket (created automatically the first time) and returns its public URL.
export async function uploadImage(path, file, contentType) {
  const sb = client();
  const body = Buffer.from(await file.arrayBuffer());
  const opts = { contentType, cacheControl: "31536000", upsert: false };
  let { error } = await sb.storage.from(BUCKET).upload(path, body, opts);
  if (error && /bucket not found/i.test(error.message)) {
    await sb.storage.createBucket(BUCKET, { public: true });
    ({ error } = await sb.storage.from(BUCKET).upload(path, body, opts));
  }
  if (error) throw new Error(error.message);
  return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

export async function removeImage(url) {
  const part = url.split(`/storage/v1/object/public/${BUCKET}/`)[1];
  if (!part) return;
  await client().storage.from(BUCKET).remove([decodeURIComponent(part)]);
}
