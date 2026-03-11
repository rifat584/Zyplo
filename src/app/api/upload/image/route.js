export const runtime = "nodejs";

export async function POST(request) {
  try {
    const key = process.env.IMG_HOST_KEY;
    if (!key) {
      return Response.json(
        { error: "IMG_HOST_KEY is missing in environment" },
        { status: 500 },
      );
    }

    const form = await request.formData();
    const file = form.get("image");

    if (!(file instanceof File)) {
      return Response.json({ error: "Image file is required" }, { status: 400 });
    }

    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxBytes) {
      return Response.json(
        { error: "Image must be 10MB or smaller" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const imageApiUrl = `https://api.imgbb.com/1/upload?key=${key}`;
    const imageBody = new URLSearchParams();
    imageBody.set("image", base64);
    imageBody.set("name", (file.name || "profile-image").replace(/\.[^.]+$/, ""));

    const response = await fetch(imageApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: imageBody.toString(),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.success || !payload?.data?.url) {
      return Response.json(
        { error: payload?.error?.message || "Failed to upload image" },
        { status: 502 },
      );
    }

    return Response.json({
      url: payload.data.url,
      displayUrl: payload.data.display_url || payload.data.url,
      deleteUrl: payload.data.delete_url || "",
    });
  } catch (error) {
    return Response.json(
      { error: error?.message || "Upload failed" },
      { status: 500 },
    );
  }
}
