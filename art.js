/* Ghost Buster GO — character art engine.
   Cel-shaded, animated, original ghost characters as inline SVG.
   window.ghostSVG(speciesObj, sizePx) -> svg string. */
(function(){
"use strict";
let UID=0;

const PAL={
  blinky:{base:"#9fd9ff",shade:"#6cb4e8",light:"#e2f4ff",line:"#27537a",hair:"#4a90c2",iris:"#2b6ea8"},
  snacker:{base:"#b9f0a1",shade:"#8ad174",light:"#e4ffd3",line:"#3f7a33",hair:"#79c55f",iris:"#3f7a33"},
  grumble:{base:"#aab1dd",shade:"#8089c4",light:"#dde1f5",line:"#3a4178",hair:"#5d66a8",iris:"#3a4178"},
  zappy:{base:"#ffe28a",shade:"#f0c35a",light:"#fff6d2",line:"#8a6a1f",hair:"#f0b429",iris:"#9a7318"},
  fog:{base:"#cfc8ec",shade:"#a99fd6",light:"#f0ecfb",line:"#4e4486",hair:"#f5f2ff",iris:"#4e4486"},
  shiver:{base:"#c9b8f0",shade:"#a48cdf",light:"#eae2fa",line:"#4c3684",hair:"#7e63c9",iris:"#5a3f9e"},
  myrtle:{base:"#f7c3da",shade:"#e394bb",light:"#fde9f2",line:"#8a3f63",hair:"#cfcfe0",iris:"#7a4a8a"},
  fang:{base:"#d6dcec",shade:"#aab4cf",light:"#f0f3fa",line:"#39415e",hair:"#23263a",iris:"#b03548"},
  bones:{base:"#f2efe4",shade:"#d4cfba",light:"#fffdf4",line:"#5a5544",hair:"#ffffff",iris:"#1a1430"},
  wrap:{base:"#eadfc2",shade:"#cbbd99",light:"#f8f2e2",line:"#6e6244",hair:"#f5ecd4",iris:"#c08a2a"},
  hexa:{base:"#cda4e8",shade:"#a97cd1",light:"#ecdcf8",line:"#5a3580",hair:"#e8853a",iris:"#6a3f9e"},
  gloom:{base:"#9ef2d8",shade:"#5ed0ae",light:"#e0fff5",line:"#1d6e55",hair:"#2e8f71",iris:"#135c46"}
};

/* body silhouette: dome head flowing into a three-wave skirt; A/B morph for tail motion */
const BODY_A="M60 10 C38 10 25 29 25 52 C25 68 27 82 24 96 C21 107 27 117 36 114 C43 112 44 103 50 104 C57 105 55 117 64 117 C73 117 71 105 78 104 C84 103 85 112 92 114 C99 116 103 106 99 96 C94 83 95 68 95 52 C95 29 82 10 60 10 Z";
const BODY_B="M60 10 C38 10 25 29 25 52 C25 68 27 82 26 96 C24 108 30 115 37 112 C44 109 43 101 50 102 C57 103 56 114 64 114 C73 114 70 103 77 102 C84 101 84 110 91 113 C98 115 101 105 98 96 C94 83 95 68 95 52 C95 29 82 10 60 10 Z";
const SHADE="M60 10 C82 10 95 29 95 52 C95 68 94 83 99 96 C102 105 99 112 93 114 C95 104 91 95 89 86 C85 74 86 60 85 48 C83 30 74 16 60 10 Z";

function eye(cx,cy,s,iris,line,lid){
  // s = scale (1 = standard). Blinks via vertical squash.
  const rx=6.4*s, ry=7.4*s;
  return `<g transform="translate(${cx} ${cy})"><g>
    <animateTransform attributeName="transform" type="scale" values="1 1;1 1;1 .08;1 1;1 1" keyTimes="0;.455;.5;.545;1" dur="3.8s" repeatCount="indefinite"/>
    <ellipse rx="${rx}" ry="${ry}" fill="#fff" stroke="${line}" stroke-width="1.6"/>
    <circle cx="${0.6*s}" cy="${1*s}" r="${3.6*s}" fill="${iris}"/>
    <circle cx="${0.6*s}" cy="${1*s}" r="${1.7*s}" fill="#1a1430"/>
    <circle cx="${-0.9*s}" cy="${-1.2*s}" r="${1.3*s}" fill="#fff"/>
    <circle cx="${2.1*s}" cy="${2.2*s}" r="${0.7*s}" fill="#ffffffcc"/>
  </g></g>`;
}
function blush(cx,cy,c){return `<ellipse cx="${cx}" cy="${cy}" rx="4.6" ry="2.8" fill="${c}" opacity=".55"/>`;}
function arm(d,P,extra){return `<path d="${d}" fill="${P.base}" stroke="${P.line}" stroke-width="2.8" stroke-linejoin="round"${extra||""}/>`;}
function sway(id,deg,dur){return `<animateTransform attributeName="transform" type="rotate" values="${-deg} 60 24;${deg} 60 24;${-deg} 60 24" dur="${dur}s" repeatCount="indefinite"/>`;}

const FACES={
blinky(P){return `
  <path d="M34 26 Q44 14 60 16 Q52 20 50 27 Q44 22 34 26 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M60 16 Q74 14 84 25 Q74 22 68 26 Q66 19 60 16 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.4" stroke-linejoin="round"/>
  ${eye(46,46,1.05,P.iris,P.line)}${eye(74,46,1.05,P.iris,P.line)}
  <path d="M42 34 Q46 31.5 50 34" stroke="${P.line}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M70 34 Q74 31.5 78 34" stroke="${P.line}" stroke-width="2" fill="none" stroke-linecap="round"/>
  ${blush(38,58,"#ff9fb0")}${blush(82,58,"#ff9fb0")}
  <ellipse cx="60" cy="63" rx="4.6" ry="5.6" fill="#5a2a3a" stroke="${P.line}" stroke-width="1.8">
    <animate attributeName="ry" values="4.6;6;4.6" dur="1.6s" repeatCount="indefinite"/></ellipse>
  <ellipse cx="60" cy="65.6" rx="2.4" ry="2" fill="#ff8ba0"/>
  ${arm("M30 62 Q38 74 50 76 Q54 77 54 81 Q53 85 48 84 Q34 80 27 69 Q26 64 30 62 Z",P)}
  ${arm("M90 62 Q82 74 70 76 Q66 77 66 81 Q67 85 72 84 Q86 80 93 69 Q94 64 90 62 Z",P)}
  <ellipse cx="55" cy="81" rx="5.4" ry="4.6" fill="${P.light}" stroke="${P.line}" stroke-width="2.4"/>
  <ellipse cx="65" cy="81" rx="5.4" ry="4.6" fill="${P.light}" stroke="${P.line}" stroke-width="2.4"/>`;},
snacker(P){return `
  <path d="M42 17 Q50 12 58 16 Q54 19 54 23 Q48 18 42 17 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.2" stroke-linejoin="round"/>
  ${eye(45,45,1,P.iris,P.line)}${eye(73,45,1,P.iris,P.line)}
  <path d="M40 33 Q45 30 50 33" stroke="${P.line}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M68 33 Q73 30 78 33" stroke="${P.line}" stroke-width="2" fill="none" stroke-linecap="round"/>
  ${blush(37,56,"#ffb08a")}${blush(81,56,"#ffb08a")}
  <path d="M46 58 Q59 72 72 58 Q66 64 59 64 Q52 64 46 58 Z" fill="#5a2a3a" stroke="${P.line}" stroke-width="2"/>
  <path d="M53 63 Q59 68 65 63 Q62 66 59 66 Q56 66 53 63 Z" fill="#ff8ba0"/>
  ${arm("M30 60 Q36 72 46 76 Q50 78 49 82 Q47 86 42 84 Q30 78 26 66 Q26 61 30 60 Z",P)}
  ${arm("M90 58 Q88 68 80 72 Q76 74 77 78 Q79 82 84 80 Q93 74 95 63 Q94 58 90 58 Z",P)}
  <g transform="rotate(-18 82 76)">
    <path d="M70 74 Q82 64 94 74 Q88 82 82 82 Q76 82 70 74 Z" fill="#e8a24b" stroke="#9a6420" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M75 72 L78 79 M81 70 L83 80 M87 72 L86 79" stroke="#9a6420" stroke-width="1.6" stroke-linecap="round"/>
  </g>
  <circle cx="68" cy="88" r="1.6" fill="#9a6420"/><circle cx="60" cy="92" r="1.3" fill="#9a6420"/>`;},
grumble(P){return `
  <path d="M30 28 Q32 14 46 12 Q56 10 64 13 Q78 12 88 24 Q90 28 86 30 L78 26 L70 30 L60 25 L50 30 L40 25 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.4" stroke-linejoin="round"/>
  ${eye(46,46,0.95,P.iris,P.line)}${eye(74,46,0.95,P.iris,P.line)}
  <path d="M38 34 L52 39" stroke="${P.line}" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M82 34 L68 39" stroke="${P.line}" stroke-width="3.4" stroke-linecap="round"/>
  <path d="M50 60 Q60 53 70 60" stroke="${P.line}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M28 72 Q40 82 56 83 L56 90 Q38 90 26 80 Q25 74 28 72 Z" fill="${P.base}" stroke="${P.line}" stroke-width="2.8" stroke-linejoin="round"/>
  <path d="M92 72 Q80 82 64 83 L64 90 Q82 90 94 80 Q95 74 92 72 Z" fill="${P.shade}" stroke="${P.line}" stroke-width="2.8" stroke-linejoin="round"/>
  <path d="M74 10 l-4 8 h5.5 l-5 9" stroke="#ffb64d" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <animate attributeName="opacity" values="1;.2;1" dur="1.4s" repeatCount="indefinite"/></path>`;},
zappy(P){return `
  <path d="M34 26 L40 10 L46 22 L54 6 L60 20 L68 8 L72 22 L82 14 L84 28 Q72 18 60 20 Q46 20 34 26 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.4" stroke-linejoin="round"/>
  ${eye(45,46,1.08,P.iris,P.line)}${eye(75,46,1.08,P.iris,P.line)}
  <path d="M39 33 Q45 29 51 32" stroke="${P.line}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M69 32 Q75 29 81 33" stroke="${P.line}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M44 59 Q60 76 76 59 Q68 67 60 67 Q52 67 44 59 Z" fill="#5a2a3a" stroke="${P.line}" stroke-width="2.2"/>
  <path d="M47 60 L73 60 L70 63.5 L50 63.5 Z" fill="#fff"/>
  ${arm("M28 58 Q22 66 24 76 Q25 80 29 79 Q33 77 32 72 Q31 65 34 60 Q32 56 28 58 Z",P)}
  ${arm("M92 58 Q98 66 96 76 Q95 80 91 79 Q87 77 88 72 Q89 65 86 60 Q88 56 92 58 Z",P)}
  <g><animate attributeName="opacity" values="1;.15;1;.6;1" dur=".8s" repeatCount="indefinite"/>
    <path d="M18 44 l3 0 M19.5 42.5 l0 3" stroke="#ffb64d" stroke-width="2" stroke-linecap="round"/>
    <path d="M100 38 l4 0 M102 36 l0 4" stroke="#ffb64d" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M102 70 l3 0 M103.5 68.5 l0 3" stroke="#ffb64d" stroke-width="2" stroke-linecap="round"/>
  </g>`;},
fog(P){return `
  <path d="M28 34 Q24 24 32 22 Q30 30 34 34 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
  <path d="M92 34 Q96 24 88 22 Q90 30 86 34 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
  ${eye(46,45,0.92,P.iris,P.line)}${eye(74,45,0.92,P.iris,P.line)}
  <circle cx="74" cy="45" r="10.6" fill="none" stroke="#d9a43b" stroke-width="2.6"/>
  <path d="M83 52 Q88 58 86 66" stroke="#d9a43b" stroke-width="1.8" fill="none"/>
  <path d="M40 34 Q46 32 51 35" stroke="${P.line}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M69 33 Q75 31 81 34" stroke="${P.line}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M44 60 Q52 54 60 60 Q68 54 76 60 Q70 66 60 64 Q50 66 44 60 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M52 70 L60 75 L68 70 L64 79 L56 79 Z" fill="#7a5fc0" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
  ${arm("M30 64 Q34 76 44 80 Q48 82 47 86 Q45 90 40 88 Q28 82 25 69 Q26 64 30 64 Z",P)}
  <g transform="rotate(8 82 82)">
    <rect x="72" y="74" width="20" height="15" rx="2" fill="#8a5a3a" stroke="${P.line}" stroke-width="2.2"/>
    <line x1="82" y1="74" x2="82" y2="89" stroke="#e8d9b8" stroke-width="2.4"/>
  </g>
  ${arm("M90 62 Q92 70 88 76 Q85 80 88 83 Q92 85 95 80 Q99 71 96 63 Q93 59 90 62 Z",P)}`;},
shiver(P){return `
  <path d="M26 52 Q20 30 36 18 Q50 8 64 14 Q80 18 88 32 Q94 44 92 58 Q88 44 80 38 Q84 52 80 64 Q78 48 68 40 Q58 34 46 38 Q36 42 34 56 Q30 68 32 80 Q24 68 26 52 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.6" stroke-linejoin="round"/>
  ${eye(48,47,1,P.iris,P.line)}${eye(74,47,1,P.iris,P.line)}
  <path d="M40 38 L44 35 M43 41 L48 37" stroke="${P.line}" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M82 38 L78 35 M79 41 L74 37" stroke="${P.line}" stroke-width="1.6" stroke-linecap="round"/>
  ${blush(41,58,"#e8a0c8")}${blush(81,58,"#e8a0c8")}
  <path d="M52 61 Q61 68 70 61" stroke="#6a2a50" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="61" cy="72" r="2.4" fill="#ffd9ec" stroke="${P.line}" stroke-width="1.4"/>
  ${arm("M88 60 Q96 54 100 46 Q102 42 98 40 Q94 39 92 43 Q88 50 82 54 Q80 59 84 61 Q86 62 88 60 Z",P)}
  <ellipse cx="100" cy="42" rx="4.8" ry="4" fill="${P.light}" stroke="${P.line}" stroke-width="2.2"/>
  <g><animate attributeName="opacity" values=".9;.2;.9" dur="2.2s" repeatCount="indefinite"/>
    <circle cx="104" cy="32" r="1.6" fill="#cfe9ff"/><circle cx="109" cy="38" r="1.2" fill="#cfe9ff"/><circle cx="100" cy="26" r="1.1" fill="#cfe9ff"/></g>
  ${arm("M32 62 Q28 72 30 82 Q31 86 35 85 Q39 83 38 78 Q37 70 40 64 Q38 59 32 62 Z",P)}`;},
myrtle(P){return `
  <path d="M36 26 Q34 12 48 12 Q44 18 48 22 Q52 12 64 12 Q74 12 76 20 Q80 14 88 20 Q92 26 86 30 Q74 20 60 22 Q46 22 36 26 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.4" stroke-linejoin="round"/>
  <circle cx="74" cy="12" r="7" fill="${P.hair}" stroke="${P.line}" stroke-width="2.2"/>
  ${eye(47,46,0.92,P.iris,P.line)}${eye(73,46,0.92,P.iris,P.line)}
  <circle cx="47" cy="46" r="9.6" fill="none" stroke="#8a5a3a" stroke-width="2.2"/>
  <circle cx="73" cy="46" r="9.6" fill="none" stroke="#8a5a3a" stroke-width="2.2"/>
  <line x1="56.5" y1="45" x2="63.5" y2="45" stroke="#8a5a3a" stroke-width="2.2"/>
  ${blush(39,58,"#f598b4")}${blush(81,58,"#f598b4")}
  <path d="M50 62 Q60 70 70 62" stroke="#8a3a56" stroke-width="2.8" fill="none" stroke-linecap="round"/>
  <path d="M30 76 Q45 70 60 70 Q75 70 90 76 L87 84 Q74 78 60 78 Q46 78 33 84 Z" fill="#c76a94" stroke="${P.line}" stroke-width="2.4" stroke-linejoin="round"/>
  ${arm("M32 74 Q36 84 46 88 L50 82 Q42 79 38 72 Q34 70 32 74 Z",P)}
  ${arm("M88 74 Q84 84 74 88 L70 82 Q78 79 82 72 Q86 70 88 74 Z",P)}
  <g>
    <path d="M48 86 Q60 92 72 86 L70 94 Q60 98 50 94 Z" fill="#fff" stroke="${P.line}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M72 88 q6 1 1 6" fill="none" stroke="${P.line}" stroke-width="2"/>
    <path d="M56 80 q3 -5 0 -9 M64 80 q-3 -5 0 -9" stroke="#ffffffbb" stroke-width="2" fill="none" stroke-linecap="round">
      <animate attributeName="opacity" values=".9;.1;.9" dur="2.4s" repeatCount="indefinite"/></path>
  </g>`;},
gloom(P){return `
  <path d="M38 14 L46 24 L56 8 L64 22 L74 6 L80 22 L90 12 L88 30 Q74 22 60 23 Q46 23 34 30 Z" fill="#ffb64d" stroke="#b8791f" stroke-width="2.8" stroke-linejoin="round"/>
  <circle cx="46" cy="18" r="2.2" fill="#ff6a7d"/><circle cx="63" cy="14" r="2.2" fill="#5cc9f2"/><circle cx="80" cy="16" r="2.2" fill="#9fff9b"/>
  ${eye(45,47,1.25,P.iris,P.line)}${eye(77,47,1.25,P.iris,P.line)}
  <path d="M34 34 L52 40" stroke="${P.line}" stroke-width="4" stroke-linecap="round"/>
  <path d="M88 34 L70 40" stroke="${P.line}" stroke-width="4" stroke-linecap="round"/>
  <path d="M38 62 Q61 84 84 62 Q73 72 61 72 Q49 72 38 62 Z" fill="#143c30" stroke="${P.line}" stroke-width="2.4"/>
  <path d="M44 64 l4 7 4-7 Z" fill="#fff"/><path d="M56 67 l4 7 4-7 Z" fill="#fff"/><path d="M68 64 l4 7 4-7 Z" fill="#fff"/>
  <path d="M52 71 Q61 78 70 71 Q66 76 61 76 Q56 76 52 71 Z" fill="#ff8ba0"/>
  ${arm("M26 60 Q18 70 20 82 Q21 87 26 86 Q31 84 30 78 Q29 70 33 64 Q31 58 26 60 Z",P)}
  ${arm("M96 60 Q104 70 102 82 Q101 87 96 86 Q91 84 92 78 Q93 70 89 64 Q91 58 96 60 Z",P)}
  <ellipse cx="24" cy="85" rx="6" ry="5" fill="${P.light}" stroke="${P.line}" stroke-width="2.6"/>
  <ellipse cx="98" cy="85" rx="6" ry="5" fill="${P.light}" stroke="${P.line}" stroke-width="2.6"/>`;}

,fang(P){return `
  <path d="M34 20 Q46 8 60 10 Q74 8 86 20 L82 30 Q73 23 66 27 L60 37 L54 27 Q47 23 38 30 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.4" stroke-linejoin="round"/>
  <path d="M24 34 L40 40 L30 52 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M96 34 L80 40 L90 52 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.2" stroke-linejoin="round"/>
  ${eye(47,47,1,P.iris,P.line)}${eye(73,47,1,P.iris,P.line)}
  <path d="M40 36 L51 39" stroke="${P.line}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M80 36 L69 39" stroke="${P.line}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M48 61 Q60 69 72 61" stroke="${P.line}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M51 62.5 l3 6 3-5 Z" fill="#fff" stroke="${P.line}" stroke-width="1"/>
  <path d="M63 63.5 l3 5 3-6 Z" fill="#fff" stroke="${P.line}" stroke-width="1"/>
  <path d="M54 74 L60 78 L66 74 L63 81 L57 81 Z" fill="#b03548" stroke="${P.line}" stroke-width="1.8" stroke-linejoin="round"/>
  ${arm("M30 66 Q34 76 44 80 Q48 82 46 86 Q43 89 38 87 Q28 81 26 70 Q27 65 30 66 Z",P)}
  ${arm("M90 66 Q86 76 76 80 Q72 82 74 86 Q77 89 82 87 Q92 81 94 70 Q93 65 90 66 Z",P)}`;}
,bones(P){return `
  <path d="M70 12 l6 5 -5 3 6 4" stroke="${P.shade}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="45" cy="46" rx="8.5" ry="10" fill="#1a1430" stroke="${P.line}" stroke-width="2"/>
  <ellipse cx="75" cy="46" rx="8.5" ry="10" fill="#1a1430" stroke="${P.line}" stroke-width="2"/>
  <circle cx="46" cy="47" r="2.4" fill="#aef2ff"><animate attributeName="opacity" values="1;.3;1" dur="2.2s" repeatCount="indefinite"/></circle>
  <circle cx="76" cy="47" r="2.4" fill="#aef2ff"><animate attributeName="opacity" values="1;.3;1" dur="2.2s" begin=".4s" repeatCount="indefinite"/></circle>
  <ellipse cx="56.5" cy="59" rx="2.2" ry="3.4" fill="#1a1430" transform="rotate(-14 56.5 59)"/>
  <ellipse cx="63.5" cy="59" rx="2.2" ry="3.4" fill="#1a1430" transform="rotate(14 63.5 59)"/>
  <path d="M46 70 H74" stroke="${P.line}" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M51 66.5 V73.5 M58 66 V74 M65 66 V74 M70 66.5 V73.5" stroke="${P.line}" stroke-width="2" stroke-linecap="round"/>
  <path d="M44 84 Q60 90 76 84 M46 93 Q60 98 74 93" stroke="${P.shade}" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${arm("M30 64 Q26 74 29 84 Q30 88 34 87 Q38 85 37 80 Q36 72 39 66 Q36 61 30 64 Z",P)}
  ${arm("M90 64 Q94 74 91 84 Q90 88 86 87 Q82 85 83 80 Q84 72 81 66 Q84 61 90 64 Z",P)}`;}
,wrap(P,u){return `
  <g clip-path="url(#${u}c)">
    <g fill="${P.light}" stroke="${P.line}" stroke-width="1.8">
      <rect x="14" y="26" width="92" height="11" rx="5.5" transform="rotate(-7 60 32)"/>
      <rect x="14" y="52" width="92" height="11" rx="5.5" transform="rotate(5 60 58)"/>
      <rect x="14" y="68" width="92" height="11" rx="5.5" transform="rotate(-4 60 74)"/>
      <rect x="14" y="86" width="92" height="11" rx="5.5" transform="rotate(6 60 92)"/>
      <rect x="14" y="12" width="92" height="11" rx="5.5" transform="rotate(4 60 18)"/>
    </g>
  </g>
  ${eye(62,46,1.15,P.iris,P.line)}
  <path d="M34 42 Q40 40 46 43 L45 48 Q39 46 35 47 Z" fill="${P.shade}" opacity=".7"/>
  <path d="M50 64 Q58 68 66 64" stroke="${P.line}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <g transform="translate(96 40)">
    <path d="M0 0 Q10 4 12 14 Q12 20 7 19 Q3 17 4 11 Q3 5 -2 4 Z" fill="${P.light}" stroke="${P.line}" stroke-width="1.8">
      <animateTransform attributeName="transform" type="rotate" values="-14 0 2;14 0 2;-14 0 2" dur="1.8s" repeatCount="indefinite"/>
    </path>
  </g>
  ${arm("M28 62 Q24 72 27 82 Q28 86 32 85 Q36 83 35 78 Q34 70 37 64 Q34 59 28 62 Z",P)}`;}
,hexa(P){return `
  <path d="M46 18 Q38 24 34 30 L42 32 Q40 40 44 44 Q48 34 52 30 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M74 18 Q82 24 86 30 L78 32 Q80 40 76 44 Q72 34 68 30 Z" fill="${P.hair}" stroke="${P.line}" stroke-width="2.2" stroke-linejoin="round"/>
  <ellipse cx="60" cy="22" rx="34" ry="8" fill="#3a2a52" stroke="#241a36" stroke-width="2.6"/>
  <path d="M40 21 Q50 18 80 21 L70 -6 Q64 -11 56 -7 Z" fill="#3a2a52" stroke="#241a36" stroke-width="2.6" stroke-linejoin="round"/>
  <path d="M42 17 Q60 13 78 17 L76 11 Q60 7 44 11 Z" fill="${P.hair}" stroke="#241a36" stroke-width="2"/>
  <rect x="56" y="9" width="8" height="7" rx="1.5" fill="#ffe28a" stroke="#241a36" stroke-width="1.8"/>
  ${eye(47,46,1.02,P.iris,P.line)}${eye(73,46,1.02,P.iris,P.line)}
  ${blush(39,57,"#e89ad0")}${blush(81,57,"#e89ad0")}
  <path d="M48 60 Q60 70 72 60 Q66 66 60 66 Q54 66 48 60 Z" fill="#5a2a3a" stroke="${P.line}" stroke-width="2"/>
  <path d="M56 61 L64 61 L62 64 L58 64 Z" fill="#fff"/>
  ${arm("M30 62 Q34 72 44 76 Q48 78 46 82 Q43 85 38 83 Q28 77 26 66 Q27 61 30 62 Z",P)}
  ${arm("M90 60 Q94 68 92 78 Q91 82 87 81 Q83 79 84 74 Q85 67 82 62 Q84 57 90 60 Z",P)}
  <g transform="rotate(24 92 84)">
    <line x1="92" y1="58" x2="92" y2="94" stroke="#8a5a3a" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M86 94 Q92 90 98 94 L100 108 Q92 104 84 108 Z" fill="#e8a24b" stroke="#9a6420" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M88 96 L87 106 M92 96 L92 106 M96 96 L97 106" stroke="#9a6420" stroke-width="1.4"/>
  </g>
  <g><animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite"/>
    <path d="M18 40 l3 0 M19.5 38.5 l0 3" stroke="#ffe28a" stroke-width="2" stroke-linecap="round"/>
    <path d="M24 66 l3 0 M25.5 64.5 l0 3" stroke="#ffe28a" stroke-width="1.8" stroke-linecap="round"/>
  </g>`;}
};

const BACKS={
fang(P){return `
  <path d="M26 30 Q6 62 14 98 Q22 88 28 98 Q34 88 40 100 L44 40 Z" fill="${P.hair}" stroke="#101320" stroke-width="2.6" stroke-linejoin="round">
    <animateTransform attributeName="transform" type="rotate" values="-3 44 36;3 44 36;-3 44 36" dur="2.8s" repeatCount="indefinite"/></path>
  <path d="M94 30 Q114 62 106 98 Q98 88 92 98 Q86 88 80 100 L76 40 Z" fill="${P.hair}" stroke="#101320" stroke-width="2.6" stroke-linejoin="round">
    <animateTransform attributeName="transform" type="rotate" values="3 76 36;-3 76 36;3 76 36" dur="2.8s" repeatCount="indefinite"/></path>`;}
};

window.ghostSVG=function(sp,px){
  const s=px||sp.size, id=sp.id, P=PAL[id]||PAL.blinky, u="ga"+(UID++);
  const boss=id==="gloom";
  const face=(FACES[id]||FACES.blinky)(P,u);
  const back=(BACKS[id]||(()=>""))(P);
  return `<svg viewBox="-6 -14 132 144" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="${u}c"><path d="${BODY_A}"><animate attributeName="d" values="${BODY_A};${BODY_B};${BODY_A}" dur="2.4s" repeatCount="indefinite"/></path></clipPath>
    <filter id="${u}f" x="-45%" y="-45%" width="190%" height="190%"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>
  <g>
    ${sway(u, boss?1.6:2.4, boss?4.2:3.4)}
    ${back}
    <path d="${BODY_A}" fill="${P.base}" opacity=".55" filter="url(#${u}f)" transform="translate(-3.6 -3) scale(1.06)">
      <animate attributeName="opacity" values=".4;.65;.4" dur="2.8s" repeatCount="indefinite"/>
    </path>
    <path d="${BODY_A}" fill="${P.base}" stroke="${P.line}" stroke-width="3" stroke-linejoin="round">
      <animate attributeName="d" values="${BODY_A};${BODY_B};${BODY_A}" dur="2.4s" repeatCount="indefinite"/>
    </path>
    <g clip-path="url(#${u}c)">
      <path d="${SHADE}" fill="${P.shade}" opacity=".85"/>
      <ellipse cx="44" cy="30" rx="15" ry="9" fill="#ffffff" opacity=".55" transform="rotate(-22 44 30)"/>
      <path d="M25 96 Q60 104 95 96 L95 120 L25 120 Z" fill="${P.shade}" opacity=".35"/>
    </g>
    ${face}
  </g>
</svg>`;
};
})();
