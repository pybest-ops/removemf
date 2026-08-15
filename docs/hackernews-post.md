# Hacker News / Show HN Draft

## Title

Show HN: Remove Matcha Filter – reduce green and yellow photo casts

## Text / First Comment

I kept seeing saved photos where a green/yellow “matcha” look was baked into the image, so I made a small tool to reduce that cast without opening a full photo editor.

What it does:

- Upload one JPG, PNG, or WEBP photo
- Preview a lightweight browser-side cleanup first
- Run an AI restore pass when the cast needs stronger correction
- Compare before/after and download the result

The goal is not to reconstruct the original pixels. Once a filter is baked into an exported image, the tool can only produce a more natural-looking version.

Built with Next.js, Cloudflare Pages/Workers, R2, and Replicate.

Live: https://removematchafilter.org
