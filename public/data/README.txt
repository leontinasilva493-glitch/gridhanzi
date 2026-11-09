GridHanzi learning-directory data
Radical numbering and reference labels: Unicode 17.0 CJKRadicals.txt and Kangxi character names. See UNICODE-LICENSE.txt.
Readings and character-radicals.json: derived from Make Me a Hanzi dictionary.txt (https://github.com/skishore/makemeahanzi/blob/master/dictionary.txt), under LGPL-3.0-or-later. See MAKE-ME-A-HANZI-NOTICE.txt and LICENSE-LGPL-3.0.txt.
The reverse-lookup file is the character-to-radical projection of every input row. Example readings, teaching notes and meanings are separately selected editorial content, not automatic first-reading defaults.
Reproduce the lookup projection with Python: load each JSON line from dictionary.txt; map each row["character"] to row["radical"]; serialize that object as JSON with ensure_ascii=False.
Pinyin spelling combinations cross-checked against https://pinyin.info/rules/initials_finals.html . No recorded pronunciation audio is supplied.
