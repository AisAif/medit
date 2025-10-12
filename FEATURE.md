### 🧩 **1. Fitur Inti (Wajib untuk versi awal / MVP)**

Ini fitur yang paling dasar agar web editor foto bisa berfungsi dengan baik:

#### 🖼️ **Upload & Tampilan Gambar**

* Upload gambar dari perangkat (drag & drop atau pilih file).
* Preview gambar langsung di canvas.
* Zoom in/out dan pan (geser tampilan).

#### ✂️ **Edit Dasar**

* **Crop** (potong gambar, rasio 1:1, 4:3, 16:9, custom).
* **Rotate** (90°, 180°, flip horizontal/vertical).
* **Resize** (ubah ukuran manual atau otomatis dengan menjaga rasio).

#### 🎨 **Penyesuaian Warna & Efek**

* Brightness (kecerahan)
* Contrast (kontras)
* Saturation (kejenuhan warna)
* Blur / Sharpness (ketajaman)
* Grayscale / Sepia / Invert (efek cepat)

#### 💾 **Ekspor**

* Download hasil edit ke format JPG/PNG.
* Opsi kualitas ekspor (misal: high, medium, low).

---

### ⚙️ **2. Fitur Tambahan (Menarik untuk dikembangkan)**

#### 🧰 **Filter Cepat (Preset)**

* Pilih filter seperti Instagram: “Warm”, “Cold”, “Vintage”, “B&W”, dll.
* Filter ini bisa gabungan beberapa efek (brightness, contrast, tone curve).

#### 🧩 **Layer & Undo/Redo**

* Layer sederhana (misal gambar, teks, stiker dipisah).
* Undo/redo untuk memudahkan pengguna.

#### 💡 **Integrasi & Sharing**

* Share langsung ke media sosial.
* Simpan ke cloud (misal Google Drive).

---

### ⚙️ **3. Teknologi**

* Nuxt
* Shadcn-vue

### ⚙️ **3. Gaya UI: Playful & Modern Minimalist**

**Karakter:**

* Flat, ringan, berwarna cerah tapi tidak norak.
* Tombol besar dengan ikon jelas.
* Fokus ke “langsung bisa pakai”, bukan fitur rumit.

**Ciri khas visual:**

* **Warna utama:** kombinasi cerah seperti biru muda, ungu, pink pastel.
* **Font:** Poppins, Inter, atau Nunito.
* **Tombol:** rounded-xl dengan bayangan lembut.
* **Layout:** toolbar di sisi kiri atau bawah seperti *Canva / Pixlr X*.

**Inspirasi:**

* [Canva](https://www.canva.com/)
* [Pixlr X](https://pixlr.com/x/)
* [Fotor](https://www.fotor.com/)

---

## ✏️ **Kombinasi UI Tools**

Kalau kamu mau implementasi cepat:

* **Framework UI:** Tailwind CSS + shadcn/ui (untuk React) atau Vuetify (untuk Vue).
* **Ikon:** [Lucide Icons](https://lucide.dev/) (konsisten & modern).
* **Font pairing:** Inter (text) + Poppins (heading).

---