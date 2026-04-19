# HistoSauti Complete Demo

Portal ya documentary storytelling kwa Kiswahili yenye:
- homepage ya premium
- archive ya stories
- story detail page yenye cinematic visual player
- gallery ya picha kwa kila story
- timeline, sources, related stories
- admin demo pages na media manager
- Story Mode na Evidence Mode
- sticky mini-player + continue listening progress
- chapter markers, auto-next, na subtitle sync

## Kuanza

```bash
npm install
npm run dev
```

Fungua:
- `http://localhost:3000`
- `http://localhost:3000/stories`
- `http://localhost:3000/admin`
- `http://localhost:3000/admin/media`

## Muhimu

Toleo hili limeandaliwa liwe **demo-first**:
- stories zimejazwa tayari kwenye `lib/data.ts`
- media configs ziko kwenye `lib/media-manager.ts`
- local studio mode husave data kwenye `data/local-stories.json` na `data/local-media-configs.json`
- subtitle files ziko kwenye `public/media/subtitles`
- player hutumia **browser narration (Web Speech API)** kama narration audio haijawekwa
- ambience na music zimepangwa kwa scene kwa kutumia free remote sample audio URLs

## Features za Story Experience

Kila story sasa inaweza kuwa na:
- cinematic player yenye visual scenes
- ambience + soundtrack layers
- subtitle panel inayosogea live
- sticky mini-player wakati user anascroll
- continue listening bar kwa progress ya awali
- chapter chips na chapter markers kwenye progress bar
- auto-next story flow
- Story Mode kwa simulizi ya kawaida
- Evidence Mode kwa facts, quote cards, timeline, na sources

## Mahali pa kubadilisha media

- Story data: `lib/data.ts`
- Story/media local store: `lib/local-content-store.ts`
- Scene visuals/audio: `lib/media-manager.ts`
- Cinematic player: `components/story-cinematic-player.tsx`
- Story experience wrapper: `components/story-mode-experience.tsx`
- Story page: `app/(public)/stories/[slug]/page.tsx`

## Integrated Story Studio

Sasa `/admin/stories/new` na `/admin/stories/[id]/edit` zina studio moja ya pamoja yenye:
- story core fields
- timeline
- sources
- cover image
- narration/subtitle
- default ambience na soundtrack
- gallery image URLs
- scene entries kwa cinematic player

Page ya `/admin/media` imeachwa kama workspace ya kupanga media JSON kwa haraka, lakini sehemu kuu ya kazi sasa ni Integrated Story Studio.

## Kupandisha ubora zaidi baadaye

Unaweza baadaye kuunganisha:
- Supabase storage kwa uploads halisi
- OpenAI TTS kwa narration ya Kiswahili iliyorekodiwa
- Wikimedia/Wikipedia image research workflow
- analytics za listening progress
- bookmark na continue-listening kwa user accounts
