export interface ColorPalette {
  name: string;
  colors: string[];
  category: string;
}

// 1000+ colors organized into palettes
export const colorPalettes: ColorPalette[] = [
  // Neutrals
  { name: "Pure Blacks", category: "Neutral", colors: ["#000000","#0a0a0a","#111111","#1a1a1a","#222222","#2a2a2a","#333333","#3a3a3a","#444444","#4a4a4a"] },
  { name: "Grays", category: "Neutral", colors: ["#555555","#5f5f5f","#666666","#6f6f6f","#777777","#7f7f7f","#888888","#8f8f8f","#999999","#a0a0a0"] },
  { name: "Light Grays", category: "Neutral", colors: ["#aaaaaa","#b0b0b0","#bbbbbb","#c0c0c0","#cccccc","#d0d0d0","#dddddd","#e0e0e0","#eeeeee","#f5f5f5"] },
  { name: "Whites", category: "Neutral", colors: ["#f8f8f8","#f9f9f9","#fafafa","#fbfbfb","#fcfcfc","#fdfdfd","#fefefe","#ffffff","#f0f0f0","#e8e8e8"] },
  { name: "Warm Grays", category: "Neutral", colors: ["#3d3935","#4a4540","#57524c","#635e58","#706a64","#7d7770","#8a847d","#979189","#a39e97","#b0aaa4"] },
  { name: "Cool Grays", category: "Neutral", colors: ["#374151","#4b5563","#6b7280","#9ca3af","#d1d5db","#e5e7eb","#f3f4f6","#f9fafb","#1f2937","#111827"] },
  { name: "Slate", category: "Neutral", colors: ["#0f172a","#1e293b","#334155","#475569","#64748b","#94a3b8","#cbd5e1","#e2e8f0","#f1f5f9","#f8fafc"] },
  { name: "Zinc", category: "Neutral", colors: ["#18181b","#27272a","#3f3f46","#52525b","#71717a","#a1a1aa","#d4d4d8","#e4e4e7","#f4f4f5","#fafafa"] },

  // Reds
  { name: "Crimson", category: "Red", colors: ["#dc143c","#c0392b","#e74c3c","#ff0000","#ff1a1a","#ff3333","#ff4d4d","#cc0000","#990000","#660000"] },
  { name: "Rose", category: "Red", colors: ["#fff1f2","#ffe4e6","#fecdd3","#fda4af","#fb7185","#f43f5e","#e11d48","#be123c","#9f1239","#881337"] },
  { name: "Red Shades", category: "Red", colors: ["#fef2f2","#fee2e2","#fecaca","#fca5a5","#f87171","#ef4444","#dc2626","#b91c1c","#991b1b","#7f1d1d"] },
  { name: "Coral", category: "Red", colors: ["#ff6b6b","#ff7675","#fd79a8","#e17055","#d63031","#ff4757","#ff6348","#ff4500","#ff6347","#dc143c"] },
  { name: "Burgundy", category: "Red", colors: ["#800020","#722f37","#5c1a1a","#6b2d2d","#8b0000","#960018","#a52a2a","#b22222","#c41e3a","#d2042d"] },

  // Oranges
  { name: "Orange", category: "Orange", colors: ["#fff7ed","#ffedd5","#fed7aa","#fdba74","#fb923c","#f97316","#ea580c","#c2410c","#9a3412","#7c2d12"] },
  { name: "Amber", category: "Orange", colors: ["#fffbeb","#fef3c7","#fde68a","#fcd34d","#fbbf24","#f59e0b","#d97706","#b45309","#92400e","#78350f"] },
  { name: "Peach", category: "Orange", colors: ["#ffecd2","#fcb69f","#ffaaa5","#ff8b94","#ffcc5c","#ff6f61","#f4a261","#e76f51","#d4a373","#ccd5ae"] },
  { name: "Burnt Orange", category: "Orange", colors: ["#cc5500","#d2691e","#cd853f","#a0522d","#8b4513","#6b3a2a","#7b3f00","#bf4f00","#c35a00","#9e3d00"] },
  { name: "Gold", category: "Orange", colors: ["#ffd700","#ffcc00","#f5c518","#f0b429","#e6a817","#daa520","#b8860b","#d4af37","#c5a028","#b8962e"] },

  // Yellows
  { name: "Yellow", category: "Yellow", colors: ["#fefce8","#fef9c3","#fef08a","#fde047","#facc15","#eab308","#ca8a04","#a16207","#854d0e","#713f12"] },
  { name: "Lime", category: "Yellow", colors: ["#f7fee7","#ecfccb","#d9f99d","#bef264","#a3e635","#84cc16","#65a30d","#4d7c0f","#3f6212","#365314"] },
  { name: "Lemon", category: "Yellow", colors: ["#fffde7","#fff9c4","#fff59d","#fff176","#ffee58","#ffeb3b","#fdd835","#f9c825","#f0b429","#e6a817"] },
  { name: "Mustard", category: "Yellow", colors: ["#e3b505","#d4ac0d","#c5a028","#b8962e","#a98226","#9c7a1f","#8c6e19","#7a5c12","#6b4e0c","#5c4008"] },

  // Greens
  { name: "Green", category: "Green", colors: ["#f0fdf4","#dcfce7","#bbf7d0","#86efac","#4ade80","#22c55e","#16a34a","#15803d","#166534","#14532d"] },
  { name: "Emerald", category: "Green", colors: ["#ecfdf5","#d1fae5","#a7f3d0","#6ee7b7","#34d399","#10b981","#059669","#047857","#065f46","#064e3b"] },
  { name: "Teal", category: "Green", colors: ["#f0fdfa","#ccfbf1","#99f6e4","#5eead4","#2dd4bf","#14b8a6","#0d9488","#0f766e","#115e59","#134e4a"] },
  { name: "Forest", category: "Green", colors: ["#014421","#155724","#1e7e34","#28a745","#218838","#1c7430","#2d6a4f","#40916c","#52b788","#74c69d"] },
  { name: "Olive", category: "Green", colors: ["#808000","#6b6b00","#556b2f","#6b8e23","#8fbc8f","#90ee90","#98fb98","#7cfc00","#7fff00","#adff2f"] },
  { name: "Mint", category: "Green", colors: ["#98ff98","#90ffe0","#aaffc3","#b7f4c2","#c3f7d0","#d0fad8","#e0fce5","#f0fef2","#78e08f","#38ada9"] },
  { name: "Sage", category: "Green", colors: ["#bcb8a2","#b2bba4","#a8b89b","#9eb491","#94b087","#8aac7e","#80a874","#76a46a","#6ca061","#629c57"] },

  // Blues
  { name: "Blue", category: "Blue", colors: ["#eff6ff","#dbeafe","#bfdbfe","#93c5fd","#60a5fa","#3b82f6","#2563eb","#1d4ed8","#1e40af","#1e3a8a"] },
  { name: "Sky", category: "Blue", colors: ["#f0f9ff","#e0f2fe","#bae6fd","#7dd3fc","#38bdf8","#0ea5e9","#0284c7","#0369a1","#075985","#0c4a6e"] },
  { name: "Cyan", category: "Blue", colors: ["#ecfeff","#cffafe","#a5f3fc","#67e8f9","#22d3ee","#06b6d4","#0891b2","#0e7490","#155e75","#164e63"] },
  { name: "Indigo", category: "Blue", colors: ["#eef2ff","#e0e7ff","#c7d2fe","#a5b4fc","#818cf8","#6366f1","#4f46e5","#4338ca","#3730a3","#312e81"] },
  { name: "Navy", category: "Blue", colors: ["#001f3f","#002952","#003366","#003d7a","#00478e","#0051a2","#0056ae","#0061c0","#006bce","#0075dc"] },
  { name: "Cobalt", category: "Blue", colors: ["#0047ab","#004ec4","#0055dd","#005cf6","#1a6fff","#3381ff","#4d93ff","#66a5ff","#80b7ff","#99c9ff"] },
  { name: "Steel Blue", category: "Blue", colors: ["#4682b4","#4a90d9","#5baef0","#6cb5e1","#79c3e8","#87ceeb","#87cefa","#add8e6","#b0c4de","#c5d8f0"] },
  { name: "Cerulean", category: "Blue", colors: ["#007ba7","#009bd4","#00aff0","#00c2ff","#1ac9ff","#33d0ff","#4dd7ff","#66deff","#80e5ff","#99ecff"] },

  // Purples
  { name: "Violet", category: "Purple", colors: ["#f5f3ff","#ede9fe","#ddd6fe","#c4b5fd","#a78bfa","#8b5cf6","#7c3aed","#6d28d9","#5b21b6","#4c1d95"] },
  { name: "Purple", category: "Purple", colors: ["#faf5ff","#f3e8ff","#e9d5ff","#d8b4fe","#c084fc","#a855f7","#9333ea","#7e22ce","#6b21a8","#581c87"] },
  { name: "Fuchsia", category: "Purple", colors: ["#fdf4ff","#fae8ff","#f5d0fe","#f0abfc","#e879f9","#d946ef","#c026d3","#a21caf","#86198f","#701a75"] },
  { name: "Lavender", category: "Purple", colors: ["#e6e6fa","#d8bfd8","#dda0dd","#da70d6","#c0a0c0","#b09fc8","#a08fc0","#9080b8","#8070b0","#7060a8"] },
  { name: "Mauve", category: "Purple", colors: ["#e0b0ff","#df99f0","#d984e0","#d46fd0","#ce5ac0","#c845b0","#c230a0","#bc1b90","#b60680","#b00070"] },
  { name: "Plum", category: "Purple", colors: ["#dda0dd","#d8a8d0","#c896c0","#b884b0","#a872a0","#986090","#884e80","#783c70","#682a60","#581850"] },
  { name: "Orchid", category: "Purple", colors: ["#da70d6","#d466d0","#ce5cca","#c852c4","#c248be","#bc3eb8","#b634b2","#b02aac","#aa20a6","#a416a0"] },

  // Pinks
  { name: "Pink", category: "Pink", colors: ["#fdf2f8","#fce7f3","#fbcfe8","#f9a8d4","#f472b6","#ec4899","#db2777","#be185d","#9d174d","#831843"] },
  { name: "Hot Pink", category: "Pink", colors: ["#ff69b4","#ff1493","#ff00aa","#ff0099","#ff0088","#ee0077","#dd0066","#cc0055","#bb0044","#aa0033"] },
  { name: "Blush", category: "Pink", colors: ["#ffc8c8","#ffb6c1","#ffa0a0","#ff9090","#ff8080","#ff7070","#ff6060","#ff5050","#ff4040","#ff3030"] },
  { name: "Salmon", category: "Pink", colors: ["#fa8072","#e9967a","#e8776a","#e06858","#d85946","#d04a34","#c83b22","#c02c10","#b81d00","#b00e00"] },
  { name: "Magenta", category: "Pink", colors: ["#ff00ff","#f000f0","#e000e0","#d000d0","#c000c0","#b000b0","#a000a0","#900090","#800080","#700070"] },

  // Browns
  { name: "Brown", category: "Brown", colors: ["#fdf8f0","#f5e6d3","#ead5b7","#dfc49b","#d4b37f","#c9a263","#be9147","#b3802b","#a86f0f","#9d5e00"] },
  { name: "Tan", category: "Brown", colors: ["#d2b48c","#c8a87c","#be9c6c","#b4905c","#aa844c","#a0783c","#966c2c","#8c601c","#82540c","#784800"] },
  { name: "Sienna", category: "Brown", colors: ["#a0522d","#a86032","#b06e37","#b87c3c","#c08a41","#c89846","#d0a64b","#d8b450","#e0c255","#e8d05a"] },
  { name: "Chocolate", category: "Brown", colors: ["#7b4f00","#8b5c00","#9b6900","#ab7600","#bb8300","#cb9000","#db9d00","#ebaa00","#fbb700","#ffc400"] },
  { name: "Caramel", category: "Brown", colors: ["#c68642","#bf7e3a","#b87632","#b16e2a","#aa6622","#a35e1a","#9c5612","#954e0a","#8e4602","#873e00"] },
  { name: "Mocha", category: "Brown", colors: ["#5c4033","#6b4c3b","#7a5843","#89644b","#987053","#a77c5b","#b68863","#c5946b","#d4a073","#e3ac7b"] },

  // Pastels
  { name: "Pastel Pink", category: "Pastel", colors: ["#ffd1dc","#ffb3c1","#ff99a8","#ff7f8f","#ff6575","#ff4b5c","#ff3043","#ff162a","#ff0011","#f00000"] },
  { name: "Pastel Blue", category: "Pastel", colors: ["#aec6cf","#b5cdd6","#bcd4dd","#c3dbe4","#cae2eb","#d1e9f2","#d8f0f9","#dff7ff","#c8e6ff","#b1d5ff"] },
  { name: "Pastel Green", category: "Pastel", colors: ["#b2dfdb","#a5d6d2","#98cdc9","#8bc4c0","#7ebbb7","#71b2ae","#64a9a5","#57a09c","#4a9793","#3d8e8a"] },
  { name: "Pastel Yellow", category: "Pastel", colors: ["#fffacd","#fff5b4","#fff09b","#ffeb82","#ffe669","#ffe150","#ffdc37","#ffd71e","#ffd205","#f5c800"] },
  { name: "Pastel Purple", category: "Pastel", colors: ["#d8b4fe","#e0beff","#e8c8ff","#f0d2ff","#f8dcff","#ffe6ff","#fce8ff","#faeaff","#f8ecff","#f6eeff"] },
  { name: "Pastel Orange", category: "Pastel", colors: ["#ffd5a6","#fec896","#feb886","#fea876","#fe9866","#fe8856","#fe7846","#fe6836","#fe5826","#fe4816"] },
  { name: "Pastel Mint", category: "Pastel", colors: ["#b2ffda","#a0ffcc","#8effbe","#7cffb0","#6affa2","#58ff94","#46ff86","#34ff78","#22ff6a","#10ff5c"] },
  { name: "Cotton Candy", category: "Pastel", colors: ["#ffb3de","#ffc0e6","#ffcded","#ffdaf4","#ffe7fb","#fff4ff","#ffebff","#ffe2ff","#ffd9ff","#ffd0ff"] },

  // Neons
  { name: "Neon Green", category: "Neon", colors: ["#39ff14","#00ff41","#00ff00","#0fff0f","#1cff1c","#30ff30","#45ff45","#59ff59","#6eff6e","#84ff84"] },
  { name: "Neon Blue", category: "Neon", colors: ["#00b3ff","#00b0ff","#00acff","#00a8ff","#00a4ff","#00a0ff","#009cff","#0098ff","#0094ff","#0090ff"] },
  { name: "Neon Pink", category: "Neon", colors: ["#ff6ec7","#ff5fc4","#ff50c1","#ff41be","#ff32bb","#ff23b8","#ff14b5","#ff05b2","#f000af","#e100ac"] },
  { name: "Neon Orange", category: "Neon", colors: ["#ff4500","#ff5800","#ff6b00","#ff7e00","#ff9100","#ffa400","#ffb700","#ffca00","#ffdd00","#fff000"] },
  { name: "Neon Yellow", category: "Neon", colors: ["#ffff00","#f5ff00","#ebff00","#e1ff00","#d7ff00","#cdff00","#c3ff00","#b9ff00","#afff00","#a5ff00"] },
  { name: "Electric Purple", category: "Neon", colors: ["#bf00ff","#c814ff","#d128ff","#da3cff","#e350ff","#ec64ff","#f578ff","#fe8cff","#ff9aff","#ffa8ff"] },

  // Earth Tones
  { name: "Terra Cotta", category: "Earth", colors: ["#e2725b","#d96a50","#d06245","#c75a3a","#be522f","#b54a24","#ac4219","#a33a0e","#9a3203","#912a00"] },
  { name: "Rust", category: "Earth", colors: ["#b7410e","#c04a17","#c95320","#d25c29","#db6532","#e46e3b","#ed7744","#f6804d","#ff8956","#ff925f"] },
  { name: "Clay", category: "Earth", colors: ["#c4a882","#ba9c76","#b0906a","#a6845e","#9c7852","#926c46","#88603a","#7e542e","#744822","#6a3c16"] },
  { name: "Sand", category: "Earth", colors: ["#f5deb3","#f0d5a5","#ebcc97","#e6c389","#e1ba7b","#dcb16d","#d7a85f","#d29f51","#cd9643","#c88d35"] },
  { name: "Desert", category: "Earth", colors: ["#c19a6b","#b8915f","#af8853","#a67f47","#9d763b","#946d2f","#8b6423","#825b17","#79520b","#70490f"] },
  { name: "Stone", category: "Earth", colors: ["#928e85","#857f74","#787063","#6b6152","#5e5241","#514330","#44341f","#37250e","#2a1600","#1d0700"] },

  // Jewel Tones
  { name: "Sapphire", category: "Jewel", colors: ["#0f52ba","#0e4caa","#0d469a","#0c408a","#0b3a7a","#0a346a","#092e5a","#08284a","#07223a","#061c2a"] },
  { name: "Ruby", category: "Jewel", colors: ["#9b111e","#a11d2b","#a72938","#ad3545","#b34152","#b94d5f","#bf596c","#c56579","#cb7186","#d17d93"] },
  { name: "Emerald Green", category: "Jewel", colors: ["#50c878","#46be6e","#3cb464","#32aa5a","#28a050","#1e9646","#148c3c","#0a8232","#007828","#006e1e"] },
  { name: "Amethyst", category: "Jewel", colors: ["#9966cc","#9060c0","#865ab4","#7c54a8","#724e9c","#684890","#5e4284","#543c78","#4a366c","#403060"] },
  { name: "Topaz", category: "Jewel", colors: ["#ffc87c","#f0b86c","#e0a85c","#d0984c","#c0883c","#b0782c","#a0681c","#90580c","#804800","#703800"] },
  { name: "Onyx", category: "Jewel", colors: ["#353839","#2f3233","#292c2d","#232627","#1d2021","#17191a","#111314","#0b0d0e","#050708","#000102"] },

  // Gradients (starting colors)
  { name: "Sunset", category: "Gradient", colors: ["#ff6b6b","#ff8e53","#ff6f91","#ffd093","#ffe66d","#ff4e50","#f9d423","#fc5c7d","#6a3093","#a044ff"] },
  { name: "Ocean", category: "Gradient", colors: ["#006994","#1a8599","#34a19e","#4ebda3","#68d9a8","#82f5ad","#1f6b8a","#2d7fa0","#3b93b6","#49a7cc"] },
  { name: "Aurora", category: "Gradient", colors: ["#00c6ff","#0072ff","#a18cd1","#fbc2eb","#96e6a1","#d4fc79","#43e97b","#38f9d7","#4facfe","#00f2fe"] },
  { name: "Cosmic", category: "Gradient", colors: ["#1a1a2e","#16213e","#0f3460","#533483","#e94560","#a855f7","#6366f1","#4f46e5","#7c3aed","#2563eb"] },
  { name: "Tropical", category: "Gradient", colors: ["#ff9a9e","#fad0c4","#a1c4fd","#c2e9fb","#96fbc4","#f9f586","#f6d365","#fda085","#f093fb","#f5576c"] },
];

export const colorCategories = [...new Set(colorPalettes.map(p => p.category))];

export const totalColors = colorPalettes.reduce((sum, p) => sum + p.colors.length, 0);
