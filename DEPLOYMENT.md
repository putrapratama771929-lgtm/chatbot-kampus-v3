# Deploy Chatbot Kampus ke Vercel

Project ini memakai pola RAG: data kampus disimpan di PostgreSQL + pgvector, lalu model AI dipanggil lewat OpenRouter API. Jangan deploy model lokal `.gguf` ke Vercel.

## 1. Siapkan Database

Gunakan PostgreSQL yang mendukung ekstensi `vector`.

```bash
npm run db:migrate
npm run db:seed
npm run rag:sync
npm run rag:ingest-pdfs
npm run rag:evaluate
```

`rag:evaluate` idealnya lulus untuk pertanyaan UKT, pendaftaran, cuti akademik, fasilitas, dan pimpinan kampus.

## 2. Environment Variables Vercel

Set variabel berikut di Vercel Project Settings. Tandai secret/API key sebagai Sensitive.

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://domain-vercel-anda.vercel.app
FRONTEND_URL=https://domain-vercel-anda.vercel.app
OPENROUTER_API_KEY=...
OPENROUTER_MODEL=google/gemini-2.5-flash
OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-small
OPENROUTER_SITE_URL=https://domain-vercel-anda.vercel.app
OPENROUTER_APP_NAME=Chatbot Kampus
AI_FALLBACK_ENABLED=true
RAG_ENABLED=true
RAG_TOP_K=5
RAG_MIN_SCORE=0.5
```

## 3. Deploy

Import repository ini ke Vercel atau jalankan Vercel CLI setelah project di-link.

```bash
vercel
vercel --prod
```

Setelah deploy, cek:

```bash
curl https://domain-vercel-anda.vercel.app/api/health
```

Lalu buka halaman chat dan tes pertanyaan seperti:

- `Apa saja jurusan di Polimdo?`
- `Berapa UKT Teknik Informatika?`
- `Bagaimana prosedur cuti akademik?`

## Catatan Penting

- `server/models/` dan `server/data_kampus/` tidak ikut bundle Vercel.
- PDF kampus dipakai saat ingestion ke database, bukan dibaca langsung dari Vercel runtime.
- API key tidak boleh dipasang di JavaScript frontend.
