export const maxDuration = 60; // MANTRA AJAIB: Memperpanjang napas Vercel jadi 60 detik!

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('Method tidak diizinkan');
    }

    try {
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        const imageBuffer = Buffer.concat(chunks);

        const hfResponse = await fetch("https://api-inference.huggingface.co/models/caidas/swin2SR-classical-sr-x2-64", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_TOKEN}`,
                "Content-Type": req.headers["content-type"] || "image/jpeg"
            },
            body: imageBuffer
        });

        if (!hfResponse.ok) {
            const errorText = await hfResponse.text();
            return res.status(hfResponse.status).send(`Hugging Face Error: ${errorText}`);
        }

        const resultBuffer = await hfResponse.arrayBuffer();
        
        res.setHeader("Content-Type", hfResponse.headers.get("content-type") || "image/jpeg");
        return res.status(200).send(Buffer.from(resultBuffer));

    } catch (error) {
        // Jika masih gagal fetch, kita berikan pesan yang lebih jelas
        return res.status(500).json({ error: error.message, detail: "Koneksi terputus. AI butuh waktu lebih dari 60 detik atau sedang offline." });
    }
}
