# Self-hosted site fonts

The site's seven Latin WOFF2 files are supplied by Google Fonts under the SIL Open Font License. The existing `OFL.txt` covers Manrope; the other family licenses are included separately. `sources.json` records the public download URLs and SHA-256 digests.

Normal faces use variable weights: Cormorant Garamond and Playfair Display 400–600, Manrope 300–600. Noto Serif and italic faces use weight 400. The `.gitignore` exception for `public/assets/fonts/*.woff2` keeps these runtime files in Git while design-source font files remain ignored.

The October audit follow-up found the previous font URLs returned HTTP 404. These files restore the existing typography without introducing a runtime third-party font request.
