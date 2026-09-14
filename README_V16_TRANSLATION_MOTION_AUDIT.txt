AFAQ JOOD V16 — Translation & Authority Card Audit

Languages verified:
- English (EN)
- Arabic (AR)
- Chinese (ZH)

Translation audit:
- All visible static sections on index.html use translation keys.
- All navigation, hero, services, products, markets, process, technical file, notice, FAQ, contact and footer labels are localized.
- Page title and meta description are localized.
- Country page navigation and footer are localized.
- Country page dynamic labels are localized, including RF/Radio, EMC, Safety, SAR/RF Exposure, Labelling and Local Representation.
- Country names, regions, scopes and product names have AR/ZH mappings for all 38 country entries.
- Country data fields (samples, lead time, validity, CE/conformity evidence, local testing, certificate type and technical documents) have exact AR/ZH translations for the published values.
- Technical abbreviations and official authority acronyms are intentionally preserved (for example RF, EMC, CE, TCF, DoC, TDRA, CST, CRA, CITRA, etc.).

Authority logo card motion audit:
- The card viewport is explicitly direction:ltr, so the physical slide direction remains RIGHT even when the page language is RTL Arabic.
- Current face exits to translateX(105%).
- Next face enters from translateX(-100%) and settles at translateX(0).
- The outgoing face is reset to -105% after the transition, allowing the cycle to repeat indefinitely.
- Language changes rebuild the country page and safely clear old card intervals before starting a new cycle.
- Theme changes do not rebuild or disable the card motion.
- A two-cycle JavaScript mock test passed for both AFAQ JOOD -> authority and authority -> AFAQ JOOD transitions.
- Reduced-motion accessibility mode intentionally disables the CSS transition. This is browser accessibility behavior, not a language/theme failure.

Asset/reference checks:
- All local authority logo files referenced by the data exist.
- No non-Yemen country uses the Yemen MTIT logo.
- Yemen Aden and Yemen Sana'a use the Yemen MTIT logo.
- Oman uses the Oman TRA logo.
- Mauritania uses the user-supplied Mauritania Authority logo.

The site does not expose commercial pricing publicly.
