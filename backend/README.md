# VisionX Creator Cloud — Backend

FastAPI backend for the VisionX Creator Cloud platform. Handles auth, image
upload, AI-style image quality diagnosis, and image enhancement — using real
OpenCV/Pillow logic (no heavy ML models yet, as decided).

## Stack

- **FastAPI** — web framework
- **PostgreSQL + SQLAlchemy** — database
- **Alembic** — migrations
- **Cloudinary** — cloud image storage (uploads + processed images)
- **OpenCV + Pillow + NumPy** — diagnosis metrics and enhancement operations
- **JWT (python-jose) + bcrypt (passlib)** — authentication

## 1. Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your real values:

```bash
cp .env.example .env
```

You'll need:
- A running PostgreSQL database — update `DATABASE_URL`
- A free Cloudinary account (cloudinary.com) — `CLOUDINARY_CLOUD_NAME`,
  `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (found on your Cloudinary dashboard)
- A random long string for `SECRET_KEY` (used to sign JWTs)

## 2. Database

For local development, tables are auto-created on startup
(`Base.metadata.create_all` in `app/main.py`), so you can just run the app.

For production, use Alembic migrations instead:

```bash
alembic revision --autogenerate -m "init"
alembic upgrade head
```

## 3. Run the server

```bash
uvicorn app.main:app --reload
```

- API root: http://localhost:8000/
- Interactive docs (Swagger UI): http://localhost:8000/docs
- Health check: http://localhost:8000/api/v1/health

## 4. API overview (all under `/api/v1`)

| Method | Endpoint                | Auth | Description |
|--------|--------------------------|------|--------------|
| GET    | `/health`                | No   | Health check |
| POST   | `/auth/register`         | No   | Create account |
| POST   | `/auth/login`            | No   | Get JWT (form fields: `username`=email, `password`) |
| GET    | `/auth/me`               | Yes  | Current user info |
| POST   | `/upload`                | Yes  | Upload an image (multipart `file`) |
| POST   | `/diagnosis/{image_id}`  | Yes  | Run quality diagnosis on an uploaded image |
| GET    | `/diagnosis/{image_id}`  | Yes  | Get latest diagnosis |
| POST   | `/enhancement/{image_id}`| Yes  | Enhance image (auto or specific `operations`) |
| GET    | `/enhancement/{image_id}`| Yes  | Get latest enhancement |
| GET    | `/results/{image_id}`    | Yes  | Combined image + diagnosis + enhancement |
| GET    | `/history`               | Yes  | List your uploaded images (filter by `status`) |

Authenticated requests need header: `Authorization: Bearer <token>`.

## 5. How diagnosis works (app/utils/image_utils.py)

Six real, math-based metrics, each scored 0–100:

- **Blur** — variance of the Laplacian (sharpness)
- **Noise** — residual vs. a median-blurred version of the image
- **Exposure** — histogram brightness + shadow/highlight clipping %
- **Contrast** — standard deviation of pixel intensities
- **Color** — R/G/B channel balance (color-cast detection)
- **Compression** — 8×8 JPEG block-edge discontinuity ("blockiness")

These combine into `overall_quality_score`, and any dimension under 55 is
flagged in `issues` (e.g. `"blurry"`, `"poor_exposure"`).

## 6. How enhancement works

If you don't pass explicit `operations` in the enhancement request, the
decision engine (`recommend_operations` in `image_utils.py`) picks operations
based on which diagnosis dimensions were weak — e.g. low exposure score →
auto exposure/gamma correction, low noise score → denoise, etc. Available
operations: `exposure`, `denoise`, `sharpen`, `contrast`, `white_balance`,
`color_correction`.

## 7. Project layout

```
backend/
├── app/
│   ├── main.py                # FastAPI app entrypoint
│   ├── api/                   # routers + auth dependency
│   ├── core/                  # config, security, logging
│   ├── database/               # SQLAlchemy session, base, models
│   ├── schemas/                # Pydantic request/response models
│   ├── services/               # business logic (upload/diagnosis/enhancement/storage)
│   ├── processors/              # image loading + pipeline orchestration
│   └── utils/                   # image analysis/enhancement math, file + validation helpers
├── migrations/                 # Alembic migrations
├── storage/                    # local scratch folders (not used for persistent storage — Cloudinary is)
├── requirements.txt
├── alembic.ini
├── Procfile
└── .env.example
```

## Notes / what's intentionally simple for now

- Processing is synchronous (no background job queue yet) — fine for single
  images, but for bulk/large images you'll want to move diagnosis/enhancement
  into a Celery/RQ worker later. The `Job` model already exists for this.
- No deep-learning models (super-resolution, face restoration, etc.) are
  wired in yet — per current scope, all diagnosis/enhancement is classic
  OpenCV/Pillow math. The separate top-level `ai_engine/` module (from the
  original project structure) is where those would eventually live.
