export default class NotFoundView {
    getHtml() {
        return `
        <div class="not-found">
          <h1>404</h1>
          <h2>Halaman Tidak Ditemukan</h2>
          <p>Maaf, halaman yang kamu tuju tidak tersedia.</p>
          <a href="#/">Kembali ke Beranda</a>
        </div>
      `;
    }
}