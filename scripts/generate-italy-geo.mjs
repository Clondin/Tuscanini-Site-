#!/usr/bin/env node

// Regenerates the public sourcing-atlas geometry from upstream open data.
// Italian regions: openpolis/geojson-italy (CC BY 4.0).
// Context layers: Natural Earth vector data (public domain).
// The generated TypeScript is checked in, so this script is not part of the
// production build and the website never calls a map service at runtime.

import { execFileSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const CACHE = join(ROOT, 'scripts', '.geo-cache')
const OUT = join(ROOT, 'src', 'lib', 'italyGeo.ts')
mkdirSync(CACHE, { recursive: true })
mkdirSync(dirname(OUT), { recursive: true })

const D2R = Math.PI / 180
const SCALE = 3198.857159489858
const MIN_X = 0.11566750509019737
const MAX_Y = 0.9339825101179065
const PAD = 28

const LABELS = new Map([
  ['Abruzzo', [431.5, 410]],
  ['Basilicata', [555.8, 538.5]],
  ['Calabria', [570.7, 642.3]],
  ['Campania', [486.7, 511.9]],
  ['Emilia-Romagna', [274.3, 233.6]],
  ['Friuli-Venezia Giulia', [386.7, 104.1]],
  ['Lazio', [370.6, 428.4]],
  ['Liguria', [144, 253.9]],
  ['Lombardia', [203.4, 146.6]],
  ['Marche', [391.7, 325]],
  ['Molise', [472.9, 450.9]],
  ['Piemonte', [100.4, 190.9]],
  ['Puglia', [585.5, 502.5]],
  ['Sardegna', [162.3, 568.5]],
  ['Sicilia', [448.2, 747.9]],
  ['Toscana', [279.6, 315.9]],
  ['Trentino-Alto Adige', [287.9, 80.8]],
  ['Umbria', [355.3, 354]],
  ["Valle d'Aosta", [70.4, 138.2]],
  ['Veneto', [320, 144.4]],
])

function project(lng, lat) {
  return [
    (lng * D2R - MIN_X) * SCALE + PAD,
    (MAX_Y - Math.log(Math.tan(Math.PI / 4 + (lat * D2R) / 2))) * SCALE + PAD,
  ]
}

const NATURAL_EARTH =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson'
const SOURCES = {
  regions:
    'https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_regions.geojson',
  countries: `${NATURAL_EARTH}/ne_50m_admin_0_countries.geojson`,
  lakes: `${NATURAL_EARTH}/ne_10m_lakes.geojson`,
  lakesEurope: `${NATURAL_EARTH}/ne_10m_lakes_europe.geojson`,
  rivers: `${NATURAL_EARTH}/ne_10m_rivers_lake_centerlines.geojson`,
}

async function download(name, url) {
  const file = join(CACHE, `${name}.geojson`)
  if (existsSync(file) && statSync(file).size > 0) return file

  console.log(`Downloading ${name}`)
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`)
  writeFileSync(file, Buffer.from(await response.arrayBuffer()))
  return file
}

function mapshaper(args) {
  const executable = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
  execFileSync(executable, ['dlx', 'mapshaper@0.6.113', ...args], {
    shell: process.platform === 'win32',
    stdio: ['ignore', 'inherit', 'inherit'],
  })
}

const formatNumber = (number) => {
  const value = number.toFixed(2)
  return value.replace(/\.?0+$/, '') || '0'
}

function ringToPath(ring) {
  let path = ''
  let previousX = null
  let previousY = null

  ring.forEach(([lng, lat], index) => {
    const [x, y] = project(lng, lat)
    const nextX = formatNumber(x)
    const nextY = formatNumber(y)
    if (nextX === previousX && nextY === previousY) return
    path += `${index === 0 ? 'M' : 'L'}${nextX} ${nextY}`
    previousX = nextX
    previousY = nextY
  })

  return `${path}Z`
}

function polygonsToPath(geometry) {
  const polygons =
    geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
  return polygons
    .flatMap((polygon) => polygon.map((ring) => ringToPath(ring)))
    .join('')
}

function linesToPath(geometry) {
  const lines =
    geometry.type === 'LineString' ? [geometry.coordinates] : geometry.coordinates

  return lines
    .map((line) =>
      line
        .map(([lng, lat], index) => {
          const [x, y] = project(lng, lat)
          return `${index === 0 ? 'M' : 'L'}${formatNumber(x)} ${formatNumber(y)}`
        })
        .join(''),
    )
    .join('')
}

function geometryBounds(geometry) {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  const polygons =
    geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates

  for (const polygon of polygons) {
    for (const ring of polygon) {
      for (const [lng, lat] of ring) {
        const [x, y] = project(lng, lat)
        x0 = Math.min(x0, x)
        y0 = Math.min(y0, y)
        x1 = Math.max(x1, x)
        y1 = Math.max(y1, y)
      }
    }
  }

  return [x0, y0, x1, y1].map((number) => Number(number.toFixed(1)))
}

function literal(value) {
  return JSON.stringify(String(value))
}

async function main() {
  const [regionsRaw, countriesRaw, lakesRaw, lakesEuropeRaw, riversRaw] =
    await Promise.all(
      Object.entries(SOURCES).map(([name, url]) => download(name, url)),
    )

  const regionsOutput = join(CACHE, 'regions-simplified.geojson')
  const neighborsOutput = join(CACHE, 'neighbors-clipped.geojson')
  const lakesOutput = join(CACHE, 'lakes-clipped.geojson')
  const riversOutput = join(CACHE, 'rivers-clipped.geojson')

  mapshaper([
    regionsRaw,
    '-simplify',
    'weighted',
    'keep-shapes',
    '18%',
    '-filter-fields',
    'reg_name',
    '-o',
    'force',
    regionsOutput,
  ])
  mapshaper([
    countriesRaw,
    '-clip',
    'bbox=4.4,34.4,21.6,48.9',
    '-simplify',
    'weighted',
    'keep-shapes',
    '45%',
    '-filter-fields',
    'ADMIN',
    '-o',
    'force',
    neighborsOutput,
  ])
  mapshaper([
    '-i',
    lakesRaw,
    lakesEuropeRaw,
    'combine-files',
    '-merge-layers',
    'force',
    '-clip',
    'bbox=6.6,41.4,13.6,46.6',
    '-simplify',
    'weighted',
    'keep-shapes',
    '35%',
    '-filter-fields',
    'name',
    '-o',
    'force',
    lakesOutput,
  ])
  mapshaper([
    riversRaw,
    '-clip',
    'bbox=6.6,36.5,18.8,47.2',
    '-simplify',
    'weighted',
    'keep-shapes',
    '35%',
    '-filter-fields',
    'name',
    '-o',
    'force',
    riversOutput,
  ])

  const readGeoJson = (file) => JSON.parse(readFileSync(file, 'utf8'))
  const regions = readGeoJson(regionsOutput)
    .features.map((feature) => {
      const name = feature.properties.reg_name
        .replace(/Valle d'Aosta.*/, "Valle d'Aosta")
        .replace(/Trentino-Alto Adige.*/, 'Trentino-Alto Adige')
      const bbox = geometryBounds(feature.geometry)
      return {
        name,
        label: LABELS.get(name) ?? [
          Number(((bbox[0] + bbox[2]) / 2).toFixed(1)),
          Number(((bbox[1] + bbox[3]) / 2).toFixed(1)),
        ],
        bbox,
        d: polygonsToPath(feature.geometry),
      }
    })
    .sort((left, right) => left.name.localeCompare(right.name))

  const neighbors = readGeoJson(neighborsOutput)
    .features.filter((feature) => feature.properties.ADMIN !== 'Italy')
    .map((feature) => ({
      name: feature.properties.ADMIN,
      d: polygonsToPath(feature.geometry),
    }))
    .sort((left, right) => left.name.localeCompare(right.name))

  const lakeMap = new Map()
  for (const feature of readGeoJson(lakesOutput).features) {
    const name = feature.properties.name ?? 'Italian lake'
    const path = polygonsToPath(feature.geometry)
    if (!lakeMap.has(name) || lakeMap.get(name).length < path.length) {
      lakeMap.set(name, path)
    }
  }
  const lakes = [...lakeMap.entries()]
    .map(([name, d]) => ({ name, d }))
    .sort((left, right) => left.name.localeCompare(right.name))

  const riverNames = new Set(['Po', 'Tiber', 'Tevere', 'Arno', 'Adige'])
  const rivers = readGeoJson(riversOutput)
    .features.filter((feature) => riverNames.has(feature.properties.name))
    .map((feature) => ({
      name: feature.properties.name,
      d: linesToPath(feature.geometry),
    }))
    .sort((left, right) => left.name.localeCompare(right.name))

  const output = `// Generated by scripts/generate-italy-geo.mjs — DO NOT HAND-EDIT.
// Italian regions: openpolis/geojson-italy (CC BY 4.0), simplified to 18%.
// Context layers: Natural Earth vector data (public domain).
// Web Mercator projection is baked into each SVG path.

export interface ItalyRegion {
  name: string
  d: string
  label: [number, number]
  bbox: [number, number, number, number]
}

export interface GeoFeature {
  name: string
  d: string
}

export const MAP_W = 720
export const MAP_H = 842

const D2R = Math.PI / 180
const SCALE = ${SCALE}
const MIN_X = ${MIN_X}
const MAX_Y = ${MAX_Y}
const PAD = ${PAD}

export function project(lng: number, lat: number): [number, number] {
  return [
    (lng * D2R - MIN_X) * SCALE + PAD,
    (MAX_Y - Math.log(Math.tan(Math.PI / 4 + (lat * D2R) / 2))) * SCALE + PAD,
  ]
}

export const ITALY_REGIONS: ItalyRegion[] = [
${regions
  .map(
    (region) => `  {
    name: ${literal(region.name)},
    label: [${region.label.join(', ')}],
    bbox: [${region.bbox.join(', ')}],
    d: ${literal(region.d)},
  },`,
  )
  .join('\n')}
]

export const NEIGHBORS: GeoFeature[] = [
${neighbors.map((feature) => `  { name: ${literal(feature.name)}, d: ${literal(feature.d)} },`).join('\n')}
]

export const LAKES: GeoFeature[] = [
${lakes.map((feature) => `  { name: ${literal(feature.name)}, d: ${literal(feature.d)} },`).join('\n')}
]

export const RIVERS: GeoFeature[] = [
${rivers.map((feature) => `  { name: ${literal(feature.name)}, d: ${literal(feature.d)} },`).join('\n')}
]
`

  writeFileSync(OUT, output)
  console.log(
    `Wrote ${OUT} (${Math.round(statSync(OUT).size / 1024)} KB, ${regions.length} regions)`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
