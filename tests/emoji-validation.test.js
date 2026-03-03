/**
 * Emoji Validation Test Suite
 * 
 * Verifies that the emoji validation logic correctly handles:
 * - Simple emojis
 * - Regional flags (multi-character)
 * - ZWJ sequences (Family, Jobs, etc.)
 * - Skin tone modifiers
 * - Variation selectors (e.g., Heart)
 * - Single-emoji constraint
 */

function isValidEmoji(text) {
  if (!text) return false;
  
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  const segments = Array.from(segmenter.segment(text.trim()));
  
  if (segments.length !== 1) {
    return false;
  }
  
  const emoji = segments[0].segment;
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}|\p{Extended_Pictographic})/u;
  return emojiRegex.test(emoji);
}

const testCategories = {
  "Simple": ["😀", "🚀", "🍕"],
  "Flags (Regional Indicators)": ["🇯🇲", "🇺🇸", "🇪🇺", "🏴󠁧󠁢󠁳󠁣󠁴󠁿"],
  "ZWJ Sequences (Families/Jobs)": ["👨‍👩‍👧‍👦", "🧑‍💻", "👩‍🚒", "🧟‍♀️"],
  "Skin Tone Modifiers": ["👍🏽", "👋🏿", "🖐🏻"],
  "Variation Selectors": ["❤️", "☀️", "❄️"],
  "Keycaps/Sequences": ["1️⃣", "🔟", "✉️"],
  "Multi-Grapheme (Should Fail)": ["😀😀", "ABC", "🇯🇲🇺🇸"],
  "Non-Emoji (Should Fail)": ["A", "1", "!", "Hello"]
};

console.log("Emoji Validation Test Results:\n");

let allPassed = true;

for (const [category, emojis] of Object.entries(testCategories)) {
  console.log(`--- ${category} ---`);
  const expected = !category.includes("Should Fail");
  
  emojis.forEach(emoji => {
    const result = isValidEmoji(emoji);
    const passed = (result === expected);
    if (!passed) {
        allPassed = false;
        console.log(`❌ [${emoji}] -> ${result} (Expected: ${expected})`);
    } else {
        console.log(`✅ [${emoji}] -> ${result}`);
    }
  });
  console.log("");
}

if (allPassed) {
  console.log("SUCCESS: All emoji validation test cases passed!");
} else {
  console.log("FAILURE: Some emoji validation test cases failed.");
  process.exit(1);
}
