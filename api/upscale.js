export const config = { runtime: 'edge' };

export default async function handler(req) {
    // 1. Validasi Metode Request
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method tidak diizinkan' }), { 
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // 2. Ambil data gambar mentah dari Frontend
        const arrayBuffer = await req.arrayBuffer();
        
        // Cek jika kiriman kosong
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            return new Response(JSON.stringify({ error: 'File gambar kosong atau rusak' }), { status: 400 });
        }

        // 3. Ambil Token dari Environment Variable Vercel
        const token = process.env.HF_TOKEN;
        if (!token) {
            return new Response(JSON.stringify({ error: 'Konfigurasi error: HF_TOKEN belum dipasang di Vercel' }), { status: 500 });
        }

        // 4. Tembak ke Hugging Face API menggunakan ArrayBuffer (lebih stabil di Edge Runtime)
        const hfResponse = await fetch("https://api-inference.huggingface.co/models/caidas/swin2SR-classical-sr-x2-64", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": req.headers.get("content-type") || "image/jpeg"
            },
            body: arrayBuffer
        });

        // 5. Jika Hugging Face merespon dengan error, teruskan detail errornya ke frontend
        if (!hfResponse.ok) {
            const hfErrorText = await hfResponse.text();
            return new Response(JSON.stringify({ error: `Hugging Face Error: ${hfErrorText}` }), { 
                status: hfResponse.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 6. Jika sukses, kirim balik gambar HD ke frontend
        const imageBlob = await hfResponse.blob();
        return new Response(imageBlob, {
            status: 200,
            headers: { 'Content-Type': req.headers.get("content-type") || "image/jpeg" }
        });

    } catch (error) {
        // Menangkap crash tak terduga agar memunculkan pesan yang jelas di console log browser
        return new Response(JSON.stringify({ error: `Backend Crash: ${error.message}` }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
}
