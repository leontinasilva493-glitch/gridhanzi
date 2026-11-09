import type { Metadata } from "next";

import { envConfigs } from "@/config";
import { PublicPageShell } from "@/features/worksheets/components/site-shell";
import { StructuredData } from "@/features/worksheets/components/structured-data";
import { buildPageSeoMetadata, toAbsoluteUrl } from "@/features/worksheets/seo";

const pagePath = "/huong-dan-tao-giay-luyen-viet-tieng-trung";
const title = "Tạo giấy luyện viết tiếng Trung từ danh sách từ vựng";
const description = "Tạo giấy luyện viết chữ Hán với ô tập viết, Pinyin và bản PDF. Xem hướng dẫn tiếng Việt trước khi dùng công cụ GridHanzi.";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    ...buildPageSeoMetadata(envConfigs.app_url, pagePath, locale, { title, description }),
    title,
    description,
  };
}

export default async function Page({ params }: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const pageUrl = toAbsoluteUrl(envConfigs.app_url, locale === "zh" ? `/zh${pagePath}` : pagePath);

  return (
    <PublicPageShell>
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url: pageUrl,
        inLanguage: "vi",
      }} />
      <main lang="vi">
        <section className="hs-container grid items-center gap-10 pb-12 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
          <div>
            <p className="hs-kicker">Hướng dẫn bằng tiếng Việt</p>
            <h1 className="hs-display mt-3 text-4xl font-bold leading-tight sm:text-5xl">Tạo giấy luyện viết tiếng Trung từ danh sách từ vựng</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#4f5d71]">Dùng GridHanzi để sắp xếp chữ Hán, Pinyin và nghĩa tiếng Anh thành trang luyện viết. Bạn có thể chọn kiểu ô, xem trước rồi in hoặc tải PDF.</p>
            <div className="mt-6 rounded-xl border border-[#dfc99d] bg-[#fff8e8] p-4 text-sm leading-6 text-[#533c20]">
              <strong>Ngôn ngữ công cụ:</strong> Trình tạo hiện dùng tiếng Anh hoặc tiếng Trung, chưa có giao diện tiếng Việt. Phần hướng dẫn bên dưới giúp bạn bắt đầu.
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/generator" lang="vi" className="hs-primary-button">Mở trình tạo bằng tiếng Anh</a>
              <a href="/zh/generator" lang="vi" className="hs-secondary-button">Mở trình tạo bằng tiếng Trung</a>
            </div>
            <p className="mt-4 text-sm text-[#617084]">Miễn phí và không cần tạo tài khoản.</p>
          </div>
          <div className="hs-card mx-auto w-full max-w-md p-6 sm:p-8" aria-label="Ví dụ nội dung luyện viết">
            <p className="text-xs font-bold uppercase tracking-wider text-[#b62822]">Ví dụ một dòng từ vựng</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div><p className="text-xs text-[#617084]">Chữ Hán</p><p lang="zh" className="mt-2 text-3xl">你好</p></div>
              <div><p className="text-xs text-[#617084]">Pinyin</p><p className="mt-3 text-lg">nǐ hǎo</p></div>
              <div><p className="text-xs text-[#617084]">Nghĩa tiếng Anh</p><p className="mt-3 text-lg">hello</p></div>
            </div>
            <p className="mt-6 border-t border-[#ded7ca] pt-4 text-sm leading-6 text-[#617084]">Kiểm tra và chỉnh sửa từng mục trước khi in. Các ô trong công cụ dùng nhãn tiếng Anh hoặc tiếng Trung.</p>
          </div>
        </section>

        <section className="border-y border-[#ded7ca] bg-[#f7f1e7] py-12">
          <div className="hs-container">
            <h2 className="hs-display text-3xl font-bold">Cách tạo một trang luyện viết</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              <li className="hs-card p-6"><h3 className="text-lg font-bold">1. Thêm từ vựng</h3><p className="mt-2 leading-7 text-[#566276]">Mở trình tạo, nhập hoặc dán danh sách chữ Hán hay từ tiếng Anh. Bạn cũng có thể bắt đầu bằng một mẫu có sẵn.</p></li>
              <li className="hs-card p-6"><h3 className="text-lg font-bold">2. Kiểm tra và chọn kiểu luyện</h3><p className="mt-2 leading-7 text-[#566276]">Chỉnh lại chữ Hán, Pinyin và nghĩa tiếng Anh nếu cần. Chọn ô tập viết, kiểu luyện và khổ giấy phù hợp.</p></li>
              <li className="hs-card p-6"><h3 className="text-lg font-bold">3. Xem trước và in</h3><p className="mt-2 leading-7 text-[#566276]">Mở bản xem trước để kiểm tra bố cục, sau đó in hoặc tải trang luyện viết dưới dạng PDF.</p></li>
            </ol>
          </div>
        </section>

        <section className="hs-container grid gap-8 py-12 md:grid-cols-2">
          <div><h2 className="hs-display text-3xl font-bold">Chọn cách luyện phù hợp</h2><p className="mt-4 leading-7 text-[#566276]">Dùng ô chữ điền Tian Zi Ge hoặc ô chữ mễ Mi Zi Ge để luyện nét. Bạn có thể chọn phần chữ mẫu, chữ để đồ theo hoặc ô trống tùy mục đích luyện tập.</p><p className="mt-3 leading-7 text-[#566276]">Giáo viên có thể chuẩn bị từ cho một bài học; người tự học có thể tạo trang ôn tập từ danh sách của mình.</p></div>
          <div className="hs-card p-6"><h2 className="hs-display text-2xl font-bold">Lưu ý trước khi bắt đầu</h2><p className="mt-3 leading-7 text-[#566276]">Công cụ chưa tự dịch từ tiếng Việt sang tiếng Trung. Hãy nhập chữ Hán hoặc từ tiếng Anh, rồi kiểm tra kỹ chữ Hán, Pinyin và nghĩa tiếng Anh trước khi sử dụng.</p><a href="/generator" className="mt-5 inline-flex font-semibold text-[#24466e] underline underline-offset-4">Mở trình tạo bằng tiếng Anh →</a></div>
        </section>
      </main>
    </PublicPageShell>
  );
}
