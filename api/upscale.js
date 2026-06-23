export const config = { runtime: 'edge' }; // Menggunakan teknologi Vercel Edge yang super cepat

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response('Method tidak diizinkan', { status: 405 });
    }

    try {
        // Mengambil file mentah yang dikirim dari frontend
        const blob = await req.blob();

        // Server Vercel melakukan fetch ke Hugging Face (Aman dari blokir ISP lokal)
        const hfResponse = await fetch("https://api-inference.huggingface.co/models/caidas/swin2SR-classical-sr-x2-64", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_TOKEN}`, // Token diambil dengan aman dari sistem Vercel
                "Content-Type": req.headers.get("content-type") || "image/jpeg"
            },
            body: blob
        });

        return hfResponse;

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
