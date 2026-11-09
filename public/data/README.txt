GridHanzi learning-directory data
Radical numbering and reference labels: Unicode 17.0 CJKRadicals.txt and Kangxi character names. See UNICODE-LICENSE.txt.
Readings and character-radicals.json: derived from Make Me a Hanzi dictionary.txt (https://github.com/skishore/makemeahanzi/blob/master/dictionary.txt), under LGPL-3.0-or-later. See MAKE-ME-A-HANZI-NOTICE.txt and LICENSE-LGPL-3.0.txt.
Radical-heading readings are editorial choices, cross-checked against https://dict.mini.moe.edu.tw/SearchIndex/RadicalsTable and https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/chi-edu/second-lang/Radicals.pdf . They are not automatic first readings of standalone simplified words. Contextual and regional differences are explained in the heading notes.
The reverse-lookup file is the character-to-radical projection of every input row. Example readings, teaching notes and meanings are separately selected editorial content, not automatic first-reading defaults.
Reproduce the lookup projection with Python: load each JSON line from dictionary.txt; map each row["character"] to row["radical"]; serialize that object as JSON with ensure_ascii=False.
Pinyin spelling combinations cross-checked against https://pinyin.info/rules/initials_finals.html . No recorded pronunciation audio is supplied.
