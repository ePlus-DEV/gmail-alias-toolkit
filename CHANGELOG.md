# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.3] - 2026-07-29
### :bug: Bug Fixes
- [`12f4d2f`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/12f4d2fbb85bd4138f9e5e28247f2599c4fb36f9) - preserve active account domain in website aliases *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`511f183`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/511f1835a2fa2268847d06514ce312381f50d52b) - ignore cross-account website aliases *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`8abcb6d`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/8abcb6dd4f48fee59e8a3e8bed9c6feb883c74bc) - enable one-shot Workspace patch workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`4c13406`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4c134063029437abd10dc1a81e1bb6a1852faa54) - isolate Workspace inline aliases *(commit by [@github-actions[bot]](https://github.com/apps/github-actions))*
- [`2efd275`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/2efd2755a68a7e2eeca0228013dafebf54a457d3) - validate base email before generating suggestions *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`e20fe7d`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e20fe7d99a3829ccc7e7e07eb116840042ac3053) - keep package metadata aligned with dev *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`b0d1e79`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b0d1e79d1dd5feb5584e0049608a1e075dae8b42) - import changelog types from data module *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`ae6327a`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ae6327ae874153d8216db55d528b6983661da655) - harden scoped inline history parsing *(commit by [@hoangsvit](https://github.com/hoangsvit))*

### :recycle: Refactors
- [`d99587d`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/d99587daa7ef1ab340c0e5c7a0e7be56a7b54eae) - isolate inline account history loading *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`301e063`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/301e063d1c63e9b039026cc3837073ee7df69370) - use inline history service *(commit by [@github-actions[bot]](https://github.com/apps/github-actions))*
- [`a8ef1af`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/a8ef1af765368a64887f3b0343d2eb917993070d) - extract extension changelog data *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`8b3271e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/8b3271e71328b17d09157ad30dbbcc0430f7323e) - separate extension changelog data *(commit by [@github-actions[bot]](https://github.com/apps/github-actions))*

### :white_check_mark: Tests
- [`596ee9f`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/596ee9fee7f595200f297b9f635213ec771d3275) - cover Google Workspace alias domains *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`33fa0a4`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/33fa0a436543dd7483bc3c4a037eb41e8628a729) - harden Workspace alias regression coverage *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`7458d65`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7458d6512869dada5c8d3326f449fc62f1f41a07) - cover inline Workspace history isolation *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`c1248e5`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/c1248e586876da45c3941c8051273c2af0042bdb) - cover malformed inline history storage *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`b70a116`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b70a116ffb6f4afdd6e6e32c3b9e501def3f6bc8) - type popup utility mock factory *(commit by [@github-actions[bot]](https://github.com/apps/github-actions))*
- [`7c71b38`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7c71b38ab895f39f7e108509ac8bcce3673ebbae) - cover inline history storage failures *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`503b2d6`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/503b2d6f290e51d7eaabf2b95ddfb2fdea1aa3f6) - validate extension changelog data *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`e760053`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e7600539290f4bf233fba7173848df1210ce1c45) - cover malformed scoped inline history *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`45e2ff9`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/45e2ff988c916dfd7671af4e9eff8c1e8b9d8b2b) - cover changelog comparator and reset state *(commit by [@hoangsvit](https://github.com/hoangsvit))*

### :wrench: Chores
- [`8e4c8a4`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/8e4c8a469f078fbae76917821632a781cbbe61a1) - add one-shot Workspace history patch *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`8f83b4c`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/8f83b4c31d4b7ac390380ee222bc76e37222a241) - add one-shot Workspace fix workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`3a47e42`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/3a47e42140ae10d4a614222450ec49e5a0623a60) - add one-shot inline history service patch *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`a031d5b`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/a031d5b20cd693a0791155ec8f2ac2d7af0c85ed) - add one-shot inline history service workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`5a81788`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/5a817883f675d31c47c6090709cb0b275ceaf24e) - add one-shot mock return type patch *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`aebca33`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/aebca333e3c6b123b2803d52dade4f7d861480f5) - add one-shot mock return type workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`236c888`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/236c8887f49bb170c1c2503a6a77a4546142b4f7) - add one-shot v1.3.3 changelog script *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`4eceb5e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4eceb5e10fd910451169fd04214e99c21182bbbe) - add one-shot v1.3.3 changelog workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`31f2a22`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/31f2a227d9c22c2d76c817ca1ca741a180e18f9a) - add one-shot extension changelog patch *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`608ca57`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/608ca57cef4776717d62864e4e5a64b0c555e7af) - add one-shot extension changelog workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`1e4c3e4`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/1e4c3e48634baa94eb630e43a98cf03ee8ef9185) - retain v1.3.3 release version *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`9545d59`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/9545d59ffefe6b5550ad4aa05fa5777eb73f320e) - normalize package metadata formatting *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`06298a9`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/06298a9db9738430a3302e0c263d150e430c54a4) - restore package trailing newline *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`862cedd`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/862cedd65cbf9fc3cccf65bfcf3a95d566de6346) - add one-shot changelog extraction patch *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`c45194f`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/c45194f3e6ae91787bb55cf917641b64e538157c) - add one-shot changelog extraction workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`11f8d6e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/11f8d6ecde70c0aff9d472c4952759617f20aa45) - keep release branch active *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`59b2adb`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/59b2adb45fba9110304f2d503b46a4bfc094dc4b) - normalize release package metadata *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`875befa`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/875befa0c8ae699a6fd4872e81d7d5560087fd7e) - preserve package formatting *(commit by [@hoangsvit](https://github.com/hoangsvit))*


## [1.3.2] - 2026-07-24
### :sparkles: New Features
- [`9730377`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/9730377be7c71678e540783dd047389d8b544eaf) - paginate disabled inline sites *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`81621a8`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/81621a8caa52746c4b876e34035a9670efd69759) - add disabled-site filtering *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`99a5b32`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/99a5b3210757a82bb01fcbb44200db6d2d56c0e6) - update changelog and disabled-sites UI *(commit by [@eplus-bot](https://github.com/eplus-bot))*
- [`e435ec1`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e435ec1c99b0cf2c2fc8144396e25a9a7fb121fb) - resolve web version from latest GitHub release *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`588cc18`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/588cc180656e5cff263100a68d3d434cf1f141e3) - allow web builds to inject release version *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`6554efc`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/6554efc1eec84ffde5c7a0ae0e7ef2951eed4c10) - inject latest GitHub release into web build *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`94eff46`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/94eff46fb06fb9a8ed96512d9c5a8f003aa2172d) - enhance development manifest validation and add test for runtime-registered content script *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`f2e9683`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f2e96830b77eb8ecad2acfef39a1911bcd50e5cd) - add environment configuration for inline helper and enhance manifest validation *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`67c4ec5`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/67c4ec5eac9ef4e2858abca3460720891e88401c) - update inline helper match patterns and improve URL handling in content script *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`0c61496`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0c614960bf05c4cb179c343a9d41a85bf38a3adc) - add localized user guide labels *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`96789a6`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/96789a6e8cacee21d4f2b177e05c202c4bb3cfab) - add tracked user guide link *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`e156a8a`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e156a8a1fe41984ee994f0b7034bced329eb015a) - add localized user guide action to popup header *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`ef95855`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ef958555fb42b9ec1697cf572fa00ab74adb3157) - add user guide link to inline popup *(commit by [@github-actions[bot]](https://github.com/apps/github-actions))*
- [`65282dc`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/65282dcf0e89fddb044016f8f85b1f06f42e22c9) - add user guide button to Settings and remove from PopupHeader *(commit by [@hoangsvit](https://github.com/hoangsvit))*

### :bug: Bug Fixes
- [`b353f92`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b353f921b71a9e872b876410546ff2c638c788bd) - align inline helper with WXT environment *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`7a2c078`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7a2c0786dc838014bc5359b0b4056341999a7ea9) - avoid console usage in manifest verifier *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`bfff3c1`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/bfff3c164295ecd5f915c15b43af016835af7ab3) - make one-time WXT mode replacement format-safe *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`cc6a0cf`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/cc6a0cf388e781d8ed9db7c94ca4d0ac6bada8cf) - align content script with WXT build mode *(commit by [@eplus-bot](https://github.com/eplus-bot))*
- [`44c1240`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/44c1240f759c5cd12399847df7ad3b30676404a9) - generate inline content scope from WXT mode *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`20be629`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/20be629392774fb8b2fc2f325c6ff7a87d56a832) - select generated manifests by WXT mode *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`64f1634`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/64f1634b341d56da70f9062664b3f3b5ab435242) - reject unexpected development URL patterns *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`291128c`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/291128cfed38e0a86d2154c878b33ef1f17c5bf4) - validate only inline helper manifest scope *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`b0cdb11`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b0cdb111ac14b286cbe59b24169f824b6c8a5dca) - pin bot approval to reviewed commit *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`6f8931e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/6f8931ee632367b0a75601571ebd08aec18189e1) - make extension update patch indentation-safe *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`ff92cf9`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ff92cf981462d959679b85eb15a6c35e1017034b) - reuse localized alias search label *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`09ebc7f`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/09ebc7f9dc357159ad415e0a8212a9e683eb3d53) - clarify disabled-site search states *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`71dfa36`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/71dfa36fec1bf052d0fb1c498a39fa13fc021a96) - resolve version test paths from repository root *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`e7f2280`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e7f2280b60fa8a65da8751fb9533998689735ab7) - address CodeRabbit release findings *(commit by [@eplus-bot](https://github.com/eplus-bot))*
- [`c40d80d`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/c40d80df85a85382f5e104d3ae71383a2fac24bf) - guard browser locale resolution for user guide *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`bb89f81`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/bb89f81ae9b01115e2e03b1eb40f7db4eee0ee6d) - handle user guide navigation failures *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`7cb836a`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7cb836a820b5f5765c2a415aaaf36ec96090ce3d) - handle popup guide navigation errors *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`4e471c2`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4e471c2f446d8bcced259e3b11a9270ac8895c20) - simplify generated locale coverage test *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`825c707`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/825c707114d91d7a173c51b92e262480203531f9) - simplify WXT locale migration workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*

### :recycle: Refactors
- [`4ed6cb5`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4ed6cb55fdda931dbe8e19cc4bcdbf452d0ade38) - remove custom WXT development flag *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`aff50e8`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/aff50e8dd179f733cecce39b7fdb07363aca182f) - use WXT runtime environment directly *(commit by [@eplus-bot](https://github.com/eplus-bot))*
- [`eb8212b`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/eb8212b97dd83befaec7c3a493c1f9c8f680eb19) - replace production-only manifest verifier *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`dec94a3`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/dec94a31c140bc2c00e66cdaa03c623d85f2ec14) - centralize WXT mode names *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`80ad957`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/80ad957a37225e1e5800ab08ab1cbb4f9124fca1) - keep content script matches static *(commit by [@eplus-bot](https://github.com/eplus-bot))*
- [`f777b10`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f777b109fa220726b7159034a624a872e29066a6) - initialize manifest verifier options safely *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`32c3f0b`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/32c3f0b69822f775a1985c08422145ad9028e049) - centralize application version metadata *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`0c35b8a`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0c35b8a47b43b806b1f8ed62cfd3001716f45731) - source displayed version from package metadata *(commit by [@eplus-bot](https://github.com/eplus-bot))*
- [`5b36146`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/5b361467299872eca9e4c99d22097e38a7ec7691) - use WXT locales for user guide labels *(commit by [@github-actions[bot]](https://github.com/apps/github-actions))*

### :white_check_mark: Tests
- [`7f54aaf`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7f54aafa239dd981a1fa33634ba098393c375872) - verify production inline helper manifest *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`d19795e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/d19795efcfad028b41cca6fa4cdd56a97a0066b9) - verify WXT manifest scope by mode *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`874a63c`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/874a63ca3c395759c7025122cc403ab791f9b3cb) - verify WXT development and production scopes *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`7ea4a2a`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7ea4a2ad201c2bcf28fdd16da498bfa99ab5494d) - expose manifest validator for unit coverage *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`cbc4b67`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/cbc4b673e66f4c160665a42ad1bee861e9d7f28e) - include Node manifest validator specs *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`0c101d5`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0c101d5c0f484585295df0c4a52d719b620b8287) - cover manifest scope validation regressions *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`ff42dbe`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ff42dbec7a8461fdf48aa897be08d6cea49fc9f3) - share manifest scope constants with specs *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`37231c6`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/37231c6c8660771936dfa87b4c4cc03a87c3a0ef) - cover missing and valid production manifests *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`e83862d`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e83862d359142b32d053fe4a95ca9c625fea11a9) - cover disabled-site filtering *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`ade38e7`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ade38e740a3cd78e19d3d1b61361ff1cfa28d14c) - prevent user-facing version hardcoding *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`76c17bb`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/76c17bbaceabe1e805576bb8202617bb24b780da) - cover GitHub release version resolution *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`c01b230`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/c01b230a587ca085f8e7b8ba14fe0334628b2fbf) - cover localized user guide labels *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`73bb4a6`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/73bb4a6d8e4f70f2790dcb176ec84a9ced79f006) - cover user guide tab navigation *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`38f72aa`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/38f72aabbf673813633de4858138079a9c6a59c6) - cover user guide navigation fallbacks *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`9ba3333`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/9ba333344fb41a784aa5e5b21723cdb98fa456c4) - cover browser locale resolution for user guide *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`0b81a66`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0b81a66cf1e2c944bd62d0356486aa4b5a360efa) - document WXT locale coverage callbacks *(commit by [@hoangsvit](https://github.com/hoangsvit))*

### :wrench: Chores
- [`f6ac25a`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f6ac25aa6cd59424d8de4a86f820454df21bad6f) - **deps**: bump brace-expansion from 1.1.15 to 1.1.16 *(commit by [@dependabot[bot]](https://github.com/apps/dependabot))*
- [`42e3553`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/42e355335ea96e104b46e8a8ba79e369a77cef17) - **deps**: bump actions/github-script from 8 to 9 *(commit by [@dependabot[bot]](https://github.com/apps/dependabot))*
- [`1a98dac`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/1a98dac0f645d1bc16f67a1801e45bc21a48dba5) - add one-time WXT environment cleanup *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`d380e3c`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/d380e3c14326837031c2e76f11b5dc4a03afff38) - no-op placeholder *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`f314e5e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f314e5e0bc3904bd4f34ec163c65aa991f709632) - remove accidental placeholder *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`ec7471e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ec7471e0fb20853472486ca8fe8ccb09277009ce) - align content script with WXT mode *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`f2c0085`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f2c0085ebe7c0b014b19fb85573a4de4909be28e) - move content matches to WXT manifest generation *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`6537b8e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/6537b8eb6b3fae5d61617bbf135e8c67ece55a55) - capture WXT development manifest *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`ee06b84`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ee06b84ba5b5406a6298a65ed2fc90fd67d87968) - capture generated development manifest *(commit by [@eplus-bot](https://github.com/eplus-bot))*
- [`924a3d4`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/924a3d4710bdb3eb71ea7fdc209c76f26f5e0a3f) - remove temporary manifest capture *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`beb45d8`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/beb45d818c0405a5d1c53039388554b29f81b950) - set extension version to 1.3.2 *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`8149632`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/8149632b8892853eb9b5e123ea5e875fb62ca3b9) - apply extension changelog update *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`40fe714`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/40fe714418c542de1057703773a7b0e7308efdd7) - trigger extension update workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`fbe503f`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/fbe503f99b9615e073d4ce083cc9672ee228a0f5) - rerun extension update workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`b8ca5f5`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b8ca5f5c54af7fbb88606aedc0d0afaa1e9f2cfa) - run extension update from pull request *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`2d2deff`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/2d2deff61b98e32810a5487fc90b4b2fcd20da04) - apply pending extension UI updates *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`cf60a11`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/cf60a11ad5e19bfa4de0dcc661e063126899b5c8) - apply automatic version source update *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`2294c69`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/2294c69965c7a5bf80da1a36fbd0487c6302f38e) - capture version test diagnostics *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`fd551dd`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/fd551dd3379d398587bf8f8ae90a0cb06994cc33) - restore standard CI workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`527fba0`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/527fba0814b77a2427419f41263c14fba6e903ed) - prepare inline guide link patch *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`9c69c7e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/9c69c7e8970d896cb900f794eaf53a07b26e29a1) - prepare inline guide CSS cleanup *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`7bf49f4`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7bf49f4799bd350faf7140f3ed289bd17122df79) - add one-shot WXT locale migration *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`73ce83a`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/73ce83a55128debe508dcaab829b5255af5fa725) - prepare WXT locale migration trigger *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`88f95c9`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/88f95c9fcf26ae9d2a2a5b7dc627a44318ea386a) - keep WXT locale migration ready *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`99c4c2d`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/99c4c2de2e53f8696dae83e665b9975358d5c0f0) - add one-shot WXT locale migration script *(commit by [@hoangsvit](https://github.com/hoangsvit))*


## [1.3.1] - 2026-07-20
### :sparkles: New Features
- [`7148619`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7148619a98c09eaaee68376d4cd021149bd70c8f) - **release**: add Edge and Opera zip scripts *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`52257ae`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/52257ae87fa2e2747269346489ff261b67a6e63d) - **release**: publish multi-browser assets and install guide *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`168a08b`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/168a08bc3fda078e4e478cfe05148554963310fb) - implement getActiveEmail function for improved email account handling *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`198e720`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/198e7208aa04c6cfedde4145d65fe6c328dc6d70) - **web**: add browser and mobile landing enhancements *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`4d63d84`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4d63d8454c4cf8c387a8364b9b92ac1af040da9d) - **web**: wire landing enhancements and social metadata *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`b884365`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b8843656cf4f2c9a9419bbfef2ef0b08bd5ff5fd) - **web**: add interactive product tour *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`2c41d4e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/2c41d4e4f022ea3566b532a2130e83a32e9c006c) - **web**: integrate phase two product tour *(commit by [@github-actions[bot]](https://github.com/apps/github-actions))*
- [`aea2772`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/aea2772ccbcc3354c14a0f5665bc27e619ffa7aa) - **web**: support configurable preview base path *(commit by [@hoangsvit](https://github.com/hoangsvit))*

### :bug: Bug Fixes
- [`ad536f4`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ad536f44fcba337a0844f972c28e9fba5bfc7f8f) - silence error logging for various operations *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`56cbed5`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/56cbed527708bba4a91cb31b178e7c6297c765e4) - remove unused error variable in catch block *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`b6e4498`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b6e44986d40f0bd64ac47a2815a4e984b09f84ed) - prevent placeholder email usage when storage fails *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`c8b3c86`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/c8b3c86e664f4aca39c69a01255b352dc9ae7927) - surface disable inline helper errors to user *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`0bb5816`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0bb581692d84df128cd906f9c16378054711d87c) - surface alias-save failures with user feedback *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`94dcefa`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/94dcefa001009287c04c1ac2f921504bd23daba3) - clean up partial icon initialization on error *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`9a187ee`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/9a187eee135ed8d35a134fd10d457c8e2626922b) - apply CodeRabbit auto-fixes *(commit by [@coderabbitai[bot]](https://github.com/apps/coderabbitai))*
- [`235f04c`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/235f04c40662c2c3624e8a4cdb4d87f78a9173b5) - correct WXT env detection for dev/build modes *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`6434c8b`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/6434c8b8caf12ece96904510eee53f830c8839d7) - remove unused originalTitle variable *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`60ace93`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/60ace930f356f707a2202f08d82a6a0b6e7ae4e9) - include activeEmail in context menu cache key *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`e8fd212`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e8fd212f605995c398a7298f2635780410246ace) - show distinct error state for history load failures *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`0535079`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0535079e7cb247bedfde04e29156d55b2ed9f6b1) - update DEV_SITES to correct URLs and remove unused entries *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`4530981`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4530981270e96752d0d67fc9b69adfd0238d07a3) - remove unused DEV_SITES entries for cleaner configuration *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`98e5959`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/98e5959e818f6960236bd21a5fa7541bc489da45) - ensure iconContainer is not null and update state references in injectIcon function *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`0e259c1`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0e259c1dfec4593222189dd8bbe881e91bd4894d) - make one-time refactor workflow deterministic *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`afa5471`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/afa547199b0d573f8db0925f31eaa97554cc301c) - remove unsafe non-null assertions *(commit by [@github-actions[bot]](https://github.com/apps/github-actions))*
- [`ea11faf`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ea11faf71f2c74eb1c3a6cdf1ba5bf1ca462a5ba) - **ci**: use dedicated PR preview environment *(commit by [@hoangsvit](https://github.com/hoangsvit))*

### :zap: Performance Improvements
- [`6b70cbd`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/6b70cbddd2bd68e091a9e62dabff464f9fc8ab40) - optimize performance, fix bugs, add base email to inline popup *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`7654278`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/76542786e07e38340e126eea1f6cb0a29843ae05) - **web**: avoid duplicate Tailwind output *(commit by [@hoangsvit](https://github.com/hoangsvit))*

### :recycle: Refactors
- [`e30a040`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e30a040fc8361becf0ee4763544b52b924eb096b) - **web**: extract phase two content *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`b7811a0`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b7811a028dd26e641b8000d66d995f0dd7f2a8e8) - **web**: extract product tour *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`86e20d8`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/86e20d887af8da48f54139aff1ec4d1b1f12a391) - **web**: extract manual install guide *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`a67ce08`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/a67ce08ccd3b073ccbd9461802d4b2caebece1ee) - **web**: split phase two sections *(commit by [@hoangsvit](https://github.com/hoangsvit))*

### :wrench: Chores
- [`927bb3b`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/927bb3b935f52e80758cc1c1a55577eb689a2ebd) - exclude non-source files from DeepSource *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`14263db`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/14263dbfd300747bd7522fc2db944a7769d907d2) - **deps**: bump @babel/core from 7.28.5 to 7.29.7 *(commit by [@dependabot[bot]](https://github.com/apps/dependabot))*
- [`77574d8`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/77574d817a59f3e7b2e55dd44388875fb7c7eef5) - add one-time DeepSource fix workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`e41e019`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e41e019eb278cbfa5c48629257194e8c0ac3b746) - remove one-time DeepSource fix workflow *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`7e97d8e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7e97d8e821ad9f6b28a6953c7fd1c026a1948b9d) - prepare phase two integration *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`c71b885`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/c71b8857bafe79209445ea266b8a06933cd7b56d) - trigger phase two integration *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`5a4f5c7`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/5a4f5c74e52ddaee841275efb3104f0aa1b53671) - **web**: scope analysis for interactive demo *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`2bf1e95`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/2bf1e955ed9f868b0b5f9b10ac157d2328d2fef7) - **web**: exclude phase two demo modules *(commit by [@hoangsvit](https://github.com/hoangsvit))*
- [`b39a226`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b39a22699680c77e57a4e2d1141e3d7c827967e1) - **deps**: bump picomatch from 2.3.1 to 2.3.2 *(commit by [@dependabot[bot]](https://github.com/apps/dependabot))*
- [`2d9b904`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/2d9b9040ae078c58bd1af978d3d4daaf17f865c7) - **deps**: bump minimatch from 3.1.2 to 3.1.5 *(commit by [@dependabot[bot]](https://github.com/apps/dependabot))*


## [1.3.0] - 2026-07-15

### :sparkles: New Features

- [`03891d1`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/03891d18845fce5087bec41cf259afbb6054bcc0) - **web**: add GitHub Pages landing site _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`b6ee37b`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b6ee37b9ca4683f65bcd0519a04d0d385bda486d) - **web**: add GitHub Pages landing site _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`066b1e2`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/066b1e277c5654ea48ea96261cda409104b4b09c) - **web**: add GitHub Pages landing site _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`80ee0f7`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/80ee0f7eab7b96889e6934a7cc551d7639126667) - **web**: add GitHub Pages landing site _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`0c25ea4`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0c25ea4806156943d888489303ba9e7eea9a006f) - **web**: add GitHub Pages landing site _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`4600ea3`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4600ea3741e37087496c06aad8e2d369b37d0048) - **web**: add GitHub Pages landing site _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`472e3ec`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/472e3ec54e75fbaa9e58ad666a0657021f231e97) - **web**: add GitHub Pages landing site _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`f5d206c`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f5d206c72e70e7432774d2227d3c87a363dc9ca7) - **web**: add GitHub Pages landing site _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`27eda22`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/27eda22e7d901c37c204c4327606738e8756feab) - **web**: add GitHub Pages landing site _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`d8a16f5`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/d8a16f51c7a3c11d740e2098dc55b2d37dcdeccc) - **web**: add GitHub Pages landing site _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`9fd7867`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/9fd7867287d7179fbee54a12e3a2e89c14b7dd6b) - **web**: improve product-focused animated landing page _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`6e5b73f`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/6e5b73f1e777ec6b821a40845cad689c97f7e961) - enhance statistics component with new metrics and localization support _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`29a1609`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/29a16098899d3ead340ac82d69e100fc6835d2e1) - implement Phase 1 - auto-detect website, normalize hostname, generate suggestions, save mappings _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`2c5f829`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/2c5f829911a6c25c68b0db426132a05ca38b5a5e) - **Phase 2**: add email input icons with suggestion popups _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`8e593b3`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/8e593b3dd7a90b4cee6d726cb11a4a41493f7732) - open popup on hover icon (not click) _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`b50a859`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b50a859a4cd1987edafa812ef7a143f03a397cc1) - add info panel in popup with supported rules and privacy notice _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`40f5bf6`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/40f5bf64c097148308ca152a872f29f242f2248b) - add live preview on suggestion hover - shows alias in input before clicking Use _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`5059ab4`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/5059ab42c6b1b2070b97c6d343f8a06006cf938a) - enhance alias selection and popup positioning - add previous alias button and adjust popup alignment _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`0a37ec7`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0a37ec7d7076ec709a370f43d7dc0dab14e3592d) - enhance popup functionality - add tab navigation and history section _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`10afb3f`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/10afb3fc84991cfee1c4a7a788055a68e9d83451) - show all aliases in history tab without website filter _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`0de5e10`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0de5e1009181e21e3275cff38e8734faaa7fbf94) - enhance email history management with account-specific storage and alias saving _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`1658a8c`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/1658a8cdd2a954d3e2f5b9f80d6a268634fc0fdc) - implement batch alias saving and enhance history management with pagination and filtering _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`3f038f3`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/3f038f3f5de1954284a1783f390084f1ce9275f9) - add internationalization support for menu items and loading messages in multiple languages _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`4146242`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4146242f684723fe55b27756e4e01af9da55b3f8) - enhance email input icon positioning and styling, add support for modern TLDs in hostname normalization, and implement tests for normalization functionality _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`9ab73c3`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/9ab73c396e57660a03a89bab49127b46945b0ee3) - integrate tldts for enhanced hostname normalization and update tests for modern TLD support _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`36e825e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/36e825e7d423874c44f175c9e5f68b8d240333a7) - enhance icon positioning and popup behavior for email input, improving visibility and responsiveness _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`93f6e9a`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/93f6e9a27bc12587d167d1c5e32c068baf70a11d) - enhance icon positioning logic and add preferred side calculation for improved popup placement _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`cd95911`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/cd95911e0eede330ad36f23f8c0f3b084550241c) - implement inline helper disable functionality with site management and internationalization support _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`9224bc1`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/9224bc1b3a8dac7c3a1f2fe330e5bdda51e5e4d8) - enhance icon positioning logic by introducing placement direction for improved popup alignment _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`0ebd077`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0ebd077126ea925f1b532ba6229324d4562d9a85) - enhance popup disable button with tooltip and improved styling for better user experience _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`370d04b`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/370d04bdb416d4d9fbd16a0b7b901937410ed2b8) - enhance popup layout and add footer with review links for improved user interaction _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`9305385`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/93053858db1bab22181f3580016ad056d62e0fd5) - add index.html for production build and enhance metadata _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`b42c3b0`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b42c3b08dc45f5311b85b2fd521414b50c3ba957) - add inline popup feature with detailed user guidance and enhanced UI elements _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`73235e4`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/73235e4b79b6888c49a627c01920e15042d53737) - implement dark mode toggle and enhance UI components in extension mockup _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`e5d822f`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e5d822f7468e2423be4862005472f10fce0869f0) - upgrade React and TypeScript types, add ThemeToggle component, and enhance Tailwind CSS configuration _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`991ee5d`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/991ee5d6407e532d19d899e68ff2a7e0c8b459b5) - add Firefox installation link and translations for Firefox support _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`c67e865`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/c67e865e821e9bfedaca4c7ec7a289dd33b0a00e) - enhance inline popup functionality and improve UI components _(commit by [@hoangsvit](https://github.com/hoangsvit))_

### :bug: Bug Fixes

- [`f361379`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f361379baee387cc4e63c1629606d25715c701b6) - **ci**: use REST API for PR automation _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`76721b6`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/76721b646e87b2bf62e5910d028d6bd61e6a79e9) - **ci**: merge dependabot PRs without auto-merge feature _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`b2ff847`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b2ff847d9f6d6a27918a1cc4f8380aedd9508ee0) - **ci**: run dependabot merge after CI passes _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`b297d48`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b297d4845c863f3e6acc4e8d0b307807de232c90) - **web**: add missing clsx dependency _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`d63cd9a`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/d63cd9a9b2f4905dd7259af40f90eea5fa8d8260) - **web**: import React types for build _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`e58d293`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e58d29362fce15c3932a3f80651d7218b5e8bcdc) - **web**: pin Tailwind v3 for PostCSS config _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`fdab039`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/fdab03953aadcd97a376eed9ebf24c1efab794d7) - **web**: add documentation comments for components _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`e78cb4d`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e78cb4d7d5ab3c1665165a9f72d9de76f9efbc92) - **web**: resolve DeepSource findings _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`88ce5f7`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/88ce5f729ce0dcc9908d3cdecabdd2627a64f2ff) - **web**: resolve DeepSource findings _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`8869c63`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/8869c639e5f9a8e63019109d35b2dfaf67036cc6) - **web**: reduce JSX nesting depth _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`d8dd7a4`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/d8dd7a499234e143a7bfa51acbbcdefbb210034a) - **web**: add React type declarations _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`41c0f41`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/41c0f410ebe993773a1583673dbf0d27510f27bf) - ensure package-manager-cache is disabled in Node setup step _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`81e9a51`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/81e9a511f50009c63cc3cd442e8c8731ca5b7bc5) - change overflow property to 'visible' for better layout in Settings component _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`62a86ac`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/62a86ac6894297ba11276aa2542172e58255ae5c) - update version to 1.2.1 in package.json and adjust overflow property in Settings component for layout consistency _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`c5dc658`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/c5dc658a753f6ff25b2721fcb3bdc42d4176ab8f) - import createPortal from react-dom for proper rendering in Select component _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`4f29972`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4f29972eb9995f72eb4e5960ca734ee7c1b36b70) - update hover styles for tab buttons and adjust button border radius in Settings component _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`3af6702`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/3af67022bbfdeb16e896c46167e8b8ec9f7c4379) - **i18n**: update Chinese translations for clarity and consistency _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`3f3e55d`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/3f3e55d9a30867ef1cd8eb54112df68ae671e307) - hide Tags tab when fewer than 2 tags to prevent poor pie chart rendering _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`ab1c792`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ab1c792c448b4e6c2ba14501f9f8f45d9ce4be2a) - resolve duplicate content script entrypoint - consolidate into single content.ts _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`66e97f8`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/66e97f8a4fb23eb153906ec8e822a6c032578090) - correct import path in websiteAliasService.ts _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`74b7b0e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/74b7b0e8176ac5ea1f21e1af5073860451376660) - keep popup open when hovering over it with delay-based close _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`f5b26c3`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f5b26c349b9c1e367928e62c1c088ae50b3ff828) - preserve email input layout width when injecting icon _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`f84c1ad`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f84c1ad374c176ea1c612170f3b03698ec3e82e9) - add flex properties to wrapper to properly fill parent container _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`0cc51da`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0cc51da1d56455a7ec692f9ba0ae800e813a8850) - capture and preserve original input layout properties _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`4af1091`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4af1091e627e21829d82e3079cc66568ac26965b) - resolve DeepSource code quality issues _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`bd0f14d`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/bd0f14d7b1cdcc6cfceb35e9c85fae090fe5630b) - add missing JSDoc comment for escapeHtml function _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`2772949`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/27729498880ed64a4b5362cb018571116251e691) - remove unnecessary async from generateEmail function _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`35f8967`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/35f89673d0b375a3eb44866c67bea78a2f2b8cb5) - revert version number to 1.2.0 in package.json _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`7b852b8`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7b852b825b204aac73d2df2a2396969882b93104) - update version number to 1.3.0 in package.json _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`ab808c5`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ab808c5566d2259ed1b3fe4075ba3bbca3538712) - resolve DeepSource code quality issues _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`52e16a8`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/52e16a869631f8408ca7692a83907a8c29bfdd82) - resolve all remaining DeepSource code quality issues _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`1bee720`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/1bee720d873d05377a6e4a5cd33a7696327c4c1b) - remove duplicate state prefix in object literal _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`63c3c11`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/63c3c11cc4eb257017a0be3c58b2ca5dff34b082) - restore hover logic in inline demo popup _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`e9347dd`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e9347dd0dcbd5b0c0b8ae95a7b4c61ed577420dc) - resolve final 3 DeepSource issues _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`358981e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/358981ef6b97e8051e4d1979b63c73591194186c) - **web**: remove unused selectedAlias prop _(commit by [@github-actions[bot]](https://github.com/apps/github-actions))_
- [`47226cb`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/47226cb2edef9d0d2a640ef40cde40de7ea7e960) - **types**: stop shadowing lucide-react exports _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`8cc8771`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/8cc8771117b961baa59ec66438f641700b4d27e1) - resolve TypeScript compile errors _(commit by [@github-actions[bot]](https://github.com/apps/github-actions))_
- [`0c60933`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/0c609335ecf8cd41e84667820647fe44a0ab236f) - **ci**: repair GitHub Pages deployment _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`7bd00aa`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7bd00aa55c03ba2eef9fdee0b64888aedbf12e93) - **ci**: run Dependabot auto-merge only for Dependabot PRs _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`166685a`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/166685a72dfc7fdfcbd491ae0f8ff8642ca0ec94) - **ci**: repair GitHub Pages website build _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`8c52443`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/8c52443ec783618185f30d25cc962565e334439e) - **ci**: initialize Yarn before release build _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`3e6e385`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/3e6e3858941b6aebf33d639a98bc08d52b5c770a) - **ci**: stop release workflow from committing to protected main _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`18bbc3b`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/18bbc3b3df762145285c4229db61830a52e53bad) - **ci**: update changelog through an auto-approved pull request _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`c81e8fe`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/c81e8fe4b3b99082b844c0a9b70bdb0c58fde2db) - **ci**: restore release tag before publishing _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`1ffe1de`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/1ffe1deb84a94563c956efb6234f44e94e2323b7) - **ci**: remove invalid workflow permission and lint workflows _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`7f2569d`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7f2569d31cf43ec863235c42bfe48141a53eb6f2) - **ci**: skip eplus-bot self-approval _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`a0aaa0c`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/a0aaa0c12517e27a2ec88a00db62ee08a87acfce) - **ci**: create changelog PR as hoangsvit and approve with eplus-bot _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`9036aef`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/9036aef5e224fad047c2b69080eb65b46396f8b8) - **ci**: remove missing hoangsvit token dependency _(commit by [@hoangsvit](https://github.com/hoangsvit))_

### :zap: Performance Improvements

- [`f4041c1`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f4041c1967430d26126143720c787da1ff23add2) - optimize alias filtering _(commit by [@hoangsvit](https://github.com/hoangsvit))_

### :recycle: Refactors

- [`9beb32c`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/9beb32cd224ed47e7b08818c16498620ce237ce6) - update App component to use localized translations consistently _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`c4eb467`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/c4eb467f1ed28e74df0eb7bd293f49a2b2531e32) - modularize Header and HeroSection components for improved readability and maintainability _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`777a7cf`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/777a7cf4650614fc0e5603dc1bd3b158a199caef) - simplify imports and improve key usage in charts _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`be21a42`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/be21a42ef12c9607d690a3fae439af2028dab454) - enhance context menu with dynamic website-specific suggestions _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`ae17424`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/ae174240e8a7cb9d28c8a3bdd9c4f05389c81119) - reorganize content script files into proper folder structure _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`67f33bb`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/67f33bbf49369993bc5462eea9b43b43a553181b) - move email helper CSS to src/styles folder _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`f4c1068`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f4c106862630bcb31ec874731cf46985c5788c8b) - colocate email helper CSS with content script (WXT best practice) _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`06d64ac`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/06d64acd6af961a7c462806b53a016f3d2d0c016) - position icon absolutely without wrapping input _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`c3c790c`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/c3c790c5170ad496077315c046134db1ae3556ec) - reduce cyclomatic complexity of context menu handler _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`cba0b59`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/cba0b5987bd965d55e7d5618be7fc494cf77d658) - remove submission test script and update contributing guidelines _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`2cb247b`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/2cb247b876afbe7db5c196c79d32bed19a57e843) - update release workflow for improved clarity and efficiency _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`2b541e7`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/2b541e7d657c01d528fed42b7b64d3c9702bb669) - enhance hostname normalization to preserve subdomains and improve test coverage _(commit by [@hoangsvit](https://github.com/hoangsvit))_

### :white_check_mark: Tests

- [`7dbe28f`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/7dbe28ff14edf8d727cdfa8335d777a38a2263f1) - add comprehensive unit tests for services and content script helpers _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`afd53fd`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/afd53fd931fd8f6534a07194eb6efa7c9d6e4555) - cover PR review regressions _(commit by [@hoangsvit](https://github.com/hoangsvit))_

### :wrench: Chores

- [`de602ad`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/de602ad0ee28593a0a0daba7b30cbd22e37f1deb) - **deps**: bump ip-address from 10.1.0 to 10.2.0 _(commit by [@dependabot[bot]](https://github.com/apps/dependabot))_
- [`4fdd5de`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4fdd5de4ba722996b5ccaaff1c2581e393f39527) - **deps**: bump tar from 7.5.13 to 7.5.19 _(commit by [@dependabot[bot]](https://github.com/apps/dependabot))_
- [`b53ee7e`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b53ee7ec26c22f778e0d2cf25c05edc7927631ab) - **deps**: bump brace-expansion from 1.1.12 to 1.1.15 _(commit by [@dependabot[bot]](https://github.com/apps/dependabot))_
- [`4fff257`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/4fff25703f1c1444aec962bec157bd11271b5155) - **deps**: bump actions/upload-pages-artifact from 4 to 5 _(commit by [@dependabot[bot]](https://github.com/apps/dependabot))_
- [`2358d20`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/2358d20521887b39b5c24c86a1dc2c916df6260b) - **deps**: bump actions/setup-node from 5 to 6 _(commit by [@dependabot[bot]](https://github.com/apps/dependabot))_
- [`e781302`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/e781302fd4c4afd8643080a5b4424b2afa3b7fff) - **deps**: bump actions/checkout from 5 to 7 _(commit by [@dependabot[bot]](https://github.com/apps/dependabot))_
- [`b9a4e4b`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/b9a4e4b95b5d709c398eb813c6cb6cc0f610c44b) - update CHANGELOG for version 1.3.0 with added, changed, and fixed items _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`62caeee`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/62caeeec684d3ff7d17501df56937e8a0d9f8a36) - apply selectedAlias cleanup _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`d21d2f2`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/d21d2f23b6fb9c0b2f1ae2cf24bd88a5871d6f26) - apply PR review fixes _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`f2eb332`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f2eb332a5c78dfafaf7ef428a27fae30f7269684) - remove temporary review workflow _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`f876aff`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/f876affc2324f8ed7981e762c3cc3fa6e5bce50a) - ignore TypeScript build info _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`55893e2`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/55893e2a37b08aa0c3d56e4322be1c80b5ee2cef) - remove generated TypeScript build info _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`a01d2f9`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/a01d2f912252690635c8843cba3fc8c789295dd3) - apply TypeScript fixes _(commit by [@hoangsvit](https://github.com/hoangsvit))_
- [`cacb358`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/cacb358a66e68acc771d8d0fa135e5ffba3c0822) - **deps**: bump actions/setup-node from 6 to 7 _(commit by [@dependabot[bot]](https://github.com/apps/dependabot))_
- [`1959e2a`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/1959e2a12aa53ab12bcfb9907f45b50fbc3fa2d6) - **deps**: bump actions/upload-artifact from 5 to 7 _(commit by [@dependabot[bot]](https://github.com/apps/dependabot))_
- [`2d1eb22`](https://github.com/ePlus-DEV/gmail-alias-toolkit/commit/2d1eb22d28403d45393eb4c8d71f6254bfde82c9) - **deps**: bump softprops/action-gh-release from 2 to 3 _(commit by [@dependabot[bot]](https://github.com/apps/dependabot))_

## [Unreleased]

### Fixed

- Added comprehensive JSDoc comments to all functions and components to meet documentation standards
- Fixed async/await anti-patterns by replacing `void` statements with proper `.catch()` error handlers
- Improved variable declarations to use `const` where appropriate
- Optimized JSX component nesting by extracting inline form input into a separate component
- Resolved all DeepSource code quality warnings (24 issues)
- Optimized alias filtering by normalizing search input once and using a set for favorites
- Added regression coverage for plus-addressed Gmail validation and trimmed searches
- Removed generated TypeScript build-info files from version control

## [1.3.0] - 2026-07-13

### Added

- Added website-aware alias suggestions based on the current hostname
- Added an email input helper with inline icons, suggestion popups, live previews, and explicit Use actions
- Added previous-alias navigation and an information panel explaining supported rules and local-only storage
- Added expanded statistics metrics and Russian and Turkish translations
- Added a product landing page with automated GitHub Pages deployment

### Changed

- Enhanced the context menu with dynamic, website-specific alias suggestions
- Updated the History tab to show aliases across websites and store history per email account
- Improved popup navigation, layout, styling, and alias selection behavior
- Reorganized the content script and colocated its email helper styles

### Fixed

- Preserved email input width and flex layout when injecting the helper icon
- Improved helper popup positioning and hover behavior to prevent accidental closing
- Hid the Tags statistics tab when there is not enough data for a useful chart
- Hardened content rendering against client-side cross-site scripting
- Resolved code quality, localization, and build workflow issues

## [1.2.0] - 2026-07-03

### Added

- Added Tailwind CSS v4, shadcn, and beUI motion components
- Added beUI Action Swap, Animated Badge, Bouncy Accordion, Theme Toggle, Tooltip, and Table integrations
- Added dark mode toggle in the popup header
- Added locale key coverage tests to keep all translations aligned

### Changed

- Redesigned popup, settings, generator tabs, Gmail tricks, history table, and changelog UI with a unified beUI style
- Reworked Recent Aliases into a compact non-scrolling table with fixed action buttons and copy-on-email-click behavior
- Improved dark mode contrast, spacing, hover states, tooltips, and responsive popup layout
- Moved theme switching out of Settings and into the main popup header for faster access
- Updated all locales with the new UI strings for English, Vietnamese, French, German, Hindi, Japanese, and Simplified Chinese

### Fixed

- "Copy All" no longer undercounts statistics for generated aliases
- Settings/QR modals no longer render outside the popup bounds
- Tab key now moves focus normally instead of being hijacked for @gmail.com autocomplete
- Fixed missing imports and old component references after replacing legacy UI components
- Fixed table overflow and hidden row action buttons in the alias history
- Fixed untranslated/fallback strings in the new UI and added tests for locale key parity

## [1.1.0] - 2025-12-30

### Added

- Initial release features
- Gmail alias generation with plus addressing
- Preset management
- Keyboard shortcuts
- Statistics tracking

### Changed

- Updated dependencies

### Fixed

- Bug fixes and improvements

## [1.0.0] - 2025-12-30

### Added

- Initial release
  [1.3.0]: https://github.com/ePlus-DEV/gmail-alias-toolkit/compare/1.2.0...1.3.0
[1.3.1]: https://github.com/ePlus-DEV/gmail-alias-toolkit/compare/1.3.0...1.3.1
[1.3.2]: https://github.com/ePlus-DEV/gmail-alias-toolkit/compare/1.3.1...1.3.2
[1.3.3]: https://github.com/ePlus-DEV/gmail-alias-toolkit/compare/1.3.2...1.3.3
