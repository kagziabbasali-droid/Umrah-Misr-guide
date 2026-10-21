if(window.top!==window.self){ try{ window.top.location=window.self.location; }catch(e){ document.documentElement.style.display="none"; } }
(function(){
"use strict";

/* ---------- storage helpers (private to this viewer) ---------- */
function load(){ try{ var r=localStorage.getItem("umrah-guide-v1"); return r?JSON.parse(r):null; }catch(e){ return null; } }
function save(){ try{ S.iBy=S.iBy||{}; S.iBy[S.mode||"umrah"]=S.i; localStorage.setItem("umrah-guide-v1", JSON.stringify(S)); }catch(e){} }

var S = load() || {started:false,type:"mufrada",gender:"m",i:0,tr:true,fs:1,theme:""};
if(!S.mode) S.mode="umrah";
if(!S.dstyle) S.dstyle="corner";
if(!S.iBy) S.iBy={};
if(typeof S.fs!=="number") S.fs=1;

/* ---------- content ---------- */
function d(title, ar, tr, note){ return {title:title, ar:ar, tr:tr, note:note||""}; }

var AR = {
 ghusl:"اللَّهُمَّ إِنِّي أَغْتَسِلُ غُسْلَ الْإِحْرَامِ بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ",
 ihramPrayM:"أُصَلِّي صَلَاةَ الْإِحْرَامِ لِلْعُمْرَةِ الْمُفْرَدَةِ رَكْعَتَيْنِ لِلَّهِ عَزَّ وَجَلَّ أَدَاءً مُسْتَقْبِلَ الْكَعْبَةِ الْحَرَامِ اللَّهُ أَكْبَرُ",
 ihramPrayT:"أُصَلِّي صَلَاةَ الْإِحْرَامِ لِلتَّمَتُّعِ بِالْعُمْرَةِ إِلَى الْحَجِّ رَكْعَتَيْنِ لِلَّهِ عَزَّ وَجَلَّ أَدَاءً مُسْتَقْبِلَ الْكَعْبَةِ الْحَرَامِ اللَّهُ أَكْبَرُ",
 niyM:"اللَّهُمَّ إِنِّي أُرِيدُ الْعُمْرَةَ الْمُفْرَدَةَ عَلَى كِتَابِكَ وَسُنَّةِ نَبِيِّكَ. اللَّهُمَّ وَمَحِلِّي حَيْثُ حَبَسْتَنِي بِقَدَرِكَ الَّذِي قَدَّرْتَ عَلَيَّ، فَأَعِنِّي عَلَى ذَلِكَ وَيَسِّرْهُ لِي وَتَقَبَّلْهُ مِنِّي",
 niyT:"اللَّهُمَّ إِنِّي أُرِيدُ أَنْ أَتَمَتَّعَ بِالْعُمْرَةِ إِلَى الْحَجِّ عَلَى كِتَابِكَ وَسُنَّةِ نَبِيِّكَ. اللَّهُمَّ وَمَحِلِّي حَيْثُ حَبَسْتَنِي بِقَدَرِكَ الَّذِي قَدَّرْتَ عَلَيَّ، فَأَعِنِّي عَلَى ذَلِكَ وَيَسِّرْهُ لِي وَتَقَبَّلْهُ مِنِّي",
 talbiyah:"لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
 talbiyah7:"لَبَّيْكَ ذَا الْمَعَارِجِ، لَبَّيْكَ دَاعِيًا إِلَى دَارِ السَّلَامِ، لَبَّيْكَ غَفَّارَ الذُّنُوبِ، لَبَّيْكَ مَرْهُوبًا مِنْكَ وَمَرْغُوبًا إِلَيْكَ، لَبَّيْكَ ذَا الْجَلَالِ وَالْإِكْرَامِ، لَبَّيْكَ إِلَهَ الْخَلْقِ، لَبَّيْكَ كَاشِفَ الْكَرْبِ",
 stopT:"لَا إِلَهَ إِلَّا اللَّهُ اللَّهُ أَكْبَرُ",
 ghuslHaram:"اللَّهُمَّ إِنِّي أَغْتَسِلُ لِدُخُولِ الْمَسْجِدِ الْحَرَامِ بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ",
 seeKaba:"اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا، وَزِدْ فِي شَرَفِهِ، وَكَرِّمْ مَنْ حَجَّهُ وَاعْتَمَرَ إِلَيْهِ تَشْرِيفًا وَتَعْظِيمًا وَبِرًّا وَتَكْرِيمًا",
 hajarStart:"اللَّهُمَّ إِنِّي أَسْأَلُكَ فِي مَقَامِي هَذَا فِي أَوَّلِ مَنَاسِكِي أَنْ تَقْبَلَ تَوْبَتِي، وَأَنْ تَتَجَاوَزَ عَنْ خَطِيئَتِي، وَتَضَعَ عَنِّي وِزْرِي. الْحَمْدُ لِلَّهِ الَّذِي بَلَّغَنِي بَيْتَهُ الْحَرَامَ",
 hajarFace:"اللَّهُمَّ إِيمَانًا بِكَ، وَوَفَاءً بِعَهْدِكَ، وَاتِّبَاعًا لِسُنَّتِكَ وَسُنَّةِ مُحَمَّدٍ نَبِيِّكَ وَأَهْلِ بَيْتِهِ الطَّاهِرِينَ",
 hajarTouch1:"بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ. اللَّهُمَّ أَمَانَتِي أَدَّيْتُهَا، وَمِيثَاقِي تَعَاهَدْتُهُ، مُحَافِظًا لَكَ فِيهِ عَلَى عَهْدِي. اللَّهُمَّ فَاقْبَلْ ذَلِكَ مِنِّي يَا أَرْحَمَ الرَّاحِمِينَ",
 tawM:"اللَّهُمَّ إِنِّي نَوَيْتُ أَنْ أَطُوفَ بِهَذَا الْبَيْتِ الْعَتِيقِ طَوَافَ الْعُمْرَةِ الْمُفْرَدَةِ سَبْعَةَ أَشْوَاطٍ لِلَّهِ عَزَّ وَجَلَّ. اللَّهُمَّ فَيَسِّرْهُ لِي وَأَعِنِّي عَلَيْهِ وَتَقَبَّلْهُ مِنِّي، بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ",
 tawT:"اللَّهُمَّ إِنِّي نَوَيْتُ أَنْ أَطُوفَ بِهَذَا الْبَيْتِ الْعَتِيقِ طَوَافَ التَّمَتُّعِ بِالْعُمْرَةِ إِلَى الْحَجِّ سَبْعَةَ أَشْوَاطٍ لِلَّهِ عَزَّ وَجَلَّ. اللَّهُمَّ فَيَسِّرْهُ لِي وَأَعِنِّي عَلَيْهِ وَتَقَبَّلْهُ مِنِّي، بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ",
 roundStart:"اللَّهُمَّ أَمَانَتِي أَدَّيْتُهَا بِجُهْدِي، وَمِيثَاقِي تَعَاهَدْتُهُ لِيَشْهَدَ لِي عِنْدَكَ بِالْبَلَاغِ",
 bab:"اللَّهُمَّ إِنَّ الْبَيْتَ بَيْتُكَ، وَالْحَرَمَ حَرَمُكَ، وَالْعَبْدَ عَبْدُكَ، وَهَذَا مَقَامُ الْعَائِذِ بِكَ مِنَ النَّارِ. اللَّهُمَّ أَعِذْنِي مِنْ عَذَابِكَ، وَاخْصُصْنِي بِالْأَجْزَلِ مِنْ ثَوَابِكَ، وَالِدَيَّ وَمَا وَلَدَا، وَالْمُسْلِمِينَ وَالْمُسْلِمَاتِ، وَالْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ، الْأَحْيَاءِ مِنْهُمْ وَالْأَمْوَاتِ. اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِهِ الطَّاهِرِينَ",
 iraqi:"اللَّهُمَّ تَعَبَّدْتَنِي بِطَاعَتِكَ، وَطَاعَةِ أَنْبِيَائِكَ، وَأَئِمَّةِ دِينِكَ وَأَوْلِيَائِكَ. وَاجْعَلْهُ حَجًّا مَبْرُورًا، وَسَعْيًا مَشْكُورًا، وَتِجَارَةً لَنْ تَبُورَ، يَا غَفُورُ يَا شَكُورُ",
 mizab:"اللَّهُمَّ أَظِلَّنِي بِظِلِّكَ تَحْتَ عَرْشِكَ يَوْمَ لَا ظِلَّ إِلَّا ظِلُّكَ، وَلَا رُكْنَ إِلَّا رُكْنُكَ، وَاسْتَعْمِلْنِي بِطَاعَتِكَ، وَوَفِّقْنِي لِمَرْضَاتِكَ، وَأَعْتِقْنِي مِنَ النَّارِ",
 shami:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَمِنَ الشَّكِّ وَالشِّرْكِ، وَالنِّفَاقِ وَالشِّقَاقِ، وَكَآبَةِ الْمُنْقَلَبِ فِي الْأَهْلِ وَالْمَالِ وَالْوَلَدِ",
 mustajar:"اللَّهُمَّ إِنَّ الْبَيْتَ بَيْتُكَ، وَالْعَبْدَ عَبْدُكَ، وَهَذَا مَقَامُ الْعَائِذِ بِكَ مِنَ النَّارِ. اللَّهُمَّ إِنِّي إِلَيْكَ فَقِيرٌ، وَبِكَ مُسْتَجِيرٌ، وَأَنْتَ بِالْإِحْسَانِ جَدِيرٌ، وَعَلَى كُلِّ شَيْءٍ قَدِيرٌ. فَلَا تُغَيِّرْ اسْمِي، وَلَا تُبَدِّلْ حُسْنَ وَسْمِي، وَلَا تُشْمِتْ بِي عَدُوًّا",
 yamani:"اللَّهُمَّ أَمَانَتِي أَدَّيْتُهَا بِجُهْدِي، وَمِيثَاقِي تَعَاهَدْتُهُ، مُحَافِظًا فِيهِ لَكَ عَلَى عَهْدِي. اللَّهُمَّ تَقَبَّلْ مِنَّا كَمَا تَقَبَّلْتَ مِنْ أَنْبِيَائِكَ وَأَصْفِيَائِكَ: إِبْرَاهِيمَ خَلِيلِكَ، وَمُوسَى كَلِيمِكَ، وَعِيسَى رُوحِكَ، وَمُحَمَّدٍ نَبِيِّكَ، صَلَوَاتُ اللَّهِ عَلَيْهِمْ أَجْمَعِينَ",
 between:"اللَّهُمَّ آتِنِي فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنِي عَذَابَ النَّارِ",
 qanni:"اللَّهُمَّ قَنِّعْنِي بِمَا رَزَقْتَنِي، وَبَارِكْ لِي فِيمَا آتَيْتَنِي، وَاغْفِرْ لِي ذَنْبِي، وَفُكَّ رَقَبَتِي مِنَ النَّارِ",
 multazam:"الْحَمْدُ لِلَّهِ الَّذِي كَرَّمَكَ وَشَرَّفَكَ وَعَظَّمَكَ، وَجَعَلَكَ مَثَابَةً لِلنَّاسِ وَأَمْنًا. اللَّهُمَّ إِنَّ الْبَيْتَ بَيْتُكَ، وَالْعَبْدَ عَبْدُكَ، وَهَذَا مَقَامُ الْعَائِذِ بِكَ مِنَ النَّارِ. اللَّهُمَّ إِنِّي إِلَيْكَ فَقِيرٌ، وَمِنْكَ خَائِفٌ، وَبِكَ مُسْتَجِيرٌ. رَبِّ لَا تُغَيِّرْ جِسْمِي، وَلَا تُبَدِّلْ اسْمِي. اللَّهُمَّ إِنِّي ضَعِيفٌ، فَقَوِّ فِي رِضَاكَ ضُعْفِي، وَضَاعِفْ عَمَلِي، وَتَقَبَّلْهُ مِنِّي. رَبِّ آتِنِي فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنِي عَذَابَ النَّارِ",
 maqam:"أُصَلِّي صَلَاةَ الطَّوَافِ رَكْعَتَيْنِ لِلَّهِ عَزَّ وَجَلَّ أَدَاءً مُسْتَقْبِلَ الْكَعْبَةِ الْحَرَامِ اللَّهُ أَكْبَرُ",
 hajar48:"اللَّهُمَّ ثَبِّتْنِي عَلَى الْهُدَى، وَجَنِّبْنِي مِنَ الضَّلَالَةِ وَالرَّدَى، وَوَفِّقْنِي لِمَا تُحِبُّ وَتَرْضَى، وَاجْعَلْنِي مِنْ أَوْلِيَائِكَ وَعِبَادِكَ الصَّالِحِينَ، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
 zamWell:"اللَّهُمَّ إِنَّكَ أَظْهَرْتَهَا، وَسَقَيْتَهَا نَبِيَّكَ إِسْمَاعِيلَ، رَحْمَةً مِنْكَ بِهِ يَا جَلِيلُ يَا جَمِيلُ",
 zamDrink:"اللَّهُمَّ اجْعَلْهُ رِزْقًا وَاسِعًا، وَعِلْمًا نَافِعًا، وَدَوَاءً نَاجِعًا مِنْ كُلِّ دَاءٍ وَسُقْمٍ، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
 saiM:"اللَّهُمَّ إِنِّي نَوَيْتُ أَنْ أَسْعَى بَيْنَ الصَّفَا وَالْمَرْوَةِ سَعْيَ الْعُمْرَةِ الْمُفْرَدَةِ سَبْعَةَ أَشْوَاطٍ لِلَّهِ عَزَّ وَجَلَّ. اللَّهُمَّ فَيَسِّرْهُ لِي وَأَعِنِّي عَلَيْهِ وَتَقَبَّلْهُ مِنِّي، بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ",
 saiT:"اللَّهُمَّ إِنِّي نَوَيْتُ أَنْ أَسْعَى بَيْنَ الصَّفَا وَالْمَرْوَةِ سَعْيَ التَّمَتُّعِ بِالْعُمْرَةِ إِلَى الْحَجِّ سَبْعَةَ أَشْوَاطٍ لِلَّهِ عَزَّ وَجَلَّ. اللَّهُمَّ فَيَسِّرْهُ لِي وَأَعِنِّي عَلَيْهِ وَتَقَبَّلْهُ مِنِّي، بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ",
 safaRaised:"الْحَمْدُ لِلَّهِ الْمُتَوَحِّدِ بِالرُّبُوبِيَّةِ، الْمُتَفَرِّدِ بِسُلْطَانِ الْإِلَهِيَّةِ، الْمُتَجَبِّرِ بِجَبَرُوتِ الْفَرْدَانِيَّةِ، الْمُتَعَظِّمِ بِكِبْرِيَاءِ الْوَحْدَانِيَّةِ، الْمُتَرَدِّي بِدَوَامِ الْأَزَلِيَّةِ، الْبَاقِي بِلَا نِهَايَةٍ، وَالْأَوَّلِ بِغَيْرِ غَايَةٍ، سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ عَلَى مَا هَدَانَا",
 takbir:"اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ حَيٌّ لَا يَمُوتُ، بِيَدِهِ الْخَيْرُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَغَلَبَ الْأَحْزَابَ وَحْدَهُ",
 safaDua:"اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ. يَا رَبِّ أَسْأَلُكَ أَنْ تُصَلِّيَ عَلَى مُحَمَّدٍ وَأَهْلِ بَيْتِهِ الطَّيِّبِينَ، وَأَنْ تُقَوِّيَنِي عَلَى الْعَمَلِ بِمَا عَلَّمْتَنِي مِنْ حَقِّكَ، وَأَنْ تَبْسُطَ عَلَيَّ مَا حَظَرْتَ عَلَيَّ مِنْ رِزْقِكَ. وَأَسْأَلُكَ يَا رَبِّ فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً، وَأَسْأَلُكَ أَنْ تَقِيَنِي عَذَابَ النَّارِ. اللَّهُمَّ اجْعَلْنَا مِنَ الْمَقْبُولِينَ، وَلَا تَرُدَّنَا خَزَايَا وَلَا نَادِمِينَ، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
 verse:"إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ، فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَنْ يَطَّوَّفَ بِهِمَا، وَمَنْ تَطَوَّعَ خَيْرًا فَإِنَّ اللَّهَ شَاكِرٌ عَلِيمٌ",
 rabbana:"رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ. رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ",
 walkDua:"بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ، وَصَلَّى اللَّهُ عَلَى مُحَمَّدٍ وَأَهْلِ بَيْتِهِ الطَّاهِرِينَ. اللَّهُمَّ اغْفِرْ وَارْحَمْ وَتَجَاوَزْ عَمَّا تَعْلَمُ، إِنَّكَ أَنْتَ الْأَعَزُّ الْأَكْرَمُ. رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ، بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ",
 bism:"بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ",
 sirri:"اللَّهُمَّ إِنَّكَ تَعْلَمُ سِرِّي وَعَلَانِيَتِي، فَاقْبَلْ مَعْذِرَتِي، وَتَعْلَمُ حَاجَتِي، فَأَعْطِنِي سُؤْلِي، وَتَعْلَمُ مَا فِي نَفْسِي وَمَا عِنْدِي فَاغْفِرْ لِي. اللَّهُمَّ إِنِّي أَسْأَلُكَ إِيمَانًا يُبَاشِرُ قَلْبِي، وَيَقِينًا صَادِقًا، حَتَّى أَعْلَمَ أَنَّهُ لَنْ يُصِيبَنِي إِلَّا مَا كَتَبْتَ عَلَيَّ",
 wadaNiy:"اللَّهُمَّ إِنِّي نَوَيْتُ أَنْ أَطُوفَ بِهَذَا الْبَيْتِ الْعَتِيقِ طَوَافَ الْوَدَاعِ سَبْعَةَ أَشْوَاطٍ لِلَّهِ تَعَالَى. اللَّهُمَّ فَيَسِّرْهُ لِي وَأَعِنِّي عَلَيْهِ وَتَقَبَّلْهُ مِنِّي",
 wadaMult:"اللَّهُمَّ إِنِّي عَبْدُكَ وَابْنُ عَبْدِكَ وَابْنُ أَمَتِكَ، حَمَلْتَنِي عَلَى دَابَّتِكَ، وَسَيَّرْتَنِي فِي بِلَادِكَ، حَتَّى أَدْخَلْتَنِي حَرَمَكَ. اللَّهُمَّ هَذَا بَيْتُكَ وَقَدْ حَلَلْتُ بِهِ، وَرَجَوْتُ فِي حُسْنِ ظَنِّي بِكَ أَنْ تَغْفِرَ لِي ذُنُوبِي. وَإِنْ كُنْتَ قَدْ غَفَرْتَ لِي فَازْدَدْ عَنِّي رِضًى، وَاجْعَلْ لِي عِنْدَكَ زُلْفَى. وَإِنْ كُنْتَ لَمْ تَغْفِرْ لِي فَمِنَ الْآنَ فَاغْفِرْ لِي مِنْ قَبْلِ أَنْ أَنْأَى عَنْ بَيْتِكَ. فَهَذَا أَوَانُ انْصِرَافِي، إِنْ كُنْتَ أَذِنْتَ لِي، غَيْرَ رَاغِبٍ عَنْكَ وَلَا عَنْ بَيْتِكَ، وَلَا مُسْتَبْدِلٍ بِكَ وَلَا بِبَيْتِكَ. فَاحْفَظْنِي عَنْ يَمِينِي وَعَنْ شِمَالِي وَخَلْفِي وَأَمَامِي حَتَّى تُبَلِّغَنِي أَهْلِي. فَإِذَا أَنْتَ بَلَّغْتَنِي فَلَا تَتَخَلَّ مِنِّي، وَتَوَفَّنِي عَلَى مَا تَوَفَّيْتَ بِهِ عِبَادَكَ الصَّالِحِينَ، فَإِنَّكَ أَوْلَى بِذَلِكَ مِنْ خَلْقِكَ وَمِنِّي",
 wadaLast:"اللَّهُمَّ لَا تَجْعَلْهُ آخِرَ عَهْدِي بِبَيْتِكَ",
 wadaB:"اللَّهُمَّ إِنَّ الْبَيْتَ بَيْتُكَ، وَالْحَرَمَ حَرَمُكَ، وَهَذَا مَقَامُ الْعَائِذِ بِكَ مِنَ النَّارِ. فَأَعِذْنَا يَا رَبِّ وَآبَاءَنَا وَأُمَّهَاتِنَا وَأَزْوَاجَنَا وَأَوْلَادَنَا وَإِخْوَانَنَا وَأَخَوَاتِنَا وَجَمِيعَ قَرَابَاتِنَا مِنَ النَّارِ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ. اللَّهُمَّ اجْعَلْهُ تَضَرُّعًا رَحِمْتَهُ، وَعَمَلًا قَبِلْتَهُ، وَحَجًّا بَرَرْتَهُ، وَدُعَاءً سَمِعْتَهُ. اللَّهُمَّ لَا تَجْعَلْهُ آخِرَ الْعَهْدِ مِنْ بَيْتِكَ الْحَرَامِ الَّذِي جَعَلْتَهُ قِبْلَةَ الْإِسْلَامِ، وَفَرَضْتَ حَجَّهُ عَلَى جَمِيعِ الْأَنَامِ، وَجَعَلْتَهُ مَثَالًا لِآلِ نَبِيِّكَ الْكِرَامِ، عَلَيْهِ وَعَلَيْهِمُ السَّلَامُ",
 wadaC:"اللَّهُمَّ صَلِّ عَلَى السَّابِقِ بِنُورِ كَلِمَاتِكَ، وَالتَّالِي بِرَحْمَتِكَ، وَالْحُدُودِ الَّتِي دَلَّتْ عَلَى حِكْمَتِكَ. وَصَلِّ عَلَى نَبِيِّكَ الْهَادِي إِلَى جَنَّتِكَ، وَعَلَى أَهْلِ بَيْتِهِ الطَّاهِرِينَ الْقَائِمِينَ بِشَرِيعَتِكَ، وَعَلَى مَوْلَانَا وَسَيِّدِنَا الْإِمَامِ أَمِيرِ الْمُؤْمِنِينَ، وَآبَائِهِ الْأَئِمَّةِ الْأَكْرَمِينَ، وَأَبْنَائِهِ الْأَئِمَّةِ الطَّيِّبِينَ، أَفْضَلَ الصَّلَاةِ وَالتَّسْلِيمِ. اللَّهُمَّ لَا تَجْعَلْهُ آخِرَ الْعَهْدِ بِبَيْتِكَ الْكَرِيمِ، وَارْزُقْنَا زِيَارَةَ قَبْرِ نَبِيِّكَ الرَّحِيمِ، وَاعْصِمْنَا بِالْبِرِّ وَالتَّقْوَى، وَوَفِّقْنَا لِمَا تُحِبُّ وَتَرْضَى، وَاهْدِنَا إِلَى الطَّرِيقِ الْأَهْدَى",
 wadaD:"اللَّهُمَّ إِنَّ لِكُلِّ آتٍ وَزَائِرٍ حَقًّا عَلَى مَنْ أَتَاهُ وَزَارَهُ. اللَّهُمَّ أَنْتَ أَكْرَمُ مَزُورٍ. اللَّهُمَّ اجْعَلْ فَائِدَتَنَا وَتُحْفَتَنَا فِي زِيَارَتِنَا وَفَادَتِنَا، وَفِي حَجَّتِنَا مَغْفِرَةَ الذُّنُوبِ يَا غَفَّارُ، وَفَكَاكَ رِقَابِنَا مِنَ النَّارِ. اللَّهُمَّ اصْحَبْنَا فِي سَفَرِنَا، وَبَارِكْ لَنَا فِي حَضَرِنَا، وَاحْفَظْنَا فِي أَهْلِنَا، فَأَنْتَ خَيْرٌ حَافِظًا وَأَنْتَ أَرْحَمُ الرَّاحِمِينَ. اللَّهُمَّ لَكَ الْحَمْدُ عَلَى الْبَلَاغِ الْجَمِيلِ. اللَّهُمَّ لَا تَصْرِفْنَا مِنْ مَوْضِعِنَا هَذَا إِلَّا وَقَدْ غَفَرْتَ لَنَا يَا أَرْحَمَ الرَّاحِمِينَ",
 wadaE:"اللَّهُمَّ لَا تُشْمِتْ بِنَا الْأَعْدَاءَ، وَلَا تَجْعَلْنَا مَعَ الْقَوْمِ الظَّالِمِينَ. وَهَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا. وَاصْرِفْ عَنَّا عَذَابَ جَهَنَّمَ إِنَّ عَذَابَهَا كَانَ غَرَامًا. اللَّهُمَّ اقْلِبْنَا الْيَوْمَ غَيْرَ خَائِبِينَ وَلَا مَحْسُورِينَ يَا أَرْحَمَ الرَّاحِمِينَ. اللَّهُمَّ إِنَّ انْصِرَافِي غَيْرَ رَاغِبٍ عَنْكَ وَلَا مُسْتَغْنٍ عَنْكَ، فَاحْفَظْنَا مِنْ بَيْنِ أَيْدِينَا وَمِنْ خَلْفِنَا وَعَنْ أَيْمَانِنَا وَعَنْ شَمَائِلِنَا يَا أَرْحَمَ الرَّاحِمِينَ",
 wadaDoor:"اللَّهُمَّ اقْلِبْنِي مُفْلِحًا مُنْجِحًا مَرْحُومًا مَغْفُورًا لِي. اللَّهُمَّ إِنْ أَمَتَّنِي فَاغْفِرْ لِي، وَإِنْ أَحْيَيْتَنِي فَارْزُقْنِي الْحَجَّ مِنْ قَابِلٍ، وَلَا تَجْعَلْهُ آخِرَ عَهْدِي مِنْ بَيْتِكَ الْحَرَامِ",
 wadaAyibun:"آيِبُونَ تَائِبُونَ عَابِدُونَ إِنْ شَاءَ اللَّهُ لِرَبِّنَا حَامِدُونَ رَاهِبُونَ إِلَيْهِ رَاجِعُونَ",
 wadaAyah:"إِنَّ الَّذِي فَرَضَ عَلَيْكَ الْقُرْآنَ لَرَادُّكَ إِلَى مَعَادٍ",
 ramalEnd:"يَا ذَا الْمَنِّ وَالْفَضْلِ وَالطَّوْلِ وَالنَّعْمَاءِ وَالْجُودِ، إِنَّ عَمَلِي ضَعِيفٌ فَضَاعِفْهُ لِي وَتَقَبَّلْهُ مِنِّي، وَصَلَّى اللَّهُ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ كَمَا أَنْتَ أَهْلُهُ وَهُمْ بِكَ أَهْلُهُ"
};

var TR = {
 ghusl:"Allahumma inni aghtasilu ghusla-l-ihrami, bismillahi Allahu akbar.",
 ihramPrayM:"Usalli salata-l-ihrami lil-umrati-l-mufradati rak'atayni lillahi azza wa jall, ada'an mustaqbila-l-ka'bati-l-haram, Allahu akbar.",
 ihramPrayT:"Usalli salata-l-ihrami lit-tamatti'i bil-umrati ilal-hajji rak'atayni lillahi azza wa jall, ada'an mustaqbila-l-ka'bati-l-haram, Allahu akbar.",
 niyM:"Allahumma inni uridu-l-umrata-l-mufradata ala kitabika wa sunnati nabiyyik. Allahumma wa mahilli haythu habastani biqadarika-lladhi qaddarta alayya, fa-a'inni ala dhalik, wa yassirhu li, wa taqabbalhu minni.",
 niyT:"Allahumma inni uridu an atamatta'a bil-umrati ilal-hajji ala kitabika wa sunnati nabiyyik. Allahumma wa mahilli haythu habastani biqadarika-lladhi qaddarta alayya, fa-a'inni ala dhalik, wa yassirhu li, wa taqabbalhu minni.",
 talbiyah:"Labbayka Allahumma labbayk, labbayka la sharika laka labbayk, inna-l-hamda wan-ni'mata laka wal-mulk, la sharika lak.",
 talbiyah7:"Labbayka dha-l-ma'arij. Labbayka da'iyan ila dari-s-salam. Labbayka ghaffara-dh-dhunub. Labbayka marhuban minka wa marghuban ilayk. Labbayka dha-l-jalali wal-ikram. Labbayka ilaha-l-khalq. Labbayka kashifa-l-karb.",
 stopT:"La ilaha illallahu Allahu akbar.",
 ghuslHaram:"Allahumma inni aghtasilu lidukhuli-l-masjidi-l-haram, bismillahi Allahu akbar.",
 seeKaba:"Allahumma zid hadha-l-bayta tashrifan wa ta'dhiman wa takriman, wa zid fi sharafihi, wa karrim man hajjahu wa'tamara ilayhi tashrifan wa ta'dhiman wa birran wa takriman.",
 hajarStart:"Allahumma inni as'aluka fi maqami hadha fi awwali manasiki an taqbala tawbati, wa an tatajawaza an khati'ati, wa tada'a anni wizri. Alhamdu lillahi-lladhi ballaghani baytahul-haram.",
 hajarFace:"Allahumma imanan bika, wa wafa'an bi-ahdika, wattiba'an li-sunnatika wa sunnati Muhammadin nabiyyika wa ahli baytihit-tahirin.",
 hajarTouch1:"Bismillahi-r-rahmani-r-rahim, wa la hawla wa la quwwata illa billahi-l-aliyyi-l-azim. Allahumma amanati addaytuha, wa mithaqi ta'ahadtuhu, muhafidhan laka fihi ala ahdi. Allahumma faqbal dhalika minni, ya arhamar-rahimin.",
 tawM:"Allahumma inni nawaytu an atufa bihadha-l-bayti-l-atiqi tawafa-l-umrati-l-mufradati sab'ata ashwatin lillahi azza wa jall. Allahumma fa-yassirhu li, wa a'inni alayhi, wa taqabbalhu minni, bismillahi Allahu akbar.",
 tawT:"Allahumma inni nawaytu an atufa bihadha-l-bayti-l-atiqi tawafa-t-tamatti'i bil-umrati ilal-hajji sab'ata ashwatin lillahi azza wa jall. Allahumma fa-yassirhu li, wa a'inni alayhi, wa taqabbalhu minni, bismillahi Allahu akbar.",
 roundStart:"Allahumma amanati addaytuha bijuhdi, wa mithaqi ta'ahadtuhu liyashhada li indaka bil-balagh.",
 bab:"Allahumma inna-l-bayta baytuk, wal-harama haramuk, wal-abda abduk, wa hadha maqamu-l-a'idhi bika minan-nar. Allahumma a'idhni min adhabik, wakhsusni bil-ajzali min thawabik, wa walidayya wa ma walada, wal-muslimina wal-muslimat, wal-mu'minina wal-mu'minat, al-ahya'i minhum wal-amwat. Allahumma salli ala Muhammadin wa alihit-tahirin.",
 iraqi:"Allahumma ta'abbadtani bita'atik, wa ta'ati anbiya'ik, wa a'immati dinika wa awliya'ik. Waj'alhu hajjan mabruran, wa sa'yan mashkuran, wa tijaratan lan tabur, ya ghafuru ya shakur.",
 mizab:"Allahumma azillani bizillika tahta arshika yawma la zilla illa zilluk, wa la rukna illa ruknuk. Wa-sta'milni bita'atik, wa waffiqni limardatik, wa a'tiqni minan-nar.",
 shami:"Allahumma inni a'udhu bika minal-kufri wal-faqr, wa minash-shakki wash-shirk, wan-nifaqi wash-shiqaq, wa ka'abati-l-munqalabi fil-ahli wal-mali wal-walad.",
 mustajar:"Allahumma inna-l-bayta baytuk, wal-abda abduk, wa hadha maqamu-l-a'idhi bika minan-nar. Allahumma inni ilayka faqir, wa bika mustajir, wa anta bil-ihsani jadir, wa ala kulli shay'in qadir. Fa-la tughayyir ismi, wa la tubaddil husna wasmi, wa la tushmit bi aduwwa.",
 yamani:"Allahumma amanati addaytuha bijuhdi, wa mithaqi ta'ahadtuhu, muhafidhan fihi laka ala ahdi. Allahumma taqabbal minna kama taqabbalta min anbiya'ika wa asfiya'ik: Ibrahima khalilik, wa Musa kalimik, wa Isa ruhik, wa Muhammadin nabiyyik, salawatullahi alayhim ajma'in.",
 between:"Allahumma atini fid-dunya hasanatan, wa fil-akhirati hasanatan, wa qini adhaban-nar.",
 qanni:"Allahumma qanni'ni bima razaqtani, wa barik li fima ataytani, waghfir li dhanbi, wa fukka raqabati minan-nar.",
 multazam:"Alhamdu lillahi-lladhi karramak, wa sharrafak, wa azzamak, wa ja'alaka mathabatan lin-nasi wa amna. Allahumma inna-l-bayta baytuk, wal-abda abduk, wa hadha maqamu-l-a'idhi bika minan-nar. Allahumma inni ilayka faqir, wa minka kha'if, wa bika mustajir. Rabbi la tughayyir jismi, wa la tubaddil ismi. Allahumma inni da'if, fa-qawwi fi ridaka du'fi, wa da'if amali, wa taqabbalhu minni. Rabbi atini fid-dunya hasanatan, wa fil-akhirati hasanatan, wa qini adhaban-nar.",
 maqam:"Usalli salata-t-tawafi rak'atayni lillahi azza wa jall, ada'an mustaqbila-l-ka'bati-l-haram, Allahu akbar.",
 hajar48:"Allahumma thabbitni alal-huda, wa jannibni minad-dalalati war-rada, wa waffiqni lima tuhibbu wa tarda, waj'alni min awliya'ika wa ibadikas-salihin, birahmatika ya arhamar-rahimin.",
 zamWell:"Allahumma innaka azhartaha, wa saqaytaha nabiyyaka Isma'il, rahmatan minka bihi, ya jalilu ya jamil.",
 zamDrink:"Allahumma-j'alhu rizqan wasi'a, wa ilman nafi'a, wa dawa'an najia, min kulli da'in wa suqm, birahmatika ya arhamar-rahimin.",
 saiM:"Allahumma inni nawaytu an as'a baynas-safa wal-marwati sa'ya-l-umrati-l-mufradati sab'ata ashwatin lillahi azza wa jall. Allahumma fa-yassirhu li, wa a'inni alayhi, wa taqabbalhu minni, bismillahi Allahu akbar.",
 saiT:"Allahumma inni nawaytu an as'a baynas-safa wal-marwati sa'yat-tamatti'i bil-umrati ilal-hajji sab'ata ashwatin lillahi azza wa jall. Allahumma fa-yassirhu li, wa a'inni alayhi, wa taqabbalhu minni, bismillahi Allahu akbar.",
 safaRaised:"Alhamdu lillahi-l-mutawahhidi bir-rububiyyah, al-mutafarridi bisultani-l-ilahiyyah, al-mutajabbiri bijabaruti-l-fardaniyyah, al-muta'azzimi bikibriya'i-l-wahdaniyyah, al-mutaraddi bidawami-l-azaliyyah, al-baqi bila nihayah, wal-awwali bighayri ghayah, subhanallahi wa bihamdih, la ilaha illallahu wallahu akbar ala ma hadana.",
 takbir:"Allahu akbar, Allahu akbar, la ilaha illallahu wahdahu la sharika lah. Lahul-mulku wa lahul-hamd, yuhyi wa yumit, wa huwa hayyun la yamut, biyadihil-khayr, wa huwa ala kulli shay'in qadir. La ilaha illallahu wahdah, anjaza wa'dah, wa nasara abdah, wa ghalabal-ahzaba wahdah.",
 safaDua:"Allahumma inni as'alukal-afwa wal-afiyata fid-dunya wal-akhirah. Ya Rabbi as'aluka an tusalliya ala Muhammadin wa ahli baytihit-tayyibin, wa an tuqawwiyani alal-amali bima allamtani min haqqik, wa an tabsuta alayya ma hazarta alayya min rizqik. Wa as'aluka ya Rabbi fid-dunya hasanatan wa fil-akhirati hasanatan, wa as'aluka an taqiyani adhaban-nar. Allahummaj'alna minal-maqbulin, wa la taruddana khazaya wa la nadimin, birahmatika ya arhamar-rahimin.",
 verse:"Innas-safa wal-marwata min sha'a'irillah. Faman hajjal-bayta awi'tamara fala junaha alayhi an yattawwafa bihima. Wa man tatawwa'a khayran fa-innallaha shakirun alim.",
 rabbana:"Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakunanna minal-khasirin. Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana min ladunka rahmah, innaka antal-wahhab.",
 walkDua:"Bismillahi Allahu akbar, wa sallallahu ala Muhammadin wa ahli baytihit-tahirin. Allahummaghfir warham, wa tajawaz amma ta'lam, innaka antal-a'azzul-akram. Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar, birahmatika ya arhamar-rahimin.",
 bism:"Bismillahi Allahu akbar.",
 sirri:"Allahumma innaka ta'lamu sirri wa 'alaniyati, faqbal ma'dhirati, wa ta'lamu hajati, fa-a'tini su'li, wa ta'lamu ma fi nafsi wa ma 'indi faghfir li. Allahumma inni as'aluka imanan yubashiru qalbi, wa yaqinan sadiqan, hatta a'lama annahu lan yusibani illa ma katabta 'alayya.",
 wadaNiy:"Allahumma inni nawaytu an atufa bihadha-l-bayti-l-atiqi tawafa-l-wada'i sab'ata ashwatin lillahi ta'ala. Allahumma fa-yassirhu li, wa a'inni alayhi, wa taqabbalhu minni.",
 wadaMult:"Allahumma inni abduka wabnu abdika wabnu amatik, hamaltani ala dabbatik, wa sayyartani fi biladik, hatta adkhaltani haramak. Allahumma hadha baytuka wa qad halaltu bih, wa rajawtu fi husni zanni bika an taghfira li dhunubi. Wa in kunta qad ghafarta li fa-azdad anni rida, waj'al li indaka zulfa. Wa in kunta lam taghfir li faminal-ana faghfir li min qabli an an'a an baytik. Fa-hadha awanu insirafi, in kunta adhinta li, ghayra raghibin anka wa la an baytik, wa la mustabdilin bika wa la bibaytik. Fahfazni an yamini wa an shimali wa khalfi wa amami hatta tuballighani ahli. Fa-idha anta ballaghtani fa-la tatakhalla minni, wa tawaffani ala ma tawaffayta bihi ibadakas-salihin, fa-innaka awla bidhalika min khalqika wa minni.",
 wadaLast:"Allahumma la taj'alhu akhira ahdi bibaytik.",
 wadaB:"Allahumma inna-l-bayta baytuk, wal-harama haramuk, wa hadha maqamu-l-a'idhi bika minan-nar. Fa-a'idhna ya Rabbi wa aba'ana wa ummahatina wa azwajana wa awladana wa ikhwanana wa akhawatina wa jami'a qarabatina minan-nar birahmatika ya arhamar-rahimin. Allahumma-j'alhu tadarru'an rahimtah, wa amalan qabiltah, wa hajjan barartah, wa du'a'an sami'tah. Allahumma la taj'alhu akhira-l-ahdi min baytikal-haram, alladhi ja'altahu qiblata-l-islam, wa faradta hajjahu ala jami'i-l-anam, wa ja'altahu mathalan li-ali nabiyyikal-kiram, alayhi wa alayhimus-salam.",
 wadaC:"Allahumma salli alas-sabiqi binuri kalimatik, wat-tali birahmatik, wal-hududi allati dallat ala hikmatik. Wa salli ala nabiyyikal-hadi ila jannatik, wa ala ahli baytihit-tahirinal-qa'imina bishari'atik, wa ala mawlana wa sayyidinal-imami amiril-mu'minin, wa aba'ihil-a'immatil-akramin, wa abna'ihil-a'immatit-tayyibin, afdalas-salati wat-taslim. Allahumma la taj'alhu akhiral-ahdi bibaytikal-karim, warzuqna ziyarata qabri nabiyyikar-rahim, wa'simna bil-birri wat-taqwa, wa waffiqna lima tuhibbu wa tarda, wahdina ilat-tariqil-ahda.",
 wadaD:"Allahumma inna likulli atin wa za'irin haqqan ala man atahu wa zarah. Allahumma anta akramu mazur. Allahumma-j'al fa'idatana wa tuhfatana fi ziyaratina wa fadatina, wa fi hajjatina maghfiratadh-dhunubi ya Ghaffar, wa fakaka riqabina minan-nar. Allahumma-shabna fi safarina, wa barik lana fi hadarina, wahfazna fi ahlina, fa-anta khayrun hafizan wa anta arhamur-rahimin. Allahumma lakal-hamdu alal-balaghil-jamil. Allahumma la tasrifna min mawdi'ina hadha illa wa qad ghafarta lana ya arhamar-rahimin.",
 wadaE:"Allahumma la tushmit binal-a'da', wa la taj'alna ma'al-qawmiz-zalimin. Wa hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama. Wasrif anna adhaba jahannam, inna adhabaha kana gharama. Allahumma aqlibnal-yawma ghayra kha'ibina wa la mahsurin ya arhamar-rahimin. Allahumma inna insirafi ghayra raghibin anka wa la mustaghnin anka, fahfazna min bayni aydina wa min khalfina wa an aymanina wa an shama'ilina ya arhamar-rahimin.",
 wadaDoor:"Allahumma aqlibni muflihan munjihan marhuman maghfuran li. Allahumma in amattani faghfir li, wa in ahyaytani farzuqnil-hajja min qabil, wa la taj'alhu akhira ahdi min baytikal-haram.",
 wadaAyibun:"Ayibuna ta'ibuna abiduna in sha'allah, lirabbina hamiduna, rahibuna ilayhi rajiun.",
 wadaAyah:"Innal-ladhi farada alaykal-qur'ana laradduka ila ma'ad.",
 ramalEnd:"Ya dha-l-manni wal-fadli wat-tawli wan-na'ma'i wal-jud. Inna amali da'ifun, fa-da'ifhu li, wa taqabbalhu minni, wa sallallahu ala Muhammadin wa ali Muhammad, kama anta ahluhu wa hum bika ahluh."
};

AR.wadaSal = AR.wadaC + ". " + AR.wadaD + ". " + AR.wadaE;
TR.wadaSal = TR.wadaC + " " + TR.wadaD + " " + TR.wadaE;
function du(key, title, note){ return d(title, AR[key], TR[key], note); }

/* ---------- build the ordered steps for this person ---------- */
function build(s){
  if(MGd()[s.mode]) return buildMadina(s.mode);
  if(s.mode==="daily") return buildDaily(s);
  if(s.mode==="wada") return buildWada(s);
  var M = s.type==="mufrada", F = s.gender==="f";
  var st = [];
  function add(o){ st.push(o); }

  add({phase:0, title:"Prepare at the Miqat",
    lead:"Do this at the Miqat, or before you reach it if that is easier.",
    actions:[
      "Remove hair from underarms and pubic area.",
      "Trim your nails of hands and feet." + (F? "":" Men also trim the moustache hair."),
      "Brush your teeth (use a miswak or toothbrush).",
      "Do not use any perfume or scented product from now on."
    ],
    duas:[],
    notes:[
      "<b>Which Miqat?</b> Madinah side: Masjid al-Shajara. Sham side: Juhfa. Taif side: Qarn. Najd and Iraq side: Aqiq. Yemen, India and Pakistan side: Yalamlam. If you cannot stop at the Miqat, do all of this earlier and put on Ihram when you are level with it.",
      F? "<b>If you are in your period:</b> do every step at the Miqat except the Ihram prayer. Stay in Ihram, wait until you are clean, do ghusl, then enter Masjid al-Haram, do Tawaf and Sa'i, and remove Ihram. If you put on Ihram after your period started, just stay in Ihram and wait until you are clean." : ""
    ]});

  add({phase:1, title:"Ghusl for Ihram",
    lead:"Take a bath with the niyyah below.",
    actions:["Make the niyyah in your heart and say it, then do your ghusl."],
    duas:[du("ghusl","Niyyah for ghusl of Ihram")],
    notes:[]});

  if(!F){
    add({phase:1, title:"Wear the Ihram cloth (men)",
      lead:"Two pieces of white, unstitched cotton.",
      actions:[
        "Tie one piece around your waist like a lungi (about 2.25 to 2.5 metres).",
        "Wrap the second piece over your body, covering whatever part of the body must be covered in Ihram.",
        "No stitched clothes, no coloured cloth, no gloves, and no socks.",
        "Do not cover your head or face from now until you remove Ihram."
      ],
      duas:[],
      notes:["<b>Rules of Ihram (men):</b> no perfume, scented oil, scented soap or kohl, no sunglasses or shade over the head, no hunting, no cutting hair or nails, do not kill any living thing (even lice), no intimate relations, no swearing, boasting or arguing. Be careful when scratching or washing your head so no hair falls and no louse dies. Keep your tongue clean, be patient, be kind to your companions, and keep busy with good talk and the remembrance of Allah."]});
  } else {
    add({phase:1, title:"Wear your Ihram clothes (women)",
      lead:"Plain white cotton clothes.",
      actions:[
        "Wear stitched white cotton clothes, covering the body and the hair.",
        "Keep your face uncovered. If you use a cloth, keep it away from touching your face.",
        "No coloured clothes, no gloves, no socks that cover the feet.",
        "Do not use perfume or scented products."
      ],
      duas:[],
      notes:["<b>Rules of Ihram:</b> no perfume, no cutting hair or nails, do not kill any living thing, no intimate relations, no swearing, boasting or arguing. Keep your tongue clean, be patient and kind, and keep busy with the remembrance of Allah."]});
  }

  add({phase:1, title:"Two rak'at Ihram prayer",
    lead:"Pray at the Miqat, or where you are level with it.",
    actions:[
      "Make the niyyah below and say Allahu akbar.",
      "First rak'at: Al-Hamd, then Surat Quraysh (Li-ilafi Quraysh).",
      "Second rak'at: Al-Hamd, then Surat al-Ikhlas (Qul huwallahu ahad).",
      F? "Women keep the head and hands covered during the prayer and afterwards." : "Keep your head covered while praying. After the salam, uncover your head again."
    ],
    duas:[M? du("ihramPrayM","Niyyah for the Ihram prayer (Umrah Mufrada)") : du("ihramPrayT","Niyyah for the Ihram prayer (Tamattu')")],
    notes:["If you cannot pray the Ihram prayer at the Miqat or opposite it, make only the niyyah of Ihram (men uncover the head) and begin the Talbiyah. Then pray the Ihram prayer at the nearest place to the Miqat, or in the next prayer time."]});

  add({phase:1, title:"Niyyah of Ihram",
    lead:"This is the moment you enter Ihram.",
    actions:[
      "Sit or stand facing the Ka'ba and say the niyyah below.",
      "If you are doing Umrah on behalf of someone else, add their name where the booklet says \"here take the name\" (page 26 and 27 of the booklet).",
      "Next, begin the Talbiyah right away."
    ],
    duas:[M? du("niyM","Niyyah of Ihram (Umrah Mufrada)") : du("niyT","Niyyah of Ihram (Tamattu')")],
    notes:["After the niyyah, the booklet has a longer dua on pages 28 and 29. Read it from the booklet if you wish."]});

  add({phase:1, title:"Talbiyah",
    lead:"Say it in a loud voice (men) or softly (women), as often as you can. At least 70 times is recommended.",
    actions:[
      "Start the Talbiyah right after the niyyah.",
      "Keep saying it in every state, with or without wudu.",
      "Say it also after every prayer, when going up or down, when you meet a group of people, and when you wake up.",
      M? "In Umrah Mufrada, stop saying it when you enter the boundary of the Haram." : "In Tamattu', stop saying it when the Ka'ba comes into view, then say the line given below."
    ],
    duas:[
      du("talbiyah","Talbiyah"),
      du("talbiyah7","Seven extra phrases (you may add these)")
    ].concat(M? [] : [du("stopT","When the Ka'ba comes into view (Tamattu')")]),
    notes:["Travelling from Madinah: start the Talbiyah from the place where you put on Ihram at Masjid al-Shajara."]});

  add({phase:2, title:"Ghusl before entering Makkah",
    lead:"Recommended when you reach Makkah, before Masjid al-Haram.",
    actions:["Keep your belongings safe first, then take a ghusl.","The Haram boundary extends some distance around Makkah. It is recommended to do ghusl before entering it."],
    duas:[
      d("Niyyah for ghusl (Masjid al-Haram)",AR.ghuslHaram,TR.ghuslHaram),
      d("Niyyah for ghusl (entering the Haram)","اللَّهُمَّ إِنِّي أَغْتَسِلُ لِدُخُولِ الْحَرَمِ بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ","Allahumma inni aghtasilu lidukhuli-l-haram, bismillahi Allahu akbar.")
    ],
    notes:[]});

  add({phase:2, title:"Enter Masjid al-Haram",
    lead:"Enter with humility and calm.",
    actions:[
      "Enter walking calmly, with humility and dignity.",
      "Stay in a state of wudu: Tawaf and Sa'i cannot be done without wudu.",
      "When you first see the Ka'ba, stop and say the dua below.",
      "Then walk toward the Black Stone (Hajar al-Aswad), near the Bab Bani Shayba side, stand facing it and say \"Allahu akbar\".",
      "After that, say salawat on the Prophet and his family and ask forgiveness (the booklet has this dua on pages 34 to 36)."
    ],
    duas:[du("seeKaba","When you first see the Ka'ba")],
    notes:["The longer dua on entering is in the booklet on pages 34 to 36. You can read it from there before starting Tawaf."]});

  add({phase:3, title:"Start Tawaf: Black Stone (Hajar al-Aswad) and niyyah",
    lead:"Seven rounds around the Ka'ba, keeping the Ka'ba on your left.",
    actions:[
      "Stand near the Black Stone (Hajar al-Aswad), raise both hands and say the first dua.",
      "Face the Black Stone (Hajar al-Aswad) and say the second dua.",
      "Kiss the Black Stone (Hajar al-Aswad) and say the third dua. If the crowd is too heavy, touch it with your hand and wipe your face, or just point to it from afar.",
      "Walk a little toward the Yamani corner (Rukn al-Yamani) until you cannot see the door of the Ka'ba, then stand with the Ka'ba on your left.",
      "Make the niyyah of Tawaf."
    ].concat(F? [] : ["Men: for the first three rounds, uncover the right shoulder."]),
    duas:[
      du("hajarStart","At the Black Stone (Hajar al-Aswad), hands raised"),
      du("hajarFace","Facing the Black Stone (Hajar al-Aswad)"),
      du("hajarTouch1","While kissing or touching the Black Stone (Hajar al-Aswad)"),
      M? du("tawM","Tawaf niyyah (Umrah Mufrada)") : du("tawT","Tawaf niyyah (Tamattu')")
    ].concat(tawNiyAll()),
    notes:["<b>Which niyyah?</b> Use the first niyyah for your Umrah Tawaf. The Tahiyya and Tatawwu' niyyahs are for those separate tawafs, for yourself or on behalf of someone. After the niyyah, begin the Tawaf keeping the Ka'ba on your left.","Women should not push in the crowd to kiss the Black Stone (Hajar al-Aswad), and it was not obligatory for women. Men should not crowd with women."]});

  for(var r=1;r<=7;r++){ add(roundStep(r,M,F)); }

  add({phase:3, title:"After the seventh round",
    lead:"Complete the Tawaf with these duas.",
    actions:[
      "At the Black Stone (Hajar al-Aswad), finish the seventh round with the dua below.",
      "Go to the Multazam, between the Black Stone (Hajar al-Aswad) and the door of the Ka'ba. Place both hands and your chest, belly and cheek against the wall of the Ka'ba and say the dua.",
      "Cry and plead (tadarru') as you make your own duas, remember your sins and ask forgiveness.",
      "Then at the Black Stone (Hajar al-Aswad), kiss or touch it and say the dua given in the booklet on page 45, then the dua below."
    ],
    duas:[
      du("qanni","At the Black Stone (Hajar al-Aswad) after the 7th round"),
      du("multazam","At the Multazam"),
      du("hajar48","At the Black Stone (Hajar al-Aswad), after the Multazam")
    ],
    notes:["The dua at the Black Stone (Hajar al-Aswad) on page 45 of the booklet begins \"Allahumma innaka ta'lamu sirri wa 'alaniyati...\". Read it from the booklet."]});

  add({phase:3, title:"Two rak'at behind Maqam Ibrahim",
    lead:"The prayer of Tawaf.",
    actions:[
      "Go to Maqam Ibrahim and pray two rak'at facing the Ka'ba.",
      "First rak'at: Al-Hamd, then Surat al-Kafirun.",
      "Second rak'at: Al-Hamd, then Surat al-Ikhlas.",
      "After the salam, make dua for yourself, your parents, and the believing men and women."
    ],
    duas:[du("maqam","Niyyah for the Tawaf prayer")],
    notes:["After the prayer, the booklet has a dua on pages 46 and 47 (begins \"Allahumma innaka qulta wa qawluka-l-haqq...\"). Read it from the booklet."]});

  add({phase:3, title:"Zamzam",
    lead:"Go to the Zamzam well or look at its water, then drink.",
    actions:[
      "Go toward the Zamzam well, or see the Zamzam water, and say the first dua.",
      "Drink Zamzam water and say the second dua.",
      "Pour some water over your body.",
      "Do not use Zamzam water for wudu out of habit. It may be used for wudu only when necessary."
    ],
    duas:[
      du("zamWell","When you see the Zamzam well"),
      du("zamDrink","While drinking Zamzam")
    ],
    notes:[]});

  add({phase:4, title:"Start Sa'i at Safa",
    lead:"Seven legs between Safa and Marwa. You start at Safa and finish at Marwa.",
    actions:[
      "Leave Masjid al-Haram through Bab al-Safa (the booklet says to use the last arch on your left as you go out), and walk to the hill of Safa.",
      "Go up the little hill of Safa and stand facing the Ka'ba (the Black Stone (Hajar al-Aswad) side).",
      "Make the niyyah of Sa'i.",
      "Raise your hands and say the first dua, then recite Al-Hamd, Qul a'udhu birabbin-nas, Qul a'udhu birabbil-falaq, Qul huwallahu ahad, and Ayat al-Kursi.",
      "Then say the takbir dua three times, and finally the last dua."
    ],
    duas:[
      M? du("saiM","Niyyah of Sa'i (Umrah Mufrada)") : du("saiT","Niyyah of Sa'i (Tamattu')"),
      du("safaRaised","On Safa, hands raised"),
      du("takbir","Takbir dua (say 3 times)"),
      du("safaDua","Dua on Safa")
    ],
    notes:["The booklet has Ayat al-Kursi in full on pages 52 and 53."]});

  for(var k=1;k<=7;k++){ add(saiStep(k,M,F)); }

  add({phase:5, title: M? "Halq or Taqsir (Umrah Mufrada)" : "Taqsir (Tamattu')",
    lead:"This is how you come out of Ihram.",
    actions: M? (F? [
      "Cut a little hair from the end of your braid (about a fingertip's length).",
      "Trim your nails.",
      "Now you can take off Ihram."
    ] : [
      "Shave your head. If you cannot, cut a little hair from the head.",
      "Trim the moustache.",
      "Take a little hair from the sides of the beard (not from the base of the beard).",
      "Trim your nails.",
      "Now you can take off Ihram and wear normal clothes."
    ]) : (F? [
      "Cut a little hair from the end of your braid (about a fingertip's length).",
      "Trim a few nails, and leave a little for Hajj.",
      "Now you can take off Ihram."
    ] : [
      "Do not shave your head. Use a blade to take a little from the right or left side of the head, or cut a little hair from the head.",
      "Trim a little moustache hair.",
      "Take a little hair from the sides of the beard (not from the base of the beard).",
      "Trim a few nails and leave a few for Hajj.",
      "Now you can take off Ihram."
    ]),
    duas:[],
    notes: M? [
      "After taking off Ihram you may wear stitched clothes and cover your head, and everything that was forbidden in Ihram is allowed again."
    ] : [
      "After taking off Ihram you may wear stitched clothes and cover your head.",
      "<b>Until Hajj:</b> for the days of Hajj that remain, stay in Makkah in the manner of a muhrim (shabiha bil-muhrim). Do not wear a shirt. You may wear the lower and inner cloth (such as an izar) and a cap on the head. Do not go outside the Haram boundary."
    ]});

  add({phase:5, title:"Your Umrah is complete",
    lead:"May Allah accept it from you.",
    actions:[
      "Spend your days in Makkah in worship. A prayer in Masjid al-Haram carries a great reward.",
      "Looking at the Ka'ba is itself worship. Sitting there and reciting the Quran carries a great reward.",
      "In Makkah always pray the full prayer. Never shorten it.",
      "Remain humble and thankful, and remember the friends of Allah."
    ],
    duas:[], notes:[], finish:true});

  return st;
}

/* ---------- Daily Tawaf (Tahiyya and Tatawwu') from the Mansak ---------- */
var PHASES_D = ["Prepare","Niyyah","Tawaf","Prayer","Finish"];
var PHASES_W = ["Niyyah","Multazam","Duas","Zamzam","Leaving"];

function tawNiyAr(K, who){
  return "اللَّهُمَّ إِنِّي نَوَيْتُ أَنْ أَطُوفَ بِهَذَا الْبَيْتِ الْعَتِيقِ طَوَافَ " + K + (who? " عَنْ ـــــــــــ" : "") + " سَبْعَةَ أَشْوَاطٍ لِلَّهِ عَزَّ وَجَلَّ. اللَّهُمَّ فَيَسِّرْهُ لِي وَأَعِنِّي عَلَيْهِ وَتَقَبَّلْهُ مِنِّي، بِسْمِ اللَّهِ اللَّهُ أَكْبَرُ";
}
function tawNiyTr(k, who){
  return "Allahumma inni nawaytu an atufa bihadha-l-bayti-l-atiqi tawafa-t-" + k + (who? " an ________" : "") + " sab'ata ashwatin lillahi azza wa jall. Allahumma fa-yassirhu li, wa a'inni alayhi, wa taqabbalhu minni, bismillahi Allahu akbar.";
}
function tawNiyAll(){
  var behalf = "Say the name of the person where the line has a blank.";
  return [
    d("Tahiyya Tawaf, for yourself (printed page 7)", tawNiyAr("التَّحِيَّةِ",false), tawNiyTr("tahiyyati",false)),
    d("Tahiyya Tawaf, on behalf of Du'at Kiram or Hudud Azam (printed page 7)", tawNiyAr("التَّحِيَّةِ",true), tawNiyTr("tahiyyati",true), behalf),
    d("Tatawwu' Tawaf, for yourself (printed page 8)", tawNiyAr("التَّطَوُّعِ",false), tawNiyTr("tatawwu'i",false)),
    d("Tatawwu' Tawaf, on behalf of Du'at Kiram, Hudud Azam or a believer (printed page 8)", tawNiyAr("التَّطَوُّعِ",true), tawNiyTr("tatawwu'i",true), behalf)
  ];
}

/* Booklet page numbers are the page numbers shown in the PDF viewer (printed page = viewer page + 4). */
var SETS = {
  "1": {rounds:["14","16","19","22","24","26","29"], mizab:"32", mustajar:"32", multazam:"33 to 34"},
  "2": {rounds:["35","38","40","42","44","47","49"], mizab:"51", mustajar:"52", multazam:"52 to 54"},
  "3": {rounds:["62","62 to 63","63","64","66","69","71"], mizab:"73", mustajar:"74 to 77", multazam:"77 to 79"}
};
function bk(x){
  var parts = String(x).split(" to ");
  var pr = parts.map(function(n){ return (+n)+4; }).join(" to ");
  return (parts.length>1? "pages " : "page ") + x + " in the viewer (printed " + pr + ")";
}

function buildDaily(s){
  var st = [];
  var style = s.dstyle || "corner";
  var setNo = style.indexOf("set")===0 ? style.charAt(3) : null;
  function add(o){ st.push(o); }

  add({phase:0, title:"Before you start Tawaf",
    lead:"Daily Tawaf has two kinds: Tahiyya Tawaf and Tatawwu' Tawaf.",
    actions:[
      "Be in wudu. Tawaf cannot be done without wudu.",
      "Enter Masjid al-Haram. When you first see the Ka'ba, stop and say the dua below.",
      "On entering Masjid al-Haram, the first tawaf you do is the Tahiyya Tawaf. After that you may do Tatawwu' Tawaf, as many as you wish.",
      setNo? "This guide is set to Ad'iyat al-Tawaf, Set " + setNo + ". You will say a short dua at the Black Stone (Hajar al-Aswad), and read this set's dua for each round from the booklet." : "This guide is set to the corner duas (booklet pages 9 to 14). They are written in full in each round."
    ],
    duas:[du("seeKaba","When you see the Ka'ba")],
    notes:[
      "<b>Gifting the reward:</b> the Tahiyya Tawaf can be gifted only to the Du'at Mutlaqin and the Hudud Fudala. The Tatawwu' Tawaf can also be gifted to believers (booklet page 6).",
      "You can change the set of duas from the start screen."
    ]});

  add({phase:1, title:"Niyyah of Tawaf",
    lead:"Choose the niyyah for the tawaf you are about to do.",
    actions:[
      "Walk from the Black Stone (Hajar al-Aswad) a little toward the Yamani corner (Rukn al-Yamani), to the place where you can no longer see the door of the Ka'ba.",
      "Stand there with the Ka'ba on your left.",
      "Say the niyyah that matches your tawaf: Tahiyya or Tatawwu', for yourself or on behalf of someone.",
      "After the niyyah, begin the tawaf with the Ka'ba on your left."
    ],
    duas:tawNiyAll(),
    notes:["Say the niyyah that fits. If you do both Tahiyya and Tatawwu', repeat this step with the second niyyah before the next tawaf."]});

  for(var r=1;r<=7;r++){ add(dailyRound(r, style, setNo)); }

  if(!setNo){
    add({phase:2, title:"After the seventh round",
      lead:"Finish the tawaf with these duas.",
      actions:[
        "At the Black Stone (Hajar al-Aswad), finish the seventh round: kiss it, touch it, or point to it, and say the first dua.",
        "Go to the Multazam, between the Black Stone (Hajar al-Aswad) and the door of the Ka'ba. Place your hands, chest, belly and cheek on the wall of the Ka'ba and say the dua.",
        "Cry and plead as you make your own duas. Remember your sins and ask forgiveness from Allah.",
        "Then ask for whatever you need.",
        "At the Black Stone (Hajar al-Aswad) again, kiss it or touch it, and say the last dua (booklet page 14)."
      ],
      duas:[
        du("qanni","At the Black Stone (Hajar al-Aswad) after the 7th round"),
        du("multazam","At the Multazam"),
        du("sirri","At the Black Stone (Hajar al-Aswad), last dua")
      ],
      notes:[]});
  } else {
    var S3 = SETS[setNo];
    add({phase:2, title:"After the seventh round",
      lead:"Finish the tawaf at the Multazam.",
      actions:[
        "When the seventh round is complete, go to the Multazam, between the Black Stone (Hajar al-Aswad) and the door of the Ka'ba.",
        "Read the Multazam dua of Set " + setNo + " from the booklet: " + bk(S3.multazam) + ".",
        "Cry and plead as you make your own duas and ask forgiveness from Allah."
      ],
      duas:[],
      notes:["If you did not finish the Mizab and Mustajar duas in the 7th round, they are on " + bk(S3.mizab) + " and " + bk(S3.mustajar) + "."]});
  }

  add({phase:3, title:"Two rak'at of Tawaf prayer",
    lead:"Pray behind Maqam Ibrahim if you can.",
    actions:[
      "Pray two rak'at of Tawaf, behind Maqam Ibrahim if you can. If you cannot, pray anywhere in Masjid al-Haram.",
      "Make the niyyah below and say Allahu akbar.",
      "First rak'at: Al-Hamd, then Surat al-Ikhlas (Qul huwallahu ahad).",
      "Second rak'at: Al-Hamd, then Surat al-Kafirun (Qul ya ayyuhal-kafirun)."
    ],
    duas:[du("maqam","Niyyah for the Tawaf prayer")],
    notes:[
      "For Tahiyya and Tatawwu' Tawaf, these two rak'at are prayed at a time when prayer is allowed. The two rak'at of an obligatory tawaf can be prayed at any time (booklet page 15).",
      "Check this rule against pages 15 and 16 of your booklet."
    ]});

  add({phase:4, title:"Your Tawaf is complete",
    lead:"May Allah accept it from you.",
    actions:[
      "If it is not a time of prayer, you may do more tawafs. Finish all seven rounds of one tawaf before you start the next.",
      "Between tawafs, do dhikr, tasbih and dua as much as you can.",
      "Pray the two rak'at for each tawaf you have done, at a prayer time in Masjid al-Haram (booklet page 16)."
    ],
    duas:[], notes:[], finish:true});

  return st;
}

function buildWada(s){
  var d = buildDaily(s), w = buildWadaOnly(s), off = PHASES_D.length;
  var lastD = d[d.length-1]; lastD.finish = false;
  lastD.notes = (lastD.notes||[]).concat(["Next: the Wada' Tawaf (farewell) duas continue in the steps that follow."]);
  w.forEach(function(x){ x.phase += off; });
  return d.concat(w);
}
/* ---------- Farewell (Wada') Tawaf: only what is on booklet pages 108 to 114 (viewer pages 104 to 110) ---------- */
function buildWadaOnly(s){
  var st = [];
  function add(o){ st.push(o); }
  add({phase:0, title:"Niyyah of the Wada' Tawaf",
    lead:"The farewell tawaf when you leave Makkah.",
    actions:[
      "When you are leaving Makkah, come to Masjid al-Haram.",
      "First do the Tahiyya Tawaf. Then, if you wish, do the Tatawwu' Tawaf. Do the Wada' Tawaf last.",
      "Make the niyyah of the Wada' Tawaf with the dua below."
    ],
    duas:[du("wadaNiy","Niyyah of the Wada' Tawaf")],
    notes:["Booklet page 108 (printed), page 104 in the viewer."]});
  add({phase:1, title:"At the Multazam",
    lead:"When you say farewell to the Bayt Allah.",
    actions:[
      "Place your hands on the Multazam and read the first dua.",
      "Then cling to the Bayt Allah and say the second dua."
    ],
    duas:[du("wadaMult","Farewell dua at the Multazam"), du("wadaLast","Clinging to the Bayt Allah")],
    notes:["Booklet pages 108 and 109 (printed), pages 104 and 105 in the viewer."]});
  add({phase:2, title:"Farewell duas",
    lead:"Say the first dua, then read the second.",
    actions:["Say the first dua below.","Then read the second dua below."],
    duas:[du("wadaB","Then say"), du("wadaSal","Then read")],
    notes:["Booklet pages 110 to 112 (printed), pages 106 to 108 in the viewer."]});
  add({phase:3, title:"Zamzam",
    lead:"Go toward Zamzam.",
    actions:[
      "Go toward Zamzam and drink the water.",
      "Sprinkle a little of the water on your body.",
      "Ask Allah for whatever you wish."
    ],
    duas:[],
    notes:["Booklet pages 112 and 113 (printed), pages 108 and 109 in the viewer."]});
  add({phase:4, title:"At the door of the mosque",
    lead:"Stand at the door of Masjid al-Haram.",
    actions:[
      "Stand at the door of the mosque and turn toward the Bayt Allah al-Haram.",
      "Look at the Bayt Allah with eyes full of tears.",
      "Raise both hands toward the sky and read the first dua below.",
      "Then say the second dua.",
      "Then recite the verse."
    ],
    duas:[du("wadaDoor","Hands raised, read"), du("wadaAyibun","Then say"), du("wadaAyah","Then recite the verse")],
    notes:["Booklet page 113 (printed), page 109 in the viewer."]});
  add({phase:4, title:"Leaving Makkah",
    lead:"The last instructions in the booklet.",
    actions:[
      "When you leave Makkah al-Mukarramah, give sadaqa according to your means.",
      "Leave Makkah with sakina (calm) and waqar (dignity).",
      "Do not be in a hurry to leave."
    ],
    duas:[],
    notes:["Booklet page 114 (printed), page 110 in the viewer."]});
  add({phase:4, title:"Your farewell is complete",
    lead:"May Allah accept it and bring you back.",
    actions:[], duas:[], notes:[], finish:true});
  return st;
}

function dailyRound(r, style, setNo){
  var acts = [
    "Start at the Black Stone (Hajar al-Aswad): kiss it, touch it, or point to it, and say the first dua.",
    "Walk around the Ka'ba with the Ka'ba on your left. Go outside Hijr Ismail, never through it."
  ];
  var duas = [du("roundStart","At the Black Stone (Hajar al-Aswad)")];
  var notes = [];

  if(!setNo){
    acts.push("Say each dua below when you reach that spot.");
    duas.push(du("bab","Facing the door of the Ka'ba"));
    duas.push(du("iraqi","At the Iraqi corner (Rukn al-Iraqi)"));
    duas.push(du("mizab","Under the Mizab (rain spout)"));
    duas.push(du("shami","At the Shami corner (Rukn al-Shami)"));
    if(r===7) duas.push(du("mustajar","At the Mustajar (7th round only)","Mustajar is on the back wall, opposite the door. In the 7th round, place both hands and your chest, belly and cheek on the wall and say this dua. Then cry and plead as you ask forgiveness for your sins."));
    duas.push(du("yamani","At the Yamani corner (Rukn al-Yamani)","Touch it if you can; if not, keep walking."));
    duas.push(du("between","Between the Yamani corner (Rukn al-Yamani) and the Black Stone (Hajar al-Aswad)"));
    if(r===1) notes.push("These are the same duas in every round (booklet pages 9 to 12). Each round starts and ends at the Black Stone (Hajar al-Aswad).");
  } else {
    var S3 = SETS[setNo];
    var startPg = S3.rounds[r-1];
    acts.push("At the Yamani corner (Rukn al-Yamani), kiss or touch it and say Bismillah Allahu akbar.");
    acts.push("Then read the dua of Set " + setNo + ", round " + r + ", from the booklet while you walk. It starts on " + bk(startPg) + " and runs until the next round heading.");
    acts.push("Finish this round's dua before the round ends.");
    duas.push(du("bism","At the Yamani corner (Rukn al-Yamani)"));
    if(r===7){
      acts.push("In the 7th round, also read the Mizab dua from " + bk(S3.mizab) + ", and the Mustajar dua from " + bk(S3.mustajar) + ". At the Mustajar, place your hands, chest and cheek on the wall of the Ka'ba.");
    }
    if(r===1) notes.push("<b>How the sets work:</b> Syedna Taher Saifuddin composed 3 sets of 7 duas for Tawaf, one dua for each round. Use one set for each tawaf (booklet page 17). Page numbers here are the numbers shown in the PDF viewer. If a round heading is on the next page, follow the heading in the booklet.");
  }
  if(r<7) acts.push("Back at the Black Stone (Hajar al-Aswad), round " + r + " is complete.");
  else acts.push("When you reach the Black Stone (Hajar al-Aswad), round 7 is complete. The next step has the closing duas.");
  return {phase:2, title:"Round " + r + " of 7", round:r, total:7, lead: r===1? "Begin your first round." : "Begin round " + r + ".", actions:acts, duas:duas, notes:notes};
}

function roundStep(r,M,F){
  var acts = [
    "Start at the Black Stone (Hajar al-Aswad): kiss it, touch it, or point to it, and say the first dua.",
    "Walk around the Ka'ba with the Ka'ba on your left. Go outside Hijr Ismail, never through it. The closer to the Ka'ba you are, the better, if it is not crowded."
  ];
  if(!F){
    if(r<=3) acts.push("Men: walk briskly (ramal) from the Black Stone (Hajar al-Aswad) to the Yamani corner (Rukn al-Yamani), and walk calmly from the Yamani corner (Rukn al-Yamani) back to the Black Stone (Hajar al-Aswad).");
    else acts.push("Men: walk at a normal, calm pace. Ramal is only for the first three rounds.");
  } else acts.push("Women: walk at a normal pace. Women do not do ramal.");
  acts.push("Say each dua below when you reach that spot.");

  var duas = [
    du("roundStart","Start: at the Black Stone (Hajar al-Aswad)"),
    du("bab","Facing the door of the Ka'ba"),
    du("iraqi","At the Iraqi corner (Rukn al-Iraqi)"),
    du("mizab","Under the Mizab (rain spout)"),
    du("shami","At the Shami corner (Rukn al-Shami)")
  ];
  if(r===7) duas.push(du("mustajar","At the Mustajar (7th round only)","Mustajar is on the back wall, opposite the door. In the 7th round, place both hands and your chest, belly and cheek on the wall here and say this dua. Then cry and plead as you ask forgiveness for your sins."));
  duas.push(du("yamani","At the Yamani corner (Rukn al-Yamani)","Touch it if you can; if not, keep walking."));
  duas.push(du("between","Between the Yamani corner (Rukn al-Yamani) and the Black Stone (Hajar al-Aswad)"));
  if(r<7) acts.push("Back at the Black Stone (Hajar al-Aswad), round " + r + " is complete.");
  else acts.push("When you reach the Black Stone (Hajar al-Aswad), round 7 is complete. The next step has the closing duas.");

  return {phase:3, title:"Round " + r + " of 7", round:r, total:7, lead: r===1? "Begin your first round." : "Begin round " + r + ".", actions:acts, duas:duas, notes:[]};
}

function saiStep(k,M,F){
  var fromSafa = (k%2===1);
  var from = fromSafa? "Safa":"Marwa", to = fromSafa? "Marwa":"Safa";
  var acts = [
    "Walk from " + from + " to " + to + " with calm and dignity.",
    "While walking, recite the verse, the dua, and the Quranic duas below (the booklet has more on pages 55 and 56)."
  ];
  if(!F) acts.push("Men: when you reach the section marked by green lights, walk briskly (ramal) until the end of that section. Walk normally outside it.");
  else acts.push("Women: walk at a normal pace. Women do not do ramal in Sa'i.");
  acts.push("At the end of the brisk section, raise both hands and say the dua given below.");
  acts.push("On reaching " + to + ", climb a little, face the Ka'ba and say the takbir dua. Then make your own duas.");
  if(k===7) acts.push("This is the last leg. You finish at Marwa, so Sa'i is complete.");
  else acts.push("When you are done, start the next leg from " + to + ".");

  var duas = [
    du("verse","Verse to recite on the way"),
    du("rabbana","Quranic dua while walking"),
    du("walkDua","Dua while walking"),
    du("ramalEnd","At the end of the running section (hands raised)"),
    du("takbir","On reaching " + to + " (say 3 times)")
  ];
  var notes = [];
  if(k===1) notes.push("Between Safa and Marwa you may also recite Surat al-Muzzammil, al-Ma'arij, al-Saff, al-Duha, al-Inshirah, al-Qadr, Ya-Sin and Ayat al-Kursi, whichever you can, plus the Tahajjud dua and the Asma al-Husna.");
  return {phase:4, title:"Leg " + k + " of 7: " + from + " to " + to, round:k, total:7, lead:"From " + from + " to " + to + ".", actions:acts, duas:duas, notes:notes};
}

/* ---------- audio: your own recordings, or this device's voice ---------- */
if(!S.rate) S.rate=1;
var RATES=[0.6,0.8,1,1.25,1.5,2];
function rateName(){ return (+S.rate)+"\u00d7"; }
function nextRate(){ var i=RATES.indexOf(S.rate); S.rate = i<0 ? 1 : RATES[(i+1)%RATES.length]; save(); if(curAudio){ try{ curAudio.playbackRate=S.rate; }catch(e){} } return S.rate; }
var curAudio=null, curUrl=null, tok=0, recMap={}, DB=null;
function hashKey(str){ var h=5381; for(var i=0;i<str.length;i++){ h=((h<<5)+h+str.charCodeAt(i))|0; } return "r"+(h>>>0).toString(36); }
function openDB(cb){
  if(DB) return cb(DB);
  try{
    var q=indexedDB.open("umrah-guide-audio",1);
    q.onupgradeneeded=function(){ q.result.createObjectStore("rec"); };
    q.onsuccess=function(){ DB=q.result; cb(DB); };
    q.onerror=function(){ cb(null); };
  }catch(e){ cb(null); }
}
function getRec(key,cb){ openDB(function(db){ if(!db) return cb(null); try{ var r=db.transaction("rec").objectStore("rec").get(key); r.onsuccess=function(){ cb(r.result||null); }; r.onerror=function(){ cb(null); }; }catch(e){ cb(null); } }); }
function putRec(key,blob,cb){ openDB(function(db){ if(!db) return cb(false); try{ var t=db.transaction("rec","readwrite"); t.objectStore("rec").put(blob,key); t.oncomplete=function(){ cb(true); }; t.onerror=function(){ cb(false); }; }catch(e){ cb(false); } }); }
function delRec(key,cb){ openDB(function(db){ if(!db) return cb(); try{ var t=db.transaction("rec","readwrite"); t.objectStore("rec").delete(key); t.oncomplete=function(){ cb(); }; t.onerror=function(){ cb(); }; }catch(e){ cb(); } }); }

function stopAll(){
  tok++;
  try{ if(window.speechSynthesis) speechSynthesis.cancel(); }catch(e){}
  if(curAudio){ try{ curAudio.pause(); }catch(e){} curAudio=null; }
  if(curUrl){ try{ URL.revokeObjectURL(curUrl); }catch(e){} curUrl=null; }
  document.querySelectorAll(".seg.on").forEach(function(e){ e.classList.remove("on"); });
  document.querySelectorAll(".play.on,.listenall.on").forEach(function(b){
    b.classList.remove("on"); b.innerHTML = b.classList.contains("listenall") ? "&#9654; "+(b.getAttribute("data-label")||"Listen") : "&#9654; Listen";
  });
}
function pickVoice(){
  try{ var vs=speechSynthesis.getVoices()||[]; for(var i=0;i<vs.length;i++){ if(/^ar/i.test(vs[i].lang)) return vs[i]; } }catch(e){}
  return null;
}
/* phrases: the text is cut at each "*" (and line breaks) so the phrase being read can be highlighted */
function segSplit(t){
  var segs=[], cur="", i, c;
  for(i=0;i<t.length;i++){
    c=t.charAt(i);
    if(c==="\n"){ if(cur.trim()) segs.push({t:cur.trim(),sep:"\n"}); else if(segs.length) segs[segs.length-1].sep="\n"; cur=""; }
    else { cur+=c; if(c==="*"){ segs.push({t:cur.trim(),sep:" "}); cur=""; } }
  }
  if(cur.trim()) segs.push({t:cur.trim(),sep:""});
  var out=[];
  segs.forEach(function(s){
    var x=s.t;
    while(x.length>190){ var k=x.lastIndexOf(" ",170); if(k<40) k=170; out.push({t:x.slice(0,k).trim(),sep:" "}); x=x.slice(k).trim(); }
    out.push({t:x,sep:s.sep});
  });
  return out;
}
function segHTML(text,isTr){
  return segSplit(text).map(function(s,k){ return '<span class="seg" data-s="'+k+'">'+(isTr?esc(s.t):s.t)+'</span>'+s.sep; }).join("");
}
/* Each phrase is cut into lines of at most 6 words. The same lines are used for the Arabic and the Latin, so the highlight
   follows the line being read. */
var MAXW=6;
function wordsOf(t){ return t.split(/\s+/).filter(function(w){ return w; }); }
function sizesFor(len){ var k=Math.ceil(len/MAXW), base=Math.floor(len/k), extra=len%k, out=[], i; for(i=0;i<k;i++) out.push(base+(i<extra?1:0)); return out; }
function arParts(text){
  var out=[], pid=0;
  segSplit(text).forEach(function(s){
    var w=wordsOf(s.t), star=false;
    if(w.length && w[w.length-1]==="*"){ w.pop(); star=true; }
    else if(w.length && /\*$/.test(w[w.length-1])){ w[w.length-1]=w[w.length-1].slice(0,-1); star=true; }
    if(!w.length){ pid++; return; }
    var sizes=sizesFor(w.length), p=0;
    sizes.forEach(function(sz,ix){
      var last=(ix===sizes.length-1), part=w.slice(p,p+sz); p+=sz;
      out.push({t:part.join(" ")+(last&&star?" *":""), n:sz, words:part, sep:(last? s.sep : " "), ph:pid});
    });
    pid++;
  });
  return out;
}
function segHTMLAr(text){
  return arParts(text).map(function(p,k){ return '<span class="seg" data-s="'+k+'">'+p.t+'</span>'+p.sep; }).join("");
}
function segHTMLTr(ar,tr){
  var P=arParts(ar); if(!P.length) return segHTML(tr,true);
  var PA=segSplit(ar), PL=segSplit(tr), res=[], i;
  function toks(t){ return wordsOf(t.replace(/\s+\*/g,"*")); }
  function alloc(tokens,idxs){
    var tot=0, cum=0, from=0, m=tokens.length;
    idxs.forEach(function(ix){ tot+=P[ix].n; });
    idxs.forEach(function(ix,ii){ cum+=P[ix].n; var to=(ii===idxs.length-1)? m : Math.round(m*cum/tot); res[ix]=tokens.slice(from,to); from=to; });
  }
  if(PA.length===PL.length){
    var byPh={}; P.forEach(function(p,ix){ (byPh[p.ph]=byPh[p.ph]||[]).push(ix); });
    Object.keys(byPh).forEach(function(ph){ alloc(toks(PL[+ph].t), byPh[ph]); });
  } else {
    alloc(toks(tr), P.map(function(p,ix){ return ix; }));
  }
  return P.map(function(p,k){
    var t=(res[k]||[]).map(function(w){ var st=/\*$/.test(w); return esc(st? w.slice(0,-1) : w)+(st?" *":""); }).join(" ");
    return '<span class="seg" data-s="'+k+'">'+t+'</span>'+p.sep;
  }).join("");
}
function unitsOf(text){
  var units=[], cur=null;
  arParts(text).forEach(function(p,k){
    if(cur && cur.n<3 && cur.n+p.n<=10){ cur.text+=" "+p.words.join(" "); cur.n+=p.n; cur.to=k; }
    else { cur={text:p.words.join(" "),n:p.n,from:k,to:k}; units.push(cur); }
  });
  return units;
}
/* plays one dua: your recording if you added one, else the device voice. done() on end, fail(msg) on problems, hl(from,to) as each phrase starts. */
function playDua(x, done, fail, hl){
  var my=tok, rec=recMap[hashKey(x.ar)];
  if(rec){
    try{
      curUrl=URL.createObjectURL(rec);
      var a=new Audio(curUrl); curAudio=a; a.playbackRate=S.rate;
      a.onended=function(){ if(my===tok) done(); };
      a.onerror=function(){ if(my===tok) fail("This recording could not be played."); };
      var p=a.play(); if(p && p.catch) p.catch(function(){ if(my===tok) fail("Could not play the recording. Tap Listen again."); });
    }catch(e){ fail("Could not play the recording."); }
    return;
  }
  if(!window.speechSynthesis || !window.SpeechSynthesisUtterance){ fail("This browser cannot read aloud. Open the file in Chrome or Safari, or use Add recording."); return; }
  var list=unitsOf(x.ar), idx=0, started=false;
  function next(){
    if(my!==tok) return;
    if(idx>=list.length){ if(hl) hl(-1,-1); done(); return; }
    var un=list[idx++];
    var u=new SpeechSynthesisUtterance(un.text.replace(/ـ+/g," "));
    u.lang="ar-SA"; u.rate=S.rate;
    var v=pickVoice(); if(v) u.voice=v;
    u.onstart=function(){ started=true; if(hl && my===tok) hl(un.from,un.to); };
    u.onend=next;
    u.onerror=function(e){ if(my!==tok) return; if(e && (e.error==="canceled"||e.error==="interrupted")) return; fail("Could not read aloud on this device. Install an Arabic voice in your phone settings, or use Add recording."); };
    if(hl && my===tok) hl(un.from,un.to);
    speechSynthesis.speak(u);
  }
  try{ if(speechSynthesis.speaking||speechSynthesis.pending) speechSynthesis.cancel(); }catch(e){}
  next();
  setTimeout(function(){ if(!started && my===tok){ fail("No sound started. Your phone may not have an Arabic voice. Install Arabic text-to-speech voice data in settings, or use Add recording."); } }, 3000);
}

function hlFor(i){
  var arts=document.querySelectorAll("article.dua"), art=arts[i]; if(!art) return null;
  var A=art.querySelectorAll(".ar .seg"), L=art.querySelectorAll(".tr .seg");
  return function(from,to){
    art.querySelectorAll(".seg.on").forEach(function(e){ e.classList.remove("on"); });
    if(from<0) return;
    var latin = !document.body.classList.contains("no-tr") && L.length>0;   // the text on top is the one that is highlighted
    var P = latin ? L : A, first=null;
    for(var k=from;k<=to;k++){
      var j = latin ? (L.length===A.length ? k : Math.round(k*(L.length-1)/Math.max(1,A.length-1))) : k;
      if(P[j]){ P[j].classList.add("on"); if(!first) first=P[j]; }
    }
    if(first){ var r=first.getBoundingClientRect(); var hb=(document.querySelector("header.top")||{}).offsetHeight||110;
      if(r.top<hb+20||r.bottom>window.innerHeight-170){ try{ first.scrollIntoView({block:"center",behavior:"smooth"}); }catch(e){} } }
  };
}
function wireSpeed(){
  document.querySelectorAll(".speedbtn").forEach(function(b){
    b.onclick=function(){ nextRate(); document.querySelectorAll(".speedbtn").forEach(function(x){ x.textContent = x.getAttribute("data-short") ? rateName() : "Speed "+rateName(); }); };
  });
}
function wireAudio(st){
  st.duas.forEach(function(x){
    var k=hashKey(x.ar); if(!(k in recMap)){ recMap[k]=null; getRec(k,function(b){ recMap[k]=b; refreshTags(st); }); }
  });
  function refreshTags(st2){
    document.querySelectorAll(".audio").forEach(function(box){
      var x=st2.duas[+box.getAttribute("data-i")]; if(!x) return;
      var has=!!recMap[hashKey(x.ar)];
      box.querySelector(".rm").hidden=!has; box.querySelector(".tag").hidden=!has;
    });
  }
  refreshTags(st);
  document.querySelectorAll(".audio").forEach(function(box){
    var i=+box.getAttribute("data-i"), x=st.duas[i], key=hashKey(x.ar);
    var play=box.querySelector(".play"), file=box.querySelector("input"), rm=box.querySelector(".rm");
    var msg=box.parentNode.querySelector(".amsg");
    function show(m){ msg.textContent=m||""; msg.hidden=!m; }
    play.onclick=function(){
      if(play.classList.contains("on")){ stopAll(); return; }
      stopAll(); show("");
      play.classList.add("on"); play.innerHTML="&#9632; Stop";
      function end(){ play.classList.remove("on"); play.innerHTML="&#9654; Listen"; }
      playDua(x, end, function(m){ end(); show(m); }, hlFor(i));
    };
    file.onchange=function(){
      var f=file.files&&file.files[0]; if(!f) return;
      putRec(key,f,function(ok){
        if(ok){ recMap[key]=f; refreshTags(st); show("Saved on this device. Tap Listen to play your recording."); }
        else show("Could not save the recording on this device.");
      });
      file.value="";
    };
    rm.onclick=function(){ delRec(key,function(){ recMap[key]=null; refreshTags(st); show("Recording removed."); }); };
  });
}

var PHASES = ["Miqat","Ihram","Makkah","Tawaf","Sa'i","Halq"];
PHASES = ["Miqat and Ihram","Ihram and Talbiyah","Enter Makkah","Tawaf","Sa'i","Finish"];
function PH(){ var g=MGd()[S.mode]; if(g) return g.phases; return S.mode==="daily"? PHASES_D : (S.mode==="wada"? PHASES_D.concat(PHASES_W.map(function(n){ return "Wada' "+n; })) : PHASES); }

/* ---------- rendering ---------- */
var app = document.getElementById("app");
var steps = [];

function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

function applyPrefs(){
  document.body.classList.toggle("no-tr", !S.tr);
  document.documentElement.style.setProperty("--fs", S.fs);
  if(S.theme) document.documentElement.setAttribute("data-theme", S.theme);
  else document.documentElement.removeAttribute("data-theme");
}

function renderMakkahHome(){
  var wada = S.mode==="wada";
  var daily = S.mode==="daily" || wada;
  function radio(name,val,cur,title,small){
    return '<label><input type="radio" name="'+name+'" value="'+val+'"'+(cur===val?' checked':'')+'><b>'+title+'</b><small>'+small+'</small></label>';
  }
  var h = '<div class="wrap home">'+'<p class="backrow"><button class="chip" id="mk-back">&#8249; Makkah and Madina</button></p>'+
    '<p class="mark" lang="ar" dir="rtl">'+(wada?'طواف الوداع':(daily?'الطواف':'العمرة'))+'</p>'+
    '<h1>'+(wada?'Farewell Tawaf step by step':(daily?'Daily Tawaf step by step':'Umrah step by step'))+'</h1>'+
    '<p class="sub">'+(wada?'Do the rounds of the tawaf like the Daily Tawaf, then continue with the Wada\' farewell duas before you leave Makkah. Based on the Mansak for Makkah that you shared.':daily?'Tahiyya and Tatawwu\' Tawaf. Do each round, read the dua, then tap done to move on. Based on the Mansak for Makkah that you shared.':'Follow each stage in order. Do the actions, read the dua, then tap done to move on. Based on the Umrah booklet you shared.')+'</p>'+
    '<fieldset><legend>What would you like to do?</legend><div class="opt">'+
      radio("mode","umrah",S.mode,"Umrah only","The full Umrah: Ihram, Tawaf, Sa\'i and coming out of Ihram.")+
      radio("mode","daily",S.mode,"Daily Tawaf","Tahiyya or Tatawwu\' Tawaf around the Ka\'ba, with the Tawaf prayer.")+
      radio("mode","wada",S.mode,"Farewell Tawaf (Wada\')","The last tawaf before you leave Makkah, with the farewell duas.")+
    '</div></fieldset>';
  if(!daily){
    h += '<fieldset><legend>Type of Umrah</legend><div class="opt">'+
      radio("type","mufrada",S.type,"Umrah Mufrada","Umrah on its own. You come out of Ihram at the end.")+
      radio("type","tamattu",S.type,"Umrah of Tamattu\' (with Hajj)","Umrah before Hajj. Includes the rules for staying in Makkah.")+
    '</div></fieldset>'+
    '<fieldset><legend>You are</legend><div class="opt">'+
      radio("gender","m",S.gender,"A man","Ihram cloth, ramal, and head rules for men.")+
      radio("gender","f",S.gender,"A woman","Ihram clothes and rules for women.")+
    '</div></fieldset>';
  } else {
    h += '<fieldset><legend>Duas during the rounds</legend><div class="opt">'+
      radio("dstyle","corner",S.dstyle,"Corner duas (pages 9 to 14)","Short duas at each spot of the Ka\'ba, the same in every round. Written in full here.")+
      radio("dstyle","set1",S.dstyle,"Ad\'iyat al-Tawaf, Set 1","Syedna Taher Saifuddin\'s duas, one for each round. You read them from the booklet.")+
      radio("dstyle","set2",S.dstyle,"Ad\'iyat al-Tawaf, Set 2","The second set of seven duas. You read them from the booklet.")+
      radio("dstyle","set3",S.dstyle,"Ad\'iyat al-Tawaf, Set 3","The third set of seven duas. You read them from the booklet.")+
    '</div></fieldset>';
  }
  h += '<button class="btn" id="start">Start</button>'+
    ((S.iBy && S.iBy[S.mode]>0) ? '<button class="btn ghost" id="resume" style="margin-top:10px">Resume where I left off</button>' : '')+
    '<p class="fine">Always check the Arabic against your booklet. The Latin letters are only to help you read quickly. Your progress is saved on this device. &copy; All rights reserved. Please do not copy, change or republish this guide without permission.</p>'+
  '</div>';
  app.innerHTML = h;
  document.getElementById("mk-back").onclick=function(){ renderHome(); };

  function pick(name,cur){ var e=document.querySelector('input[name="'+name+'"]:checked'); return e? e.value : cur; }
  function readChoices(){
    S.type = pick("type",S.type); S.gender = pick("gender",S.gender); S.dstyle = pick("dstyle",S.dstyle);
  }
  document.querySelectorAll('input[name="mode"]').forEach(function(el){
    el.onchange=function(){ readChoices(); S.mode=el.value; S.i=(S.iBy&&S.iBy[S.mode])||0; save(); renderMakkahHome(); };
  });
  document.getElementById("start").onclick=function(){
    readChoices(); S.mode = pick("mode",S.mode);
    S.i=0; S.started=true; save(); steps=build(S); renderStep();
  };
  var rs=document.getElementById("resume");
  if(rs) rs.onclick=function(){
    readChoices(); S.mode = pick("mode",S.mode);
    S.i = (S.iBy && S.iBy[S.mode]) || 0;
    S.started=true; steps=build(S); if(S.i>=steps.length) S.i=0; save(); renderStep();
  };
}

function headerHTML(st){
  var segs="";
  for(var p=0;p<PH().length;p++){
    segs += '<span class="'+(p<st.phase?'done':'')+'"><i style="'+(p===st.phase?'transform:scaleX('+phaseFrac(st)+')':'')+'"></i></span>';
  }
  return '<header class="top"><div class="wrap">'+
    '<div class="top-row"><span class="brand">'+(MGd()[S.mode]?MGd()[S.mode].brand:(S.mode==="daily"?"Daily Tawaf":(S.mode==="wada"?"Farewell Tawaf":"Umrah Guide")))+'</span><span class="tools">'+
      '<button class="chip" id="b-tr" aria-pressed="'+(S.tr?'true':'false')+'">Latin</button>'+
      '<button class="chip" id="b-sm" aria-label="Smaller text">A−</button>'+
      '<button class="chip" id="b-lg" aria-label="Larger text">A+</button>'+
      (st.duas&&st.duas.length? '<button class="chip speedbtn" id="speedBtn" data-short="1" aria-label="Reading speed, tap to change">'+rateName()+'</button>' : '')+'<button class="chip" id="b-list">Steps</button>'+
    '</span></div>'+
    '<div class="phases" aria-hidden="true">'+segs+'</div>'+
    '<div class="phase-label"><span>'+PH()[st.phase]+(st.round? ' &middot; '+roundNoun(st)+' '+st.round+' of '+st.total : '')+'</span><span>Step '+(S.i+1)+' of '+steps.length+'</span></div>'+
  '</div></header>';
}
function phaseFrac(st){
  var idx=[],first=-1,last=-1;
  for(var j=0;j<steps.length;j++){ if(steps[j].phase===st.phase){ if(first<0) first=j; last=j; } }
  return (S.i-first+1)/(last-first+1);
}

function roundNoun(st){ return st.roundLabel ? st.roundLabel : (st.title.indexOf("Leg")===0 ? "Leg" : "Round"); }
function roundGroup(i){
  var t=steps[i].total, from=i, to=i;
  while(from>0 && steps[from-1].round && steps[from-1].total===t) from--;
  while(to<steps.length-1 && steps[to+1].round && steps[to+1].total===t) to++;
  return {from:from,to:to};
}
function wireRounds(){
  document.querySelectorAll(".rpick button").forEach(function(b){
    b.onclick=function(){ var j=parseInt(b.getAttribute("data-j"),10); if(j<0) return; stopAll(); S.i=j; save(); renderStep(); };
  });
}
var DONE={}, lockFn=null;
/* The Next/Done button stays locked until you have scrolled to the end of the step, so a stray tap cannot skip a step or round. */
function lockNext(){
  if(lockFn){ window.removeEventListener("scroll",lockFn); window.removeEventListener("resize",lockFn); lockFn=null; }
  var b=document.getElementById("next"); if(!b) return;
  var normal=b.textContent;
  function setLock(on){ b.disabled=on; b.classList.toggle("locked",on); b.textContent=on? "Scroll to the end to continue" : normal; b.setAttribute("aria-disabled",on?"true":"false"); }
  if((DONE[S.mode]||0)>S.i){ setLock(false); return; }
  function atEnd(){ var de=document.documentElement; return (window.innerHeight+(window.pageYOffset||window.scrollY||0))>=de.scrollHeight-30; }
  function check(){ if(atEnd()){ setLock(false); window.removeEventListener("scroll",check); window.removeEventListener("resize",check); if(lockFn===check) lockFn=null; } }
  setLock(true);
  lockFn=check; window.addEventListener("scroll",check,{passive:true}); window.addEventListener("resize",check);
  [120,400,900,1800].forEach(function(t){ setTimeout(function(){ if(lockFn===check) check(); },t); });
}
function renderStep(){
  stopAll();
  var st = steps[S.i];
  var h = headerHTML(st);
  var body = '<main><div class="wrap">';
  if(st.finish){
    body += '<div class="finish"><p class="mark" lang="ar" dir="rtl">تَقَبَّلَ اللَّهُ</p><h1 class="t">'+esc(st.title)+'</h1><p class="lead">'+esc(st.lead)+'</p></div>';
  } else {
    body += '<p class="eyebrow">'+PH()[st.phase]+'</p><h1 class="t">'+esc(st.title)+'</h1><p class="lead">'+esc(st.lead)+'</p>';
  }
  if(st.round){
    var rg=roundGroup(S.i), rtab='';
    for(var q=1;q<=st.total;q++){
      var ri=-1; for(var jj=rg.from;jj<=rg.to;jj++){ if(steps[jj].round===q){ ri=jj; break; } }
      rtab += '<button class="'+(q<st.round?'on':(q===st.round?'now':''))+'" data-j="'+ri+'"'+(ri<0?' disabled':'')+' aria-label="Go to '+roundNoun(st).toLowerCase()+' '+q+'"'+(q===st.round?' aria-current="true"':'')+'>'+q+'</button>';
    }
    body += '<div class="rpick" role="group" aria-label="Choose a '+roundNoun(st).toLowerCase()+'">'+rtab+'</div>';
    body += '<p class="rcap">'+roundNoun(st)+' '+st.round+' of '+st.total+(st.round>1?' &middot; '+(st.round-1)+' done':'')+' &middot; tap a number to repeat or skip to it</p>';
  }
  if(st.actions.length){
    body += '<h2 class="s">What to do</h2><ol class="do">'+st.actions.map(function(a){return '<li>'+esc(a)+'</li>';}).join("")+'</ol>';
  }
  if(st.duas.length){
    body += '<div class="dhead"><h2 class="s">Dua to read</h2></div>';
    st.duas.forEach(function(x,di){
      body += '<article class="dua"><h3>'+esc(x.title)+'</h3><p class="ar" lang="ar" dir="rtl">'+segHTMLAr(x.ar)+'</p><p class="tr" lang="en">'+segHTMLTr(x.ar,x.tr)+'</p>'+(x.note?'<p class="dnote">'+esc(x.note)+'</p>':'')+
      '<div class="audio" data-i="'+di+'"><button class="chip play" aria-label="Listen to this dua">&#9654; Listen</button>'+
      '<label class="chip">Add recording<input type="file" accept="audio/*" hidden></label>'+
      '<button class="chip rm" hidden>Remove mine</button><span class="tag" hidden>Your recording</span></div><p class="amsg" hidden></p></article>';
    });
  }
  var ns = st.notes.filter(Boolean);
  if(ns.length){
    body += '<h2 class="s">Good to know</h2>' + ns.map(function(n){return '<div class="note">'+n+'</div>';}).join("");
  }
  body += '</div></main>';

  var last = S.i===steps.length-1;
  var label = last? "Start over" : (st.round? (st.round===st.total? "Done. Next step" : (st.roundLabel? "Station done. Next" : "Round done. Next")) : "Done. Next step");
  if(st.round && S.type && st.title.indexOf("Leg")===0) label = st.round===st.total? "Sa'i complete. Next" : "Leg done. Next";
  var hasSp = !!(st.duas && st.duas.length);
  var bar = '<footer class="bar"><div class="wrap'+(hasSp?' has-speed':'')+'">'+
    '<button class="btn ghost" id="back"'+(S.i===0?' disabled style="opacity:.4"':'')+'>Back</button>'+(hasSp?'<button class="chip speedbtn" aria-label="Reading speed">Speed '+rateName()+'</button>':'')+
    '<button class="btn" id="next">'+label+'</button></div></footer>';

  app.innerHTML = h + body + bar;
  window.scrollTo(0,0);
  wireAudio(st);
  wireSpeed();
  wireRounds();
  lockNext();

  document.getElementById("next").onclick=function(){
    DONE[S.mode]=Math.max(DONE[S.mode]||0,S.i+1);
    if(last){ S.started=false; S.i=0; save(); if(MGd()[S.mode]) renderMadina(); else renderMakkahHome(); return; }
    S.i++; save(); renderStep();
  };
  document.getElementById("back").onclick=function(){ if(S.i>0){ S.i--; save(); renderStep(); } };
  document.getElementById("b-tr").onclick=function(){ S.tr=!S.tr; save(); applyPrefs(); this.setAttribute("aria-pressed", S.tr?"true":"false"); };
  document.getElementById("b-sm").onclick=function(){ S.fs=Math.max(.8, +(S.fs-.1).toFixed(2)); save(); applyPrefs(); };
  document.getElementById("b-lg").onclick=function(){ S.fs=Math.min(1.8, +(S.fs+.1).toFixed(2)); save(); applyPrefs(); };
  document.getElementById("b-list").onclick=openList;
}

function openList(){
  var panel=document.getElementById("panel"), html='<h2>All steps</h2><ul class="list">', cur=-1;
  steps.forEach(function(s,j){
    if(s.phase!==cur){ cur=s.phase; html+='<li class="grp">'+PH()[cur]+'</li>'; }
    html+='<li><button data-j="'+j+'" class="'+(j<S.i?'past':'')+'"'+(j===S.i?' aria-current="step"':'')+'>'+(j<S.i?'✓ ':'')+esc(s.title)+'</button></li>';
  });
  html+='</ul><div style="display:grid;gap:8px;margin-top:14px">'+
    '<button class="btn ghost" id="speed">Audio speed: '+rateName()+'</button>'+
    '<button class="btn ghost" id="theme">Switch light or dark</button>'+
    '<button class="btn ghost" id="restart">Back to start screen</button>'+
    '<button class="btn" id="closeSheet">Close</button></div>';
  panel.innerHTML=html;
  var sh=document.getElementById("sheet"); sh.classList.add("open");
  panel.querySelectorAll("[data-j]").forEach(function(b){
    b.onclick=function(){ S.i=+b.getAttribute("data-j"); save(); sh.classList.remove("open"); renderStep(); };
  });
  document.getElementById("closeSheet").onclick=function(){ sh.classList.remove("open"); };
  document.getElementById("restart").onclick=function(){ sh.classList.remove("open"); renderHome(); };
  document.getElementById("speed").onclick=function(){
    nextRate(); this.textContent="Audio speed: "+rateName();
  };
  document.getElementById("theme").onclick=function(){
    var dark = document.documentElement.getAttribute("data-theme")==="dark" ||
      (!document.documentElement.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    S.theme = dark? "light":"dark"; save(); applyPrefs();
  };
  var cur2 = panel.querySelector('[aria-current="step"]'); if(cur2) cur2.scrollIntoView({block:"center"});
}
document.getElementById("sheet").addEventListener("click",function(e){ if(e.target===this) this.classList.remove("open"); });
document.addEventListener("keydown",function(e){ if(e.key==="Escape") document.getElementById("sheet").classList.remove("open"); });


/* ---------- Madina guides: same step-by-step engine as Makkah ---------- */
var MGc=null;
function MGd(){ if(!MGc){ try{ MGc=JSON.parse(document.getElementById("madina-data").textContent); }catch(e){ MGc={}; } } return MGc; }
function buildMadina(id){
  return MGd()[id].steps.map(function(x){ var o={phase:x.phase,title:x.title,lead:x.lead||"",actions:x.actions||[],duas:x.duas||[],notes:x.notes||[],finish:!!x.finish}; if(x.round){ o.round=x.round; o.total=x.total; o.roundLabel=x.roundLabel; } return o; });
}
var MORDER=["nabawi","baqi","mosques","juhfa"];
function renderHome(){
  stopAll();
  app.innerHTML='<div class="wrap home">'+
    '<p class="mark" lang="ar" dir="rtl">مكة والمدينة</p>'+
    '<h1>Makkah and Madina</h1>'+
    '<p class="sub">Choose where you are. Everything works offline.</p>'+
    '<button class="secard" id="go-makkah"><span class="ar2" lang="ar" dir="rtl">مكة</span><b>Makkah</b><small>Umrah, daily Tawaf and the farewell Tawaf, step by step with the duas.</small></button>'+
    '<button class="secard" id="go-madina"><span class="ar2" lang="ar" dir="rtl">المدينة</span><b>Madina</b><small>Masjid-un-Nabawi, Jannat al-Baqi, the mosques of Madinah and Uhud, and Juhfa and Masjid Shajarah. Step by step with the duas.</small></button>'+
    '<p class="fine">Always check the Arabic against your booklet. The Latin letters are only to help you read quickly. Your progress is saved on this device. &copy; All rights reserved. Please do not copy, change or republish this guide without permission.</p>'+
  '</div>';
  document.getElementById("go-makkah").onclick=function(){
    if(["umrah","daily","wada"].indexOf(S.mode)<0){ S.mode="umrah"; }
    S.i=(S.iBy&&S.iBy[S.mode])||0;
    renderMakkahHome();
  };
  document.getElementById("go-madina").onclick=function(){ renderMadina(); };
}
function renderMadina(){
  stopAll();
  var G=MGd();
  app.innerHTML='<div class="wrap home">'+
    '<p class="backrow"><button class="chip" id="md-back">&#8249; Makkah and Madina</button></p>'+
    '<p class="mark" lang="ar" dir="rtl">المدينة المنورة</p>'+
    '<h1>Madina</h1>'+
    '<p class="sub">Pick a guide. Each one takes you step by step. Tap Steps inside a guide to jump to any step.</p>'+
    MORDER.map(function(id){ var g=G[id]; if(!g) return ""; var n=g.steps.length, at=(S.iBy&&S.iBy[id])||0;
      return '<button class="bkcard" data-g="'+id+'"><b>'+esc(g.title)+'</b><small>'+esc(g.sub)+'</small><small>'+n+' steps &middot; <span class="go">'+(at>0&&at<n?'Continue at step '+(at+1):'Start')+'</span></small></button>'; }).join("")+
  '</div>';
  document.getElementById("md-back").onclick=function(){ renderHome(); };
  document.querySelectorAll(".bkcard").forEach(function(c){ c.onclick=function(){
    var id=c.getAttribute("data-g"); S.mode=id; S.i=(S.iBy&&S.iBy[id])||0; S.started=true;
    steps=build(S); if(S.i>=steps.length) S.i=0; save(); renderStep();
  }; });
}

/* ---------- start ---------- */
applyPrefs();
renderHome();
})();