export interface AthkerItem {
  id: string;
  ar: string;
  en: string;
  category: 'hadith' | 'dua' | 'athker';
}

export const ATHKER_DATA: AthkerItem[] = [
  {
    id: '1',
    ar: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    en: 'Glory be to Allah and His is the praise, Glory be to Allah the Giant.',
    category: 'athker',
  },
  {
    id: '2',
    ar: 'لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ',
    en: 'There is no might nor power except with Allah.',
    category: 'athker',
  },
  {
    id: '3',
    ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    en: 'O Allah, send prayers and peace upon our Prophet Muhammad.',
    category: 'athker',
  },
  {
    id: '4',
    ar: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    en: 'All praise is due to Allah, Lord of the worlds.',
    category: 'athker',
  },
  {
    id: '5',
    ar: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    en: 'I seek Allah’s forgiveness and I repent to Him.',
    category: 'athker',
  },
  {
    id: '6',
    ar: 'قَالَ صلى الله عليه وسلم: "مَنْ قَالَ سُبْحَانَ اللَّهِ وَبِحَمْدِهِ فِي يَوْمٍ مِائَةَ مَرَّةٍ حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ"',
    en: 'The Prophet (ﷺ) said: "Whoever says Subhan Allah wa bihamdihi one hundred times a day, his sins will be forgiven even if they are like the foam of the sea."',
    category: 'hadith',
  },
  {
    id: '7',
    ar: 'قَالَ صلى الله عليه وسلم: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ"',
    en: 'The Prophet (ﷺ) said: "Two words are light on the tongue, heavy in the balance, and loved by the Most Merciful: Subhan Allah wa bihamdihi, Subhan Allah al-Adhim."',
    category: 'hadith',
  },
  {
    id: '8',
    ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    en: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.',
    category: 'dua',
  },
  {
    id: '9',
    ar: 'عن عمر بن الخطاب رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: «إِنَّمَا الْأَعْمَالُ بِالنِّيَّةِ، وَإِنَّمَا لِامْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللهِ وَرَسُولِهِ، فَهِجْرَتُهُ إِلَى اللهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوِ امْرَأَةٍ يَتَزَوَّجُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ». وفي لفظ للبخاري: «إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى».',
    en: 'عن عمر بن الخطاب رضي الله عنه قال: قال رسول الله صلى الله عليه وسلم: «إِنَّمَا الْأَعْمَالُ بِالنِّيَّةِ، وَإِنَّمَا لِامْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللهِ وَرَسُولِهِ، فَهِجْرَتُهُ إِلَى اللهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوِ امْرَأَةٍ يَتَزَوَّجُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ». وفي لفظ للبخاري: «إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى».',
    category: 'hadith',
  },
];
