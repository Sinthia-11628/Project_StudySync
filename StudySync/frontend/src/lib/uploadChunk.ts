import { STORAGE_SERVER } from "../config";

export async function uploadFileInChunks(file: File) {
  const chunkSize = 1024 * 1024 * 2; // 2MB
  const totalChunks = Math.ceil(file.size / chunkSize);

  const safeName = file.name.replace(/\s+/g, "-");
  const fileName = `${Date.now()}-${safeName}`;

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(file.size, start + chunkSize);

    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("fileName", fileName);
    formData.append("chunkIndex", i.toString());
    formData.append("totalChunks", totalChunks.toString());

    const res = await fetch(`${STORAGE_SERVER}/upload-chunk`, {
      method: "POST",
      mode: "cors",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Chunk upload failed at chunk ${i}: ${res.status} ${res.statusText} - ${text}`);
    }
  }

  const mergeRes = await fetch(`${STORAGE_SERVER}/merge-chunks`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName,
      totalChunks,
    }),
  });

  if (!mergeRes.ok) {
    const text = await mergeRes.text();
    throw new Error(`Merge failed: ${mergeRes.status} ${mergeRes.statusText} - ${text}`);
  }

  const result = await mergeRes.json();
  const fileUrl = result.fileUrl || result.url;

  if (!fileUrl) {
    throw new Error("Merge response missing fileUrl");
  }

  return {
    fileName,
    fileUrl,
  };
}