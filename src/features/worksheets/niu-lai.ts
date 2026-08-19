export interface NiuLaiSource {
  title: string;
  publisher: string;
  href: string;
  scope: string;
}

export const niuLaiGuide = {
  seo: {
    title: "牛来 (Niu Lai) Meaning & Chinese Movie Meme",
    description:
      "Understand 牛来 (Niú Lái), the 2026 Chinese animated-film meme. Learn its literal meaning, why it went viral, overseas reactions, and how 牛 and 来 work in Chinese.",
    h1: "What Does 牛来 (Niú Lái) Mean? The Chinese Movie Meme Explained",
  },
  reviewedAt: "2026-08-17",
  publishedAt: "2026-08-17",
  simplified: "牛来",
  traditional: "牛來",
  pinyin: "Niú Lái",
  quickAnswer:
    "牛来 (Niú Lái) is the name of a calf, the film title of a 2026 Chinese animated production, and the label used for the meme around that film. It is not a standard two-character expression and not an HSK vocabulary item.",
  sources: [
    {
      title: "《牛来》票房逆袭，网友花式整活",
      publisher: "The Beijing News",
      href: "https://www.bjnews.com.cn/detail/1786783512168828.html",
      scope:
        "Film premise, early audience figures, screening growth, remix culture, and social check-in behaviour.",
    },
    {
      title: "动画电影《牛来》爆火，导演回应",
      publisher: "Jimu News via Phoenix New Media",
      href: "https://news.ifeng.com/c/8vaT7tvW53p",
      scope:
        "Small production team, early box-office context, credited creators, and production-company information.",
    },
    {
      title: "Chinese mainland film release calendar",
      publisher: "Maoyan Pro",
      href: "https://piaofang.maoyan.com/calendar",
      scope: "Release-date and film-credit cross-check.",
    },
    {
      title: "Niu Lai discussion in r/antiai",
      publisher: "Reddit",
      href: "https://www.reddit.com/r/antiai/comments/1vprekm/niu_lai_an_animated_film_that_recently_got/",
      scope: "One strand of overseas reaction to the film's visual style and meme potential.",
    },
    {
      title: "Niu Lai box-office discussion",
      publisher: "Reddit r/boxoffice",
      href: "https://www.reddit.com/r/boxoffice/comments/1vp7r1j/in_china_once_upon_a_time_in_the_middle_east/",
      scope: "Time-stamped overseas discussion of the sudden screening and audience spike.",
    },
    {
      title: "Niu Lai discussion in r/Letterboxd",
      publisher: "Reddit",
      href: "https://www.reddit.com/r/Letterboxd/comments/1vph6ru/niu_lai_%E7%89%9B%E6%9D%A5_a_brandnew_chinese_movie_thats_quickly/",
      scope: "Film-community discussion and the explanatory gloss ‘The Bull Arrives.’",
    },
  ] satisfies NiuLaiSource[],
} as const;

export type NiuLaiGuide = typeof niuLaiGuide;
